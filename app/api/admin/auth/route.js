import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getSettings } from "@/app/lib/db";

export async function POST(request) {
  const { password } = await request.json();
  const settings = await getSettings();

  if (password === (settings.adminPassword || "admin123")) {
    const token = Buffer.from(`admin:${Date.now()}`).toString("base64");
    const cookieStore = await cookies();
    cookieStore.set("admin_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60 * 24,
      path: "/",
    });
    return NextResponse.json({ success: true });
  }

  return NextResponse.json({ error: "Invalid password" }, { status: 401 });
}

export async function DELETE() {
  const cookieStore = await cookies();
  cookieStore.delete("admin_token");
  return NextResponse.json({ success: true });
}
