import { NextResponse } from "next/server";
import { getCategories } from "@/app/lib/db";

export async function POST(request) {
  const { password } = await request.json();
  const categories = await getCategories();
  const matched = categories.find((c) => c.password === password);

  if (matched) {
    return NextResponse.json({ slug: matched.slug, name: matched.name });
  }

  return NextResponse.json({ error: "Invalid access code" }, { status: 401 });
}
