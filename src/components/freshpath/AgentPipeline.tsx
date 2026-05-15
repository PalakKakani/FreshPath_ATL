import { Brain, Database, ChefHat, MessageCircle, Check } from "lucide-react";
import type { LucideIcon } from "lucide-react";

export type PipelineStage = "idle" | "analyze" | "fetch" | "plan" | "advisor" | "done";

const STAGES: { key: Exclude<PipelineStage, "idle" | "done">; label: string; sub: string; icon: LucideIcon }[] = [
  { key: "analyze", label: "Reading your needs", sub: "Budget, family, diet", icon: Brain },
  { key: "fetch", label: "Looking up ingredients", sub: "Real Atlanta prices", icon: Database },
  { key: "plan", label: "Building your plan", sub: "Meals + grocery list", icon: ChefHat },
  { key: "advisor", label: "Ready to chat", sub: "Ask follow-ups", icon: MessageCircle },
];

const ORDER: PipelineStage[] = ["idle", "analyze", "fetch", "plan", "advisor", "done"];

export function AgentPipeline({ stage }: { stage: PipelineStage }) {
  const stageIndex = ORDER.indexOf(stage);

  return (
    <div className="panel p-5">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-info">
            What's happening
          </p>
          <h2 className="mt-1 font-display text-lg font-semibold">Building your plan</h2>
        </div>
        <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
          {stage === "idle"
            ? "ready"
            : stage === "done"
              ? "done"
              : "working…"}
        </span>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {STAGES.map((s, i) => {
          const isActive = stage === s.key;
          const isDone = stageIndex > ORDER.indexOf(s.key);
          const Icon = s.icon;
          return (
            <div
              key={s.key}
              className={`relative overflow-hidden rounded-xl border p-4 transition ${
                isActive
                  ? "border-fresh/60 bg-fresh/5 glow-fresh"
                  : isDone
                    ? "border-fresh/30 bg-fresh/[0.03]"
                    : "border-border/60 bg-background/30"
              }`}
            >
              {isActive && (
                <div className="pointer-events-none absolute inset-x-0 top-0 h-px overflow-hidden">
                  <div className="h-full w-1/3 animate-flow bg-gradient-to-r from-transparent via-fresh to-transparent" />
                </div>
              )}
              <div className="flex items-start justify-between">
                <div
                  className={`flex h-9 w-9 items-center justify-center rounded-lg ${
                    isActive
                      ? "bg-fresh text-fresh-foreground animate-pulse-ring"
                      : isDone
                        ? "bg-fresh/20 text-fresh"
                        : "bg-surface-elevated text-muted-foreground"
                  }`}
                >
                  {isDone ? <Check className="h-4 w-4" strokeWidth={3} /> : <Icon className="h-4 w-4" />}
                </div>
                <span className="font-mono text-[10px] text-muted-foreground">0{i + 1}</span>
              </div>
              <div className="mt-3">
                <p className="font-display text-sm font-semibold">{s.label}</p>
                <p className="mt-0.5 text-[11px] text-muted-foreground">{s.sub}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
