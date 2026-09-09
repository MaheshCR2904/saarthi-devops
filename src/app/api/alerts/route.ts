import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { connectDB } from "@/db";
import { Alert } from "@/db/schema";

export async function GET(req: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await connectDB();
  const url = new URL(req.url);
  const unreadOnly = url.searchParams.get("unread") === "true";
  const limit = parseInt(url.searchParams.get("limit") || "20");

  const filter: Record<string, any> = { userId: session.userId };
  if (unreadOnly) {
    filter.isRead = false;
  }

  const result = await Alert.find(filter)
    .sort({ createdAt: -1 })
    .limit(limit)
    .lean();

  return NextResponse.json({ alerts: result });
}

export async function PATCH(req: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await connectDB();
  const { id, markAllRead } = await req.json();

  if (markAllRead) {
    await Alert.updateMany(
      { userId: session.userId, isRead: false },
      { $set: { isRead: true } }
    );
    return NextResponse.json({ success: true });
  }

  if (id) {
    await Alert.findByIdAndUpdate(id, { $set: { isRead: true } });
    return NextResponse.json({ success: true });
  }

  return NextResponse.json({ error: "id or markAllRead required" }, { status: 400 });
}

