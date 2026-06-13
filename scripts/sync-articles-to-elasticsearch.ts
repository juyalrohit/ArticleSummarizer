const { config } = require("dotenv");

config({ path: ".env.local" });

const { connectToDatabase } = require("../app/lib/mongodb");
const { ArticleModel } = require("../app/models/Article");
const { Client } = require("@elastic/elasticsearch");

const ELASTICSEARCH_URL = process.env.ELASTICSEARCH_URL || "http://localhost:9200";
const ELASTICSEARCH_API_KEY = process.env.ELASTICSEARCH_API_KEY;
const INDEX_NAME = process.env.ELASTICSEARCH_INDEX || "articles";

const client = new Client({
  node: ELASTICSEARCH_URL,
  auth: ELASTICSEARCH_API_KEY ? { apiKey: ELASTICSEARCH_API_KEY } : undefined,
});

async function ensureIndex() {
  const exists = await client.indices.exists({ index: INDEX_NAME });
  if (!exists) {
    await client.indices.create({
      index: INDEX_NAME,
      mappings: {
        properties: {
          id: { type: "keyword" },
          title: { type: "text" },
          content: { type: "text" },
          authorId: { type: "keyword" },
          deleted: { type: "boolean" },
          createdAt: { type: "date" },
          updatedAt: { type: "date" },
        },
      },
    });
  }
}

async function syncAllArticles() {
  await connectToDatabase();
  await ensureIndex();

  const articles = await ArticleModel.find({}).sort({ updatedAt: -1 }).lean();

  for (const article of articles) {
    await client.index({
      index: INDEX_NAME,
      id: String(article._id),
      document: {
        id: String(article._id),
        title: article.title,
        content: article.content,
        authorId: article.authorId ? String(article.authorId) : undefined,
        deleted: false,
        createdAt: article.createdAt ?? new Date().toISOString(),
        updatedAt: article.updatedAt ?? new Date().toISOString(),
      },
      refresh: "wait_for",
    });
  }

  console.log(`Synced ${articles.length} article(s) to Elasticsearch index "${INDEX_NAME}".`);
}

syncAllArticles().catch((error) => {
  console.error("Article sync failed:", error);
  process.exitCode = 1;
});
