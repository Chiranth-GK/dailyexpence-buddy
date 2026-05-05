import { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send, Sparkles } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import type { Expense } from "@/lib/expense-data";

interface Msg { role: "user" | "assistant"; content: string; }

const ExpenseChat = ({ expenses }: { expenses: Expense[] }) => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([
    { role: "assistant", content: "Hi! I'm your finance assistant. Ask me anything about your spending or budgeting." },
  ]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  const send = async () => {
    const text = input.trim();
    if (!text || busy) return;
    setInput("");
    const userMsg: Msg = { role: "user", content: text };
    setMessages((p) => [...p, userMsg]);
    setBusy(true);

    try {
      const resp = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/expense-chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({ messages: [...messages, userMsg], expenses }),
      });

      if (!resp.ok || !resp.body) {
        if (resp.status === 429) toast.error("Rate limit hit, try again shortly.");
        else if (resp.status === 402) toast.error("AI credits exhausted. Add funds in Settings → Workspace.");
        else toast.error("AI request failed");
        setBusy(false);
        return;
      }

      const reader = resp.body.getReader();
      const decoder = new TextDecoder();
      let buf = "";
      let acc = "";
      let started = false;
      let done = false;

      while (!done) {
        const { done: d, value } = await reader.read();
        if (d) break;
        buf += decoder.decode(value, { stream: true });
        let nl: number;
        while ((nl = buf.indexOf("\n")) !== -1) {
          let line = buf.slice(0, nl);
          buf = buf.slice(nl + 1);
          if (line.endsWith("\r")) line = line.slice(0, -1);
          if (!line.startsWith("data: ")) continue;
          const json = line.slice(6).trim();
          if (json === "[DONE]") { done = true; break; }
          try {
            const p = JSON.parse(json);
            const c = p.choices?.[0]?.delta?.content;
            if (c) {
              acc += c;
              if (!started) {
                started = true;
                setMessages((prev) => [...prev, { role: "assistant", content: acc }]);
              } else {
                setMessages((prev) => prev.map((m, i) => i === prev.length - 1 ? { ...m, content: acc } : m));
              }
            }
          } catch { buf = line + "\n" + buf; break; }
        }
      }
    } catch (e) {
      console.error(e);
      toast.error("Network error");
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setOpen((v) => !v)}
        className="fixed bottom-6 right-6 z-50 p-4 rounded-full bg-primary text-primary-foreground glow-primary shadow-lg hover:scale-105 transition-transform"
        aria-label="Open AI assistant"
      >
        {open ? <X className="w-5 h-5" /> : <MessageCircle className="w-5 h-5" />}
      </button>

      {open && (
        <div className="fixed bottom-24 right-4 left-4 sm:left-auto sm:w-96 z-50 glass-card flex flex-col h-[70vh] max-h-[600px] overflow-hidden">
          <div className="flex items-center gap-2 p-4 border-b border-border">
            <Sparkles className="w-4 h-4 text-primary" />
            <h3 className="font-semibold text-sm">Finance Assistant</h3>
          </div>

          <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[85%] rounded-lg px-3 py-2 text-sm ${
                  m.role === "user" ? "bg-primary text-primary-foreground" : "bg-secondary"
                }`}>
                  {m.role === "assistant" ? (
                    <div className="prose prose-sm prose-invert max-w-none [&>*]:my-1">
                      <ReactMarkdown>{m.content}</ReactMarkdown>
                    </div>
                  ) : m.content}
                </div>
              </div>
            ))}
            {busy && messages[messages.length - 1]?.role === "user" && (
              <div className="text-xs text-muted-foreground">Thinking...</div>
            )}
          </div>

          <form
            onSubmit={(e) => { e.preventDefault(); send(); }}
            className="p-3 border-t border-border flex gap-2"
          >
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about your expenses..."
              className="bg-secondary border-border"
              disabled={busy}
            />
            <Button type="submit" size="icon" disabled={busy || !input.trim()}>
              <Send className="w-4 h-4" />
            </Button>
          </form>
        </div>
      )}
    </>
  );
};

export default ExpenseChat;
