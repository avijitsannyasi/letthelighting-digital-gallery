import { NextResponse } from "next/server";
import { isAdmin } from "@/app/lib/adminAuth";
import { getGalleryImages, saveGalleryImages, addGalleryImage, deleteGalleryImage } from "@/app/lib/db";

export async function GET(request) {
  if (!(await isAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const slug = searchParams.get("slug");
  if (!slug) return NextResponse.json({ error: "slug required" }, { status: 400 });

  return NextResponse.json(await getGalleryImages(slug));
}

export async function POST(request) {
  if (!(await isAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { slug, image } = await request.json();
  if (!slug || !image) return NextResponse.json({ error: "slug and image required" }, { status: 400 });

  const newImage = await addGalleryImage(slug, {
    src: image.src,
    publicId: image.publicId || "",
    alt: image.alt || "",
    width: image.width || 400,
    height: image.height || 300,
  });

  return NextResponse.json(newImage);
}

export async function PUT(request) {
  if (!(await isAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { slug, images } = await request.json();
  if (!slug) return NextResponse.json({ error: "slug required" }, { status: 400 });

  await saveGalleryImages(slug, images);
  return NextResponse.json({ success: true });
}

export async function DELETE(request) {
  if (!(await isAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { slug, imageId } = await request.json();
  if (!slug || !imageId) return NextResponse.json({ error: "slug and imageId required" }, { status: 400 });

  await deleteGalleryImage(slug, imageId);
  return NextResponse.json({ success: true });
}
