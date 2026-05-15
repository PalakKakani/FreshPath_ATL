import { Sprout } from "lucide-react";

export function Logo({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <div className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-fresh to-info glow-fresh">
        <Sprout className="h-5 w-5 text-fresh-foreground" strokeWidth={2.5} />
      </div>
      <div className="flex flex-col leading-none">
        <span className="font-display text-lg font-bold tracking-tight">
          FreshPath <span className="text-gradient-fresh">ATL</span>
        </span>
        <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
          food intelligence
        </span>
      </div>
    </div>
  );
}
