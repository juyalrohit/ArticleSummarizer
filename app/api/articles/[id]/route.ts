import { NextResponse } from "next/server";

import { connectToDatabase } from "@/lib/mongodb";
import { ArticleModel } from "../../../models/Article";
import { requireAuth } from "@/lib/auth";
import { indexArticle, softDeleteArticle } from "@/lib/elasticsearch";
import { connectRedis } from "@/lib/redis";

function serializeArticle(article: Record<string, unknown>) {
  const { _id, ...rest } = article;
  return { ...rest, id: String(_id) };
}

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
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

    return NextResponse.json({ article: serializeArticle(article) });
  } catch (error) {
    console.error("Failed to fetch article:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const auth = await requireAuth();
    if ("error" in auth) {
      return NextResponse.json({ error: auth.error }, { status: auth.status });
    }

    const { id } = await params;
    const body = await request.json();

    await connectToDatabase();
    const article = await ArticleModel.findById(id);
    if (!article) {
      return NextResponse.json({ error: "Article not found" }, { status: 404 });
    }

    if (auth.user.role !== "Admin" && String(article.authorId) !== auth.user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    article.title = String(body?.title ?? article.title).trim();
    article.content = String(body?.content ?? article.content).trim();

    if (!article.title || !article.content) {
      return NextResponse.json(
        { error: "Title and content are required." },
        { status: 400 },
      );
    }

    await article.save();
    const redis = await connectRedis();

    await redis.del(`summary:${id}`);
   try{
      await indexArticle({
      id: String(article._id),
      title: article.title,
      content: article.content,
      authorId: String(article.authorId),
      createdAt: article.createdAt?.toISOString(),
      updatedAt: article.updatedAt?.toISOString(),
    });
   }
   catch (error) {
   console.error("Elastic sync failed", error);
}
    
    return NextResponse.json({ article: serializeArticle(article.toObject()) });
  } catch (error) {
    console.error("Failed to update article:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const auth = await requireAuth();
    if ("error" in auth) {
      return NextResponse.json({ error: auth.error }, { status: auth.status });
    }

    const { id } = await params;

    await connectToDatabase();
    const article = await ArticleModel.findById(id);

    if (!article) {
      return NextResponse.json({ error: "Article not found" }, { status: 404 });
    }

    if (auth.user.role !== "Admin" && String(article.authorId) !== auth.user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    await ArticleModel.findByIdAndDelete(id);
    await softDeleteArticle(id);

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Failed to delete article:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
