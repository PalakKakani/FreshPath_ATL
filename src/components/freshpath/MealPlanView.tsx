import type { MealPlanResult, SituationAnalysis } from "@/lib/agents.functions";
import { Utensils, ShoppingBasket, ArrowRightLeft, Sparkles, MapPin, Users, Wallet } from "lucide-react";

export function MealPlanView({
  plan,
  analysis,
}: {
  plan: MealPlanResult;
  analysis: SituationAnalysis;
}) {
  const underBudget = plan.weeklyTotalCost <= analysis.budget;

  return (
    <div className="space-y-5">
      {/* Summary strip */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Stat icon={MapPin} label="Neighborhood" value={analysis.location} />
        <Stat icon={Users} label="Family" value={`${analysis.familySize} people`} />
        <Stat
          icon={Wallet}
          label="Weekly cost"
          value={`$${plan.weeklyTotalCost.toFixed(2)}`}
          accent={underBudget ? "fresh" : "warm"}
          sub={`/ $${analysis.budget} budget`}
        />
        <Stat
          icon={Sparkles}
          label="Per person/day"
          value={`$${plan.costPerPersonPerDay.toFixed(2)}`}
        />
      </div>

      {analysis.dietaryNeeds.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {analysis.dietaryNeeds.map((n) => (
            <span
              key={n}
              className="rounded-full border border-info/40 bg-info/10 px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-wider text-info"
            >
              {n}
            </span>
          ))}
        </div>
      )}

      {/* Meals grid */}
      <div>
        <SectionTitle icon={Utensils} index="03" title="Weekly Meal Plan" tint="fresh" />
        <div className="mt-3 grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
          {plan.meals.map((m, i) => (
            <div
              key={i}
              className="group rounded-xl border border-border/60 bg-background/30 p-4 transition hover:border-fresh/50 hover:bg-fresh/[0.03]"
            >
              <div className="flex items-start justify-between">
                <p className="font-display text-base font-semibold leading-tight">{m.name}</p>
                <span className="rounded-md bg-fresh/15 px-1.5 py-0.5 font-mono text-[10px] font-semibold text-fresh">
                  ${m.estimatedCost.toFixed(2)}
                </span>
              </div>
              <p className="mt-1.5 text-[12px] leading-relaxed text-muted-foreground">{m.description}</p>
              <div className="mt-3 space-y-1">
                {m.nutritionHighlights.slice(0, 3).map((h, j) => (
                  <div key={j} className="flex items-start gap-1.5 text-[11px]">
                    <span className="mt-1 h-1 w-1 shrink-0 rounded-full bg-fresh" />
                    <span className="text-foreground/80">{h}</span>
                  </div>
                ))}
              </div>
              <div className="mt-3 flex flex-wrap gap-1">
                {m.ingredients.slice(0, 5).map((ing) => (
                  <span
                    key={ing}
                    className="rounded border border-border/50 px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-wider text-muted-foreground"
                  >
                    {ing}
                  </span>
                ))}
              </div>
              <p className="mt-3 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                serves {m.servings}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Grocery + swaps */}
      <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
        <div className="rounded-xl border border-border/60 bg-background/30 p-4">
          <SectionTitle icon={ShoppingBasket} index="04" title="Grocery list" tint="warm" />
          <ul className="mt-3 divide-y divide-border/50">
            {plan.groceryList.map((g, i) => (
              <li key={i} className="flex items-center justify-between py-1.5 text-sm">
                <span className="text-foreground/90">{g.item}</span>
                <span className="font-mono text-xs text-muted-foreground">${g.estCost.toFixed(2)}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-xl border border-border/60 bg-background/30 p-4">
          <SectionTitle icon={ArrowRightLeft} index="05" title="Smart swaps" tint="info" />
          {plan.swaps.length === 0 ? (
            <p className="mt-3 text-sm text-muted-foreground">No swaps needed — plan is optimized.</p>
          ) : (
            <ul className="mt-3 space-y-2.5">
              {plan.swaps.map((s, i) => (
                <li key={i} className="rounded-lg border border-border/40 bg-background/40 p-2.5">
                  <p className="font-mono text-[11px]">
                    <span className="text-muted-foreground line-through">{s.from}</span>
                    <span className="mx-1.5 text-info">→</span>
                    <span className="font-semibold text-fresh">{s.to}</span>
                  </p>
                  <p className="mt-1 text-[11px] leading-relaxed text-muted-foreground">{s.reason}</p>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {plan.summary && (
        <div className="rounded-xl border border-fresh/30 bg-fresh/[0.05] p-4">
          <p className="flex items-start gap-2 text-sm leading-relaxed text-foreground/90">
            <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-fresh" />
            {plan.summary}
          </p>
        </div>
      )}
    </div>
  );
}

function Stat({
  icon: Icon,
  label,
  value,
  sub,
  accent,
}: {
  icon: typeof MapPin;
  label: string;
  value: string;
  sub?: string;
  accent?: "fresh" | "warm";
}) {
  return (
    <div className="rounded-xl border border-border/60 bg-background/30 p-3">
      <div className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
        <Icon className="h-3 w-3" />
        {label}
      </div>
      <p
        className={`mt-1.5 font-display text-lg font-semibold leading-tight ${
          accent === "fresh" ? "text-fresh" : accent === "warm" ? "text-warm" : "text-foreground"
        }`}
      >
        {value}
      </p>
      {sub && <p className="font-mono text-[10px] text-muted-foreground">{sub}</p>}
    </div>
  );
}

function SectionTitle({
  icon: Icon,
  index,
  title,
  tint,
}: {
  icon: typeof MapPin;
  index: string;
  title: string;
  tint: "fresh" | "warm" | "info";
}) {
  const color = tint === "fresh" ? "text-fresh" : tint === "warm" ? "text-warm" : "text-info";
  return (
    <div className="flex items-center gap-2">
      <Icon className={`h-4 w-4 ${color}`} />
      <p className={`font-mono text-[10px] uppercase tracking-[0.2em] ${color}`}>{index} / {title}</p>
    </div>
  );
}
