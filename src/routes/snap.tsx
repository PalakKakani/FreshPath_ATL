import { createFileRoute } from "@tanstack/react-router";
import { MealAnalyzer } from "@/components/freshpath/MealAnalyzer";

export const Route = createFileRoute("/snap")({
  head: () => ({
    meta: [
      { title: "Snap a Meal — Instant Nutrition Score | FreshPath ATL" },
      {
        name: "description",
        content:
          "Take a photo of any meal — get a health score, nutrition breakdown, and cheap Atlanta-sourced fixes in 5 seconds.",
      },
      { property: "og:title", content: "Snap a Meal — FreshPath ATL" },
      {
        property: "og:description",
        content:
          "AI vision turns any meal photo into a nutrition score and a list of affordable Atlanta swaps.",
      },
    ],
  }),
  component: SnapPage,
});

function SnapPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-10 lg:px-6 lg:py-14">
      <header className="mb-8 max-w-3xl">
        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-warm">
          Snap a meal
        </p>
        <h1 className="mt-2 font-display text-3xl font-bold sm:text-4xl">
          Photo your plate — get an instant nutrition check
        </h1>
        <p className="mt-3 text-base text-muted-foreground">
          School lunch tray? Corner-store dinner? Last night's leftovers?
          Take a picture and find out — in 5 seconds — what's in it, what's
          missing, and the <em>cheapest Atlanta ingredient</em> that would
          make it healthier.
        </p>
      </header>

      <MealAnalyzer />

      <section className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
        {[
          {
            t: "It's private",
            d: "Photos are sent to AI for analysis only — not saved on our servers.",
          },
          {
            t: "It's honest",
            d: "We won't shame anyone's plate. We just suggest what cheap thing would help.",
          },
          {
            t: "It's local",
            d: "Every fix is priced and sourced from a real Atlanta store.",
          },
        ].map((c) => (
          <div
            key={c.t}
            className="rounded-2xl border border-border/60 bg-background/40 p-4"
          >
            <p className="font-display text-sm font-semibold">{c.t}</p>
            <p className="mt-1 text-sm text-muted-foreground">{c.d}</p>
          </div>
        ))}
      </section>
    </div>
  );
}
