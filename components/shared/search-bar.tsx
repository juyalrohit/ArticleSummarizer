"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface SearchBarProps {
  placeholder?: string;
  size?: "sm" | "md" | "lg";
  className?: string;
  onSearch?: (q: string) => void;
}

export function SearchBar({ placeholder = "Search articles...", size = "md", className, onSearch }: SearchBarProps) {
  const [value, setValue] = useState("");
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (value.trim()) {
      if (onSearch) {
        onSearch(value.trim());
      } else {
        router.push(`/search?q=${encodeURIComponent(value.trim())}`);
      }
    }
  };

  const sizes = {
    sm: "h-9 text-sm",
    md: "h-11 text-sm",
    lg: "h-14 text-base",
  };

  return (
    <form onSubmit={handleSubmit} className={cn("relative w-full", className)}>
      <Search
        className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
        size={size === "lg" ? 18 : 16}
      />
      <input
        type="search"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={placeholder}
        className={cn(
          "w-full pl-11 pr-10 rounded-2xl border border-border bg-secondary text-foreground placeholder:text-muted-foreground",
          "focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all",
          sizes[size]
        )}
      />
      {value && (
        <button
          type="button"
          onClick={() => setValue("")}
          className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-md hover:bg-accent text-muted-foreground hover:text-foreground transition-colors"
        >
          <X size={14} />
        </button>
      )}
    </form>
  );
}
