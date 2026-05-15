import type { IngredientIntel } from "@/lib/journey-data";
import { Leaf, DollarSign, Heart, MapPin } from "lucide-react";

function ScoreBar({ value, color }: { value: number; color: string }) {
  return (
    <div className="h-1 w-full overflow-hidden rounded-full bg-background/60">
      <div
        className="h-full rounded-full transition-all"
        style={{ width: `${Math.max(0, Math.min(100, value))}%`, backgroundColor: color }}
      />
    </div>
  );
}

export function IngredientCard({ intel }: { intel: IngredientIntel }) {
  const isLive = intel.source === "journey-api";
  return (
    <div className="group overflow-hidden rounded-xl border border-border/60 bg-background/30 transition hover:border-fresh/40 hover:bg-fresh/[0.03]">
      {intel.imageUrl ? (
        <div className="relative h-28 w-full overflow-hidden bg-background/50">
          <img
            src={intel.imageUrl}
            alt={intel.ingredient}
            loading="lazy"
            className="h-full w-full object-cover transition group-hover:scale-105"
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).style.display = "none";
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-background/10 to-transparent" />
          <span className="absolute left-2 top-2 inline-flex items-center gap-1 rounded-full bg-background/80 px-2 py-0.5 font-mono text-[10px] backdrop-blur">
            <span className="text-base leading-none">{intel.emoji}</span>
            {intel.category}
          </span>
          <span
            className={`absolute right-2 top-2 rounded-full border px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-wider backdrop-blur ${
              isLive
                ? "border-fresh/50 bg-fresh/15 text-fresh"
                : "border-border/60 bg-background/70 text-muted-foreground"
            }`}
            title={isLive ? "Live data" : "Curated for Atlanta"}
          >
            {isLive ? "● live" : "verified"}
          </span>
        </div>
      ) : null}

      <div className="p-3.5">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <p className="truncate font-display text-sm font-semibold">{intel.ingredient}</p>
            <p className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
              ${intel.pricePerServing.toFixed(2)} per serving
            </p>
          </div>
        </div>

        <div className="mt-3 space-y-2">
          {[
            { label: "Nutrition", value: intel.nutritionScore, color: "var(--fresh)", icon: Heart },
            { label: "Affordable", value: intel.affordability, color: "var(--warm)", icon: DollarSign },
            { label: "Sustainable", value: intel.sustainability, color: "var(--info)", icon: Leaf },
          ].map((m) => (
            <div key={m.label}>
              <div className="mb-1 flex items-center justify-between text-[10px] text-muted-foreground">
                <span className="flex items-center gap-1 font-mono uppercase tracking-wider">
                  <m.icon className="h-2.5 w-2.5" />
                  {m.label}
                </span>
                <span className="font-mono font-semibold text-foreground">{m.value}</span>
              </div>
              <ScoreBar value={m.value} color={m.color} />
            </div>
          ))}
        </div>

        <p className="mt-3 line-clamp-2 text-[11px] leading-relaxed text-muted-foreground">
          {intel.notes}
        </p>

        <p className="mt-2 flex items-start gap-1 text-[10px] leading-snug text-muted-foreground">
          <MapPin className="mt-0.5 h-2.5 w-2.5 shrink-0 text-fresh" />
          <span className="truncate">{intel.atlantaSourcing}</span>
        </p>
      </div>
    </div>
  );
}
