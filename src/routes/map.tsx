import { createFileRoute } from "@tanstack/react-router";
import { MapPin, Info } from "lucide-react";
import { StoreMap } from "@/components/freshpath/StoreMap";
import { FoodDesertMap } from "@/components/freshpath/FoodDesertMap";

export const Route = createFileRoute("/map")({
  head: () => ({
    meta: [
      { title: "Find Food Near Me — Atlanta Stores & Markets" },
      {
        name: "description",
        content:
          "Interactive Atlanta map of SNAP-friendly grocery stores, farmers markets, and co-ops — color-coded by neighborhood food access.",
      },
      { property: "og:title", content: "Find Food Near Me — FreshPath ATL" },
      {
        property: "og:description",
        content:
          "An interactive map of every affordable, SNAP-friendly food source in metro Atlanta.",
      },
    ],
  }),
  component: MapPage,
});

function MapPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-10 lg:px-6 lg:py-14">
      <header className="mb-8 max-w-3xl">
        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-info">
          Find food near me
        </p>
        <h1 className="mt-2 font-display text-3xl font-bold sm:text-4xl">
          Where to actually shop in Atlanta
        </h1>
        <p className="mt-3 text-base text-muted-foreground">
          Every dot is a real, SNAP-friendly food source. Shaded circles show
          neighborhood food-access scores — red areas are food deserts where the
          nearest grocery is over a mile away. Click any pin for details and
          directions.
        </p>
      </header>

      <div className="rounded-2xl border border-info/30 bg-info/[0.04] p-4 lg:p-5">
        <div className="flex items-start gap-3">
          <Info className="mt-0.5 h-4 w-4 shrink-0 text-info" />
          <p className="text-sm leading-relaxed text-foreground/85">
            <strong>Tip:</strong> Farmers markets in red zones (like Community
            Farmers Market in East Atlanta) <em>double</em> SNAP/EBT dollars up
            to $50 through the <strong>Fresh for Less</strong> program — you spend $50, you
            get $100 of fresh produce.
          </p>
        </div>
      </div>

      <section className="mt-6">
        <StoreMap />
      </section>

      <section className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <FoodDesertMap />
        <div className="panel p-5 lg:p-6">
          <div className="mb-3 flex items-center gap-2">
            <MapPin className="h-4 w-4 text-warm" />
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-warm">
              Why this map matters
            </p>
          </div>
          <h2 className="font-display text-xl font-semibold">
            Atlanta's food-desert geography is a civil-rights story
          </h2>
          <div className="mt-4 space-y-3 text-sm leading-relaxed text-foreground/85">
            <p>
              The neighborhoods shaded red on this map — Bankhead, English Avenue,
              Mechanicsville, Thomasville Heights — sit less than 5 miles from
              Whole Foods stores in Buckhead and Midtown. The distance is short.
              The reality is not.
            </p>
            <p>
              For families without a car, a 1.8-mile walk with kids and groceries
              is the difference between fresh broccoli and a bag of chips from the
              corner store. FreshPath was built to shrink that distance with a
              second tool: <strong>information</strong>.
            </p>
            <p>
              Knowing that Aldi on Lee Street is $0.85 cheaper per pound on chicken
              than the corner Family Dollar — and that Buford Highway has tofu for
              $1.50 a block — is its own form of access.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
