// app/api/auth/google/route.ts

import { NextResponse } from "next/server";

export async function GET() {
  const url =
    `https://accounts.google.com/o/oauth2/v2/auth?` +
    new URLSearchParams({
      client_id: process.env.GOOGLE_CLIENT_ID!,
      redirect_uri:
        "http://localhost:3000/api/auth/google/callback",
      response_type: "code",
      scope: "openid email profile",
    });

  return NextResponse.redirect(url);
}