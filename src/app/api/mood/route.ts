import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { connectDB } from "@/db";
import { MoodLog, User } from "@/db/schema";

export async function GET(req: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await connectDB();
  const url = new URL(req.url);
  const limit = parseInt(url.searchParams.get("limit") || "30");

  const logs = await MoodLog.find({ userId: session.userId })
    .sort({ createdAt: -1 })
    .limit(limit)
    .lean();

  return NextResponse.json({ logs });
}

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    await connectDB();
    const body = await req.json();
    const { mood, note, lifeUpdate } = body;

    if (!mood) {
      return NextResponse.json({ error: "Mood is required" }, { status: 400 });
    }

    // Simple wellbeing score from mood
    const moodScores: Record<string, number> = {
      great: 90, good: 70, okay: 55, low: 35, stressed: 25, anxious: 20,
    };
    const wellbeingScore = moodScores[mood] || 50;

    const log = await MoodLog.create({
      userId: session.userId,
      mood,
      note: note || null,
      lifeUpdate: lifeUpdate || null,
      wellbeingScore,
    });

    // Update streak
    const user = await User.findById(session.userId);
    if (user) {
      const today = new Date().toISOString().split("T")[0];
      const lastCheckin = user.lastCheckinDate ? new Date(user.lastCheckinDate) : null;
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);

      let newStreak = user.currentStreak || 0;
      if (lastCheckin) {
        const lastDate = lastCheckin.toISOString().split("T")[0];
        const yesterdayStr = yesterday.toISOString().split("T")[0];
        if (lastDate === yesterdayStr) {
          newStreak += 1;
        } else if (lastDate !== today) {
          newStreak = 1;
        }
      } else {
        newStreak = 1;
      }

      const longestStreak = Math.max(newStreak, user.longestStreak || 0);

      await User.findByIdAndUpdate(session.userId, {
        lastCheckinDate: today,
        currentStreak: newStreak,
        longestStreak,
        wellbeingScore: Math.round((user.wellbeingScore + wellbeingScore) / 2),
      });
    }

    return NextResponse.json({ log, streak: user?.currentStreak }, { status: 201 });
  } catch (error) {
    console.error("Mood log error:", error);
    return NextResponse.json({ error: "Failed to log mood" }, { status: 500 });
  }
}

