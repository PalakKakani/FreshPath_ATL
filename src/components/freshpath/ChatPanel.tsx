import { useEffect, useRef, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { Send, MessageCircle, RotateCcw, User } from "lucide-react";
import { askAdvisor } from "@/lib/agents.functions";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

type Msg = { role: "user" | "assistant"; content: string };

const STORAGE_KEY = "freshpath-atl:advisor-chat";
const SUGGESTIONS = [
  "What's a $5 dinner for 4?",
  "Is canned tuna actually healthy?",
  "Cheapest high-protein breakfast?",
  "Where can I shop without a car?",
  "How do I stretch SNAP further?",
  "Are frozen vegetables as good as fresh?",
];

function loadHistory(): Msg[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as Msg[];
    return Array.isArray(parsed) ? parsed.slice(-30) : [];
  } catch {
    return [];
  }
}

export function ChatPanel({ context }: { context?: unknown }) {
  const ask = useServerFn(askAdvisor);
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const taRef = useRef<HTMLTextAreaElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMessages(loadHistory());
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
    requestAnimationFrame(() => {
      scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
    });
  }, [messages]);

  useEffect(() => {
    if (!pending) taRef.current?.focus();
  }, [pending, messages.length]);

  async function send(text: string) {
    const trimmed = text.trim();
    if (!trimmed || pending) return;
    setError(null);
    const next: Msg[] = [...messages, { role: "user", content: trimmed }];
    setMessages(next);
    setInput("");
    setPending(true);
    try {
      const { reply } = await ask({
        data: {
          history: next.slice(-12),
          context: context as never,
        },
      });
      setMessages((m) => [...m, { role: "assistant", content: reply }]);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Advisor is unavailable.");
      setMessages((m) => m.slice(0, -1));
      setInput(trimmed);
    } finally {
      setPending(false);
    }
  }

  function reset() {
    setMessages([]);
    setError(null);
    if (typeof window !== "undefined") window.localStorage.removeItem(STORAGE_KEY);
  }

  return (
    <div className="panel-elevated flex h-[640px] flex-col">
      <div className="flex items-center justify-between border-b border-border/60 px-5 py-4">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-warm">
            Ask the advisor
          </p>
          <h2 className="mt-0.5 font-display text-lg font-semibold">Food, budget, nutrition — anything</h2>
        </div>
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-wider text-fresh">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-fresh opacity-60" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-fresh" />
            </span>
            online
          </span>
          {messages.length > 0 && (
            <Button size="sm" variant="ghost" onClick={reset} className="h-7 px-2 text-muted-foreground hover:text-foreground">
              <RotateCcw className="h-3 w-3" />
            </Button>
          )}
        </div>
      </div>

      <div ref={scrollRef} className="flex-1 space-y-4 overflow-y-auto px-5 py-5">
        {messages.length === 0 && (
          <div className="flex h-full flex-col items-center justify-center text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-warm/15 text-warm">
              <MessageCircle className="h-6 w-6" />
            </div>
            <p className="mt-3 font-display text-base font-semibold">Hey! I'm your FreshPath advisor.</p>
            <p className="mt-1 max-w-sm text-sm text-muted-foreground">
              I know your family's plan and Atlanta's food landscape. Ask me anything.
            </p>
            <div className="mt-5 flex w-full max-w-md flex-wrap justify-center gap-1.5">
              {SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => send(s)}
                  className="rounded-full border border-border/60 bg-background/40 px-3 py-1.5 text-[12px] text-muted-foreground transition hover:border-warm/60 hover:text-warm"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((m, i) => (
          <div key={i} className={m.role === "user" ? "flex justify-end" : "flex gap-3"}>
            {m.role === "assistant" && (
              <div className="mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-fresh to-info text-fresh-foreground">
                <MessageCircle className="h-3.5 w-3.5" />
              </div>
            )}
            <div
              className={
                m.role === "user"
                  ? "max-w-[78%] rounded-2xl rounded-br-sm bg-fresh px-4 py-2.5 text-sm leading-relaxed text-fresh-foreground"
                  : "max-w-[85%] text-sm leading-relaxed text-foreground/95 whitespace-pre-wrap"
              }
            >
              {m.content}
            </div>
            {m.role === "user" && (
              <div className="mt-1 ml-2 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-surface-elevated text-muted-foreground">
                <User className="h-3.5 w-3.5" />
              </div>
            )}
          </div>
        ))}

        {pending && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span className="h-1.5 w-1.5 animate-blink rounded-full bg-fresh" />
            <span className="h-1.5 w-1.5 animate-blink rounded-full bg-fresh [animation-delay:0.2s]" />
            <span className="h-1.5 w-1.5 animate-blink rounded-full bg-fresh [animation-delay:0.4s]" />
            <span className="ml-1 font-mono text-[11px] uppercase tracking-wider">Thinking…</span>
          </div>
        )}

        {error && (
          <div className="rounded-lg border border-destructive/40 bg-destructive/10 px-3 py-2 text-xs text-destructive-foreground">
            {error}
          </div>
        )}
      </div>

      <div className="border-t border-border/60 p-3">
        <div className="flex items-end gap-2">
          <Textarea
            ref={taRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                send(input);
              }
            }}
            rows={1}
            placeholder="Ask about swaps, prices, stores, nutrition…"
            disabled={pending}
            className="min-h-[42px] resize-none border-border/60 bg-background/40 text-sm focus-visible:ring-fresh"
          />
          <Button
            onClick={() => send(input)}
            disabled={pending || input.trim().length === 0}
            className="h-[42px] bg-gradient-to-br from-fresh to-info text-fresh-foreground hover:opacity-95"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
