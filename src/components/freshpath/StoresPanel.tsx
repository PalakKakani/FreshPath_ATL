import { Store, MapPin, BadgeCheck } from "lucide-react";
import { ATLANTA_STORES } from "@/lib/journey-data";

export function StoresPanel() {
  return (
    <div className="panel p-5 lg:p-6">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-warm">
            08 / Atlanta Food Map
          </p>
          <h2 className="mt-1 font-display text-xl font-semibold">Where to actually shop</h2>
        </div>
        <Store className="h-5 w-5 text-warm" />
      </div>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {ATLANTA_STORES.map((s) => (
          <div
            key={s.name}
            className="group rounded-xl border border-border/60 bg-background/30 p-3.5 transition hover:border-warm/50 hover:bg-warm/[0.03]"
          >
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <p className="truncate font-display text-sm font-semibold">{s.name}</p>
                <p className="mt-0.5 flex items-center gap-1 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                  <MapPin className="h-2.5 w-2.5" />
                  {s.neighborhood} · {s.type}
                </p>
              </div>
              {s.snap && (
                <span className="flex shrink-0 items-center gap-1 rounded-full border border-info/40 bg-info/10 px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-wider text-info">
                  <BadgeCheck className="h-2.5 w-2.5" />
                  SNAP
                </span>
              )}
            </div>
            <p className="mt-2 text-[12px] leading-relaxed text-foreground/80">{s.notes}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
