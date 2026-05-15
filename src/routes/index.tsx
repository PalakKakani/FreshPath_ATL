import { createFileRoute, Link } from "@tanstack/react-router";
import {
  AlertTriangle,
  Apple,
  Wallet,
  MapPin,
  Sparkles,
  Camera,
  Heart,
  ArrowRight,
  CheckCircle2,
  Users,
} from "lucide-react";
import heroImage from "@/assets/hero-ingredients.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "FreshPath ATL — Eat Better, Spend Less in Atlanta" },
      {
        name: "description",
        content:
          "Free AI assistant that helps Atlanta families build healthy weekly meal plans on a real budget, find affordable groceries nearby, and get the most from SNAP/WIC.",
      },
      { property: "og:title", content: "FreshPath ATL — Closing Atlanta's Food-Access Gap" },
      {
        property: "og:description",
        content:
          "Plan meals, find food, snap-a-meal nutrition, and get involved — all built around Atlanta's neighborhoods.",
      },
    ],
  }),
  component: HomePage,
});

function HomePage() {
  return (
    <div>
      {/* Hero */}
      <section className="mx-auto max-w-7xl px-4 pt-10 pb-14 lg:px-6 lg:pt-16 lg:pb-20">
        <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <span className="inline-flex items-center gap-2 rounded-full border border-warm/40 bg-warm/10 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.2em] text-warm">
              <AlertTriangle className="h-3 w-3" />
              Atlanta food-desert problem
            </span>
            <h1 className="mt-4 font-display text-4xl font-bold leading-[1.05] tracking-tight sm:text-5xl lg:text-[64px]">
              Eating well shouldn't cost more than{" "}
              <span className="text-gradient-fresh">it should.</span>
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-relaxed text-muted-foreground">
              500,000+ Atlantans live more than a mile from a grocery store.
              Families end up choosing between healthy and affordable.{" "}
              <span className="font-semibold text-foreground">
                FreshPath helps them stop choosing.
              </span>{" "}
              Build a weekly plan, find SNAP-friendly stores nearby, and learn
              what to actually eat — in 30 seconds.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                to="/plan"
                className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-fresh to-info px-6 py-3 font-semibold text-fresh-foreground shadow-lg shadow-fresh/30 transition hover:opacity-95"
              >
                <Sparkles className="h-4 w-4" />
                Plan my week — free
              </Link>
              <Link
                to="/map"
                className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-background/40 px-6 py-3 font-semibold text-foreground transition hover:border-fresh/50 hover:bg-fresh/[0.04]"
              >
                <MapPin className="h-4 w-4" />
                Find food near me
              </Link>
            </div>

            <div className="mt-8 flex flex-wrap gap-2">
              {[
                { icon: Apple, label: "Photo → nutrition in 5s" },
                { icon: Wallet, label: "Plans under $50/week" },
                { icon: MapPin, label: "Atlanta-local stores" },
                { icon: Heart, label: "Built for SNAP/WIC" },
              ].map((b) => (
                <div
                  key={b.label}
                  className="flex items-center gap-1.5 rounded-full border border-border/60 bg-background/40 px-3 py-1.5 text-xs text-foreground/85"
                >
                  <b.icon className="h-3.5 w-3.5 text-fresh" />
                  {b.label}
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-5">
            <div className="relative overflow-hidden rounded-3xl border border-border/60 panel-elevated">
              <img
                src={heroImage}
                alt="Affordable Atlanta grocery staples"
                className="h-full w-full object-cover"
              />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-background/80 via-transparent to-transparent" />
              <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between rounded-xl border border-border/60 bg-background/80 px-3 py-2 backdrop-blur-md">
                <div>
                  <p className="font-mono text-[9px] uppercase tracking-wider text-muted-foreground">
                    sample basket · feeds 4
                  </p>
                  <p className="font-display text-sm font-semibold">
                    7 staples · <span className="text-fresh">$18.40</span>
                  </p>
                </div>
                <span className="rounded-full bg-fresh/15 px-2 py-1 font-mono text-[10px] font-semibold text-fresh">
                  92% nutrition
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Problem strip */}
      <section className="border-y border-border/40 bg-background/40">
        <div className="mx-auto grid max-w-7xl gap-6 px-4 py-10 sm:grid-cols-3 lg:px-6">
          {[
            { v: "500k+", l: "Atlantans living in food deserts" },
            { v: "$3.50", l: "extra spent per meal vs. better-stocked zips" },
            { v: "1.2 mi", l: "average walk to fresh produce in West End" },
          ].map((s) => (
            <div key={s.l} className="text-center">
              <p className="font-display text-4xl font-bold text-fresh">{s.v}</p>
              <p className="mt-1 text-sm text-muted-foreground">{s.l}</p>
            </div>
          ))}
        </div>
      </section>

      {/* What you can do */}
      <section className="mx-auto max-w-7xl px-4 py-16 lg:px-6">
        <div className="mb-10 text-center">
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-fresh">
            Four things, one app
          </p>
          <h2 className="mt-2 font-display text-3xl font-bold sm:text-4xl">
            Healthy + affordable, made simple
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-4">
          {[
            {
              to: "/plan",
              icon: Sparkles,
              title: "Plan my week",
              desc: "Tell us your budget and family size — get a 5-meal plan, grocery list, and money-saving swaps in 30 seconds.",
              color: "text-fresh",
              bg: "bg-fresh/10",
            },
            {
              to: "/map",
              icon: MapPin,
              title: "Find food near me",
              desc: "An interactive Atlanta map of SNAP-friendly stores, farmers markets, and food deserts.",
              color: "text-info",
              bg: "bg-info/10",
            },
            {
              to: "/snap",
              icon: Camera,
              title: "Snap a meal",
              desc: "Take a photo of any meal — get a health score and cheap Atlanta swaps to make it better.",
              color: "text-warm",
              bg: "bg-warm/10",
            },
            {
              to: "/involved",
              icon: Heart,
              title: "Get involved",
              desc: "Donate, volunteer, or invest in real Atlanta organizations closing the food-access gap.",
              color: "text-destructive",
              bg: "bg-destructive/10",
            },
          ].map((c) => (
            <Link
              key={c.title}
              to={c.to}
              className="group relative overflow-hidden rounded-2xl border border-border/60 bg-background/40 p-6 transition hover:-translate-y-0.5 hover:border-fresh/50 hover:bg-background/60"
            >
              <div
                className={`flex h-11 w-11 items-center justify-center rounded-xl ${c.bg} ${c.color}`}
              >
                <c.icon className="h-5 w-5" />
              </div>
              <h3 className="mt-4 font-display text-lg font-semibold">{c.title}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{c.desc}</p>
              <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-fresh">
                Open
                <ArrowRight className="h-3.5 w-3.5 transition group-hover:translate-x-0.5" />
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="border-t border-border/40 bg-background/30">
        <div className="mx-auto max-w-7xl px-4 py-16 lg:px-6">
          <div className="mb-10 text-center">
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-info">
              How it works
            </p>
            <h2 className="mt-2 font-display text-3xl font-bold sm:text-4xl">
              From profile to plate in three steps
            </h2>
          </div>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {[
              {
                n: "01",
                t: "Tell us about your family",
                d: "Neighborhood, household size, budget, dietary needs, and whether you have a car.",
              },
              {
                n: "02",
                t: "We build your plan",
                d: "Our AI cross-references local prices, nutrition data, and Atlanta stores you can actually reach.",
              },
              {
                n: "03",
                t: "Cook, save, repeat",
                d: "Print or save the plan, ask follow-up questions, snap meals to track nutrition.",
              },
            ].map((s) => (
              <div
                key={s.n}
                className="rounded-2xl border border-border/60 bg-background/40 p-6"
              >
                <p className="font-mono text-xl font-bold text-fresh">{s.n}</p>
                <h3 className="mt-2 font-display text-xl font-semibold">{s.t}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{s.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust strip */}
      <section className="mx-auto max-w-7xl px-4 py-12 lg:px-6">
        <div className="rounded-3xl border border-fresh/30 bg-fresh/[0.04] p-8 lg:p-12">
          <div className="grid items-center gap-6 lg:grid-cols-2">
            <div>
              <h2 className="font-display text-2xl font-bold sm:text-3xl">
                Built with — and for — Atlanta
              </h2>
              <p className="mt-3 text-base leading-relaxed text-muted-foreground">
                Every store, every neighborhood, every price reflects the real
                metro Atlanta landscape — from West End to Edgewood, Bankhead
                to Buford Highway.
              </p>
              <div className="mt-5 grid grid-cols-2 gap-2 text-sm">
                {[
                  "USDA food-access data",
                  "Atlanta Regional Commission",
                  "Aldi · Kroger · Publix",
                  "Buford Hwy Farmers Market",
                  "Sevananda Co-op",
                  "Fresh for Less program",
                ].map((x) => (
                  <div key={x} className="flex items-center gap-1.5 text-foreground/85">
                    <CheckCircle2 className="h-3.5 w-3.5 text-fresh" />
                    {x}
                  </div>
                ))}
              </div>
            </div>
            <div className="flex flex-col items-stretch gap-3">
              <Link
                to="/plan"
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-fresh to-info px-6 py-4 font-display text-lg font-semibold text-fresh-foreground shadow-lg shadow-fresh/30 transition hover:opacity-95"
              >
                <Sparkles className="h-5 w-5" />
                Build my first plan
              </Link>
              <Link
                to="/involved"
                className="inline-flex items-center justify-center gap-2 rounded-2xl border border-border/60 bg-background/60 px-6 py-4 font-display text-lg font-semibold transition hover:border-fresh/40"
              >
                <Users className="h-5 w-5" />
                Help close the gap
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
