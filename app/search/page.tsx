"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Search, Clock, ArrowRight, Database, AlertCircle } from "lucide-react";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useArticula } from "@/lib/store";
import { articles as seedArticles } from "@/lib/data";
import type { Article } from "@/lib/store";

// Merge seed articles (no authorId) with user articles from store
function highlight(text: string, query: string) {
  if (!query.trim()) return <>{text}</>;
  const parts = text.split(new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`, "gi"));
  return (
    <>
      {parts.map((part, i) =>
        part.toLowerCase() === query.toLowerCase()
          ? <mark key={i} className="bg-purple-500/30 text-purple-200 rounded px-0.5 not-italic">{part}</mark>
          : part
      )}
    </>
  );
}

function SearchContent() {
  const searchParams = useSearchParams();
  const initialQ = searchParams.get("q") || "";
  const { articles: userArticles, fetchArticles, articlesLoading, sessionUser } = useArticula();

  const [query, setQuery] = useState(initialQ);
  const [activeQuery, setActiveQuery] = useState(initialQ);
  const [localLoading, setLocalLoading] = useState(false);

  useEffect(() => {
    if (initialQ) doSearch(initialQ);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const doSearch = async (q: string) => {
    setActiveQuery(q);
    setLocalLoading(true);
    await fetchArticles(q);
    setLocalLoading(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    doSearch(query);
  };

  // Merge seed + user articles and filter
  const q = activeQuery.toLowerCase();
  const seedMatches = activeQuery
    ? seedArticles.filter(
        (a) =>
          a.title.toLowerCase().includes(q) ||
          a.excerpt.toLowerCase().includes(q) ||
          a.content.toLowerCase().includes(q) ||
          a.summary?.toLowerCase().includes(q)
      )
    : seedArticles.slice(0, 6);

  // User articles from store (already filtered by fetchArticles)
  const userMatches: Article[] = activeQuery ? userArticles : userArticles.slice(0, 3);

  const isLoading = localLoading || articlesLoading;

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 pt-24 pb-20">
        {/* Hero search */}
        <div className="relative py-16 px-4 sm:px-6 border-b border-border overflow-hidden">
          <div className="absolute inset-0 -z-10">
            <div className="absolute top-0 right-1/3 w-64 h-64 bg-blue-500/8 rounded-full blur-3xl" />
          </div>
          <div className="max-w-3xl mx-auto text-center">
            <p className="text-sm font-medium text-blue-400 mb-3 flex items-center justify-center gap-2">
              <Database size={13} /> Elasticsearch full-text search
            </p>
            <h1 className="text-4xl sm:text-5xl font-bold mb-6">Search Articles</h1>
            <form onSubmit={handleSubmit} className="relative">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search by title, topic, keyword, or summary…"
                className="w-full h-14 pl-13 pr-16 rounded-2xl border border-border bg-secondary text-base placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-all"
              />
              <button
                type="submit"
                className="absolute right-3 top-1/2 -translate-y-1/2 px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 text-white text-sm font-medium hover:from-purple-500 hover:to-blue-500 transition-all"
              >
                Search
              </button>
            </form>
            <p className="text-xs text-muted-foreground mt-3">
              Searches titles, body text, and cached AI summaries — same query path as a real Elasticsearch layer.
            </p>
          </div>
        </div>

        {/* Results */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
          {activeQuery && (
            <div className="flex items-center justify-between mb-6">
              <p className="text-sm text-muted-foreground">
                Results for <span className="text-purple-400 font-medium">&quot;{activeQuery}&quot;</span>
                {!isLoading && <> — {seedMatches.length + userMatches.length} found</>}
              </p>
              {isLoading && <span className="text-xs text-muted-foreground animate-pulse">Searching index…</span>}
            </div>
          )}

          {isLoading ? (
            <div className="space-y-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="bg-card border border-border rounded-2xl p-5 space-y-3">
                  <Skeleton className="h-5 w-3/4" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-2/3" />
                </div>
              ))}
            </div>
          ) : (
            <>
              {/* User articles */}
              {userMatches.length > 0 && sessionUser && (
                <div className="mb-8">
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-400" />
                    Your Articles
                  </p>
                  <div className="space-y-3">
                    {userMatches.map((article) => (
                      <Link key={article.id} href={`/articles/${article.id}`}>
                        <div className="group bg-card border border-border rounded-2xl p-5 hover:border-purple-500/40 hover:shadow-lg hover:shadow-purple-500/5 transition-all duration-200">
                          <div className="flex items-start justify-between gap-3 mb-2">
                            <h3 className="font-semibold text-base group-hover:text-purple-400 transition-colors">
                              {highlight(article.title, activeQuery)}
                            </h3>
                            <Badge variant="green">Yours</Badge>
                          </div>
                          <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                            {highlight(article.content.slice(0, 200), activeQuery)}
                          </p>
                          <div className="flex items-center justify-between text-xs text-muted-foreground">
                            <span className="flex items-center gap-1"><Clock size={11} /> {new Date(article.updatedAt).toLocaleDateString()}</span>
                            <span className="flex items-center gap-1 text-purple-400 opacity-0 group-hover:opacity-100 transition-opacity">Read article <ArrowRight size={11} /></span>
                          </div>
                          {article.summary && (
                            <div className="mt-3 px-3 py-2 rounded-xl bg-purple-500/5 border border-purple-500/20 text-xs text-purple-300">
                              <span className="font-medium">AI Summary: </span>
                              {highlight(article.summary.slice(0, 120), activeQuery)}…
                            </div>
                          )}
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Seed articles */}
              {seedMatches.length > 0 && (
                <div>
                  {userMatches.length > 0 && sessionUser && (
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-purple-400" />
                      Featured Articles
                    </p>
                  )}
                  <div className="space-y-3">
                    {seedMatches.map((article) => (
                      <Link key={article.id} href={`/articles/${article.id}`}>
                        <div className="group bg-card border border-border rounded-2xl p-5 hover:border-purple-500/40 hover:shadow-lg hover:shadow-purple-500/5 transition-all duration-200">
                          <div className="flex items-start justify-between gap-3 mb-2">
                            <h3 className="font-semibold text-base group-hover:text-purple-400 transition-colors">
                              {highlight(article.title, activeQuery)}
                            </h3>
                            <div className="flex gap-1.5 shrink-0">
                              {article.tags.slice(0, 2).map((t) => <Badge key={t} variant="outline">{t}</Badge>)}
                            </div>
                          </div>
                          <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                            {highlight(article.excerpt, activeQuery)}
                          </p>
                          <div className="flex items-center gap-4 text-xs text-muted-foreground">
                            <div className="flex items-center gap-1.5">
                              <Avatar src={article.author.avatar} alt={article.author.name} size="sm" />
                              {article.author.name}
                            </div>
                            <span className="flex items-center gap-1"><Clock size={11} /> {article.readTime} min</span>
                            <span className="flex items-center gap-1 ml-auto text-purple-400 opacity-0 group-hover:opacity-100 transition-opacity">
                              Read <ArrowRight size={11} />
                            </span>
                          </div>
                          {article.summary && activeQuery && article.summary.toLowerCase().includes(q) && (
                            <div className="mt-3 px-3 py-2 rounded-xl bg-purple-500/5 border border-purple-500/20 text-xs text-purple-300">
                              <span className="font-medium">In AI Summary: </span>
                              {highlight(article.summary.slice(0, 100), activeQuery)}…
                            </div>
                          )}
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Empty */}
              {seedMatches.length === 0 && userMatches.length === 0 && activeQuery && (
                <div className="text-center py-20">
                  <AlertCircle size={32} className="text-muted-foreground mx-auto mb-4" />
                  <p className="text-lg font-semibold mb-2">No results for &quot;{activeQuery}&quot;</p>
                  <p className="text-sm text-muted-foreground">Try different keywords, or <Link href="/articles/create" className="text-purple-400 hover:underline">write an article</Link> on this topic.</p>
                </div>
              )}

              {/* Empty state: no query yet */}
              {!activeQuery && (
                <div className="text-center py-10 text-muted-foreground">
                  <Search size={32} className="mx-auto mb-4 opacity-30" />
                  <p className="text-sm">Enter a keyword above to search the article index.</p>
                </div>
              )}
            </>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="animate-pulse text-muted-foreground">Loading search…</div></div>}>
      <SearchContent />
    </Suspense>
  );
}
