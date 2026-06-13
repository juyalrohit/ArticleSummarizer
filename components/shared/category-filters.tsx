"use client";

import { cn } from "@/lib/utils";
import { categories } from "@/lib/data";

interface CategoryFiltersProps {
  selected: string;
  onSelect: (cat: string) => void;
}

export function CategoryFilters({ selected, onSelect }: CategoryFiltersProps) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-thin">
      {categories.map((cat) => (
        <button
          key={cat}
          onClick={() => onSelect(cat)}
          className={cn(
            "shrink-0 px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200",
            selected === cat
              ? "bg-purple-500/20 text-purple-400 border border-purple-500/40"
              : "border border-border text-muted-foreground hover:border-purple-500/30 hover:text-foreground"
          )}
        >
          {cat}
        </button>
      ))}
    </div>
  );
}
