import { NextResponse } from "next/server";
import { isAdmin } from "@/app/lib/adminAuth";
import { getSlider, saveSlider, addSlide, deleteSlide } from "@/app/lib/db";

export async function GET() {
  if (!(await isAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  return NextResponse.json(await getSlider());
}

export async function POST(request) {
  if (!(await isAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json();
  const newSlide = await addSlide({
    src: body.src,
    category: body.category || "",
  });

  return NextResponse.json(newSlide);
}

export async function PUT(request) {
  if (!(await isAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const slides = await request.json();
  await saveSlider(slides);
  return NextResponse.json({ success: true });
}

export async function DELETE(request) {
  if (!(await isAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await request.json();
  await deleteSlide(id);
  return NextResponse.json({ success: true });
}
