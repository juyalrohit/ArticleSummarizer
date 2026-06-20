import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

import { connectToDatabase } from "@/lib/mongodb";
import { UserModel } from "../../../models/User";
import { createSession } from "@/lib/auth";

export async function POST(request: Request) {
   await connectToDatabase();
   

  const body = await request.json();


  const email = String(body?.email ?? "").trim().toLowerCase();

  const password = String(body?.password ?? "");

  const role = String(body?.role ?? "User") as "Admin" | "User";

  if (!email || !password) {
    return NextResponse.json({ error: "Email and password are required." }, { status: 400 });
  }

  const existing = await UserModel.findOne({ email });

  if (existing) {
    return NextResponse.json({ error: "User already exists." }, { status: 409 });
  }

  const passwordHash = await bcrypt.hash(password, 10);
  
  const user = await UserModel.create({ email, passwordHash, role });

  await createSession({ id: String(user._id), email: user.email, role: user.role });

  return NextResponse.json({ user: { id: String(user._id), email: user.email, role: user.role } }, { status: 201 });
}
