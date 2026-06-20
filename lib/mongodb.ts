// Source - https://stackoverflow.com/a/79875907
// Posted by Sudarsan Sarkar, modified by community. See post 'Timeline' for change history
// Retrieved 2026-06-12, License - CC BY-SA 4.0

import dns from "node:dns/promises";

dns.setServers(["1.1.1.1", "1.0.0.1"]);

import mongoose from "mongoose";



const MONGO_URI = process.env.MONGO_URI

interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

const globalWithMongoose = globalThis as typeof globalThis & {
  mongooseCache?: MongooseCache;
};

console.log("This mongodb url", MONGO_URI);

const cached = globalWithMongoose.mongooseCache ?? (globalWithMongoose.mongooseCache = { conn: null, promise: null });

export async function connectToDatabase() {
  if (!MONGO_URI) {
    throw new Error("Please define MONGO_URL or MONGODB_URI in your environment variables.");
  }

  if (cached.conn) {
    console.log("MongoDb Connected");
    return cached.conn;
  }

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGO_URI, {
      dbName: "articalSummarizer",
    });
  }

      console.log("MongoDb Connected");

  cached.conn = await cached.promise;
  return cached.conn;
}
