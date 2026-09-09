import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { connectDB } from "@/db";
import { User } from "@/db/schema";
import { detectSkillGap } from "@/lib/ml";

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    await connectDB();
    const body = await req.json();

    const user = await User.findById(session.userId);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const skills = (body.skills || user.skills || []) as string[];
    const targetRole = body.targetRole || user.targetRole || "Software Engineer";

    const result = detectSkillGap(skills, targetRole);

    return NextResponse.json(result);
  } catch (error) {
    console.error("Skill gap error:", error);
    return NextResponse.json({ error: "Skill gap analysis failed" }, { status: 500 });
  }
}

