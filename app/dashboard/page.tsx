import Link from "next/link";
import {
  FileText,
  Sparkles,
  Eye,
  Search,
  PenSquare,
  TrendingUp,
  ArrowRight,
} from "lucide-react";
import { DashboardSidebar } from "@/components/layout/dashboard-sidebar";
import { StatsCard } from "@/components/dashboard/stats-card";
import { ArticleTable } from "@/components/dashboard/article-table";
import { articles, dummyStats } from "@/lib/data";

export default function DashboardPage() {
  const recentArticles = articles.slice(0, 5);

  return (
    <div className="flex min-h-screen">
      <DashboardSidebar />

      <main className="flex-1 overflow-auto">
        {/* Header */}
        <div className="sticky top-0 z-10 border-b border-border bg-background/80 backdrop-blur-xl px-6 h-16 flex items-center justify-between">
          <div>
            <h1 className="font-semibold">Dashboard</h1>
            <p className="text-xs text-muted-foreground">Good morning, Aria 👋</p>
          </div>
          <Link href="/articles/create">
            <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 text-white text-sm font-medium hover:from-purple-500 hover:to-blue-500 transition-all shadow-lg shadow-purple-500/20">
              <PenSquare size={14} />
              New Article
            </button>
          </Link>
        </div>

        <div className="p-6 space-y-8 max-w-6xl">
          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <StatsCard
              title="Total Articles"
              value={dummyStats.totalArticles}
              change="12%"
              positive
              icon={FileText}
              color="purple"
            />
            <StatsCard
              title="AI Summaries"
              value={dummyStats.totalSummaries}
              change="8%"
              positive
              icon={Sparkles}
              color="blue"
            />
            <StatsCard
              title="Total Views"
              value={`${(dummyStats.totalViews / 1000).toFixed(0)}K`}
              change="24%"
              positive
              icon={Eye}
              color="green"
            />
            <StatsCard
              title="Searches"
              value={`${(dummyStats.totalSearches / 1000).toFixed(1)}K`}
              change="5%"
              positive
              icon={Search}
              color="orange"
            />
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Link href="/articles/create">
              <div className="group p-5 rounded-2xl border border-border bg-gradient-to-br from-purple-500/10 to-violet-500/10 hover:border-purple-500/40 hover:shadow-lg hover:shadow-purple-500/5 transition-all duration-200 cursor-pointer">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-purple-500/20 flex items-center justify-center text-purple-400">
                    <PenSquare size={18} />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold">Write New Article</p>
                    <p className="text-sm text-muted-foreground">Start from a blank canvas</p>
                  </div>
                  <ArrowRight size={14} className="text-muted-foreground group-hover:text-purple-400 group-hover:translate-x-1 transition-all" />
                </div>
              </div>
            </Link>
            <Link href="/search">
              <div className="group p-5 rounded-2xl border border-border bg-gradient-to-br from-blue-500/10 to-cyan-500/10 hover:border-blue-500/40 hover:shadow-lg hover:shadow-blue-500/5 transition-all duration-200 cursor-pointer">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center text-blue-400">
                    <Search size={18} />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold">Search Articles</p>
                    <p className="text-sm text-muted-foreground">Find with Elasticsearch</p>
                  </div>
                  <ArrowRight size={14} className="text-muted-foreground group-hover:text-blue-400 group-hover:translate-x-1 transition-all" />
                </div>
              </div>
            </Link>
          </div>

          {/* Recent Articles */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Recent Articles</h2>
              <Link href="/dashboard/my-articles" className="text-sm text-purple-400 hover:text-purple-300 flex items-center gap-1">
                View all <ArrowRight size={12} />
              </Link>
            </div>
            <ArticleTable articles={recentArticles} />
          </div>

          {/* Activity Trend (Mock Chart) */}
          <div className="bg-card border border-border rounded-2xl p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="font-semibold">Article Views</h3>
                <p className="text-sm text-muted-foreground">Last 7 days</p>
              </div>
              <div className="flex items-center gap-1.5 text-sm text-green-400">
                <TrendingUp size={14} />
                +24% this week
              </div>
            </div>
            {/* Mock bar chart */}
            <div className="flex items-end gap-2 h-32">
              {[40, 65, 45, 80, 55, 90, 75].map((h, i) => {
                const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
                return (
                  <div key={i} className="flex-1 flex flex-col items-center gap-1.5">
                    <div
                      className="w-full rounded-lg bg-gradient-to-t from-purple-600/60 to-purple-400/40 hover:from-purple-600/80 hover:to-purple-400/60 transition-colors"
                      style={{ height: `${h}%` }}
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
