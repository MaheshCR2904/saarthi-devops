import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { connectDB } from "@/db";
import { LifeEvent } from "@/db/schema";

export async function GET(req: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await connectDB();
  const url = new URL(req.url);
  const limit = parseInt(url.searchParams.get("limit") || "50");
  const eventType = url.searchParams.get("type");

  const filter: Record<string, any> = { userId: session.userId };
  if (eventType) {
    filter.eventType = eventType;
  }

  const events = await LifeEvent.find(filter)
    .sort({ occurredAt: -1 })
    .limit(limit)
    .lean();

  return NextResponse.json({ events });
}

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    await connectDB();
    const body = await req.json();
    const { eventType, title, description, lifeStage, impactScore, tags, occurredAt } = body;

    if (!eventType || !title || !occurredAt) {
      return NextResponse.json(
        { error: "eventType, title, and occurredAt are required" },
        { status: 400 }
      );
    }

    const event = await LifeEvent.create({
      userId: session.userId,
      eventType,
      title,
      description,
      lifeStage,
      impactScore: impactScore || 0,
      tags: tags || [],
      occurredAt: new Date(occurredAt),
    });

    return NextResponse.json({ event }, { status: 201 });
  } catch (error) {
    console.error("Create event error:", error);
    return NextResponse.json({ error: "Failed to create event" }, { status: 500 });
  }
}

