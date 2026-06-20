"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Save, Send, Eye, EyeOff, AlertCircle, CheckCircle2, ArrowLeft, FileText } from "lucide-react";
import { DashboardSidebar } from "@/components/layout/dashboard-sidebar";
import { Button } from "@/components/ui/button";
import { useArticula } from "@/lib/store";
import Link from "next/link";

export default function CreateArticlePage() {
  const { createArticle, sessionUser } = useArticula();
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [preview, setPreview] = useState(false);
  const [pending, setPending] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  if (!sessionUser) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground mb-4">You must be signed in to write articles.</p>
          <Link href="/login"><Button variant="gradient">Sign in</Button></Link>
        </div>
      </div>
    );
  }

  const handleSave = async (publish = false) => {
    if (!title.trim() || !content.trim()) {
      setMessage({ type: "error", text: "Title and content are required." });
      return;
    }
    setPending(true);
    setMessage(null);
    const ok = await createArticle(title, content);
    setPending(false);
    if (ok) {
      setMessage({ type: "success", text: publish ? "Article published!" : "Draft saved!" });
      setTimeout(() => router.push("/dashboard/my-articles"), 1000);
    } else {
      setMessage({ type: "error", text: "Failed to save. Please try again." });
    }
  };

  const wordCount = content.trim().split(/\s+/).filter(Boolean).length;
  const readTime = Math.max(1, Math.ceil(wordCount / 200));

  return (
    <div className="flex min-h-screen">
      <DashboardSidebar />

      <main className="flex-1 overflow-auto flex flex-col">
        {/* Topbar */}
        <div className="sticky top-0 z-10 border-b border-border bg-background/80 backdrop-blur-xl px-6 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link href="/dashboard/my-articles">
              <button className="p-2 rounded-xl hover:bg-accent transition-colors text-muted-foreground hover:text-foreground">
                <ArrowLeft size={16} />
              </button>
            </Link>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <FileText size={14} />
              <span>New article</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPreview(!preview)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm text-muted-foreground hover:bg-accent hover:text-foreground transition-colors border border-border"
            >
              {preview ? <EyeOff size={13} /> : <Eye size={13} />}
              {preview ? "Edit" : "Preview"}
            </button>
            <Button variant="outline" size="sm" onClick={() => handleSave(false)} disabled={pending}>
              <Save size={13} /> {pending ? "Saving…" : "Save Draft"}
            </Button>
            <Button variant="gradient" size="sm" onClick={() => handleSave(true)} disabled={pending}>
              <Send size={13} /> Publish
            </Button>
          </div>
        </div>

        {/* Message banner */}
        {message && (
          <div className={`mx-6 mt-4 flex items-center gap-2 p-3 rounded-xl text-sm border ${
            message.type === "success"
              ? "bg-green-500/10 border-green-500/30 text-green-300"
              : "bg-red-500/10 border-red-500/30 text-red-300"
          }`}>
            {message.type === "success" ? <CheckCircle2 size={14} /> : <AlertCircle size={14} />}
            {message.text}
          </div>
        )}

        <div className="flex-1 grid grid-cols-1 lg:grid-cols-[1fr_280px]">
          {/* Editor / Preview */}
          <div className="min-h-full p-6 lg:p-10 border-r border-border">
            {preview ? (
              <div className="max-w-2xl mx-auto">
                <h1 className="text-4xl font-bold mb-6 leading-tight">{title || <span className="text-muted-foreground">Untitled article</span>}</h1>
                <div className="text-muted-foreground leading-relaxed whitespace-pre-wrap">{content || "No content yet."}</div>
              </div>
            ) : (
              <div className="max-w-2xl mx-auto space-y-4">
                <input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Article title…"
                  className="w-full bg-transparent text-4xl font-bold placeholder:text-muted-foreground/40 outline-none border-none resize-none leading-tight"
                />
                <div className="h-px bg-border" />
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Start writing your article here… Use markdown-style headings like ## Section, **bold**, and `code`."
                  rows={24}
                  className="w-full bg-transparent text-base text-muted-foreground placeholder:text-muted-foreground/40 outline-none border-none resize-none leading-relaxed font-mono"
                />
              </div>
            )}
          </div>

          {/* Right panel */}
          <div className="p-5 space-y-5 hidden lg:block">
            <div className="bg-card border border-border rounded-2xl p-4 space-y-3 text-sm">
              <h3 className="font-semibold text-xs uppercase tracking-wider text-muted-foreground">Article Stats</h3>
              <div className="flex justify-between"><span className="text-muted-foreground">Words</span><span>{wordCount}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Read time</span><span>~{readTime} min</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Characters</span><span>{content.length}</span></div>
            </div>

            <div className="bg-card border border-border rounded-2xl p-4 text-sm">
              <h3 className="font-semibold text-xs uppercase tracking-wider text-muted-foreground mb-3">Writing Tips</h3>
              <ul className="space-y-2 text-muted-foreground">
                {["Start with a clear hook", "Use ## for section headings", "**bold** for key terms", "`backticks` for inline code", "Aim for 800–1500 words"].map((t) => (
                  <li key={t} className="flex gap-2 text-xs"><span className="text-purple-400">→</span>{t}</li>
                ))}
              </ul>
            </div>

            <div className="bg-purple-500/5 border border-purple-500/20 rounded-2xl p-4 text-sm">
              <p className="text-xs text-purple-300 font-medium mb-1">✦ AI Summary</p>
              <p className="text-xs text-muted-foreground">After publishing, you can generate an AI summary from the article detail page.</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
