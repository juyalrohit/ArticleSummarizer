import { ArticleCard } from "./article-card";
import type { Article } from "@/lib/data";

interface ArticleGridProps {
  articles: Article[];
  compact?: boolean;
}

export function ArticleGrid({ articles, compact }: ArticleGridProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
      {articles.map((article) => (
        <ArticleCard key={article.id} article={article} compact={compact} />
      ))}
    </div>
  );
}
