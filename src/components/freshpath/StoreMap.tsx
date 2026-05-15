import { lazy, Suspense, useEffect, useState } from "react";
import { ATLANTA_STORES, type AtlantaStore } from "@/lib/journey-data";
import { MapPin, BadgeCheck, Clock, ExternalLink } from "lucide-react";

const StoreMapInner = lazy(() => import("./StoreMapInner"));

function MapPlaceholder() {
  return (
    <div className="grid h-[520px] place-items-center rounded-2xl border border-border/60 bg-background/40">
      <div className="text-center">
        <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-fresh border-t-transparent" />
        <p className="mt-3 font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
          loading map…
        </p>
      </div>
    </div>
  );
}

export function StoreMap() {
  const [mounted, setMounted] = useState(false);
  const [selected, setSelected] = useState<AtlantaStore | null>(null);

  useEffect(() => setMounted(true), []);

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
      <div className="overflow-hidden rounded-2xl border border-border/60 lg:col-span-2">
        {mounted ? (
          <Suspense fallback={<MapPlaceholder />}>
            <StoreMapInner onSelect={setSelected} />
          </Suspense>
        ) : (
          <MapPlaceholder />
        )}
      </div>

      <div className="space-y-2 lg:max-h-[520px] lg:overflow-y-auto lg:pr-1">
        <div className="flex flex-wrap items-center gap-3 rounded-xl border border-border/60 bg-background/40 p-3 text-[11px]">
          <Legend color="#10b981" label="Affordable store" />
          <Legend color="#e5484d" label="Severe food desert" dot />
          <Legend color="#f5a524" label="Limited access" dot />
        </div>
        {ATLANTA_STORES.map((s) => {
          const active = selected?.name === s.name;
          return (
            <button
              key={s.name}
              onClick={() => setSelected(s)}
              className={`group block w-full rounded-xl border p-3 text-left transition ${
                active
                  ? "border-fresh/60 bg-fresh/[0.06]"
                  : "border-border/60 bg-background/40 hover:border-fresh/40 hover:bg-background/60"
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <p className="font-display text-sm font-semibold leading-tight">{s.name}</p>
                {s.snap && (
                  <span className="inline-flex shrink-0 items-center gap-1 rounded-full border border-info/40 bg-info/10 px-1.5 py-0.5 font-mono text-[9px] uppercase text-info">
                    <BadgeCheck className="h-2.5 w-2.5" />
                    SNAP
                  </span>
                )}
              </div>
              <p className="mt-1 flex items-center gap-1 text-[11px] text-muted-foreground">
                <MapPin className="h-3 w-3" />
                {s.neighborhood} · {s.type}
              </p>
              {s.hours && (
                <p className="mt-0.5 flex items-center gap-1 text-[11px] text-muted-foreground">
                  <Clock className="h-3 w-3" />
                  {s.hours}
                </p>
              )}
              <p className="mt-2 text-[12px] leading-relaxed text-foreground/85">{s.notes}</p>
              {active && (
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(s.address)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 inline-flex items-center gap-1 text-[11px] font-semibold text-fresh hover:underline"
                >
                  Get directions <ExternalLink className="h-3 w-3" />
                </a>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function Legend({ color, label, dot }: { color: string; label: string; dot?: boolean }) {
  return (
    <div className="flex items-center gap-1.5">
      <span
        className="h-3 w-3 rounded-full"
        style={{
          backgroundColor: dot ? `${color}40` : color,
          border: `1px solid ${color}`,
        }}
      />
      <span className="text-foreground/80">{label}</span>
    </div>
  );
}
