import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { connectDB } from "@/db";
import { ResumeData } from "@/db/schema";
import { calculateATSScore } from "@/lib/ml";

export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await connectDB();
  const resume = await ResumeData.findOne({ userId: session.userId }).lean();
  return NextResponse.json({ resume: resume || null });
}

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    await connectDB();
    const body = await req.json();

    // Check existing
    const existing = await ResumeData.findOne({ userId: session.userId });

    let resume;
    if (existing) {
      resume = await ResumeData.findOneAndUpdate(
        { userId: session.userId },
        { $set: { ...body, updatedAt: new Date() } },
        { new: true }
      );
    } else {
      resume = await ResumeData.create({
        userId: session.userId,
        ...body,
      });
    }

    // Calculate ATS score
    if (body.skills && body.targetRole) {
      const atsResult = calculateATSScore({
        skills: body.skills || [],
        experience: body.experience || [],
        education: body.education || [],
        certifications: body.certifications || [],
        targetRole: body.targetRole || "Software Engineer",
      });

      resume = await ResumeData.findOneAndUpdate(
        { userId: session.userId },
        { $set: { atsScore: atsResult.score, lastOptimizedRole: body.targetRole } },
        { new: true }
      );

      return NextResponse.json({ resume, atsAnalysis: atsResult });
    }

    return NextResponse.json({ resume });
  } catch (error) {
    console.error("Resume error:", error);
    return NextResponse.json({ error: "Failed to save resume" }, { status: 500 });
  }
}

