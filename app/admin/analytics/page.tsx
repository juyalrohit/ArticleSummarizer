import { Eye, FileText, Search, TrendingUp, Users, Zap } from "lucide-react";
import { AdminSidebar } from "@/components/layout/admin-sidebar";
import { StatsCard } from "@/components/dashboard/stats-card";
import { Badge } from "@/components/ui/badge";
import { articles } from "@/lib/data";

const topArticles = [...articles].sort((a, b) => b.views - a.views).slice(0, 5);

const weeklyData = [30, 45, 38, 60, 52, 78, 65];
const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const maxVal = Math.max(...weeklyData);

export default function AdminAnalyticsPage() {
  return (
    <div className="flex min-h-screen">
      <AdminSidebar />
      <main className="flex-1 overflow-auto">
        <div className="sticky top-0 z-10 border-b border-border bg-background/80 backdrop-blur-xl px-6 h-16 flex items-center">
          <h1 className="font-semibold">Analytics</h1>
        </div>

        <div className="p-6 space-y-8 max-w-6xl">
          {/* Overview Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <StatsCard title="Total Views" value="1.24M" change="31%" positive icon={Eye} color="purple" />
            <StatsCard title="Active Users" value="2,847" change="8%" positive icon={Users} color="blue" />
            <StatsCard title="Articles" value="184" change="12%" positive icon={FileText} color="green" />
            <StatsCard title="Searches" value="38.4K" change="22%" positive icon={Search} color="orange" />
          </div>

          {/* Chart + Top articles */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Views chart */}
            <div className="bg-card border border-border rounded-2xl p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="font-semibold">Weekly Views</h3>
                  <p className="text-sm text-muted-foreground">Last 7 days</p>
                </div>
                <div className="flex items-center gap-1.5 text-sm text-green-400">
                  <TrendingUp size={14} />
                  +31%
                </div>
              </div>
              <div className="flex items-end gap-2 h-36">
                {weeklyData.map((v, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center gap-2">
                    <span className="text-xs text-muted-foreground">{v}K</span>
                    <div
                      className="w-full rounded-lg bg-gradient-to-t from-purple-600/70 to-purple-400/50 hover:from-purple-600 hover:to-purple-400 transition-colors cursor-pointer"
                      style={{ height: `${(v / maxVal) * 90}%` }}
                    />
                    <span className="text-xs text-muted-foreground">{days[i]}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Traffic sources */}
            <div className="bg-card border border-border rounded-2xl p-6">
              <h3 className="font-semibold mb-6">Traffic Sources</h3>
              <div className="space-y-4">
                {[
                  { source: "Organic Search", pct: 68, color: "bg-purple-500" },
                  { source: "Direct", pct: 18, color: "bg-blue-500" },
                  { source: "Social Media", pct: 9, color: "bg-green-500" },
                  { source: "Referral", pct: 5, color: "bg-orange-500" },
                ].map(({ source, pct, color }) => (
                  <div key={source}>
                    <div className="flex justify-between text-sm mb-1.5">
                      <span className="text-muted-foreground">{source}</span>
                      <span className="font-medium">{pct}%</span>
                    </div>
                    <div className="h-2 bg-secondary rounded-full overflow-hidden">
                      <div className={`h-full ${color} rounded-full`} style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Top articles */}
          <div className="bg-card border border-border rounded-2xl overflow-hidden">
            <div className="px-6 py-4 border-b border-border flex items-center justify-between">
              <h3 className="font-semibold">Top Articles by Views</h3>
              <Badge variant="purple">All time</Badge>
            </div>
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-secondary/30">
                  <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">#</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Title</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide hidden md:table-cell">Author</th>
                  <th className="text-right px-5 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Views</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {topArticles.map((article, i) => (
                  <tr key={article.id} className="hover:bg-secondary/30 transition-colors">
                    <td className="px-5 py-3.5">
                      <span className={`text-sm font-mono font-bold ${i === 0 ? "text-yellow-400" : i === 1 ? "text-slate-400" : i === 2 ? "text-amber-600" : "text-muted-foreground"}`}>
                        {i + 1}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      <p className="font-medium line-clamp-1">{article.title}</p>
                    </td>
                    <td className="px-5 py-3.5 hidden md:table-cell text-muted-foreground">{article.author.name}</td>
                    <td className="px-5 py-3.5 text-right font-medium">{article.views.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* AI Usage */}
          <div className="bg-card border border-border rounded-2xl p-6">
            <h3 className="font-semibold mb-6 flex items-center gap-2">
              <Zap size={16} className="text-purple-400" />
              AI Summary Usage
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                { label: "Summaries Generated", value: "1,842", color: "text-purple-400" },
                { label: "Avg. Response Time", value: "1.4s", color: "text-blue-400" },
                { label: "Cache Hit Rate", value: "87%", color: "text-green-400" },
                { label: "Tokens Used", value: "2.1M", color: "text-orange-400" },
              ].map(({ label, value, color }) => (
                <div key={label} className="p-4 bg-secondary/40 rounded-xl">
                  <p className={`text-2xl font-bold ${color} mb-1`}>{value}</p>
                  <p className="text-xs text-muted-foreground">{label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
