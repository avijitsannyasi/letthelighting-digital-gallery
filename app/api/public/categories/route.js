import { NextResponse } from "next/server";
import { getCategories } from "@/app/lib/db";

export async function GET() {
  const categories = await getCategories();
  const safe = categories.map(({ name, slug }) => ({ name, slug }));
  return NextResponse.json(safe);
}
