import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { callAi, callAiJson } from "./ai";
import { lookupIngredients, knownIngredientList, type IngredientIntel } from "./journey-data";

export interface SituationAnalysis {
  location: string;
  budget: number;
  familySize: number;
  dietaryNeeds: string[];
  ingredients: string[];
  notes: string;
}

export interface MealPlanItem {
  name: string;
  description: string;
  estimatedCost: number;
  servings: number;
  ingredients: string[];
  nutritionHighlights: string[];
}

export interface MealPlanResult {
  weeklyTotalCost: number;
  costPerPersonPerDay: number;
  meals: MealPlanItem[];
  groceryList: { item: string; estCost: number }[];
  swaps: { from: string; to: string; reason: string }[];
  summary: string;
}

export interface PipelineResult {
  analysis: SituationAnalysis;
  ingredientIntel: IngredientIntel[];
  mealPlan: MealPlanResult;
}

const PipelineInput = z.object({
  message: z.string().min(3).max(2000),
});

const knownList = knownIngredientList().join(", ");

export const runPipeline = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => PipelineInput.parse(input))
  .handler(async ({ data }): Promise<PipelineResult> => {
    // Agent 1 — Situation Analyzer
    const analysis = await callAiJson<SituationAnalysis>({
      messages: [
        {
          role: "system",
          content: `You are the Situation Analyzer agent for FreshPath ATL, an Atlanta food-access assistant.
Extract structured data from a family's free-text request and return STRICT JSON:
{
  "location": string (Atlanta neighborhood),
  "budget": number (USD weekly),
  "familySize": number,
  "dietaryNeeds": string[],
  "ingredients": string[] (5-8 staples ONLY from: ${knownList}),
  "notes": string
}
Return ONLY the JSON, no prose.`,
        },
        { role: "user", content: data.message },
      ],
      temperature: 0.2,
    });

    analysis.budget = Number(analysis.budget) || 50;
    analysis.familySize = Number(analysis.familySize) || 4;
    analysis.dietaryNeeds = Array.isArray(analysis.dietaryNeeds) ? analysis.dietaryNeeds : [];
    analysis.ingredients =
      Array.isArray(analysis.ingredients) && analysis.ingredients.length > 0
        ? analysis.ingredients
        : ["beans", "rice", "spinach", "eggs", "onions"];
    analysis.location = analysis.location || "Atlanta";
    analysis.notes = analysis.notes || "";

    // Agent 2 — Journey Foods Data Fetcher (RAG over curated + live API)
    const ingredientIntel = await lookupIngredients(analysis.ingredients);

    // Agent 3 — Meal Planner (RAG-grounded)
    const mealPlan = await callAiJson<MealPlanResult>({
      messages: [
        {
          role: "system",
          content: `You are the Meal Planner agent for FreshPath ATL.
Use the provided Journey Foods ingredient intelligence (this is your retrieved knowledge — RAG) to design a 5-meal weekly plan that fits the family's budget and dietary needs.
Return STRICT JSON only:
{
  "weeklyTotalCost": number,
  "costPerPersonPerDay": number,
  "meals": [{ "name": string, "description": string, "estimatedCost": number, "servings": number, "ingredients": string[], "nutritionHighlights": string[] }] (5 items),
  "groceryList": [{ "item": string, "estCost": number }],
  "swaps": [{ "from": string, "to": string, "reason": string }] (1-3),
  "summary": string (2 sentences celebrating impact)
}
Stay under the family budget. Prefer Aldi-friendly staples. No prose outside JSON.`,
        },
        { role: "user", content: JSON.stringify({ analysis, ingredientIntel }) },
      ],
      temperature: 0.4,
    });

    return { analysis, ingredientIntel, mealPlan };
  });

const AdvisorInput = z.object({
  history: z
    .array(
      z.object({
        role: z.enum(["user", "assistant"]),
        content: z.string().min(1).max(4000),
      }),
    )
    .max(40),
  context: z
    .object({
      profileBrief: z.string().optional(),
      analysis: z.unknown().optional(),
      ingredientIntel: z.unknown().optional(),
      mealPlan: z.unknown().optional(),
    })
    .optional(),
});

export const askAdvisor = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => AdvisorInput.parse(input))
  .handler(async ({ data }): Promise<{ reply: string }> => {
    const profile = data.context?.profileBrief
      ? `\n\nFAMILY PROFILE:\n${data.context.profileBrief}`
      : "";
    const planCtx =
      data.context?.analysis || data.context?.mealPlan
        ? `\n\nCURRENT PLAN CONTEXT:\n${JSON.stringify({
            analysis: data.context?.analysis,
            mealPlan: data.context?.mealPlan,
          }).slice(0, 5000)}`
        : "";

    const reply = await callAi({
      messages: [
        {
          role: "system",
          content: `You are the Food Advisor agent for FreshPath ATL — a warm, practical AI nutritionist for Atlanta families in food deserts.
You answer ANY food, nutrition, cooking, budget, or grocery question — not just questions about the current plan.
You know metro Atlanta stores (Aldi, Kroger, Publix, Sevananda, Buford Hwy Farmers Market, Atlanta State Farmers Market, Sprouts) and SNAP/WIC/Fresh-for-Less doubling.
Be concrete: cite prices per serving, mention specific Atlanta neighborhoods/stores, and suggest swaps with rationale.
If the user asks something off-topic, gently steer back to food/nutrition/affordability.
Keep replies under 200 words. Use short bullet lists when helpful.${profile}${planCtx}`,
        },
        ...data.history.map((m) => ({ role: m.role, content: m.content }) as const),
      ],
      temperature: 0.5,
    });

    return { reply };
  });

// ====================== SNAP-A-MEAL VISION AGENT ======================

export interface MealAnalysis {
  identifiedFoods: string[];
  estimatedCalories: number;
  proteinG: number;
  carbsG: number;
  fiberG: number;
  fatG: number;
  sodiumMg: number;
  healthScore: number; // 0-100
  strengths: string[];
  gaps: string[]; // nutrients/food groups missing
  affordableFixes: { add: string; why: string; whereATL: string; costEst: string }[];
  verdict: string;
}

const MealPhotoInput = z.object({
  imageDataUrl: z
    .string()
    .min(20)
    .max(8_000_000)
    .refine((v) => v.startsWith("data:image/"), "Must be a data URL image"),
});

export const analyzeMealPhoto = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => MealPhotoInput.parse(input))
  .handler(async ({ data }): Promise<MealAnalysis> => {
    return await callAiJson<MealAnalysis>({
      model: "google/gemini-2.5-flash",
      messages: [
        {
          role: "system",
          content: `You are the FreshPath ATL Meal Vision agent. You see a photo of a meal and return a nutritional + affordability assessment for Atlanta families.
Return STRICT JSON:
{
  "identifiedFoods": string[] (visible items),
  "estimatedCalories": number,
  "proteinG": number, "carbsG": number, "fiberG": number, "fatG": number, "sodiumMg": number,
  "healthScore": number (0-100, weight: nutrient density, fiber, sodium, balance),
  "strengths": string[] (2-3 bullets),
  "gaps": string[] (nutrients/food groups missing — fiber, leafy greens, lean protein, vitamin C, etc.),
  "affordableFixes": [{ "add": string, "why": string, "whereATL": string, "costEst": string }] (2-4 items, cheap Atlanta-sourced fixes),
  "verdict": string (1-2 sentences)
}
Be honest but kind. Prefer cheap Atlanta-available fixes (Aldi, Kroger, Buford Hwy, Atlanta State Farmers Market). No prose outside JSON.`,
        },
        {
          role: "user",
          content: [
            { type: "text", text: "Analyze this meal." },
            { type: "image_url", image_url: { url: data.imageDataUrl } },
          ],
        },
      ],
      temperature: 0.3,
    });
  });
