"use client";

import { useState } from "react";
import { Search, SlidersHorizontal } from "lucide-react";
import { AdminSidebar } from "@/components/layout/admin-sidebar";
import { ArticleTable } from "@/components/dashboard/article-table";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { articles, authors } from "@/lib/data";

export default function AdminArticlesPage() {
  const [search, setSearch] = useState("");
  const [authorFilter, setAuthorFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");

  const filtered = articles.filter((a) => {
    const matchesSearch = a.title.toLowerCase().includes(search.toLowerCase());
    const matchesAuthor = authorFilter === "All" || a.author.name === authorFilter;
    const matchesStatus = statusFilter === "All" || a.status === statusFilter.toLowerCase();
    return matchesSearch && matchesAuthor && matchesStatus;
  });

  return (
    <div className="flex min-h-screen">
      <AdminSidebar />
      <main className="flex-1 overflow-auto">
        <div className="sticky top-0 z-10 border-b border-border bg-background/80 backdrop-blur-xl px-6 h-16 flex items-center justify-between">
          <h1 className="font-semibold">All Articles</h1>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span className="font-medium text-foreground">{filtered.length}</span> articles
          </div>
        </div>

        <div className="p-6 space-y-6 max-w-6xl">
          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input placeholder="Search articles..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
            </div>

            {/* Author filter */}
            <select
              value={authorFilter}
              onChange={(e) => setAuthorFilter(e.target.value)}
              className="h-10 px-3 rounded-xl border border-border bg-secondary text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <option>All</option>
              {authors.map((a) => <option key={a.id}>{a.name}</option>)}
            </select>

            {/* Status filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="h-10 px-3 rounded-xl border border-border bg-secondary text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <option>All</option>
              <option>Published</option>
              <option>Draft</option>
            </select>
          </div>

          {/* Active filters */}
          <div className="flex flex-wrap gap-2">
            {authorFilter !== "All" && (
              <Badge variant="purple" className="cursor-pointer" onClick={() => setAuthorFilter("All")}>
                Author: {authorFilter} ×
              </Badge>
            )}
            {statusFilter !== "All" && (
              <Badge variant="blue" className="cursor-pointer" onClick={() => setStatusFilter("All")}>
                Status: {statusFilter} ×
              </Badge>
            )}
          </div>

          <ArticleTable articles={filtered} showAuthor />
        </div>
      </main>
    </div>
  );
}
