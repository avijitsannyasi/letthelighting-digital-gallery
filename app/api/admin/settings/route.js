import { NextResponse } from "next/server";
import { isAdmin } from "@/app/lib/adminAuth";
import { getSettings, updateSettings } from "@/app/lib/db";

export async function GET() {
  if (!(await isAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const settings = await getSettings();
  const { adminPassword, ...safe } = settings;
  return NextResponse.json(safe);
}

export async function PUT(request) {
  if (!(await isAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json();
  const updated = await updateSettings(body);
  const { adminPassword, ...safe } = updated;
  return NextResponse.json(safe);
}
