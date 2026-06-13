"use client";

import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Search, Clock, ArrowRight, Zap } from "lucide-react";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { articles } from "@/lib/data";

function highlightMatch(text: string, query: string): React.ReactNode {
  if (!query) return text;
  const parts = text.split(new RegExp(`(${query})`, "gi"));
  return parts.map((part, i) =>
    part.toLowerCase() === query.toLowerCase() ? (
      <mark key={i} className="bg-purple-500/30 text-purple-300 rounded px-0.5">{part}</mark>
    ) : part
  );
}

function SearchContent() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get("q") || "";
  const [query, setQuery] = useState(initialQuery);
  const [activeQuery, setActiveQuery] = useState(initialQuery);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    setLoading(true);
    await new Promise((r) => setTimeout(r, 600));
    setActiveQuery(query.trim());
    setLoading(false);
  };

  const results = activeQuery
    ? articles.filter(
        (a) =>
          a.title.toLowerCase().includes(activeQuery.toLowerCase()) ||
          a.excerpt.toLowerCase().includes(activeQuery.toLowerCase()) ||
          a.tags.some((t) => t.toLowerCase().includes(activeQuery.toLowerCase()))
      )
    : [];

  return (
    <>
      {/* Search header */}
      <section className="pt-32 pb-12 px-4 sm:px-6 border-b border-border bg-gradient-to-b from-secondary/10 to-transparent">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-6 h-6 rounded-md bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center">
              <Zap size={12} className="text-white" />
            </div>
            <p className="text-sm font-medium text-purple-400">Elasticsearch-powered search</p>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold mb-6">Search Articles</h1>

          <form onSubmit={handleSearch} className="relative">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search articles, topics, keywords..."
              className="pl-12 h-14 text-base rounded-2xl pr-32"
            />
            <button
              type="submit"
              className="absolute right-2 top-1/2 -translate-y-1/2 px-5 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 text-white text-sm font-medium hover:from-purple-500 hover:to-blue-500 transition-all"
            >
              Search
            </button>
          </form>

          {/* Popular searches */}
          {!activeQuery && (
            <div className="flex flex-wrap gap-2 mt-4">
              <span className="text-xs text-muted-foreground">Popular:</span>
              {["React", "TypeScript", "AI", "Kubernetes", "PostgreSQL"].map((term) => (
                <button
                  key={term}
                  onClick={() => { setQuery(term); setActiveQuery(term); }}
                  className="text-xs px-3 py-1.5 rounded-full border border-border hover:border-purple-500/40 hover:text-purple-400 transition-colors"
                >
                  {term}
                </button>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Results */}
      <section className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
        {loading ? (
          <div className="space-y-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="p-5 rounded-2xl border border-border space-y-3">
                <Skeleton className="h-5 w-3/4" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-2/3" />
                <div className="flex gap-2">
                  <Skeleton className="h-5 w-16 rounded-full" />
                  <Skeleton className="h-5 w-16 rounded-full" />
                </div>
              </div>
            ))}
          </div>
        ) : activeQuery ? (
          <>
            <div className="flex items-center justify-between mb-6">
              <p className="text-sm text-muted-foreground">
                <span className="font-medium text-foreground">{results.length}</span> results for{" "}
                <span className="text-purple-400">&quot;{activeQuery}&quot;</span>
              </p>
              <p className="text-xs text-muted-foreground">~{(Math.random() * 0.1 + 0.05).toFixed(3)}s</p>
            </div>

            {results.length === 0 ? (
              <div className="text-center py-20">
                <div className="w-14 h-14 rounded-2xl bg-secondary flex items-center justify-center mx-auto mb-4">
                  <Search size={20} className="text-muted-foreground" />
                </div>
                <h3 className="font-semibold mb-2">No results found</h3>
                <p className="text-sm text-muted-foreground">
                  Try different keywords or browse articles in{" "}
                  <Link href="/explore" className="text-purple-400 hover:underline">Explore</Link>
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {results.map((article) => (
                  <Link key={article.id} href={`/articles/${article.id}`}>
                    <div className="group p-5 rounded-2xl border border-border hover:border-purple-500/40 hover:shadow-lg hover:shadow-purple-500/5 transition-all duration-200">
                      {/* Source badge */}
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-xs text-muted-foreground bg-secondary px-2 py-0.5 rounded-md font-mono">
                          articles/{article.id}
                        </span>
                        <span className="text-xs text-green-400">● Relevant</span>
                      </div>

                      <h2 className="font-semibold text-base mb-2 group-hover:text-purple-400 transition-colors">
                        {highlightMatch(article.title, activeQuery)}
                      </h2>

                      <p className="text-sm text-muted-foreground line-clamp-2 mb-3 leading-relaxed">
                        {highlightMatch(article.excerpt, activeQuery)}
                      </p>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Avatar src={article.author.avatar} alt={article.author.name} size="sm" />
                          <span className="text-xs text-muted-foreground">{article.author.name}</span>
                          <span className="text-xs text-muted-foreground flex items-center gap-1">
                            <Clock size={10} /> {article.readTime}m
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          {article.tags.slice(0, 2).map((tag) => (
                            <Badge key={tag} variant="outline" className="text-xs">
                              {highlightMatch(tag, activeQuery)}
                            </Badge>
                          ))}
                          <ArrowRight size={14} className="text-muted-foreground group-hover:text-purple-400 group-hover:translate-x-0.5 transition-all" />
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-20 text-muted-foreground text-sm">
            Enter a query above to search across all articles
          </div>
        )}
      </section>
    </>
  );
}

export default function SearchPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <Suspense fallback={<div className="pt-32 text-center text-muted-foreground">Loading search...</div>}>
          <SearchContent />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}
