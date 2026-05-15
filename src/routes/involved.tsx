import { createFileRoute } from "@tanstack/react-router";
import { Heart, ExternalLink, DollarSign, Users, Briefcase, Mail } from "lucide-react";

export const Route = createFileRoute("/involved")({
  head: () => ({
    meta: [
      { title: "Get Involved — Close Atlanta's Food-Access Gap" },
      {
        name: "description",
        content:
          "Donate, volunteer, or invest in real Atlanta organizations fighting food insecurity — from urban farms to mobile markets.",
      },
      { property: "og:title", content: "Get Involved — FreshPath ATL" },
      {
        property: "og:description",
        content:
          "Real Atlanta organizations doing the work — and how to support them with money, time, or business.",
      },
    ],
  }),
  component: InvolvedPage,
});

interface Org {
  name: string;
  mission: string;
  what: string;
  link: string;
  tags: ("Donate" | "Volunteer" | "Invest" | "Partner")[];
  neighborhood: string;
}

const ORGS: Org[] = [
  {
    name: "Atlanta Community Food Bank",
    mission: "Distributes 122 million meals across 29 metro counties annually.",
    what: "Largest hunger-relief organization in Georgia. $1 = 4 meals.",
    link: "https://www.acfb.org",
    tags: ["Donate", "Volunteer", "Partner"],
    neighborhood: "East Point",
  },
  {
    name: "Truly Living Well Center for Natural Urban Agriculture",
    mission: "Black-led urban farming in Atlanta's food deserts.",
    what: "Training the next generation of urban farmers in West End and Collegetown.",
    link: "https://trulylivingwell.com",
    tags: ["Donate", "Volunteer", "Invest"],
    neighborhood: "West End",
  },
  {
    name: "Concrete Jungle ATL",
    mission: "Harvests fruit from forgotten city trees and delivers it to families.",
    what: "Volunteer-run. Has redirected 50,000+ lbs of fresh produce since 2009.",
    link: "https://concrete-jungle.org",
    tags: ["Donate", "Volunteer"],
    neighborhood: "Citywide",
  },
  {
    name: "Food Well Alliance",
    mission: "Backbone organization for Atlanta's local food movement.",
    what: "Funds and supports 1,800+ urban farms, gardens, and markets across the metro.",
    link: "https://foodwellalliance.org",
    tags: ["Donate", "Partner", "Invest"],
    neighborhood: "Citywide",
  },
  {
    name: "Wholesome Wave Georgia (Fresh for Less)",
    mission: "Doubles SNAP/EBT dollars at participating Atlanta farmers markets.",
    what: "$50 of SNAP becomes $100 of fresh produce. Direct dollar-for-dollar match.",
    link: "https://wholesomewavegeorgia.org",
    tags: ["Donate", "Partner"],
    neighborhood: "Markets statewide",
  },
  {
    name: "Common Market Southeast",
    mission: "Connects Black and small farmers to Atlanta schools and institutions.",
    what: "Investing here puts more local produce into Atlanta school lunches.",
    link: "https://www.thecommonmarket.org/markets/southeast",
    tags: ["Invest", "Partner"],
    neighborhood: "Forest Park",
  },
  {
    name: "Open Hand Atlanta",
    mission: "Cooks and delivers medically-tailored meals to chronically ill Atlantans.",
    what: "1.4 million meals/year. Strong evidence-based food-as-medicine model.",
    link: "https://www.openhandatlanta.org",
    tags: ["Donate", "Volunteer"],
    neighborhood: "Cheshire Bridge",
  },
  {
    name: "Goodr",
    mission: "ATL-founded startup turning surplus food into community meals.",
    what: "Investable for-profit fighting hunger. Founded by Jasmine Crowe-Houston.",
    link: "https://goodr.co",
    tags: ["Invest", "Partner"],
    neighborhood: "Atlanta-based",
  },
];

const TAG_STYLES: Record<Org["tags"][number], string> = {
  Donate: "border-fresh/40 bg-fresh/10 text-fresh",
  Volunteer: "border-info/40 bg-info/10 text-info",
  Invest: "border-warm/40 bg-warm/10 text-warm",
  Partner: "border-foreground/30 bg-foreground/5 text-foreground/85",
};

function InvolvedPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-10 lg:px-6 lg:py-14">
      <header className="mb-8 max-w-3xl">
        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-destructive">
          Get involved
        </p>
        <h1 className="mt-2 font-display text-3xl font-bold sm:text-4xl">
          Apps don't end food deserts. <span className="text-gradient-fresh">People do.</span>
        </h1>
        <p className="mt-3 text-base text-muted-foreground">
          FreshPath is a tool. The real work happens at urban farms, mobile
          markets, and food banks across Atlanta. Here are the organizations
          actually closing the gap — and exactly how to back them.
        </p>
      </header>

      {/* CTA cards */}
      <section className="mb-10 grid grid-cols-1 gap-4 sm:grid-cols-3">
        {[
          {
            icon: DollarSign,
            t: "Donate",
            d: "$25 = a week of meals. Every org below accepts direct support.",
            color: "text-fresh",
            bg: "bg-fresh/10",
          },
          {
            icon: Users,
            t: "Volunteer",
            d: "Saturdays, evenings, family days. Most need 2 hours, not a career.",
            color: "text-info",
            bg: "bg-info/10",
          },
          {
            icon: Briefcase,
            t: "Invest",
            d: "Open a grocery in a desert zip. Fund a Black-owned farm. Back ATL food startups.",
            color: "text-warm",
            bg: "bg-warm/10",
          },
        ].map((c) => (
          <div
            key={c.t}
            className="rounded-2xl border border-border/60 bg-background/40 p-6"
          >
            <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${c.bg} ${c.color}`}>
              <c.icon className="h-5 w-5" />
            </div>
            <h3 className="mt-4 font-display text-lg font-semibold">{c.t}</h3>
            <p className="mt-1.5 text-sm text-muted-foreground">{c.d}</p>
          </div>
        ))}
      </section>

      {/* Organizations grid */}
      <section>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-display text-2xl font-bold">Atlanta organizations doing the work</h2>
          <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
            {ORGS.length} verified
          </span>
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {ORGS.map((o) => (
            <a
              key={o.name}
              href={o.link}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative flex flex-col rounded-2xl border border-border/60 bg-background/40 p-5 transition hover:-translate-y-0.5 hover:border-fresh/50 hover:bg-background/60"
            >
              <div className="flex items-start justify-between gap-2">
                <h3 className="font-display text-base font-semibold leading-tight">{o.name}</h3>
                <ExternalLink className="h-3.5 w-3.5 shrink-0 text-muted-foreground transition group-hover:text-fresh" />
              </div>
              <p className="mt-1 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                {o.neighborhood}
              </p>
              <p className="mt-3 text-sm leading-relaxed text-foreground/90">{o.mission}</p>
              <p className="mt-2 text-[12px] leading-relaxed text-muted-foreground">{o.what}</p>
              <div className="mt-4 flex flex-wrap gap-1.5">
                {o.tags.map((t) => (
                  <span
                    key={t}
                    className={`rounded-full border px-2 py-0.5 font-mono text-[9px] uppercase tracking-wider ${TAG_STYLES[t]}`}
                  >
                    {t}
                  </span>
                ))}
              </div>
            </a>
          ))}
        </div>
      </section>

      {/* Investor pitch */}
      <section className="mt-12 rounded-3xl border border-warm/30 bg-warm/[0.04] p-8 lg:p-12">
        <div className="grid items-center gap-8 lg:grid-cols-2">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-warm/40 bg-warm/10 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.2em] text-warm">
              <Briefcase className="h-3 w-3" />
              For investors & developers
            </span>
            <h2 className="mt-3 font-display text-2xl font-bold sm:text-3xl">
              Atlanta's food deserts are also Atlanta's biggest grocery opportunity
            </h2>
            <p className="mt-3 text-base leading-relaxed text-foreground/85">
              500,000+ residents are spending $1.5B+ annually on groceries — but
              traveling miles to do it. Building <em>any</em> well-stocked,
              SNAP-friendly grocery in West End, Bankhead, or Vine City is both
              a profit center and a civic act.
            </p>
            <p className="mt-3 text-base leading-relaxed text-foreground/85">
              The City of Atlanta's <strong>Food Access Initiative</strong> offers
              tax incentives, the <strong>Atlanta Wealth Building Initiative</strong> funds
              Black-owned grocery startups, and <strong>Invest Atlanta</strong> backs
              mobile-market projects. The capital is sitting there.
            </p>
          </div>
          <div className="space-y-3">
            <a
              href="https://www.investatlanta.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between rounded-xl border border-border/60 bg-background/60 p-4 transition hover:border-warm/50"
            >
              <div>
                <p className="font-display text-sm font-semibold">Invest Atlanta</p>
                <p className="text-xs text-muted-foreground">Public economic development authority</p>
              </div>
              <ExternalLink className="h-4 w-4 text-muted-foreground" />
            </a>
            <a
              href="https://www.atlantawealthbuilding.org"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between rounded-xl border border-border/60 bg-background/60 p-4 transition hover:border-warm/50"
            >
              <div>
                <p className="font-display text-sm font-semibold">Atlanta Wealth Building Initiative</p>
                <p className="text-xs text-muted-foreground">Funds Black-owned grocery & food businesses</p>
              </div>
              <ExternalLink className="h-4 w-4 text-muted-foreground" />
            </a>
            <a
              href="https://www.atlantaga.gov/government/mayor-s-office/projects-and-initiatives/food-policy"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between rounded-xl border border-border/60 bg-background/60 p-4 transition hover:border-warm/50"
            >
              <div>
                <p className="font-display text-sm font-semibold">Atlanta Mayor's Food Policy Office</p>
                <p className="text-xs text-muted-foreground">Tax incentives & permitting for food deserts</p>
              </div>
              <ExternalLink className="h-4 w-4 text-muted-foreground" />
            </a>
            <a
              href="mailto:hello@freshpathatl.app"
              className="flex items-center justify-between rounded-xl bg-gradient-to-r from-fresh to-info p-4 text-fresh-foreground transition hover:opacity-95"
            >
              <div>
                <p className="font-display text-sm font-semibold">Partner with FreshPath</p>
                <p className="text-xs opacity-90">We want to plug your data, store, or fund into the app</p>
              </div>
              <Mail className="h-4 w-4" />
            </a>
          </div>
        </div>
      </section>

      <div className="mt-12 flex items-center justify-center gap-2 text-center text-sm text-muted-foreground">
        <Heart className="h-4 w-4 text-fresh" />
        Built by Atlantans, for Atlantans.
      </div>
    </div>
  );
}
