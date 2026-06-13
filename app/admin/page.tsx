import { FileText, Users, Eye, TrendingUp, AlertCircle, ArrowRight } from "lucide-react";
import Link from "next/link";
import { AdminSidebar } from "@/components/layout/admin-sidebar";
import { StatsCard } from "@/components/dashboard/stats-card";
import { ArticleTable } from "@/components/dashboard/article-table";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { articles, authors } from "@/lib/data";

export default function AdminDashboardPage() {
  return (
    <div className="flex min-h-screen">
      <AdminSidebar />
      <main className="flex-1 overflow-auto">
        <div className="sticky top-0 z-10 border-b border-border bg-background/80 backdrop-blur-xl px-6 h-16 flex items-center justify-between">
          <div>
            <h1 className="font-semibold">Admin Dashboard</h1>
            <p className="text-xs text-muted-foreground">System overview</p>
          </div>
          <Badge variant="red">Admin</Badge>
        </div>

        <div className="p-6 space-y-8 max-w-6xl">
          {/* Alert */}
          <div className="flex items-start gap-3 p-4 rounded-xl bg-amber-500/10 border border-amber-500/20">
            <AlertCircle size={16} className="text-amber-400 shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-amber-400">Pending review</p>
              <p className="text-xs text-muted-foreground mt-0.5">
                3 articles are awaiting moderation review before publishing.
              </p>
            </div>
            <Link href="/admin/articles" className="ml-auto shrink-0">
              <button className="text-xs text-amber-400 hover:text-amber-300 flex items-center gap-1">
                Review <ArrowRight size={11} />
              </button>
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <StatsCard title="Total Articles" value="184" change="12%" positive icon={FileText} color="purple" />
            <StatsCard title="Active Users" value="2,847" change="8%" positive icon={Users} color="blue" />
            <StatsCard title="Total Views" value="1.2M" change="31%" positive icon={Eye} color="green" />
            <StatsCard title="Revenue" value="$8,400" change="15%" positive icon={TrendingUp} color="orange" />
          </div>

          {/* Recent Articles */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Recent Articles</h2>
              <Link href="/admin/articles" className="text-sm text-purple-400 hover:text-purple-300 flex items-center gap-1">
                Manage all <ArrowRight size={12} />
              </Link>
            </div>
            <ArticleTable articles={articles.slice(0, 6)} showAuthor />
          </div>

          {/* Users overview */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Top Authors</h2>
              <Link href="/admin/users" className="text-sm text-purple-400 hover:text-purple-300 flex items-center gap-1">
                All users <ArrowRight size={12} />
              </Link>
            </div>
            <div className="bg-card border border-border rounded-2xl overflow-hidden">
              {authors.map((author, i) => (
                <div key={author.id} className={`flex items-center gap-4 px-5 py-4 hover:bg-secondary/30 transition-colors ${i < authors.length - 1 ? "border-b border-border" : ""}`}>
                  <span className="text-xs font-mono text-muted-foreground w-5">{i + 1}</span>
                  <Avatar src={author.avatar} alt={author.name} size="sm" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium">{author.name}</p>
                    <p className="text-xs text-muted-foreground">{author.role}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">{Math.floor(Math.random() * 15 + 3)}</p>
                    <p className="text-xs text-muted-foreground">articles</p>
                  </div>
                  <Badge variant={i === 0 ? "purple" : "secondary"}>{i === 0 ? "Top Author" : "Active"}</Badge>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
