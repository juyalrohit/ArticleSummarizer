import { NextRequest, NextResponse } from "next/server";
import { OAuth2Client } from "google-auth-library";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

import { connectToDatabase } from "@/lib/mongodb";
import { UserModel } from "@/app/models/User";
import { createSession } from "@/lib/auth";
const client = new OAuth2Client(
  process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID
);

export async function POST(req: NextRequest) {
  try {
    const { credential } = await req.json();

    if (!credential) {
      return NextResponse.json(
        { error: "Missing credential" },
        { status: 400 }
      );
    }

    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();

    if (!payload?.email) {
      return NextResponse.json(
        { error: "Invalid Google token" },
        { status: 401 }
      );
    }

    await connectToDatabase();

    let user = await UserModel.findOne({
      email: payload.email,
    });

    if (!user) {
      user = await UserModel.create({
        name: payload.name,
        email: payload.email,
        provider: "google",
        role: "User",
      });
    }

   await createSession(user);

    return NextResponse.json({
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Google Auth Error:", error);

    return NextResponse.json(
      {
        error: "Google authentication failed",
      },
      {
        status: 500,
      }
    );
  }
}