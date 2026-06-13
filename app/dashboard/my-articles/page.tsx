"use client";

import { useState } from "react";
import Link from "next/link";
import { PenSquare, Search, FileText } from "lucide-react";
import { DashboardSidebar } from "@/components/layout/dashboard-sidebar";
import { ArticleTable } from "@/components/dashboard/article-table";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/shared/empty-state";
import { articles } from "@/lib/data";

const statusTabs = ["All", "Published", "Draft"];

export default function MyArticlesPage() {
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState("All");

  const filtered = articles.filter((a) => {
    const matchesSearch = a.title.toLowerCase().includes(search.toLowerCase());
    const matchesTab =
      activeTab === "All" ||
      (activeTab === "Published" && a.status === "published") ||
      (activeTab === "Draft" && a.status === "draft");
    return matchesSearch && matchesTab;
  });

  return (
    <div className="flex min-h-screen">
      <DashboardSidebar />
      <main className="flex-1 overflow-auto">
        {/* Header */}
        <div className="sticky top-0 z-10 border-b border-border bg-background/80 backdrop-blur-xl px-6 h-16 flex items-center justify-between">
          <h1 className="font-semibold">My Articles</h1>
          <Link href="/articles/create">
            <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 text-white text-sm font-medium hover:from-purple-500 hover:to-blue-500 transition-all shadow-lg shadow-purple-500/20">
              <PenSquare size={14} />
              New Article
            </button>
          </Link>
        </div>

        <div className="p-6 space-y-6 max-w-6xl">
          {/* Filters row */}
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            {/* Status tabs */}
            <div className="flex gap-1 bg-secondary/50 rounded-xl p-1">
              {statusTabs.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${
                    activeTab === tab
                      ? "bg-background text-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {tab}
                  <span className="ml-2 text-xs text-muted-foreground">
                    {tab === "All"
                      ? articles.length
                      : articles.filter((a) => a.status === tab.toLowerCase()).length}
                  </span>
                </button>
              ))}
            </div>

            {/* Search */}
            <div className="relative w-full sm:w-72">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
              <Input
                placeholder="Search articles..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>

          {/* Results count */}
          <div className="flex items-center gap-2">
            <p className="text-sm text-muted-foreground">
              {filtered.length} article{filtered.length !== 1 ? "s" : ""}
            </p>
            {search && (
              <Badge variant="purple">
                {search}
              </Badge>
            )}
          </div>

          {/* Table or empty */}
          {filtered.length > 0 ? (
            <ArticleTable articles={filtered} />
          ) : (
            <EmptyState
              icon={FileText}
              title="No articles found"
              description={
                search
                  ? `No articles matching "${search}". Try a different search term.`
                  : "You haven't written any articles yet. Start sharing your knowledge!"
              }
              action={
                search
                  ? { label: "Clear search", onClick: () => setSearch("") }
                  : { label: "Write first article", href: "/articles/create" }
              }
            />
          )}
        </div>
      </main>
    </div>
  );
}
