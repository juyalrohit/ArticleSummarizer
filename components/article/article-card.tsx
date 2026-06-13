import Link from "next/link";
import Image from "next/image";
import { Clock, Eye, ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import type { Article } from "@/lib/data";

interface ArticleCardProps {
  article: Article;
  compact?: boolean;
}

export function ArticleCard({ article, compact = false }: ArticleCardProps) {
  return (
    <Link href={`/articles/${article.id}`}>
      <article className="group h-full bg-card border border-border rounded-2xl overflow-hidden hover:border-purple-500/40 hover:shadow-lg hover:shadow-purple-500/5 transition-all duration-300">
        {/* Cover Image */}
        <div className="relative w-full h-44 overflow-hidden bg-secondary">
          <Image
            src={article.coverImage}
            alt={article.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            unoptimized
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          <div className="absolute bottom-3 left-3 flex gap-1.5">
            {article.tags.slice(0, 2).map((tag) => (
              <Badge key={tag} variant="purple" className="backdrop-blur-sm bg-black/40 border-white/10 text-white">
                {tag}
              </Badge>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="p-5">
          <h3 className="font-semibold text-base leading-snug mb-2 group-hover:text-purple-400 transition-colors line-clamp-2">
            {article.title}
          </h3>
          {!compact && (
            <p className="text-sm text-muted-foreground leading-relaxed mb-4 line-clamp-2">
              {article.excerpt}
            </p>
          )}

          {/* Meta */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Avatar src={article.author.avatar} alt={article.author.name} size="sm" />
              <div>
                <p className="text-xs font-medium">{article.author.name}</p>
                <p className="text-xs text-muted-foreground">{article.publishedAt}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <Clock size={11} /> {article.readTime}m
              </span>
              <span className="flex items-center gap-1">
                <Eye size={11} /> {(article.views / 1000).toFixed(1)}k
              </span>
            </div>
          </div>
        </div>

        {/* Hover CTA */}
        <div className="px-5 pb-4">
          <div className="flex items-center gap-1 text-xs text-purple-400 opacity-0 group-hover:opacity-100 transition-opacity font-medium">
            Read article <ArrowRight size={12} />
          </div>
        </div>
      </article>
    </Link>
  );
}
