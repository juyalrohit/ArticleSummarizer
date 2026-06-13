import mongoose, { Schema } from "mongoose";

const articleSchema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    content: { type: String, required: true, trim: true },
    authorId: { type: String, default: "system" },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
  },
);

export const ArticleModel = mongoose.models.Article || mongoose.model("Article", articleSchema);
