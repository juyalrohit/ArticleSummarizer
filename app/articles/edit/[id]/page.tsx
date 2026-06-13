"use client";

import { use } from "react";
import { useState } from "react";
import { Save, Eye, Send, Bold, Italic, Code, List, Link, Hash, Image as ImageIcon, ArrowLeft } from "lucide-react";
import NextLink from "next/link";
import { DashboardSidebar } from "@/components/layout/dashboard-sidebar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { articles } from "@/lib/data";
import { cn } from "@/lib/utils";

const toolbarButtons = [
  { icon: Bold, label: "Bold" },
  { icon: Italic, label: "Italic" },
  { icon: Code, label: "Code" },
  { icon: List, label: "List" },
  { icon: Link, label: "Link" },
  { icon: Hash, label: "Heading" },
  { icon: ImageIcon, label: "Image" },
];

export default function EditArticlePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const article = articles.find((a) => a.id === id) ?? articles[0];

  const [title, setTitle] = useState(article.title);
  const [content, setContent] = useState(article.content.trim());
  const [tags, setTags] = useState<string[]>(article.tags);
  const [tagInput, setTagInput] = useState("");
  const [preview, setPreview] = useState(false);
  const [saved, setSaved] = useState<null | "draft" | "published">(null);

  const addTag = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && tagInput.trim()) {
      setTags([...tags, tagInput.trim()]);
      setTagInput("");
    }
  };

  const removeTag = (tag: string) => setTags(tags.filter((t) => t !== tag));

  return (
    <div className="flex min-h-screen">
      <DashboardSidebar />
      <main className="flex-1 flex flex-col overflow-hidden">
        <div className="sticky top-0 z-10 border-b border-border bg-background/80 backdrop-blur-xl px-6 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <NextLink href="/dashboard/my-articles" className="p-1.5 rounded-lg hover:bg-accent text-muted-foreground hover:text-foreground transition-colors">
              <ArrowLeft size={16} />
            </NextLink>
            <span className="text-sm font-medium">Edit Article</span>
            {saved && (
              <Badge variant={saved === "published" ? "green" : "secondary"}>
                {saved === "published" ? "Published" : "Draft saved"}
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={() => setPreview(!preview)} className={preview ? "text-purple-400" : ""}>
              <Eye size={14} />
              {preview ? "Edit" : "Preview"}
            </Button>
            <Button variant="outline" size="sm" onClick={() => setSaved("draft")}>
              <Save size={13} />
              Save draft
            </Button>
            <Button variant="gradient" size="sm" onClick={() => setSaved("published")}>
              <Send size={13} />
              Publish
            </Button>
          </div>
        </div>

        <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 overflow-hidden">
          <div className={cn("flex flex-col border-r border-border overflow-auto", preview && "hidden lg:flex")}>
            <div className="p-6 pb-0">
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full text-3xl font-bold bg-transparent border-none outline-none placeholder:text-muted-foreground/40 mb-4"
              />
              <div className="flex flex-wrap gap-2 mb-4">
                {tags.map((tag) => (
                  <button key={tag} onClick={() => removeTag(tag)} className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-purple-500/15 text-purple-400 border border-purple-500/30 text-xs hover:bg-red-500/10 hover:text-red-400 hover:border-red-500/30 transition-colors">
                    {tag} ×
                  </button>
                ))}
                <input value={tagInput} onChange={(e) => setTagInput(e.target.value)} onKeyDown={addTag} placeholder="Add tag..." className="px-2 py-1 bg-transparent border-none outline-none text-xs text-muted-foreground placeholder:text-muted-foreground/40" />
              </div>
            </div>

            <div className="flex items-center gap-1 px-6 py-2 border-y border-border bg-secondary/20">
              {toolbarButtons.map(({ icon: Icon, label }) => (
                <button key={label} title={label} className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent transition-colors">
                  <Icon size={14} />
                </button>
              ))}
            </div>

            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="flex-1 p-6 bg-transparent border-none outline-none resize-none text-sm text-muted-foreground leading-relaxed font-mono scrollbar-thin min-h-[500px]"
            />
          </div>

          <div className={cn("overflow-auto p-8", !preview && "hidden lg:block")}>
            <div className="max-w-2xl mx-auto">
              <h1 className="text-3xl font-bold mb-6">{title}</h1>
              {tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-6">
                  {tags.map((tag) => <Badge key={tag} variant="purple">{tag}</Badge>)}
                </div>
              )}
              <div className="prose prose-invert max-w-none text-sm">
                {content.split("\n\n").map((block, i) => {
                  if (block.startsWith("## ")) return <h2 key={i} className="text-2xl font-bold mt-8 mb-3 text-foreground">{block.slice(3)}</h2>;
                  if (block.startsWith("### ")) return <h3 key={i} className="text-xl font-semibold mt-6 mb-2 text-foreground">{block.slice(4)}</h3>;
                  if (block.trim()) return <p key={i} className="text-muted-foreground leading-relaxed mb-4">{block}</p>;
                  return null;
                })}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
