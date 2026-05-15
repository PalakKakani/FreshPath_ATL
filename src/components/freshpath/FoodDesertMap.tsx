import { Map, AlertCircle } from "lucide-react";
import { NEIGHBORHOOD_ACCESS, type AtlNeighborhood } from "@/lib/profile";

export function FoodDesertMap({ active }: { active?: AtlNeighborhood }) {
  const entries = Object.entries(NEIGHBORHOOD_ACCESS) as [
    AtlNeighborhood,
    { access: number; note: string },
  ][];
  const sorted = [...entries].sort((a, b) => a[1].access - b[1].access);
  const desertCount = sorted.filter(([, v]) => v.access < 40).length;

  return (
    <div className="panel p-5 lg:p-6">
      <div className="mb-4 flex items-start justify-between">
        <div>
          <p className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.2em] text-info">
            <Map className="h-3 w-3" />
            Atlanta neighborhoods
          </p>
          <h2 className="mt-2 font-display text-xl font-semibold">
            Who has access to fresh food?
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Lower bars mean longer walks to a real grocery store.
          </p>
        </div>
      </div>

      {desertCount > 0 && (
        <div className="mb-4 flex items-start gap-2 rounded-lg border border-destructive/30 bg-destructive/[0.06] px-3 py-2 text-[12px] text-foreground/90">
          <AlertCircle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-destructive" />
          <span>
            <strong>{desertCount} neighborhoods</strong> are classified as severe food deserts —
            no full grocery store within 1 mile.
          </span>
        </div>
      )}

      <div className="space-y-1.5">
        {sorted.map(([name, { access, note }]) => {
          const isActive = name === active;
          const tone =
            access < 30
              ? "bg-destructive/80"
              : access < 50
                ? "bg-warm/80"
                : access < 70
                  ? "bg-info/70"
                  : "bg-fresh/80";
          const label =
            access < 30 ? "severe" : access < 50 ? "limited" : access < 70 ? "okay" : "good";
          return (
            <div
              key={name}
              className={`rounded-lg border px-3 py-2 transition ${
                isActive
                  ? "border-fresh/60 bg-fresh/[0.06]"
                  : "border-border/50 bg-background/30 hover:border-border"
              }`}
            >
              <div className="flex items-center justify-between gap-2">
                <p className="truncate text-sm font-medium">
                  {name}
                  {isActive && (
                    <span className="ml-2 rounded-full bg-fresh px-1.5 py-0.5 font-mono text-[9px] uppercase text-fresh-foreground">
                      you
                    </span>
                  )}
                </p>
                <span
                  className={`shrink-0 rounded-full px-2 py-0.5 font-mono text-[9px] uppercase tracking-wider ${
                    access < 30
                      ? "bg-destructive/15 text-destructive"
                      : access < 50
                        ? "bg-warm/15 text-warm"
                        : access < 70
                          ? "bg-info/15 text-info"
                          : "bg-fresh/15 text-fresh"
                  }`}
                >
                  {label} · {access}
                </span>
              </div>
              <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-background/60">
                <div className={`h-full transition-all ${tone}`} style={{ width: `${access}%` }} />
              </div>
              <p className="mt-1 text-[11px] leading-snug text-muted-foreground">{note}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
