"use client";

import { useState } from "react";
import { Sparkles, RefreshCw, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

interface SummaryCardProps {
  initialSummary?: string;
}

export function SummaryCard({ initialSummary }: SummaryCardProps) {
  const [summary, setSummary] = useState(initialSummary || "");
  const [loading, setLoading] = useState(false);
  const [expanded, setExpanded] = useState(true);

  const handleGenerate = async () => {
    setLoading(true);
    setSummary("");
    await new Promise((r) => setTimeout(r, 2000));
    setSummary(
      initialSummary ||
        "This article provides a comprehensive overview of the topic, covering key concepts, practical applications, and future implications. The author presents technical depth while maintaining accessibility for readers at various expertise levels. Key takeaways include foundational principles, implementation strategies, and considerations for production environments."
    );
    setLoading(false);
  };

  return (
    <div className="rounded-2xl border border-purple-500/30 bg-purple-500/5 overflow-hidden">
      {/* Header */}
      <div
        className="flex items-center justify-between px-4 py-3 cursor-pointer hover:bg-purple-500/10 transition-colors"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-purple-500 to-violet-600 flex items-center justify-center">
            <Sparkles size={13} className="text-white" />
          </div>
          <span className="text-sm font-semibold text-purple-300">AI Generated Summary</span>
        </div>
        <button className="text-muted-foreground hover:text-foreground transition-colors">
          {expanded ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
        </button>
      </div>

      {/* Body */}
      {expanded && (
        <div className="px-4 pb-4 space-y-3">
          {loading ? (
            <div className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
              <Skeleton className="h-4 w-4/6" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          ) : summary ? (
            <p className="text-sm text-muted-foreground leading-relaxed">{summary}</p>
          ) : (
            <p className="text-sm text-muted-foreground italic">
              No summary generated yet. Click below to generate one with AI.
            </p>
          )}

          <div className="flex gap-2 pt-1">
            <Button
              variant="gradient"
              size="sm"
              onClick={handleGenerate}
              disabled={loading}
              className="flex-1"
            >
              <Sparkles size={13} />
              {summary ? "Regenerate" : "Generate Summary"}
            </Button>
            {summary && !loading && (
              <Button variant="outline" size="sm" onClick={handleGenerate}>
                <RefreshCw size={13} />
              </Button>
            )}
          </div>

          {summary && !loading && (
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-green-400 inline-block" />
              Cached — generated 2 hours ago
            </p>
          )}
        </div>
      )}
    </div>
  );
}
