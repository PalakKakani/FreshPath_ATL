import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";
import { Sparkles } from "lucide-react";
import { runPipeline, type PipelineResult } from "@/lib/agents.functions";
import { ProfileForm } from "@/components/freshpath/ProfileForm";
import { InputPanel } from "@/components/freshpath/InputPanel";
import { AgentPipeline, type PipelineStage } from "@/components/freshpath/AgentPipeline";
import { IngredientCard } from "@/components/freshpath/IngredientCard";
import { MealPlanView } from "@/components/freshpath/MealPlanView";
import { ChatPanel } from "@/components/freshpath/ChatPanel";
import { DEFAULT_PROFILE, profileToBrief, type FamilyProfile } from "@/lib/profile";
import emptyState from "@/assets/empty-state.png";

export const Route = createFileRoute("/plan")({
  head: () => ({
    meta: [
      { title: "Plan My Week — FreshPath ATL" },
      {
        name: "description",
        content:
          "Build a personalized weekly meal plan for your Atlanta family — within budget, SNAP-friendly, and built from real local stores.",
      },
      { property: "og:title", content: "Plan My Week — FreshPath ATL" },
      {
        property: "og:description",
        content:
          "Tell FreshPath your budget and family size, and get a full meal plan, grocery list, and money-saving swaps in seconds.",
      },
    ],
  }),
  component: PlanPage,
});

function PlanPage() {
  const run = useServerFn(runPipeline);
  const [profile, setProfile] = useState<FamilyProfile>(DEFAULT_PROFILE);
  const [stage, setStage] = useState<PipelineStage>("idle");
  const [result, setResult] = useState<PipelineResult | null>(null);

  async function handleRun(message: string) {
    setResult(null);
    setStage("analyze");
    const t1 = setTimeout(() => setStage((s) => (s === "analyze" ? "fetch" : s)), 1400);
    const t2 = setTimeout(() => setStage((s) => (s === "fetch" ? "plan" : s)), 3200);
    try {
      const res = await run({ data: { message } });
      clearTimeout(t1);
      clearTimeout(t2);
      setResult(res);
      setStage("advisor");
      setTimeout(() => setStage("done"), 700);
      toast.success("Meal plan ready", {
        description: `Weekly cost $${res.mealPlan.weeklyTotalCost.toFixed(2)} for ${res.analysis.familySize} people.`,
      });
    } catch (e) {
      clearTimeout(t1);
      clearTimeout(t2);
      setStage("idle");
      toast.error("Couldn't build your plan", {
        description: e instanceof Error ? e.message : "Please try again.",
      });
    }
  }

  const loading = stage !== "idle" && stage !== "done";
  const chatContext = {
    profileBrief: profileToBrief(profile),
    analysis: result?.analysis,
    mealPlan: result?.mealPlan,
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 lg:px-6 lg:py-14">
      <header className="mb-8 max-w-3xl">
        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-fresh">
          Plan my week
        </p>
        <h1 className="mt-2 font-display text-3xl font-bold sm:text-4xl">
          Your family's healthy, affordable week — built in 30 seconds
        </h1>
        <p className="mt-3 text-base text-muted-foreground">
          Tell us about your household, then click the button. We'll cross-reference
          Atlanta prices and your needs to build the plan, grocery list, and swaps.
        </p>
      </header>

      <section className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <ProfileForm profile={profile} onChange={setProfile} />
        </div>
        <div className="space-y-6 lg:col-span-7">
          <InputPanel profile={profile} onSubmit={handleRun} loading={loading} />
          <AgentPipeline stage={stage} />
        </div>
      </section>

      <section className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-12">
        <div className="space-y-6 lg:col-span-8">
          {result ? (
            <>
              <div className="panel p-5 lg:p-6">
                <MealPlanView plan={result.mealPlan} analysis={result.analysis} />
              </div>
              <div className="panel p-5 lg:p-6">
                <div className="mb-4 flex items-center justify-between">
                  <div>
                    <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-info">
                      Ingredient intelligence
                    </p>
                    <h2 className="mt-1 font-display text-xl font-semibold">
                      What's in your basket — and why it's smart
                    </h2>
                  </div>
                  <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                    {result.ingredientIntel.length} items
                  </span>
                </div>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
                  {result.ingredientIntel.map((intel) => (
                    <IngredientCard key={intel.ingredient} intel={intel} />
                  ))}
                </div>
              </div>
            </>
          ) : (
            <div className="panel flex min-h-[420px] flex-col items-center justify-center p-8 text-center">
              <img
                src={emptyState}
                alt=""
                className="h-32 w-32 object-contain drop-shadow-[0_0_30px_rgba(120,220,140,0.25)]"
              />
              <h3 className="mt-4 font-display text-2xl font-semibold">
                Ready when you are
              </h3>
              <p className="mt-2 max-w-md text-sm leading-relaxed text-muted-foreground">
                Save your profile and click <strong>Build my plan</strong>.
                Your weekly meals, grocery list, and money-saving swaps will appear here.
              </p>
              <div className="mt-6 flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-wider text-fresh">
                <Sparkles className="h-3 w-3" /> takes about 20 seconds
              </div>
            </div>
          )}
        </div>
        <div className="lg:col-span-4">
          <ChatPanel context={chatContext} />
        </div>
      </section>
    </div>
  );
}
