// Journey Foods ingredient intelligence.
// Tries the real Journey Foods API first when JOURNEY_API_KEY is configured;
// gracefully falls back to a curated, Atlanta-tuned mock catalog so the
// demo always works.

export interface IngredientIntel {
  ingredient: string;
  emoji: string;
  category: string;
  nutritionScore: number;
  affordability: number;
  sustainability: number;
  pricePerServing: number;
  proteinG: number;
  fiberG: number;
  sodiumMg: number;
  alternatives: string[];
  atlantaSourcing: string;
  notes: string;
  source: "journey-api" | "freshpath-curated";
  imageUrl?: string;
}

// Free Wikimedia / public-domain food images — no API key needed.
const IMG = (slug: string) =>
  `https://images.unsplash.com/${slug}?auto=format&fit=crop&w=400&q=70`;

const DB: Record<string, Omit<IngredientIntel, "source">> = {
  beans: {
    ingredient: "Black Beans (dry)",
    emoji: "🫘",
    category: "Legume",
    nutritionScore: 92,
    affordability: 95,
    sustainability: 88,
    pricePerServing: 0.18,
    proteinG: 15,
    fiberG: 15,
    sodiumMg: 2,
    alternatives: ["lentils", "chickpeas", "pinto beans"],
    atlantaSourcing: "Aldi (West End), Kroger, Sevananda Co-op",
    notes: "Pound for pound the cheapest complete-meal protein for ATL families.",
    imageUrl: IMG("photo-1564417947365-8dbc9d0e718e"),
  },
  rice: {
    ingredient: "Brown Rice",
    emoji: "🍚",
    category: "Grain",
    nutritionScore: 78,
    affordability: 92,
    sustainability: 70,
    pricePerServing: 0.12,
    proteinG: 5,
    fiberG: 4,
    sodiumMg: 5,
    alternatives: ["quinoa", "barley", "bulgur"],
    atlantaSourcing: "Aldi, Buford Hwy Farmers Market",
    notes: "Pairs with beans for a complete protein at <$0.30 per serving.",
    imageUrl: IMG("photo-1536304993881-ff6e9eefa2a6"),
  },
  quinoa: {
    ingredient: "Quinoa",
    emoji: "🌾",
    category: "Grain",
    nutritionScore: 88,
    affordability: 55,
    sustainability: 60,
    pricePerServing: 0.65,
    proteinG: 8,
    fiberG: 5,
    sodiumMg: 7,
    alternatives: ["brown rice", "bulgur"],
    atlantaSourcing: "Kroger, Sprouts (Edgewood)",
    notes: "Higher protein than rice but ~5x the cost per serving.",
    imageUrl: IMG("photo-1586201375761-83865001e31c"),
  },
  chicken: {
    ingredient: "Chicken Thighs (bone-in)",
    emoji: "🍗",
    category: "Protein",
    nutritionScore: 80,
    affordability: 78,
    sustainability: 55,
    pricePerServing: 0.85,
    proteinG: 22,
    fiberG: 0,
    sodiumMg: 75,
    alternatives: ["chicken legs", "turkey thighs", "lentils"],
    atlantaSourcing: "Aldi (best price), Publix",
    notes: "Bone-in thighs are 40% cheaper than breasts with similar protein.",
    imageUrl: IMG("photo-1604503468506-a8da13d82791"),
  },
  spinach: {
    ingredient: "Frozen Spinach",
    emoji: "🥬",
    category: "Vegetable",
    nutritionScore: 94,
    affordability: 84,
    sustainability: 80,
    pricePerServing: 0.45,
    proteinG: 3,
    fiberG: 4,
    sodiumMg: 65,
    alternatives: ["frozen kale", "collard greens"],
    atlantaSourcing: "Aldi, Kroger, Walmart",
    notes: "Frozen retains nutrients and lasts weeks — ideal for low-access neighborhoods.",
    imageUrl: IMG("photo-1576045057995-568f588f82fb"),
  },
  eggs: {
    ingredient: "Eggs (Large)",
    emoji: "🥚",
    category: "Protein",
    nutritionScore: 90,
    affordability: 80,
    sustainability: 65,
    pricePerServing: 0.32,
    proteinG: 6,
    fiberG: 0,
    sodiumMg: 70,
    alternatives: ["tofu", "beans"],
    atlantaSourcing: "Aldi, Costco",
    notes: "Most affordable complete protein; SNAP-eligible everywhere.",
    imageUrl: IMG("photo-1582722872445-44dc5f7e3c8f"),
  },
  oats: {
    ingredient: "Rolled Oats",
    emoji: "🥣",
    category: "Grain",
    nutritionScore: 90,
    affordability: 96,
    sustainability: 85,
    pricePerServing: 0.09,
    proteinG: 5,
    fiberG: 4,
    sodiumMg: 0,
    alternatives: ["barley", "quinoa flakes"],
    atlantaSourcing: "Aldi, Kroger",
    notes: "Cheapest filling breakfast for families — under $0.10 per bowl.",
    imageUrl: IMG("photo-1517673400267-0251440c45dc"),
  },
  potatoes: {
    ingredient: "Sweet Potatoes",
    emoji: "🍠",
    category: "Vegetable",
    nutritionScore: 92,
    affordability: 90,
    sustainability: 82,
    pricePerServing: 0.35,
    proteinG: 2,
    fiberG: 4,
    sodiumMg: 40,
    alternatives: ["butternut squash", "carrots"],
    atlantaSourcing: "Aldi, Atlanta State Farmers Market",
    notes: "Grown in Georgia — local, in-season, and SNAP-eligible.",
    imageUrl: IMG("photo-1596097635121-14b38c5d7a55"),
  },
  tomatoes: {
    ingredient: "Canned Tomatoes (no-salt)",
    emoji: "🍅",
    category: "Vegetable",
    nutritionScore: 86,
    affordability: 88,
    sustainability: 75,
    pricePerServing: 0.4,
    proteinG: 2,
    fiberG: 2,
    sodiumMg: 20,
    alternatives: ["fresh tomatoes", "tomato sauce"],
    atlantaSourcing: "Aldi, Kroger",
    notes: "No-salt-added cans are crucial for low-sodium meal plans.",
    imageUrl: IMG("photo-1592924357228-91a4daadcfea"),
  },
  onions: {
    ingredient: "Yellow Onions",
    emoji: "🧅",
    category: "Vegetable",
    nutritionScore: 75,
    affordability: 95,
    sustainability: 90,
    pricePerServing: 0.15,
    proteinG: 1,
    fiberG: 2,
    sodiumMg: 4,
    alternatives: ["leeks", "shallots"],
    atlantaSourcing: "Every grocery in metro ATL",
    notes: "Long shelf life — backbone of any low-budget meal plan.",
    imageUrl: IMG("photo-1620574387735-3624d75b2dbc"),
  },
  tofu: {
    ingredient: "Firm Tofu",
    emoji: "🥡",
    category: "Protein",
    nutritionScore: 88,
    affordability: 82,
    sustainability: 92,
    pricePerServing: 0.55,
    proteinG: 14,
    fiberG: 2,
    sodiumMg: 12,
    alternatives: ["tempeh", "beans", "eggs"],
    atlantaSourcing: "Buford Hwy Farmers Market (cheapest), Kroger",
    notes: "Most sustainable protein source — minimal water/land footprint.",
    imageUrl: IMG("photo-1546069901-eacef0df6022"),
  },
  lentils: {
    ingredient: "Red Lentils",
    emoji: "🫛",
    category: "Legume",
    nutritionScore: 91,
    affordability: 93,
    sustainability: 90,
    pricePerServing: 0.22,
    proteinG: 13,
    fiberG: 11,
    sodiumMg: 4,
    alternatives: ["black beans", "split peas"],
    atlantaSourcing: "Aldi, International Farmers Market",
    notes: "Cook in 15 min — no soaking needed, perfect for time-pressed families.",
    imageUrl: IMG("photo-1612257999756-b73e6b5adcb1"),
  },
  bananas: {
    ingredient: "Bananas",
    emoji: "🍌",
    category: "Fruit",
    nutritionScore: 82,
    affordability: 96,
    sustainability: 70,
    pricePerServing: 0.18,
    proteinG: 1,
    fiberG: 3,
    sodiumMg: 1,
    alternatives: ["apples", "frozen berries"],
    atlantaSourcing: "Aldi (cheapest), every Atlanta corner store",
    notes: "Cheapest fresh fruit in metro ATL — ~$0.18/banana at Aldi.",
    imageUrl: IMG("photo-1571771894821-ce9b6c11b08e"),
  },
  carrots: {
    ingredient: "Carrots",
    emoji: "🥕",
    category: "Vegetable",
    nutritionScore: 88,
    affordability: 92,
    sustainability: 88,
    pricePerServing: 0.2,
    proteinG: 1,
    fiberG: 3,
    sodiumMg: 50,
    alternatives: ["sweet potato", "butternut squash"],
    atlantaSourcing: "Aldi, Kroger, Atlanta State Farmers Market",
    notes: "Long-storage root vegetable — keeps 4+ weeks in the fridge.",
    imageUrl: IMG("photo-1598170845058-32b9d6a5da37"),
  },
};

function fromCurated(key: string): IngredientIntel | null {
  const direct = DB[key];
  if (direct) return { ...direct, source: "freshpath-curated" };
  const fuzzy = Object.entries(DB).find(([k]) => key.includes(k) || k.includes(key))?.[1];
  return fuzzy ? { ...fuzzy, source: "freshpath-curated" } : null;
}

interface JourneyApiIngredient {
  name?: string;
  category?: string;
  nutrition_score?: number;
  affordability_score?: number;
  sustainability_score?: number;
  price_per_serving?: number;
  protein_g?: number;
  fiber_g?: number;
  sodium_mg?: number;
  alternatives?: string[];
}

async function tryJourneyApi(name: string): Promise<IngredientIntel | null> {
  const key = process.env.JOURNEY_API_KEY;
  if (!key) return null;
  try {
    const res = await fetch(
      `https://api.journeyfoods.io/v1/ingredients/search?q=${encodeURIComponent(name)}`,
      {
        headers: { Authorization: `Bearer ${key}`, Accept: "application/json" },
        signal: AbortSignal.timeout(4000),
      },
    );
    if (!res.ok) return null;
    const data = (await res.json()) as { results?: JourneyApiIngredient[] } | JourneyApiIngredient[];
    const arr = Array.isArray(data) ? data : (data.results ?? []);
    const first = arr[0];
    if (!first?.name) return null;
    const curated = fromCurated(name.toLowerCase());
    return {
      ingredient: first.name,
      emoji: curated?.emoji ?? "🍽️",
      category: first.category ?? curated?.category ?? "Ingredient",
      nutritionScore: first.nutrition_score ?? curated?.nutritionScore ?? 70,
      affordability: first.affordability_score ?? curated?.affordability ?? 70,
      sustainability: first.sustainability_score ?? curated?.sustainability ?? 70,
      pricePerServing: first.price_per_serving ?? curated?.pricePerServing ?? 0.5,
      proteinG: first.protein_g ?? curated?.proteinG ?? 0,
      fiberG: first.fiber_g ?? curated?.fiberG ?? 0,
      sodiumMg: first.sodium_mg ?? curated?.sodiumMg ?? 0,
      alternatives: first.alternatives ?? curated?.alternatives ?? [],
      atlantaSourcing: curated?.atlantaSourcing ?? "Major Atlanta grocers",
      notes: curated?.notes ?? `Live data from Journey Foods API.`,
      source: "journey-api",
      imageUrl: curated?.imageUrl,
    };
  } catch {
    return null;
  }
}

export async function lookupIngredients(names: string[]): Promise<IngredientIntel[]> {
  const seen = new Set<string>();
  const out: IngredientIntel[] = [];
  for (const raw of names) {
    const key = raw.toLowerCase().trim();
    if (!key) continue;
    const live = await tryJourneyApi(key);
    const intel = live ?? fromCurated(key);
    if (intel && !seen.has(intel.ingredient)) {
      seen.add(intel.ingredient);
      out.push(intel);
    }
  }
  if (out.length === 0) {
    return ["beans", "rice", "spinach", "eggs", "onions", "potatoes"]
      .map(fromCurated)
      .filter((x): x is IngredientIntel => x !== null);
  }
  return out;
}

export function knownIngredientList(): string[] {
  return Object.keys(DB);
}

export interface AtlantaStore {
  name: string;
  neighborhood: string;
  type: string;
  notes: string;
  snap: boolean;
  lat: number;
  lng: number;
  address: string;
  hours?: string;
  affordability: number; // 0-100
}

export const ATLANTA_STORES: AtlantaStore[] = [
  {
    name: "Aldi — West End",
    neighborhood: "West End",
    type: "Discount Grocery",
    notes: "Cheapest staples in southwest ATL. Eggs, bananas, frozen veg under $1.",
    snap: true,
    lat: 33.7396,
    lng: -84.4209,
    address: "835 Lee St SW, Atlanta, GA 30310",
    hours: "9am – 8pm daily",
    affordability: 95,
  },
  {
    name: "Sevananda Natural Foods Co-op",
    neighborhood: "Little Five Points",
    type: "Co-op",
    notes: "Bulk grains, legumes, and produce. Member discounts stack with SNAP.",
    snap: true,
    lat: 33.7649,
    lng: -84.3492,
    address: "467 Moreland Ave NE, Atlanta, GA 30307",
    hours: "8am – 9pm daily",
    affordability: 70,
  },
  {
    name: "Buford Highway Farmers Market",
    neighborhood: "Doraville",
    type: "International Market",
    notes: "Best prices in metro ATL on tofu, produce, rice, and spices.",
    snap: true,
    lat: 33.8895,
    lng: -84.2898,
    address: "5600 Buford Hwy NE, Doraville, GA 30340",
    hours: "8am – 9pm daily",
    affordability: 92,
  },
  {
    name: "Atlanta State Farmers Market",
    neighborhood: "Forest Park",
    type: "Wholesale + Retail",
    notes: "Bulk Georgia-grown sweet potatoes, greens, and seasonal produce.",
    snap: true,
    lat: 33.6479,
    lng: -84.3863,
    address: "16 Forest Pkwy, Forest Park, GA 30297",
    hours: "Open 24 hours",
    affordability: 90,
  },
  {
    name: "Community Farmers Market — East Atlanta",
    neighborhood: "East Atlanta",
    type: "Farmers Market",
    notes: "Doubles SNAP/EBT dollars up to $50 via Fresh for Less program.",
    snap: true,
    lat: 33.7405,
    lng: -84.3349,
    address: "561 Edgewood Ave SE, Atlanta, GA 30312",
    hours: "Thu 4 – 8pm",
    affordability: 80,
  },
  {
    name: "Kroger — Edgewood",
    neighborhood: "Edgewood",
    type: "Full-Service Grocery",
    notes: "Reliable for low-sodium canned goods, frozen veg, store-brand basics.",
    snap: true,
    lat: 33.7546,
    lng: -84.3577,
    address: "1225 Caroline St NE, Atlanta, GA 30307",
    hours: "6am – 11pm daily",
    affordability: 75,
  },
  {
    name: "Walmart Neighborhood Market — Vine City",
    neighborhood: "Vine City",
    type: "Discount Grocery",
    notes: "Recently opened in a former food desert. Wide SNAP selection.",
    snap: true,
    lat: 33.7561,
    lng: -84.4115,
    address: "844 M.L.K. Jr Dr NW, Atlanta, GA 30314",
    hours: "7am – 10pm daily",
    affordability: 88,
  },
  {
    name: "Sprouts Farmers Market — Edgewood",
    neighborhood: "Edgewood",
    type: "Health Grocery",
    notes: "Bulk grains and weekly $1.99 produce sale on Wednesdays.",
    snap: true,
    lat: 33.7558,
    lng: -84.3528,
    address: "1250 Caroline St NE, Atlanta, GA 30307",
    hours: "7am – 10pm daily",
    affordability: 65,
  },
];

// Atlanta neighborhoods with coordinates for the map page.
export const ATL_NEIGHBORHOOD_COORDS: Record<string, { lat: number; lng: number }> = {
  "West End": { lat: 33.7392, lng: -84.4204 },
  "Mechanicsville": { lat: 33.7345, lng: -84.4015 },
  "Bankhead": { lat: 33.7727, lng: -84.4341 },
  "Vine City": { lat: 33.7567, lng: -84.4131 },
  "English Avenue": { lat: 33.7654, lng: -84.4188 },
  "Pittsburgh": { lat: 33.7234, lng: -84.4032 },
  "Adair Park": { lat: 33.7263, lng: -84.4192 },
  "Westview": { lat: 33.7351, lng: -84.4419 },
  "Grove Park": { lat: 33.7773, lng: -84.4601 },
  "Thomasville Heights": { lat: 33.6906, lng: -84.3589 },
  "Edgewood": { lat: 33.7546, lng: -84.3577 },
  "Old Fourth Ward": { lat: 33.7674, lng: -84.3712 },
  "East Atlanta": { lat: 33.7405, lng: -84.3349 },
  "Other Atlanta": { lat: 33.749, lng: -84.388 },
};
