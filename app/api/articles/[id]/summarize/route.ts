import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

import { connectToDatabase } from "@/lib/mongodb";
import { ArticleModel } from "../../../../models/Article";
import { requireAuth } from "@/lib/auth";
import { geminiModel } from "@/lib/gemini";
import { connectRedis } from "@/lib/redis";

function serializeArticle(article: Record<string, unknown>) {
  const { _id, ...rest } = article;
  return { ...rest, id: String(_id) };
}

const summaryCache = (globalThis as typeof globalThis & {
  __SUMMARY_CACHE__?: Record<string, string>;
}).__SUMMARY_CACHE__ ?? ((globalThis as typeof globalThis & {
  __SUMMARY_CACHE__?: Record<string, string>;
}).__SUMMARY_CACHE__ = {});




async function generateSummary(content: string) {
  try {
    if (!process.env.GEMINI_API_KEY) {
      throw new Error("Gemini API key missing");
    }

    const prompt = `
      Summarize the following article in 5 concise bullet points.

      Article:
      ${content}
    `;

    const result = await geminiModel.generateContent(prompt);

    const summary = result.response.text();

    if (!summary) {
      throw new Error("Empty response from Gemini");
    }

    return summary;
  } catch (error) {
    console.error("Gemini Error:", error);

    if (error instanceof Error) {
      if (error.message.includes("API key")) {
        throw new Error("Gemini configuration error");
      }
    }

    throw new Error("Failed to generate summary");
  }
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

  const redis = await connectRedis();
  const cachedSummary = await redis.get(`summary:${id}`);

  if (cachedSummary) {
    return NextResponse.json({ article: { ...serializeArticle(article), summary: cachedSummary } });
  }

  try {
    console.log("Sending Request to Gemini To Genrate summary");
    const summary = await generateSummary(`${article.title}\n\n${article.content}`);

    await redis.set(
      `summary:${id}`,
      summary,
      {
        EX: 86400,
      }
    );    
    const summaryArticle = { ...serializeArticle(article), summary };

    return NextResponse.json({ article: summaryArticle });
  } catch (error) {
    const fallback = `Summary unavailable. ${error instanceof Error ? error.message : "Please verify the Gemini API key."}`;
    summaryCache[id] = fallback;

    return NextResponse.json({ article: { ...serializeArticle(article), summary: fallback } }, { status: 200 });
  }
}
