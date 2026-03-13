import { NextResponse } from "next/server";
import { isAdmin } from "@/app/lib/adminAuth";
import { getCategories, addCategory, updateCategory, deleteCategory } from "@/app/lib/db";

export async function GET() {
  if (!(await isAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  return NextResponse.json(await getCategories());
}

export async function POST(request) {
  if (!(await isAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json();

  const slug = body.name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

  const newCategory = await addCategory({
    name: body.name,
    slug,
    password: body.password || "",
    description: body.description || "",
    bannerImage: body.bannerImage || "",
  });

  return NextResponse.json(newCategory);
}

export async function PUT(request) {
  if (!(await isAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json();
  const updated = await updateCategory(body.id, body);

  if (!updated) return NextResponse.json({ error: "Not found" }, { status: 404 });

  return NextResponse.json(updated);
}

export async function DELETE(request) {
  if (!(await isAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await request.json();
  await deleteCategory(id);
  return NextResponse.json({ success: true });
}
