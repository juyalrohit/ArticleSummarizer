import { NextResponse } from "next/server";

import { connectToDatabase } from "@/lib/mongodb";
import { ArticleModel } from "../../models/Article";
import { requireAuth } from "@/lib/auth";
import { indexArticle, searchArticles } from "@/lib/elasticsearch";

function serializeArticle(article: Record<string, unknown>) {
  const { _id, ...rest } = article;
  return { ...rest, id: String(_id) };
}

export async function GET(request: Request) {
  try {
    const auth = await requireAuth();
    if ("error" in auth) {
      return NextResponse.json({ error: auth.error }, { status: auth.status });
    }

    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q")?.trim().toLowerCase() ?? "";

    await connectToDatabase();

    if (query) {
      const hits = await searchArticles(query);
      return NextResponse.json({ articles: hits });
    }

    const baseFilter = auth.user.role === "Admin" ? {} : { authorId: auth.user.id };

    const articles = await ArticleModel.find(baseFilter)
      .sort({ updatedAt: -1 })
      .lean();

    return NextResponse.json({ articles: articles.map(serializeArticle) });
  } catch (error) {
    console.error("Failed to fetch articles:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const auth = await requireAuth();
    if ("error" in auth) {
      return NextResponse.json({ error: auth.error }, { status: auth.status });
    }

    const body = await request.json();
    const title = String(body?.title ?? "").trim();
    const content = String(body?.content ?? "").trim();

    if (!title || !content) {
      return NextResponse.json(
        { error: "Title and content are required." },
        { status: 400 },
      );
    }

    await connectToDatabase();
    const article = await ArticleModel.create({ title, content, authorId: auth.user.id });
    await indexArticle({
      id: String(article._id),
      title: article.title,
      content: article.content,
      authorId: String(article.authorId),
      createdAt: article.createdAt?.toISOString(),
      updatedAt: article.updatedAt?.toISOString(),
    });

    return NextResponse.json({ article: serializeArticle(article.toObject()) }, { status: 201 });
  } catch (error) {
    console.error("Failed to create article:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
