import { Send, Sparkles, RefreshCw } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { profileToBrief, type FamilyProfile } from "@/lib/profile";

export function InputPanel({
  profile,
  onSubmit,
  loading,
}: {
  profile: FamilyProfile;
  onSubmit: (text: string) => void;
  loading: boolean;
}) {
  const [text, setText] = useState("");
  const [edited, setEdited] = useState(false);

  // Auto-derive from profile until the user edits manually.
  useEffect(() => {
    if (!edited) setText(profileToBrief(profile));
  }, [profile, edited]);

  return (
    <div className="panel-elevated p-5 lg:p-6">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-fresh">
            Your situation
          </p>
          <h2 className="mt-1 font-display text-xl font-semibold">Build my weekly plan</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            We pulled this from your profile. Edit anything before running.
          </p>
        </div>
        <Sparkles className="h-5 w-5 text-fresh" />
      </div>

      <Textarea
        value={text}
        onChange={(e) => {
          setText(e.target.value);
          setEdited(true);
        }}
        rows={5}
        className="resize-none border-border/60 bg-background/40 font-sans text-sm leading-relaxed focus-visible:ring-fresh"
        disabled={loading}
      />

      {edited && (
        <button
          type="button"
          onClick={() => {
            setText(profileToBrief(profile));
            setEdited(false);
          }}
          className="mt-2 inline-flex items-center gap-1 font-mono text-[10px] uppercase tracking-wider text-muted-foreground hover:text-fresh"
        >
          <RefreshCw className="h-3 w-3" /> reset to profile
        </button>
      )}

      <Button
        size="lg"
        disabled={loading || text.trim().length < 5}
        onClick={() => onSubmit(text.trim())}
        className="mt-5 w-full bg-gradient-to-r from-fresh to-info text-fresh-foreground hover:opacity-95 glow-fresh font-semibold"
      >
        {loading ? (
          <>
            <span className="mr-2 inline-block h-2 w-2 animate-blink rounded-full bg-fresh-foreground" />
            Working…
          </>
        ) : (
          <>
            <Send className="mr-2 h-4 w-4" />
            Build my plan
          </>
        )}
      </Button>
    </div>
  );
}
