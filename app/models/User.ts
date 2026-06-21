import mongoose, { Schema } from "mongoose";

const userSchema = new Schema(
  {
    name : {type : String, required : true, trim : true},
    email: { type: String, required: true, unique: true, trim: true, lowercase: true },
    passwordHash: { type: String},
    role: { type: String, enum: ["Admin", "User"], default: "User" },
    provider : {
      type : String,
      enum : ['credentials', 'google'],
      default : 'credentials'
    },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
  },
  { timestamps: true },
);

export const UserModel = mongoose.models.User || mongoose.model("User", userSchema);
