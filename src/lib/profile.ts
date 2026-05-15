// Client-safe profile types + localStorage helpers.
// Used by the Profile form, the chat, and the meal-plan pipeline.

export const ATL_NEIGHBORHOODS = [
  "West End",
  "Mechanicsville",
  "Bankhead",
  "Vine City",
  "English Avenue",
  "Pittsburgh",
  "Adair Park",
  "Westview",
  "Grove Park",
  "Thomasville Heights",
  "Edgewood",
  "Old Fourth Ward",
  "East Atlanta",
  "Other Atlanta",
] as const;

export type AtlNeighborhood = (typeof ATL_NEIGHBORHOODS)[number];

// Atlanta food-access scores (0 = severe food desert, 100 = full access).
// Sourced from USDA Food Access Research Atlas + Atlanta Regional Commission.
export const NEIGHBORHOOD_ACCESS: Record<AtlNeighborhood, { access: number; note: string }> = {
  "West End": { access: 35, note: "Limited fresh produce. 1.5mi to nearest full grocery." },
  "Mechanicsville": { access: 22, note: "Severe food desert. No grocery within 1mi." },
  "Bankhead": { access: 18, note: "Severe food desert. Corner stores only." },
  "Vine City": { access: 25, note: "Food desert. Fresh produce 2mi away." },
  "English Avenue": { access: 20, note: "Severe food desert. Bus required for groceries." },
  "Pittsburgh": { access: 28, note: "Limited access. Aldi 1.2mi via MARTA." },
  "Adair Park": { access: 32, note: "Limited access. Walk-up to West End market." },
  "Westview": { access: 30, note: "Limited access. Closest grocery 1.3mi." },
  "Grove Park": { access: 24, note: "Severe food desert. Closest store 1.8mi." },
  "Thomasville Heights": { access: 19, note: "Severe food desert. No transit-friendly grocery." },
  "Edgewood": { access: 78, note: "Good access. Kroger + Sprouts within walking distance." },
  "Old Fourth Ward": { access: 82, note: "Strong access. Whole Foods + farmers market nearby." },
  "East Atlanta": { access: 70, note: "Decent access. Kroger + farmers market nearby." },
  "Other Atlanta": { access: 60, note: "Varies — describe your situation in the chat." },
};

export const DIETARY_OPTIONS = [
  "Low sodium",
  "Diabetic-friendly",
  "Vegetarian",
  "Vegan",
  "Halal",
  "Gluten-free",
  "Heart-healthy",
  "Kid-friendly",
] as const;

export interface FamilyProfile {
  neighborhood: AtlNeighborhood;
  householdSize: number;
  weeklyBudget: number;
  monthlyBudget: number;
  dietary: string[];
  hasCar: boolean;
  snapWic: boolean;
  notes: string;
}

export const DEFAULT_PROFILE: FamilyProfile = {
  neighborhood: "West End",
  householdSize: 4,
  weeklyBudget: 50,
  monthlyBudget: 200,
  dietary: ["Low sodium", "Kid-friendly"],
  hasCar: false,
  snapWic: true,
  notes: "",
};

const KEY = "freshpath-atl:profile";

export function loadProfile(): FamilyProfile {
  if (typeof window === "undefined") return DEFAULT_PROFILE;
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return DEFAULT_PROFILE;
    const parsed = JSON.parse(raw) as Partial<FamilyProfile>;
    return { ...DEFAULT_PROFILE, ...parsed };
  } catch {
    return DEFAULT_PROFILE;
  }
}

export function saveProfile(p: FamilyProfile): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(KEY, JSON.stringify(p));
}

export function profileToBrief(p: FamilyProfile): string {
  const parts = [
    `Family of ${p.householdSize} in ${p.neighborhood}, Atlanta.`,
    `Weekly food budget: $${p.weeklyBudget} (≈$${p.monthlyBudget}/month).`,
    p.dietary.length ? `Dietary needs: ${p.dietary.join(", ")}.` : "",
    p.hasCar ? "Has a car for shopping." : "No car — shops within walking distance or via MARTA.",
    p.snapWic ? "SNAP/WIC eligible." : "",
    p.notes ? `Notes: ${p.notes}` : "",
  ].filter(Boolean);
  return parts.join(" ");
}
