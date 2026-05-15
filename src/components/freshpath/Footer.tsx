import { Link } from "@tanstack/react-router";
import { Heart } from "lucide-react";

export function Footer() {
  return (
    <footer className="mt-16 border-t border-border/40 bg-background/30">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:grid-cols-2 lg:grid-cols-4 lg:px-6">
        <div>
          <p className="font-display text-lg font-bold">FreshPath ATL</p>
          <p className="mt-2 text-sm text-muted-foreground">
            Helping Atlanta families eat better without spending more.
          </p>
        </div>
        <div>
          <p className="mb-2 font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
            Use the app
          </p>
          <ul className="space-y-1.5 text-sm">
            <li><Link to="/plan" className="hover:text-fresh">Plan my week</Link></li>
            <li><Link to="/map" className="hover:text-fresh">Find food near me</Link></li>
            <li><Link to="/snap" className="hover:text-fresh">Snap a meal</Link></li>
          </ul>
        </div>
        <div>
          <p className="mb-2 font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
            Help close the gap
          </p>
          <ul className="space-y-1.5 text-sm">
            <li><Link to="/involved" className="hover:text-fresh">Donate or volunteer</Link></li>
            <li><Link to="/involved" className="hover:text-fresh">Invest in food access</Link></li>
            <li><Link to="/involved" className="hover:text-fresh">Partner with us</Link></li>
          </ul>
        </div>
        <div>
          <p className="mb-2 font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
            Built with
          </p>
          <p className="text-sm text-muted-foreground">
            Lovable Cloud · Journey Foods · OpenStreetMap · Atlanta community data.
          </p>
        </div>
      </div>
      <div className="border-t border-border/40 py-4 text-center text-xs text-muted-foreground">
        Made with <Heart className="inline h-3 w-3 text-fresh" /> in Atlanta · © {new Date().getFullYear()} FreshPath ATL
      </div>
    </footer>
  );
}
