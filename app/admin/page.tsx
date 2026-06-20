"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Users, FileText, BarChart3, Shield, Trash2, Eye, Sparkles, AlertCircle } from "lucide-react";
import { AdminSidebar } from "@/components/layout/admin-sidebar";
import { StatsCard } from "@/components/dashboard/stats-card";
import { Badge } from "@/components/ui/badge";
import { useArticula } from "@/lib/store";

export default function AdminDashboardPage() {
  const { sessionUser, authLoading, articles, articlesLoading, deleteArticle, groupedByAuthor } = useArticula();
  const router = useRouter();

  useEffect(() => {
    if (!authLoading && (!sessionUser || sessionUser.role !== "Admin")) {
      router.push(sessionUser ? "/dashboard" : "/login");
    }
  }, [authLoading, sessionUser, router]);

  if (authLoading) {
    return <div className="flex min-h-screen items-center justify-center"><div className="animate-pulse text-muted-foreground">Loading…</div></div>;
  }

  if (!sessionUser || sessionUser.role !== "Admin") return null;

  const summarizedCount = articles.filter((a) => a.summary).length;
  const authorCount = Object.keys(groupedByAuthor).length;

  return (
    <div className="flex min-h-screen">
      <AdminSidebar />
      <main className="flex-1 overflow-auto">
        <div className="sticky top-0 z-10 border-b border-border bg-background/80 backdrop-blur-xl px-6 h-16 flex items-center gap-3">
          <Shield size={16} className="text-amber-400" />
          <div>
            <h1 className="font-semibold">Admin Dashboard</h1>
            <p className="text-xs text-muted-foreground">Full platform oversight</p>
          </div>
        </div>

        <div className="p-6 max-w-6xl space-y-8">
          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <StatsCard title="Total Articles" value={articles.length} icon={FileText} color="purple" />
            <StatsCard title="AI Summaries" value={summarizedCount} icon={Sparkles} color="blue" />
            <StatsCard title="Unique Authors" value={authorCount} icon={Users} color="green" />
            <StatsCard title="Cache Hit Rate" value={articles.length > 0 ? `${Math.round((summarizedCount / articles.length) * 100)}%` : "0%"} icon={BarChart3} color="orange" />
          </div>

          {/* Admin nav cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { href: "/admin/users", icon: Users, label: "Manage Users", desc: "View and control all accounts", color: "blue" },
              { href: "/admin/articles", icon: FileText, label: "All Articles", desc: "Edit or remove any article", color: "purple" },
              { href: "/admin/analytics", icon: BarChart3, label: "Analytics", desc: "Platform metrics and trends", color: "green" },
            ].map(({ href, icon: Icon, label, desc, color }) => (
              <Link key={href} href={href}>
                <div className={`group p-5 rounded-2xl border border-border bg-${color}-500/5 hover:border-${color}-500/30 hover:bg-${color}-500/10 transition-all cursor-pointer`}>
                  <div className={`w-9 h-9 rounded-xl bg-${color}-500/20 flex items-center justify-center text-${color}-400 mb-3`}><Icon size={16} /></div>
                  <p className="font-semibold text-sm">{label}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{desc}</p>
                </div>
              </Link>
            ))}
          </div>

          {/* Grouped by author */}
          <div>
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Users size={16} className="text-muted-foreground" />
              Articles by Author
            </h2>

            {articlesLoading ? (
              <div className="space-y-3">{Array.from({ length: 3 }).map((_, i) => <div key={i} className="h-24 rounded-2xl bg-secondary/40 animate-pulse" />)}</div>
            ) : Object.keys(groupedByAuthor).length === 0 ? (
              <div className="text-center py-12 border border-dashed border-border rounded-2xl text-muted-foreground">
                <AlertCircle size={24} className="mx-auto mb-2 opacity-40" />
                <p className="text-sm">No user articles yet. They&apos;ll appear here once users start writing.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {Object.entries(groupedByAuthor).map(([author, items]) => (
                  <div key={author} className="rounded-2xl border border-border bg-card overflow-hidden">
                    <div className="px-5 py-3 border-b border-border bg-secondary/30 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-amber-500/20 flex items-center justify-center text-amber-400 text-xs">A</div>
                        <span className="text-sm font-medium text-amber-300">{author}</span>
                      </div>
                      <Badge variant="secondary">{items.length} article{items.length !== 1 ? "s" : ""}</Badge>
                    </div>
                    <div className="divide-y divide-border">
                      {items.map((article) => (
                        <div key={article.id} className="flex items-center justify-between px-5 py-3 hover:bg-secondary/20 transition-colors group">
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium line-clamp-1 group-hover:text-purple-400 transition-colors">{article.title}</p>
                            <p className="text-xs text-muted-foreground mt-0.5">{new Date(article.updatedAt).toLocaleString()}</p>
                          </div>
                          <div className="flex items-center gap-1 ml-3">
                            {article.summary && <Badge variant="purple">Summarized</Badge>}
                            <Link href={`/articles/${article.id}`}>
                              <button className="p-1.5 rounded-lg hover:bg-accent text-muted-foreground hover:text-foreground transition-colors"><Eye size={13} /></button>
                            </Link>
                            <button
                              onClick={() => deleteArticle(article.id)}
                              className="p-1.5 rounded-lg hover:bg-red-500/10 text-muted-foreground hover:text-red-400 transition-colors"
                            >
                              <Trash2 size={13} />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
