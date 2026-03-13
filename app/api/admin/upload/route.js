import { NextResponse } from "next/server";
import { isAdmin } from "@/app/lib/adminAuth";
import { uploadImage } from "@/app/lib/cloudinary";

export async function POST(request) {
  if (!(await isAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const formData = await request.formData();
  const file = formData.get("file");
  const folder = formData.get("folder") || "general";

  if (!file) return NextResponse.json({ error: "No file uploaded" }, { status: 400 });

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
