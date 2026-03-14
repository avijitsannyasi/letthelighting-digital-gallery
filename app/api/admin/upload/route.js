import { NextResponse } from "next/server";
import { isAdmin } from "@/app/lib/adminAuth";
import { uploadImage } from "@/app/lib/cloudinary";

export const maxDuration = 60;

const MAX_SIZE = 10 * 1024 * 1024; // 10MB

export async function POST(request) {
  if (!(await isAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const formData = await request.formData();
  const file = formData.get("file");
  const folder = formData.get("folder") || "general";

  if (!file) return NextResponse.json({ error: "No file uploaded" }, { status: 400 });

  if (file.size > MAX_SIZE) {
    return NextResponse.json({ error: "File too large. Maximum size is 10MB." }, { status: 413 });
  }

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  const result = await uploadImage(buffer, folder);

  return NextResponse.json({
    url: result.secure_url,
    publicId: result.public_id,
    fileName: file.name,
    width: result.width,
    height: result.height,
  });
}
