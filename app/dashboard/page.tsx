"use client";

import Link from "next/link";
import { FileText, Sparkles, Eye, Search, PenSquare, TrendingUp, ArrowRight } from "lucide-react";
import { DashboardSidebar } from "@/components/layout/dashboard-sidebar";
import { StatsCard } from "@/components/dashboard/stats-card";
import { useArticula } from "@/lib/store";
import { Badge } from "@/components/ui/badge";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function DashboardPage() {
  const { sessionUser, articles, articlesLoading, authLoading } = useArticula();
  const router = useRouter();

  useEffect(() => {
    if (!authLoading && !sessionUser) router.push("/login");
  }, [authLoading, sessionUser, router]);

  const myArticles = sessionUser?.role === "Admin"
    ? articles
    : articles.filter((a) => a.authorId === sessionUser?.id);

  const summarizedCount = myArticles.filter((a) => a.summary).length;
  const recentArticles = myArticles.slice(0, 5);

  if (authLoading) {
    return (
      <div className="flex min-h-screen">
        <DashboardSidebar />
        <main className="flex-1 flex items-center justify-center">
          <div className="animate-pulse text-muted-foreground">Loading…</div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen">
      <DashboardSidebar />
      <main className="flex-1 overflow-auto">
        {/* Header */}
        <div className="sticky top-0 z-10 border-b border-border bg-background/80 backdrop-blur-xl px-6 h-16 flex items-center justify-between">
          <div>
            <h1 className="font-semibold">Dashboard</h1>
            <p className="text-xs text-muted-foreground">
              Welcome back, {sessionUser?.email?.split("@")[0] ?? "there"} 👋
              {sessionUser?.role === "Admin" && <span className="ml-2 text-amber-400">🛡 Admin</span>}
            </p>
          </div>
          <Link href="/articles/create">
            <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 text-white text-sm font-medium hover:from-purple-500 hover:to-blue-500 transition-all shadow-lg shadow-purple-500/20">
              <PenSquare size={14} /> New Article
            </button>
          </Link>
        </div>

        <div className="p-6 space-y-8 max-w-6xl">
          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <StatsCard title="My Articles" value={myArticles.length} icon={FileText} color="purple" />
            <StatsCard title="AI Summaries" value={summarizedCount} icon={Sparkles} color="blue" />
            <StatsCard title="Total (Platform)" value={articles.length} icon={Eye} color="green" />
            <StatsCard title="Role" value={sessionUser?.role ?? "—"} icon={Search} color="orange" />
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Link href="/articles/create">
              <div className="group p-5 rounded-2xl border border-border bg-gradient-to-br from-purple-500/10 to-violet-500/10 hover:border-purple-500/40 hover:shadow-lg hover:shadow-purple-500/5 transition-all duration-200 cursor-pointer">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-purple-500/20 flex items-center justify-center text-purple-400"><PenSquare size={18} /></div>
                  <div className="flex-1">
                    <p className="font-semibold">Write New Article</p>
                    <p className="text-sm text-muted-foreground">Notion-style editor, live preview</p>
                  </div>
                  <ArrowRight size={14} className="text-muted-foreground group-hover:text-purple-400 group-hover:translate-x-1 transition-all" />
                </div>
              </div>
            </Link>
            <Link href="/search">
              <div className="group p-5 rounded-2xl border border-border bg-gradient-to-br from-blue-500/10 to-cyan-500/10 hover:border-blue-500/40 hover:shadow-lg hover:shadow-blue-500/5 transition-all duration-200 cursor-pointer">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center text-blue-400"><Search size={18} /></div>
                  <div className="flex-1">
                    <p className="font-semibold">Search Articles</p>
                    <p className="text-sm text-muted-foreground">Full-text, summaries, and tags</p>
                  </div>
                  <ArrowRight size={14} className="text-muted-foreground group-hover:text-blue-400 group-hover:translate-x-1 transition-all" />
                </div>
              </div>
            </Link>
          </div>

          {/* Recent Articles */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">
                {sessionUser?.role === "Admin" ? "All Articles" : "My Recent Articles"}
              </h2>
              <Link href="/dashboard/my-articles" className="text-sm text-purple-400 hover:text-purple-300 flex items-center gap-1">
                View all <ArrowRight size={12} />
              </Link>
            </div>

            {articlesLoading ? (
              <div className="space-y-3">{Array.from({ length: 3 }).map((_, i) => <div key={i} className="h-14 rounded-xl bg-secondary/40 animate-pulse" />)}</div>
            ) : recentArticles.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground border border-dashed border-border rounded-2xl">
                <FileText size={24} className="mx-auto mb-2 opacity-40" />
                <p className="text-sm">No articles yet. <Link href="/articles/create" className="text-purple-400 hover:underline">Write your first one.</Link></p>
              </div>
            ) : (
              <div className="overflow-hidden rounded-2xl border border-border">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border bg-secondary/50">
                      <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Title</th>
                      <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide hidden md:table-cell">Updated</th>
                      <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Summary</th>
                      <th className="text-right px-5 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {recentArticles.map((article) => (
                      <tr key={article.id} className="hover:bg-secondary/30 transition-colors group">
                        <td className="px-5 py-3">
                          <p className="font-medium line-clamp-1 group-hover:text-purple-400 transition-colors">{article.title}</p>
                        </td>
                        <td className="px-5 py-3 hidden md:table-cell text-muted-foreground text-xs">{new Date(article.updatedAt).toLocaleDateString()}</td>
                        <td className="px-5 py-3">
                          {article.summary ? <Badge variant="purple">Cached</Badge> : <Badge variant="outline">None</Badge>}
                        </td>
                        <td className="px-5 py-3 text-right">
                          <div className="flex justify-end gap-2">
                            <Link href={`/articles/${article.id}`} className="text-xs text-muted-foreground hover:text-foreground transition-colors">View</Link>
                            <Link href={`/articles/edit/${article.id}`} className="text-xs text-purple-400 hover:text-purple-300 transition-colors">Edit</Link>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Activity Chart */}
          <div className="bg-card border border-border rounded-2xl p-6">
            <div className="flex items-center justify-between mb-6">
              <div><h3 className="font-semibold">Writing Activity</h3><p className="text-sm text-muted-foreground">Last 7 days</p></div>
              <div className="flex items-center gap-1.5 text-sm text-green-400"><TrendingUp size={14} /> Active</div>
            </div>
            <div className="flex items-end gap-2 h-28">
              {[2, 0, 1, 0, 3, 1, myArticles.length].map((h, i) => {
                const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Today"];
                const maxH = Math.max(1, myArticles.length);
                return (
                  <div key={i} className="flex-1 flex flex-col items-center gap-1.5">
                    <div
                      className={`w-full rounded-lg transition-colors ${i === 6 ? "bg-gradient-to-t from-purple-600 to-purple-400" : "bg-gradient-to-t from-purple-600/40 to-purple-400/20 hover:from-purple-600/60 hover:to-purple-400/40"}`}
                      style={{ height: `${Math.max(8, (h / maxH) * 100)}%` }}
                    />
                    <span className="text-xs text-muted-foreground">{days[i]}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
