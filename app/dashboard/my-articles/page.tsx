"use client";

import { useState } from "react";
import Link from "next/link";
import { PenSquare, Eye, Pencil, Trash2, FileText, AlertCircle, CheckCircle2 } from "lucide-react";
import { DashboardSidebar } from "@/components/layout/dashboard-sidebar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ConfirmDialog } from "@/components/ui/modal";
import { EmptyState } from "@/components/shared/empty-state";
import { useArticula } from "@/lib/store";

export default function MyArticlesPage() {
  const { articles, articlesLoading, deleteArticle, sessionUser } = useArticula();
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Filter to current user's articles only (unless admin)
  const myArticles = sessionUser?.role === "Admin"
    ? articles
    : articles.filter((a) => a.authorId === sessionUser?.id);

  const handleDelete = async (id: string) => {
    const { ok, error } = await deleteArticle(id);
    if (ok) {
      setMessage({ type: "success", text: "Article deleted." });
    } else {
      setMessage({ type: "error", text: error ?? "Failed to delete article." });
    }
    setTimeout(() => setMessage(null), 3000);
  };

  return (
    <div className="flex min-h-screen">
      <DashboardSidebar />

      <main className="flex-1 overflow-auto">
        {/* Header */}
        <div className="sticky top-0 z-10 border-b border-border bg-background/80 backdrop-blur-xl px-6 h-16 flex items-center justify-between">
          <div>
            <h1 className="font-semibold">My Articles</h1>
            <p className="text-xs text-muted-foreground">{myArticles.length} article{myArticles.length !== 1 ? "s" : ""}</p>
          </div>
          <Link href="/articles/create">
            <Button variant="gradient" size="sm">
              <PenSquare size={13} /> New Article
            </Button>
          </Link>
        </div>

        <div className="p-6 max-w-6xl space-y-4">
          {/* Message */}
          {message && (
            <div className={`flex items-center gap-2 p-3 rounded-xl text-sm border ${
              message.type === "success"
                ? "bg-green-500/10 border-green-500/30 text-green-300"
                : "bg-red-500/10 border-red-500/30 text-red-300"
            }`}>
              {message.type === "success" ? <CheckCircle2 size={14} /> : <AlertCircle size={14} />}
              {message.text}
            </div>
          )}

          {articlesLoading ? (
            <div className="space-y-3">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="h-16 rounded-2xl bg-secondary/40 animate-pulse" />
              ))}
            </div>
          ) : myArticles.length === 0 ? (
            <EmptyState
              icon={FileText}
              title="No articles yet"
              description="You haven't written anything yet. Start your first article and share your ideas with the world."
              action={{ label: "Write your first article", href: "/articles/create" }}
            />
          ) : (
            <div className="overflow-hidden rounded-2xl border border-border">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-secondary/50">
                    <th className="text-left px-5 py-3.5 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Title</th>
                    {sessionUser?.role === "Admin" && (
                      <th className="text-left px-5 py-3.5 text-xs font-semibold text-muted-foreground uppercase tracking-wide hidden md:table-cell">Author</th>
                    )}
                    <th className="text-left px-5 py-3.5 text-xs font-semibold text-muted-foreground uppercase tracking-wide hidden md:table-cell">Updated</th>
                    <th className="text-left px-5 py-3.5 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Summary</th>
                    <th className="text-right px-5 py-3.5 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {myArticles.map((article) => (
                    <tr key={article.id} className="hover:bg-secondary/30 transition-colors group">
                      <td className="px-5 py-4">
                        <p className="font-medium text-sm line-clamp-1 group-hover:text-purple-400 transition-colors max-w-xs">{article.title}</p>
                        <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">{article.content.slice(0, 60)}…</p>
                      </td>
                      {sessionUser?.role === "Admin" && (
                        <td className="px-5 py-4 hidden md:table-cell">
                          <span className="text-xs text-muted-foreground font-mono">…{article.authorId?.slice(-6)}</span>
                        </td>
                      )}
                      <td className="px-5 py-4 hidden md:table-cell">
                        <span className="text-xs text-muted-foreground">{new Date(article.updatedAt).toLocaleDateString()}</span>
                      </td>
                      <td className="px-5 py-4">
                        {article.summary
                          ? <Badge variant="purple">AI cached</Badge>
                          : <Badge variant="outline">None</Badge>
                        }
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center justify-end gap-1">
                          <Link href={`/articles/${article.id}`}>
                            <button className="p-1.5 rounded-lg hover:bg-accent text-muted-foreground hover:text-foreground transition-colors" title="View">
                              <Eye size={14} />
                            </button>
                          </Link>
                          <Link href={`/articles/edit/${article.id}`}>
                            <button className="p-1.5 rounded-lg hover:bg-accent text-muted-foreground hover:text-foreground transition-colors" title="Edit">
                              <Pencil size={14} />
                            </button>
                          </Link>
                          <button
                            className="p-1.5 rounded-lg hover:bg-red-500/10 text-muted-foreground hover:text-red-400 transition-colors"
                            onClick={() => setDeleteTarget(article.id)}
                            title="Delete"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>

      <ConfirmDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={() => { if (deleteTarget) handleDelete(deleteTarget); setDeleteTarget(null); }}
        title="Delete article"
        description="This action cannot be undone. The article and its AI summary will be permanently removed."
        confirmLabel="Delete"
        variant="destructive"
      />
    </div>
  );
}
