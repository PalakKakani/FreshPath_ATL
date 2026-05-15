import { useRef, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { Camera, Upload, Loader2, Sparkles, AlertCircle, MapPin, X } from "lucide-react";
import { analyzeMealPhoto, type MealAnalysis } from "@/lib/agents.functions";
import { Button } from "@/components/ui/button";

const MAX_BYTES = 5 * 1024 * 1024; // 5MB

async function fileToCompressedDataUrl(file: File, maxSide = 1024): Promise<string> {
  const dataUrl = await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
  const img = await new Promise<HTMLImageElement>((resolve, reject) => {
    const i = new Image();
    i.onload = () => resolve(i);
    i.onerror = reject;
    i.src = dataUrl;
  });
  const scale = Math.min(1, maxSide / Math.max(img.width, img.height));
  const w = Math.round(img.width * scale);
  const h = Math.round(img.height * scale);
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d")!;
  ctx.drawImage(img, 0, 0, w, h);
  return canvas.toDataURL("image/jpeg", 0.82);
}

export function MealAnalyzer() {
  const analyze = useServerFn(analyzeMealPhoto);
  const fileRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<MealAnalysis | null>(null);

  async function handleFile(file: File) {
    setError(null);
    setResult(null);
    if (!file.type.startsWith("image/")) {
      setError("Please upload an image file (JPG/PNG).");
      return;
    }
    if (file.size > MAX_BYTES) {
      setError("Image is too large. Please pick one under 5MB.");
      return;
    }
    try {
      setLoading(true);
      const dataUrl = await fileToCompressedDataUrl(file);
      setPreview(dataUrl);
      const res = await analyze({ data: { imageDataUrl: dataUrl } });
      setResult(res);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not analyze that photo.");
    } finally {
      setLoading(false);
    }
  }

  function reset() {
    setPreview(null);
    setResult(null);
    setError(null);
    if (fileRef.current) fileRef.current.value = "";
  }

  return (
    <div className="panel-elevated p-5 lg:p-6">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-warm">
            09 / Snap-a-Meal
          </p>
          <h2 className="mt-1 font-display text-xl font-semibold">
            Photo a meal · get nutrition + gaps instantly
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            AI vision identifies the food, scores it, and tells you what cheap Atlanta ingredient to add.
          </p>
        </div>
        <Camera className="h-5 w-5 text-warm" />
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-5">
        {/* Uploader / Preview */}
        <div className="lg:col-span-2">
          {!preview ? (
            <label
              htmlFor="meal-photo"
              className="flex h-64 cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-border/70 bg-background/30 text-center transition hover:border-warm/60 hover:bg-warm/[0.04]"
            >
              <Upload className="h-8 w-8 text-warm" />
              <p className="mt-3 font-display text-sm font-semibold">Drop or tap to upload</p>
              <p className="mt-1 px-4 text-xs text-muted-foreground">
                JPG/PNG · under 5MB · works on phone camera
              </p>
            </label>
          ) : (
            <div className="relative h-64 overflow-hidden rounded-2xl border border-border/60">
              <img src={preview} alt="meal" className="h-full w-full object-cover" />
              <button
                onClick={reset}
                className="absolute right-2 top-2 rounded-full bg-background/80 p-1.5 text-foreground backdrop-blur hover:bg-background"
                aria-label="Reset"
              >
                <X className="h-3.5 w-3.5" />
              </button>
              {loading && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-background/70 backdrop-blur-sm">
                  <Loader2 className="h-6 w-6 animate-spin text-warm" />
                  <p className="mt-2 font-mono text-[11px] uppercase tracking-wider text-warm">
                    Vision agent thinking…
                  </p>
                </div>
              )}
            </div>
          )}
          <input
            ref={fileRef}
            id="meal-photo"
            type="file"
            accept="image/*"
            capture="environment"
            className="hidden"
            onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
          />
          <div className="mt-3 flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => fileRef.current?.click()}
              disabled={loading}
              className="flex-1 border-border/60"
            >
              <Camera className="mr-2 h-3.5 w-3.5" /> {preview ? "Replace photo" : "Take / pick photo"}
            </Button>
          </div>
          {error && (
            <div className="mt-3 flex items-start gap-2 rounded-lg border border-destructive/40 bg-destructive/10 px-3 py-2 text-xs text-destructive-foreground">
              <AlertCircle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
              {error}
            </div>
          )}
        </div>

        {/* Result */}
        <div className="lg:col-span-3">
          {!result && !loading && (
            <div className="flex h-full min-h-[256px] flex-col items-center justify-center rounded-2xl border border-border/60 bg-background/20 p-6 text-center">
              <Sparkles className="h-6 w-6 text-warm" />
              <p className="mt-2 font-display text-sm font-semibold">Waiting for a photo</p>
              <p className="mt-1 max-w-xs text-xs text-muted-foreground">
                Try a school lunch tray, a corner-store dinner, or last night's plate.
              </p>
            </div>
          )}

          {result && (
            <div className="space-y-4">
              <div className="flex items-center justify-between rounded-xl border border-border/60 bg-background/30 p-4">
                <div>
                  <p className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                    Health score
                  </p>
                  <p className="font-display text-3xl font-bold text-fresh">
                    {result.healthScore}
                    <span className="text-base text-muted-foreground">/100</span>
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                    Calories
                  </p>
                  <p className="font-display text-xl font-semibold">{result.estimatedCalories}</p>
                </div>
              </div>

              <div className="grid grid-cols-4 gap-2 text-center">
                {[
                  { l: "Protein", v: `${result.proteinG}g`, c: "text-fresh" },
                  { l: "Fiber", v: `${result.fiberG}g`, c: "text-info" },
                  { l: "Carbs", v: `${result.carbsG}g`, c: "text-warm" },
                  { l: "Sodium", v: `${result.sodiumMg}mg`, c: "text-foreground" },
                ].map((m) => (
                  <div key={m.l} className="rounded-lg border border-border/60 bg-background/30 p-2">
                    <p className={`font-display text-sm font-semibold ${m.c}`}>{m.v}</p>
                    <p className="mt-0.5 font-mono text-[9px] uppercase tracking-wider text-muted-foreground">
                      {m.l}
                    </p>
                  </div>
                ))}
              </div>

              {result.identifiedFoods.length > 0 && (
                <div>
                  <p className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                    Detected
                  </p>
                  <div className="mt-1.5 flex flex-wrap gap-1.5">
                    {result.identifiedFoods.map((f) => (
                      <span
                        key={f}
                        className="rounded-full border border-border/60 bg-background/40 px-2.5 py-0.5 text-[11px] text-foreground/90"
                      >
                        {f}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {result.gaps.length > 0 && (
                <div className="rounded-xl border border-warm/40 bg-warm/[0.06] p-3">
                  <p className="font-mono text-[10px] uppercase tracking-wider text-warm">
                    What's missing
                  </p>
                  <ul className="mt-1.5 space-y-1 text-[12px] text-foreground/90">
                    {result.gaps.map((g, i) => (
                      <li key={i} className="flex items-start gap-1.5">
                        <span className="mt-1 h-1 w-1 shrink-0 rounded-full bg-warm" />
                        {g}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {result.affordableFixes.length > 0 && (
                <div>
                  <p className="font-mono text-[10px] uppercase tracking-wider text-fresh">
                    Cheap Atlanta fixes
                  </p>
                  <div className="mt-1.5 grid grid-cols-1 gap-2 sm:grid-cols-2">
                    {result.affordableFixes.map((f, i) => (
                      <div
                        key={i}
                        className="rounded-lg border border-fresh/30 bg-fresh/[0.05] p-2.5"
                      >
                        <p className="font-display text-sm font-semibold text-fresh">+ {f.add}</p>
                        <p className="mt-0.5 text-[11px] leading-snug text-foreground/85">{f.why}</p>
                        <p className="mt-1.5 flex items-center gap-1 font-mono text-[10px] text-muted-foreground">
                          <MapPin className="h-2.5 w-2.5" /> {f.whereATL} · {f.costEst}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {result.verdict && (
                <p className="rounded-xl border border-border/60 bg-background/30 p-3 text-sm leading-relaxed text-foreground/90">
                  {result.verdict}
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
