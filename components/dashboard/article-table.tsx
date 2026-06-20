"use client";

import Link from "next/link";
import { useState } from "react";
import { Eye, Pencil, Trash2, MoreHorizontal, ExternalLink } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ConfirmDialog } from "@/components/ui/modal";
import type { Article } from "@/lib/data";



interface ArticleTableProps {
  articles: Article[];
  showAuthor?: boolean;
}

export function ArticleTable({ articles, showAuthor = false }: ArticleTableProps) {
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);

  return (
    <>
      <div className="overflow-hidden rounded-2xl border border-border">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-secondary/50">
              <th className="text-left px-5 py-3.5 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                Title
              </th>
              {showAuthor && (
                <th className="text-left px-5 py-3.5 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                  Author
                </th>
              )}
              <th className="text-left px-5 py-3.5 text-xs font-semibold text-muted-foreground uppercase tracking-wide hidden md:table-cell">
                Created
              </th>
              <th className="text-left px-5 py-3.5 text-xs font-semibold text-muted-foreground uppercase tracking-wide hidden lg:table-cell">
                Views
              </th>
              <th className="text-left px-5 py-3.5 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                Status
              </th>
              <th className="text-right px-5 py-3.5 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {articles.map((article) => (
              <tr key={article.id} className="hover:bg-secondary/30 transition-colors group">
                <td className="px-5 py-4">
                  <div className="max-w-sm">
                    <p className="font-medium text-sm line-clamp-1 group-hover:text-purple-400 transition-colors">
                      {article.title}
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">{article.readTime} min read</p>
                  </div>
                </td>
                {showAuthor && (
                  <td className="px-5 py-4">
                    <span className="text-sm text-muted-foreground">{article.author.name}</span>
                  </td>
                )}
                <td className="px-5 py-4 hidden md:table-cell">
                  <span className="text-sm text-muted-foreground">{article.publishedAt}</span>
                </td>
                <td className="px-5 py-4 hidden lg:table-cell">
                  <span className="text-sm text-muted-foreground">{article?.views?.toLocaleString() || '9'}</span>
                </td>
                <td className="px-5 py-4">
                  <Badge variant={article.status === "published" ? "green" : "secondary"}>
                    {article.status === "published" ? "Published" : "Draft"}
                  </Badge>
                </td>
                <td className="px-5 py-4">
                  <div className="flex items-center justify-end gap-1">
                    <Link href={`/articles/${article.id}`}>
                      <button className="p-1.5 rounded-lg hover:bg-accent text-muted-foreground hover:text-foreground transition-colors">
                        <Eye size={14} />
                      </button>
                    </Link>
                    <Link href={`/articles/edit/${article.id}`}>
                      <button className="p-1.5 rounded-lg hover:bg-accent text-muted-foreground hover:text-foreground transition-colors">
                        <Pencil size={14} />
                      </button>
                    </Link>
                    <button
                      className="p-1.5 rounded-lg hover:bg-red-500/10 text-muted-foreground hover:text-red-400 transition-colors"
                      onClick={() => setDeleteTarget(article.id)}
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

      <ConfirmDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={() => setDeleteTarget(null)}
        title="Delete article"
        description="This action cannot be undone. The article and all its AI summaries will be permanently removed."
        confirmLabel="Delete"
        variant="destructive"
      />
    </>
  );
}
