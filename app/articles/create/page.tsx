"use client";

import { useState } from "react";
import { Save, Eye, Send, Bold, Italic, Code, List, Link, Hash, Image as ImageIcon } from "lucide-react";
import { DashboardSidebar } from "@/components/layout/dashboard-sidebar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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

const dummyContent = `## Introduction

Start writing your article here. This editor supports Markdown formatting.

You can use **bold**, *italic*, and \`code\` inline formatting.

## Getting Started

Write your main content in this area. The live preview will show how your article looks to readers.

- Use bullet points for lists
- Add headings to structure your content
- Include code blocks for technical content

## Conclusion

Wrap up your article with key takeaways and next steps for readers.`;

export default function CreateArticlePage() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState(dummyContent);
  const [tags, setTags] = useState<string[]>(["TypeScript", "React"]);
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
        {/* Top bar */}
        <div className="sticky top-0 z-10 border-b border-border bg-background/80 backdrop-blur-xl px-6 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium">New Article</span>
            {saved && (
              <Badge variant={saved === "published" ? "green" : "secondary"}>
                {saved === "published" ? "Published" : "Draft saved"}
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setPreview(!preview)}
              className={preview ? "text-purple-400" : ""}
            >
              <Eye size={14} />
              {preview ? "Edit" : "Preview"}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSaved("draft")}
            >
              <Save size={13} />
              Save draft
            </Button>
            <Button
              variant="gradient"
              size="sm"
              onClick={() => setSaved("published")}
            >
              <Send size={13} />
              Publish
            </Button>
          </div>
        </div>

        <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 overflow-hidden">
          {/* Editor Panel */}
          <div className={cn("flex flex-col border-r border-border overflow-auto", preview && "hidden lg:flex")}>
            <div className="p-6 pb-0">
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Article title..."
                className="w-full text-3xl font-bold bg-transparent border-none outline-none placeholder:text-muted-foreground/40 resize-none mb-4"
              />

              {/* Tags */}
              <div className="flex flex-wrap gap-2 mb-4">
                {tags.map((tag) => (
                  <button
                    key={tag}
                    onClick={() => removeTag(tag)}
                    className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-purple-500/15 text-purple-400 border border-purple-500/30 text-xs hover:bg-red-500/10 hover:text-red-400 hover:border-red-500/30 transition-colors"
                  >
                    {tag} ×
                  </button>
                ))}
                <input
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={addTag}
                  placeholder="Add tag..."
                  className="px-2 py-1 bg-transparent border-none outline-none text-xs text-muted-foreground placeholder:text-muted-foreground/40"
                />
              </div>
            </div>

            {/* Toolbar */}
            <div className="flex items-center gap-1 px-6 py-2 border-y border-border bg-secondary/20">
              {toolbarButtons.map(({ icon: Icon, label }) => (
                <button
                  key={label}
                  title={label}
                  className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
                >
                  <Icon size={14} />
                </button>
              ))}
            </div>

            {/* Content editor */}
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Start writing your article in Markdown..."
              className="flex-1 p-6 bg-transparent border-none outline-none resize-none text-sm text-muted-foreground leading-relaxed font-mono scrollbar-thin min-h-[500px]"
            />
          </div>

          {/* Preview Panel */}
          <div className={cn("overflow-auto p-8", !preview && "hidden lg:block")}>
            <div className="max-w-2xl mx-auto">
              {title ? (
                <h1 className="text-3xl font-bold mb-6">{title}</h1>
              ) : (
                <h1 className="text-3xl font-bold mb-6 text-muted-foreground/30">Article title preview</h1>
              )}
              {tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-6">
                  {tags.map((tag) => <Badge key={tag} variant="purple">{tag}</Badge>)}
                </div>
              )}
              <div className="prose prose-invert max-w-none text-sm">
                {content.split("\n\n").map((block, i) => {
                  if (block.startsWith("## ")) return <h2 key={i} className="text-2xl font-bold mt-8 mb-3 text-foreground">{block.slice(3)}</h2>;
                  if (block.startsWith("### ")) return <h3 key={i} className="text-xl font-semibold mt-6 mb-2 text-foreground">{block.slice(4)}</h3>;
                  if (block.startsWith("- ")) {
                    const items = block.split("\n").filter(l => l.startsWith("- "));
                    return <ul key={i} className="space-y-1 my-4 pl-4">{items.map((item, j) => <li key={j} className="text-muted-foreground flex gap-2"><span className="text-purple-400">•</span>{item.slice(2)}</li>)}</ul>;
                  }
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
