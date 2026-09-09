import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { connectDB } from "@/db";
import { User } from "@/db/schema";

export async function GET(req: NextRequest) {
  const session = await getSession(req);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await connectDB();
  const user = await User.findById(session.userId);
  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  return NextResponse.json({
    user: {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      role: user.role,
      lifeStage: user.lifeStage,
      age: user.age,
      dateOfBirth: user.dateOfBirth,
      interests: user.interests,
      skills: user.skills,
      goals: user.goals,
      education: user.education,
      stream: user.stream,
      college: user.college,
      cgpa: user.cgpa,
      currentRole: user.currentRole,
      currentCompany: user.currentCompany,
      currentSalary: user.currentSalary,
      targetRole: user.targetRole,
      location: user.location,
      experienceYears: user.experienceYears,
      careerScore: user.careerScore,
      financeScore: user.financeScore,
      skillsScore: user.skillsScore,
      wellbeingScore: user.wellbeingScore,
      overallLifeScore: user.overallLifeScore,
      currentStreak: user.currentStreak,
      longestStreak: user.longestStreak,
      monthlySavings: user.monthlySavings,
      monthlyIncome: user.monthlyIncome,
      emergencyFund: user.emergencyFund,
      parsedGoalTags: user.parsedGoalTags,
      aptitudeScores: user.aptitudeScores,
      createdAt: user.createdAt,
    },
  });
}

