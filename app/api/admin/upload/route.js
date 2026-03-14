import { NextResponse } from "next/server";
import { isAdmin } from "@/app/lib/adminAuth";
import { generateSignature } from "@/app/lib/cloudinary";

export async function POST(request) {
  try {
    if (!(await isAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { folder } = await request.json();
    const signatureData = generateSignature(folder || "general");

    return NextResponse.json(signatureData);
  } catch (err) {
    console.error("Upload signature error:", err);
    return NextResponse.json({ error: err.message || "Failed to generate signature" }, { status: 500 });
  }
}
