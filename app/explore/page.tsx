"use client";

import { useState } from "react";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { ArticleGrid } from "@/components/article/article-grid";
import { SearchBar } from "@/components/shared/search-bar";
import { CategoryFilters } from "@/components/shared/category-filters";
import { Pagination } from "@/components/shared/pagination";
import { articles } from "@/lib/data";
import { SlidersHorizontal } from "lucide-react";

export default function ExplorePage() {
  const [category, setCategory] = useState("All");
  const [page, setPage] = useState(1);

  const filtered = category === "All"
    ? articles
    : articles.filter((a) => a.tags.some((t) => t.toLowerCase() === category.toLowerCase()));

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1 pt-24 pb-20">
        {/* Header */}
        <div className="relative py-14 px-4 sm:px-6 border-b border-border overflow-hidden">
          <div className="absolute inset-0 -z-10">
            <div className="absolute top-0 left-1/3 w-64 h-64 bg-purple-500/8 rounded-full blur-3xl" />
          </div>
          <div className="max-w-4xl mx-auto text-center">
            <p className="text-sm font-medium text-purple-400 mb-3">Knowledge Base</p>
            <h1 className="text-4xl sm:text-5xl font-bold mb-4">Explore Articles</h1>
            <p className="text-muted-foreground text-lg mb-8">
              Discover in-depth technical articles written by engineers and researchers.
            </p>
            <SearchBar placeholder="Search by title, topic, or keyword..." size="lg" className="max-w-xl mx-auto" />
          </div>
        </div>

        {/* Filters + Grid */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
          <div className="flex items-center justify-between gap-4 mb-8">
            <CategoryFilters selected={category} onSelect={(c) => { setCategory(c); setPage(1); }} />
            <button className="shrink-0 flex items-center gap-2 px-4 py-2 rounded-xl border border-border text-sm text-muted-foreground hover:text-foreground hover:border-purple-500/40 transition-colors">
              <SlidersHorizontal size={14} />
              <span className="hidden sm:inline">Filters</span>
            </button>
          </div>

          <div className="flex items-center justify-between mb-6">
            <p className="text-sm text-muted-foreground">
              <span className="font-medium text-foreground">{filtered.length}</span> articles
              {category !== "All" && <> in <span className="text-purple-400">{category}</span></>}
            </p>
          </div>

          <ArticleGrid articles={filtered} />

          {filtered.length > 0 && (
            <div className="flex justify-center mt-12">
              <Pagination currentPage={page} totalPages={3} onPageChange={setPage} />
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
