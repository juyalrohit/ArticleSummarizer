import { NextResponse } from "next/server";

import { connectToDatabase } from "../../../../lib/mongodb";
import { ArticleModel } from "../../../../models/Article";
import { requireAuth } from "../../../../lib/auth";

function serializeArticle(article: Record<string, unknown>) {
  const { _id, ...rest } = article;
  return { ...rest, id: String(_id) };
}

const summaryCache = (globalThis as typeof globalThis & {
  __SUMMARY_CACHE__?: Record<string, string>;
}).__SUMMARY_CACHE__ ?? ((globalThis as typeof globalThis & {
  __SUMMARY_CACHE__?: Record<string, string>;
}).__SUMMARY_CACHE__ = {});

async function generateSummary(text: string) {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    return `Auto summary unavailable. In production, connect GEMINI_API_KEY for AI summaries. Source preview: ${text.slice(0, 120)}...`;
  }

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [
          {
            role: "user",
            parts: [
              {
                text: `Summarize this article in three concise bullet points:\n\n${text}`,
              },
            ],
          },
        ],
      }),
    },
  );

  if (!response.ok) {
    throw new Error(`Gemini API request failed: ${response.status}`);
  }

  const data = await response.json();
  return data.candidates?.[0]?.content?.parts?.[0]?.text ?? "Summary unavailable.";
}

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireAuth();
  if ("error" in auth) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  const { id } = await params;

  await connectToDatabase();
  const article = await ArticleModel.findById(id).lean();
  if (!article) {
    return NextResponse.json({ error: "Article not found" }, { status: 404 });
  }

  if (auth.user.role !== "Admin" && String(article.authorId) !== auth.user.id) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  if (summaryCache[id]) {
    return NextResponse.json({ article: { ...serializeArticle(article), summary: summaryCache[id] } });
  }

  try {
    const summary = await generateSummary(`${article.title}\n\n${article.content}`);
    summaryCache[id] = summary;
    const summaryArticle = { ...serializeArticle(article), summary };

    return NextResponse.json({ article: summaryArticle });
  } catch (error) {
    const fallback = `Summary unavailable. ${error instanceof Error ? error.message : "Please verify the Gemini API key."}`;
    summaryCache[id] = fallback;

    return NextResponse.json({ article: { ...serializeArticle(article), summary: fallback } }, { status: 200 });
  }
}
