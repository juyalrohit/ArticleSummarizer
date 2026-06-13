import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

import { connectToDatabase } from "./mongodb";
import { UserModel } from "../models/User";

const JWT_SECRET = process.env.JWT_SECRET || "dev-secret-change-me";

export type Role = "Admin" | "User";

export type SessionUser = {
  id: string;
  email: string;
  role: Role;
};

export async function createSession(user: SessionUser) {
  const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: "7d" });
  const cookieStore = await cookies();
  cookieStore.set("session", token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 7,
  });
}

export async function getSessionUser(): Promise<SessionUser | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get("session")?.value;
  if (!token) return null;

  try {
    const payload = jwt.verify(token, JWT_SECRET) as { id?: string; email?: string; role?: Role };
    if (!payload.id || !payload.email || !payload.role) return null;

    return { id: payload.id, email: payload.email, role: payload.role };
  } catch {
    return null;
  }
}

export async function requireAuth() {
  const user = await getSessionUser();
  if (!user) {
    return { error: "Unauthorized", status: 401 } as const;
  }
  return { user };
}

export async function requireRole(role: Role) {
  const auth = await requireAuth();
  if ("error" in auth) return auth;
  if (auth.user.role !== role) {
    return { error: "Forbidden", status: 403 } as const;
  }
  return { user: auth.user };
}

export async function getUserFromSession() {
  const user = await getSessionUser();
  if (!user) return null;

  await connectToDatabase();
  return UserModel.findById(user.id).lean();
}

export function withAuthResponse() {
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}
