"use client";

import Link from "next/link";
import { ArrowLeft, Clock, Calendar, FileText } from "lucide-react";
import { SummaryCard } from "@/components/article/summary-card";
import { useArticula } from "@/lib/store";
import { Button } from "@/components/ui/button";

interface Props {
  articleId: string;
  initialSummary?: string;
  isDynamic?: boolean;
}

export function ArticleDetailClient({ articleId, initialSummary, isDynamic }: Props) {
  const { articles } = useArticula();

  // Only used when isDynamic (user-created article not in seed data)
  if (isDynamic) {
    const article = articles.find((a) => a.id === articleId);
    if (!article) {
      return (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-20 text-center">
          <FileText size={40} className="text-muted-foreground mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">Article not found</h2>
          <p className="text-muted-foreground mb-6">This article may have been deleted or doesn&apos;t exist.</p>
          <Link href="/dashboard/my-articles">
            <Button variant="outline"><ArrowLeft size={14} /> My Articles</Button>
          </Link>
        </div>
      );
    }

    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-10">
          <article>
            <h1 className="text-3xl sm:text-4xl font-bold leading-tight mb-6">{article.title}</h1>
            <div className="flex items-center gap-5 text-sm text-muted-foreground pb-6 border-b border-border mb-6">
              <span className="flex items-center gap-1.5"><Calendar size={13} />{new Date(article.updatedAt).toLocaleDateString()}</span>
              <span className="flex items-center gap-1.5"><Clock size={13} />~{Math.max(1, Math.ceil(article.content.split(" ").length / 200))} min read</span>
            </div>
            <div className="text-muted-foreground leading-relaxed whitespace-pre-wrap">{article.content}</div>
          </article>
          <aside className="lg:sticky lg:top-24 space-y-5">
            <SummaryCard articleId={articleId} initialSummary={initialSummary} />
            <div className="bg-card border border-border rounded-2xl p-5 text-sm space-y-3">
              <h3 className="font-semibold">Article Info</h3>
              <div className="flex justify-between"><span className="text-muted-foreground">Last updated</span><span>{new Date(article.updatedAt).toLocaleDateString()}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Words</span><span>{article.content.split(" ").length}</span></div>
            </div>
          </aside>
        </div>
      </div>
    );
  }

  // Default: just render the SummaryCard for seed articles
  return <SummaryCard articleId={articleId} initialSummary={initialSummary} />;
}
