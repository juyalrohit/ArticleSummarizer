import { Client } from "@elastic/elasticsearch";

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

export async function indexArticle(article: {
  id: string;
  title: string;
  content: string;
  authorId?: string;
  createdAt?: string;
  updatedAt?: string;
}) {
  await ensureIndex();
  await client.index({
    index: INDEX_NAME,
    id: article.id,
    document: {
      ...article,
      deleted: false,
      createdAt: article.createdAt ?? new Date().toISOString(),
      updatedAt: article.updatedAt ?? new Date().toISOString(),
    },
    refresh: "wait_for",
  });
}


export async function softDeleteArticle(id: string) {
  await ensureIndex();
  try {
    await client.update({
      index: INDEX_NAME,
      id,
      doc: { deleted: true },
      refresh: "wait_for",
    });
  } catch {
    await client.index({
      index: INDEX_NAME,
      id,
      document: { id, deleted: true },
      refresh: "wait_for",
    });
  }
}



export async function searchArticles(query: string) {
  await ensureIndex();
  const response = await client.search({
    index: INDEX_NAME,
    query: {
      bool: {
        must: [
          { multi_match: { query, fields: ["title^3", "content"], fuzziness: "AUTO" } },
          { term: { deleted: false } },
        ],
      },
    },
    sort: ["_score"],
    size: 50,
  });

  return response.hits.hits.map((hit) => ({
    ...(hit._source as Record<string, unknown>),
    id: String((hit._source as { id?: string }).id ?? hit._id),
  }));
}
