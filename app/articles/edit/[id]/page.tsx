"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Save, ArrowLeft, AlertCircle, CheckCircle2, Eye, EyeOff } from "lucide-react";
import { DashboardSidebar } from "@/components/layout/dashboard-sidebar";
import { Button } from "@/components/ui/button";
import { useArticula } from "@/lib/store";
import Link from "next/link";

export default function EditArticlePage() {
  const { id } = useParams<{ id: string }>();
  const { articles, updateArticle, sessionUser } = useArticula();
  const router = useRouter();

  const article = articles.find((a) => a.id === id);

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [preview, setPreview] = useState(false);
  const [pending, setPending] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Pre-fill once article loads
  useEffect(() => {
    if (article) {
      setTitle(article.title);
      setContent(article.content);
    }
  }, [article]);

  if (!sessionUser) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-muted-foreground">Please <Link href="/login" className="text-purple-400 underline">sign in</Link> to edit articles.</p>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="flex min-h-screen">
        <DashboardSidebar />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <p className="text-muted-foreground mb-4">Article not found.</p>
            <Link href="/dashboard/my-articles"><Button variant="outline">Back to My Articles</Button></Link>
          </div>
        </main>
      </div>
    );
  }

  // Permission check: user can only edit their own articles
  const canEdit = sessionUser.role === "Admin" || article.authorId === sessionUser.id;
  if (!canEdit) {
    return (
      <div className="flex min-h-screen">
        <DashboardSidebar />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <AlertCircle size={32} className="text-red-400 mx-auto mb-3" />
            <p className="text-muted-foreground mb-4">You don&apos;t have permission to edit this article.</p>
            <Link href="/dashboard/my-articles"><Button variant="outline">Back to My Articles</Button></Link>
          </div>
        </main>
      </div>
    );
  }

  const handleSave = async () => {
    if (!title.trim() || !content.trim()) {
      setMessage({ type: "error", text: "Title and content are required." });
      return;
    }
    setPending(true);
    setMessage(null);
    const ok = await updateArticle(id, title, content);
    setPending(false);
    if (ok) {
      setMessage({ type: "success", text: "Article updated successfully!" });
      setTimeout(() => router.push("/dashboard/my-articles"), 1000);
    } else {
      setMessage({ type: "error", text: "Failed to update. You may not have permission." });
    }
  };

  const wordCount = content.trim().split(/\s+/).filter(Boolean).length;

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
            <span className="text-sm text-muted-foreground">Editing: <span className="text-foreground font-medium">{article.title.slice(0, 40)}{article.title.length > 40 ? "…" : ""}</span></span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPreview(!preview)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm text-muted-foreground hover:bg-accent hover:text-foreground transition-colors border border-border"
            >
              {preview ? <EyeOff size={13} /> : <Eye size={13} />}
              {preview ? "Edit" : "Preview"}
            </button>
            <Button variant="gradient" size="sm" onClick={handleSave} disabled={pending}>
              <Save size={13} /> {pending ? "Saving…" : "Save Changes"}
            </Button>
          </div>
        </div>

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

        <div className="flex-1 grid grid-cols-1 lg:grid-cols-[1fr_260px]">
          <div className="p-6 lg:p-10 border-r border-border">
            {preview ? (
              <div className="max-w-2xl mx-auto">
                <h1 className="text-4xl font-bold mb-6">{title || "Untitled"}</h1>
                <div className="text-muted-foreground leading-relaxed whitespace-pre-wrap">{content}</div>
              </div>
            ) : (
              <div className="max-w-2xl mx-auto space-y-4">
                <input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-transparent text-4xl font-bold placeholder:text-muted-foreground/40 outline-none border-none resize-none leading-tight"
                  placeholder="Article title…"
                />
                <div className="h-px bg-border" />
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  rows={24}
                  className="w-full bg-transparent text-base text-muted-foreground placeholder:text-muted-foreground/40 outline-none border-none resize-none leading-relaxed font-mono"
                  placeholder="Article content…"
                />
              </div>
            )}
          </div>

          <div className="p-5 space-y-4 hidden lg:block">
            <div className="bg-card border border-border rounded-2xl p-4 space-y-3 text-sm">
              <h3 className="font-semibold text-xs uppercase tracking-wider text-muted-foreground">Stats</h3>
              <div className="flex justify-between"><span className="text-muted-foreground">Words</span><span>{wordCount}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Read time</span><span>~{Math.max(1, Math.ceil(wordCount / 200))} min</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Last saved</span><span className="text-xs">{new Date(article.updatedAt).toLocaleTimeString()}</span></div>
            </div>

            {article.summary && (
              <div className="bg-purple-500/5 border border-purple-500/20 rounded-2xl p-4 text-xs">
                <p className="text-purple-300 font-medium mb-1.5">✦ Cached AI Summary</p>
                <p className="text-muted-foreground leading-relaxed">{article.summary.slice(0, 120)}…</p>
                <p className="text-muted-foreground/60 mt-2">Editing this article will invalidate the cached summary.</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
