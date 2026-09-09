import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { connectDB } from "@/db";
import { MoodLog } from "@/db/schema";
import { analyzeWellbeing } from "@/lib/ml";

export async function GET(req: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    await connectDB();

    const logs = await MoodLog.find({ userId: session.userId })
      .select("mood note")
      .sort({ createdAt: -1 })
      .limit(30)
      .lean();

    const analysis = analyzeWellbeing(logs as unknown as { mood: string; note: string }[]);

    return NextResponse.json(analysis);
  } catch (error) {
    console.error("Wellbeing analysis error:", error);
    return NextResponse.json({ error: "Analysis failed" }, { status: 500 });
  }
}

