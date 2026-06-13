import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Clock, Eye, Calendar, Hash } from "lucide-react";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { SummaryCard } from "@/components/article/summary-card";
import { ArticleGrid } from "@/components/article/article-grid";
import { articles } from "@/lib/data";

export function generateStaticParams() {
  return articles.map((a) => ({ id: a.id }));
}

export default async function ArticleDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const article = articles.find((a) => a.id === id);
  if (!article) notFound();

  const related = articles.filter((a) => a.id !== id).slice(0, 3);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1 pt-24 pb-20">
        {/* Back */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
          <Link href="/explore" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft size={14} /> Back to Explore
          </Link>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-10">
            {/* Main Content */}
            <article>
              {/* Cover */}
              <div className="relative w-full aspect-[2/1] rounded-2xl overflow-hidden mb-8">
                <Image
                  src={article.coverImage}
                  alt={article.title}
                  fill
                  className="object-cover"
                  unoptimized
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-2 mb-6">
                {article.tags.map((tag) => (
                  <Badge key={tag} variant="purple">{tag}</Badge>
                ))}
              </div>

              {/* Title */}
              <h1 className="text-3xl sm:text-4xl font-bold leading-tight mb-6">
                {article.title}
              </h1>

              {/* Author + Meta */}
              <div className="flex items-center justify-between flex-wrap gap-4 pb-8 border-b border-border mb-8">
                <div className="flex items-center gap-3">
                  <Avatar src={article.author.avatar} alt={article.author.name} size="lg" />
                  <div>
                    <p className="font-semibold">{article.author.name}</p>
                    <p className="text-sm text-muted-foreground">{article.author.role}</p>
                  </div>
                </div>
                <div className="flex items-center gap-5 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1.5">
                    <Calendar size={13} /> {article.publishedAt}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Clock size={13} /> {article.readTime} min read
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Eye size={13} /> {article.views.toLocaleString()} views
                  </span>
                </div>
              </div>

              {/* Article Content */}
              <div className="prose prose-invert prose-sm sm:prose-base max-w-none">
                {article.content.split("\n\n").map((block, i) => {
                  if (block.startsWith("## ")) {
                    return <h2 key={i} className="text-2xl font-bold mt-10 mb-4 text-foreground">{block.slice(3)}</h2>;
                  }
                  if (block.startsWith("### ")) {
                    return <h3 key={i} className="text-xl font-semibold mt-8 mb-3 text-foreground">{block.slice(4)}</h3>;
                  }
                  if (block.startsWith("```")) {
                    const code = block.replace(/```\w*\n?/, "").replace(/```$/, "");
                    return (
                      <pre key={i} className="bg-secondary/80 border border-border rounded-xl p-4 overflow-x-auto text-sm font-mono text-muted-foreground my-6">
                        <code>{code}</code>
                      </pre>
                    );
                  }
                  if (block.startsWith("- ")) {
                    const items = block.split("\n").filter(l => l.startsWith("- "));
                    return (
                      <ul key={i} className="space-y-2 my-4 pl-4">
                        {items.map((item, j) => (
                          <li key={j} className="text-muted-foreground flex gap-2">
                            <span className="text-purple-400 shrink-0">•</span>
                            <span dangerouslySetInnerHTML={{ __html: item.slice(2).replace(/\*\*(.+?)\*\*/g, '<strong class="text-foreground font-semibold">$1</strong>') }} />
                          </li>
                        ))}
                      </ul>
                    );
                  }
                  if (block.startsWith("|")) {
                    const rows = block.split("\n").filter(r => r.startsWith("|") && !r.includes("---"));
                    return (
                      <div key={i} className="overflow-x-auto my-6">
                        <table className="w-full text-sm border-collapse">
                          {rows.map((row, ri) => {
                            const cells = row.split("|").filter(Boolean).map(c => c.trim());
                            return (
                              <tr key={ri} className={ri === 0 ? "border-b border-border" : "border-b border-border/50"}>
                                {cells.map((cell, ci) => (
                                  <td key={ci} className={`px-4 py-2 ${ri === 0 ? "font-semibold text-foreground" : "text-muted-foreground"}`}>{cell}</td>
                                ))}
                              </tr>
                            );
                          })}
                        </table>
                      </div>
                    );
                  }
                  if (block.trim()) {
                    return (
                      <p key={i} className="text-muted-foreground leading-relaxed mb-4"
                        dangerouslySetInnerHTML={{ __html: block.replace(/\*\*(.+?)\*\*/g, '<strong class="text-foreground font-semibold">$1</strong>') }}
                      />
                    );
                  }
                  return null;
                })}
              </div>
            </article>

            {/* Sidebar */}
            <aside className="space-y-6">
              {/* AI Summary - Sticky */}
              <div className="lg:sticky lg:top-24">
                <SummaryCard initialSummary={article.summary} />

                {/* Article Info */}
                <div className="mt-5 bg-card border border-border rounded-2xl p-5 space-y-4">
                  <h3 className="text-sm font-semibold">Article Info</h3>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Author</span>
                      <span className="font-medium">{article.author.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Published</span>
                      <span>{article.publishedAt}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Read time</span>
                      <span>{article.readTime} min</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Views</span>
                      <span>{article.views.toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                {/* Tags */}
                <div className="mt-5 bg-card border border-border rounded-2xl p-5">
                  <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
                    <Hash size={14} /> Tags
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {article.tags.map((tag) => (
                      <Badge key={tag} variant="outline">{tag}</Badge>
                    ))}
                  </div>
                </div>
              </div>
            </aside>
          </div>

          {/* Related Articles */}
          <div className="mt-20">
            <h2 className="text-2xl font-bold mb-8">More articles</h2>
            <ArticleGrid articles={related} />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
