"use client";

import { useState } from "react";
import { Sparkles, RefreshCw, ChevronDown, ChevronUp, Database, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useArticula } from "@/lib/store";

interface SummaryCardProps {
  articleId: string;
  initialSummary?: string;
}

// ─── Parser ───────────────────────────────────────────────────────────────────
// Gemini returns bullet points in several formats:
//   "* point"  "- point"  "• point"  "1. point"
// This strips the marker and any leading bold prefix like "**Key:**"
// and returns a clean string array.

function parseBullets(raw: string): string[] {
  return raw
    .split("\n")
    .map((line) => line.trim())
    .filter((line) =>
      line.startsWith("* ") ||
      line.startsWith("- ") ||
      line.startsWith("• ") ||
      /^\d+\.\s/.test(line)
    )
    .map((line) =>
      line
        // strip bullet markers
        .replace(/^(\*|-|•|\d+\.)\s+/, "")
        // strip leading bold labels like **Label:** or *Label:*
        .replace(/^\*{1,2}[^*]+\*{1,2}:?\s*/, "")
        .trim()
    )
    .filter(Boolean);
}

// ─── Rendered bullet list ─────────────────────────────────────────────────────

function BulletList({ text }: { text: string }) {
  const bullets = parseBullets(text);

  // If Gemini returned prose instead of bullets, fall back to plain text
  if (bullets.length === 0) {
    return (
      <p className="text-sm text-muted-foreground leading-relaxed">{text}</p>
    );
  }

  return (
    <ol className="space-y-2.5">
      {bullets.map((point, i) => (
        <li key={i} className="flex items-start gap-3">
          {/* Numbered badge */}
          <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-purple-500/20 text-[10px] font-bold text-purple-300 ring-1 ring-purple-500/30">
            {i + 1}
          </span>
          <span className="text-sm text-muted-foreground leading-relaxed">{point}</span>
        </li>
      ))}
    </ol>
  );
}

// ─── Component ────────────────────────────────────────────────────────────────

export function SummaryCard({ articleId, initialSummary }: SummaryCardProps) {
  const { summarizeArticle, sessionUser, articles } = useArticula();
  const [summary, setSummary] = useState(initialSummary || "");
  const [loading, setLoading] = useState(false);
  const [expanded, setExpanded] = useState(true);
  const [statusMsg, setStatusMsg] = useState<{ text: string; cached: boolean } | null>(null);

  const handleGenerate = async () => {
    if (!sessionUser) {
      setStatusMsg({ text: "Sign in to generate AI summaries.", cached: false });
      return;
    }
    setLoading(true);
    setSummary("");
    setStatusMsg(null);
    const { ok, cached, error } = await summarizeArticle(articleId);
    setLoading(false);
    if (!ok) {
      setStatusMsg({ text: error ?? "Failed to generate summary.", cached: false });
      return;
    }
    setStatusMsg({
      text: cached ? "Loaded from Redis cache" : "Generated and cached for 24 h",
      cached: !!cached,
    });
  };

  // Stay in sync with store updates (e.g. after generate)
  const liveArticle = articles.find((a) => a.id === articleId);
  const liveSummary = liveArticle?.summary ?? summary;
  const bulletCount = liveSummary ? parseBullets(liveSummary).length : 0;

  return (
    <div className="rounded-2xl border border-purple-500/30 bg-purple-500/5 overflow-hidden">

      {/* ── Header ── */}
      <div
        className="flex items-center justify-between px-4 py-3 cursor-pointer hover:bg-purple-500/10 transition-colors"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-purple-500 to-violet-600 flex items-center justify-center shadow-md shadow-purple-500/30">
            <Sparkles size={13} className="text-white" />
          </div>
          <div>
            <span className="text-sm font-semibold text-purple-300">AI Generated Summary</span>
            {bulletCount > 0 && !loading && (
              <span className="ml-2 text-[10px] font-medium text-purple-400/70">
                {bulletCount} key points
              </span>
            )}
          </div>
        </div>
        <button className="text-muted-foreground hover:text-foreground transition-colors">
          {expanded ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
        </button>
      </div>

      {/* ── Body ── */}
      {expanded && (
        <div className="px-4 pb-4 space-y-3">

          {/* Loading skeletons */}
          {loading && (
            <div className="space-y-3 pt-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex items-start gap-3">
                  <Skeleton className="mt-0.5 h-5 w-5 rounded-full shrink-0" />
                  <div className="flex-1 space-y-1.5">
                    <Skeleton className={`h-3.5 ${["w-full", "w-5/6", "w-4/6", "w-full", "w-3/4"][i]}`} />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Rendered summary */}
          {!loading && liveSummary && (
            <div className="pt-1">
              <BulletList text={liveSummary} />
            </div>
          )}

          {/* Empty state */}
          {!loading && !liveSummary && (
            <p className="text-sm text-muted-foreground italic py-1">
              {sessionUser
                ? "No summary yet. Click below to generate one with AI."
                : "Sign in to generate AI-powered summaries."}
            </p>
          )}

          {/* Status pill */}
          {statusMsg && !loading && (
            <div className={`flex items-center gap-1.5 text-xs rounded-lg px-2.5 py-1.5 w-fit ${
              statusMsg.cached
                ? "bg-green-500/10 text-green-400 border border-green-500/20"
                : "bg-purple-500/10 text-purple-300 border border-purple-500/20"
            }`}>
              {statusMsg.cached
                ? <CheckCircle2 size={11} />
                : <Database size={11} />}
              {statusMsg.text}
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-2 pt-1">
            <Button
              variant="gradient"
              size="sm"
              onClick={handleGenerate}
              disabled={loading || !sessionUser}
              className="flex-1"
            >
              <Sparkles size={13} />
              {liveSummary ? "Regenerate" : "Generate Summary"}
            </Button>
            {liveSummary && !loading && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleGenerate}
                disabled={!sessionUser}
                title="Regenerate"
              >
                <RefreshCw size={13} />
              </Button>
            )}
          </div>

          {!sessionUser && (
            <p className="text-xs text-muted-foreground text-center pt-1">
              <a href="/login" className="text-purple-400 hover:underline">Sign in</a> to generate summaries
            </p>
          )}
        </div>
      )}
    </div>
  );
}
