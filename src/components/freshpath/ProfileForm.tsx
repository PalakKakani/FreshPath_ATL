import { useEffect, useState } from "react";
import { Home, Users, Wallet, Car, BadgeCheck, Save, Check } from "lucide-react";
import {
  ATL_NEIGHBORHOODS,
  DIETARY_OPTIONS,
  NEIGHBORHOOD_ACCESS,
  loadProfile,
  saveProfile,
  type FamilyProfile,
} from "@/lib/profile";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

export function ProfileForm({
  profile,
  onChange,
}: {
  profile: FamilyProfile;
  onChange: (p: FamilyProfile) => void;
}) {
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const p = loadProfile();
    onChange(p);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function update<K extends keyof FamilyProfile>(k: K, v: FamilyProfile[K]) {
    const next = { ...profile, [k]: v };
    if (k === "weeklyBudget") next.monthlyBudget = Math.round(Number(v) * 4.33);
    if (k === "monthlyBudget") next.weeklyBudget = Math.round(Number(v) / 4.33);
    onChange(next);
  }

  function toggleDiet(d: string) {
    const has = profile.dietary.includes(d);
    update("dietary", has ? profile.dietary.filter((x) => x !== d) : [...profile.dietary, d]);
  }

  function handleSave() {
    saveProfile(profile);
    setSaved(true);
    setTimeout(() => setSaved(false), 1800);
  }

  const access = NEIGHBORHOOD_ACCESS[profile.neighborhood];
  const isDesert = access.access < 40;

  return (
    <div className="panel-elevated p-5 lg:p-6">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-fresh">
            Step 01 / Your Family
          </p>
          <h2 className="mt-1 font-display text-xl font-semibold">Tell us about your household</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Saved on your device. The AI uses this in every plan and chat.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {/* Neighborhood */}
        <div className="sm:col-span-2">
          <Label className="flex items-center gap-1.5 text-xs uppercase tracking-wider text-muted-foreground">
            <Home className="h-3 w-3" /> Neighborhood
          </Label>
          <select
            value={profile.neighborhood}
            onChange={(e) => update("neighborhood", e.target.value as FamilyProfile["neighborhood"])}
            className="mt-1.5 w-full rounded-md border border-border/60 bg-background/50 px-3 py-2 text-sm text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-fresh"
          >
            {ATL_NEIGHBORHOODS.map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
          <div
            className={`mt-2 rounded-lg border px-3 py-2 text-[12px] leading-relaxed ${
              isDesert
                ? "border-warm/40 bg-warm/10 text-warm-foreground/90"
                : "border-fresh/40 bg-fresh/10 text-foreground/90"
            }`}
          >
            <div className="flex items-center justify-between font-mono text-[10px] uppercase tracking-wider">
              <span>{isDesert ? "⚠ Food desert" : "✓ Adequate access"}</span>
              <span>access score {access.access}/100</span>
            </div>
            <p className="mt-1">{access.note}</p>
          </div>
        </div>

        {/* Household + budget */}
        <div>
          <Label className="flex items-center gap-1.5 text-xs uppercase tracking-wider text-muted-foreground">
            <Users className="h-3 w-3" /> Household size
          </Label>
          <Input
            type="number"
            min={1}
            max={12}
            value={profile.householdSize}
            onChange={(e) => update("householdSize", Math.max(1, Number(e.target.value) || 1))}
            className="mt-1.5 border-border/60 bg-background/50"
          />
        </div>
        <div>
          <Label className="flex items-center gap-1.5 text-xs uppercase tracking-wider text-muted-foreground">
            <Wallet className="h-3 w-3" /> Weekly food budget (USD)
          </Label>
          <Input
            type="number"
            min={10}
            max={500}
            value={profile.weeklyBudget}
            onChange={(e) => update("weeklyBudget", Math.max(10, Number(e.target.value) || 10))}
            className="mt-1.5 border-border/60 bg-background/50"
          />
          <p className="mt-1 font-mono text-[10px] text-muted-foreground">
            ≈ ${profile.monthlyBudget}/month
          </p>
        </div>

        {/* Dietary */}
        <div className="sm:col-span-2">
          <Label className="text-xs uppercase tracking-wider text-muted-foreground">
            Dietary needs
          </Label>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {DIETARY_OPTIONS.map((d) => {
              const on = profile.dietary.includes(d);
              return (
                <button
                  key={d}
                  type="button"
                  onClick={() => toggleDiet(d)}
                  className={`rounded-full border px-3 py-1 text-xs transition ${
                    on
                      ? "border-fresh bg-fresh/15 text-fresh"
                      : "border-border/60 bg-background/30 text-muted-foreground hover:border-fresh/50 hover:text-foreground"
                  }`}
                >
                  {on && <Check className="mr-1 inline h-3 w-3" />}
                  {d}
                </button>
              );
            })}
          </div>
        </div>

        {/* Toggles */}
        <div>
          <Label className="text-xs uppercase tracking-wider text-muted-foreground">
            Transportation
          </Label>
          <button
            type="button"
            onClick={() => update("hasCar", !profile.hasCar)}
            className={`mt-1.5 flex w-full items-center justify-between rounded-md border px-3 py-2 text-sm transition ${
              profile.hasCar
                ? "border-fresh/50 bg-fresh/10 text-foreground"
                : "border-border/60 bg-background/40 text-muted-foreground"
            }`}
          >
            <span className="flex items-center gap-2">
              <Car className="h-4 w-4" /> {profile.hasCar ? "Has car" : "No car / MARTA only"}
            </span>
            <span className="font-mono text-[10px] uppercase">{profile.hasCar ? "yes" : "no"}</span>
          </button>
        </div>
        <div>
          <Label className="text-xs uppercase tracking-wider text-muted-foreground">
            SNAP / WIC eligible
          </Label>
          <button
            type="button"
            onClick={() => update("snapWic", !profile.snapWic)}
            className={`mt-1.5 flex w-full items-center justify-between rounded-md border px-3 py-2 text-sm transition ${
              profile.snapWic
                ? "border-info/50 bg-info/10 text-foreground"
                : "border-border/60 bg-background/40 text-muted-foreground"
            }`}
          >
            <span className="flex items-center gap-2">
              <BadgeCheck className="h-4 w-4" /> {profile.snapWic ? "Yes — uses benefits" : "Not enrolled"}
            </span>
            <span className="font-mono text-[10px] uppercase">{profile.snapWic ? "yes" : "no"}</span>
          </button>
        </div>

        <div className="sm:col-span-2">
          <Label className="text-xs uppercase tracking-wider text-muted-foreground">
            Anything else (allergies, schedule, kids' ages…)
          </Label>
          <Textarea
            value={profile.notes}
            onChange={(e) => update("notes", e.target.value.slice(0, 400))}
            rows={2}
            placeholder="e.g., Two kids under 8. Work nights so dinners need to be fast."
            className="mt-1.5 resize-none border-border/60 bg-background/40"
          />
        </div>
      </div>

      <Button
        onClick={handleSave}
        className="mt-5 w-full bg-gradient-to-r from-fresh to-info text-fresh-foreground hover:opacity-95 glow-fresh"
      >
        {saved ? (
          <>
            <Check className="mr-2 h-4 w-4" /> Saved
          </>
        ) : (
          <>
            <Save className="mr-2 h-4 w-4" /> Save profile
          </>
        )}
      </Button>
    </div>
  );
}
