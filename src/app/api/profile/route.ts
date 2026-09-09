import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { connectDB } from "@/db";
import { User } from "@/db/schema";
import { parseGoalText } from "@/lib/ml";

export async function PUT(req: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    await connectDB();
    const body = await req.json();

    // If goals are provided as raw text, parse them
    if (body.goalRawText) {
      const parsed = parseGoalText(body.goalRawText);
      body.parsedGoalTags = parsed;
    }

    // Calculate age if dateOfBirth provided
    if (body.dateOfBirth) {
      const dob = new Date(body.dateOfBirth);
      const today = new Date();
      let age = today.getFullYear() - dob.getFullYear();
      const monthDiff = today.getMonth() - dob.getMonth();
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
        age--;
      }
      body.age = age;

      // Auto-detect life stage
      if (age < 18) body.lifeStage = "stage_1";
      else if (age < 22) body.lifeStage = "stage_2";
      else if (age < 26) body.lifeStage = "stage_3";
      else if (age < 35) body.lifeStage = "stage_4";
      else if (age < 50) body.lifeStage = "stage_5";
      else body.lifeStage = "stage_6";
    }

    // Calculate overall life score
    const careerScore = body.careerScore || 50;
    const financeScore = body.financeScore || 50;
    const skillsScore = body.skillsScore || 50;
    const wellbeingScore = body.wellbeingScore || 50;
    body.overallLifeScore = Math.round(
      (careerScore + financeScore + skillsScore + wellbeingScore) / 4
    );

    const allowedFields = [
      "name", "profilePhoto", "dateOfBirth", "age", "lifeStage",
      "interests", "aptitudeScores", "goals", "goalRawText", "parsedGoalTags",
      "education", "stream", "college", "cgpa", "skills",
      "experienceYears", "currentRole", "currentCompany", "currentSalary",
      "targetRole", "location", "preferredLocation",
      "careerScore", "financeScore", "skillsScore", "wellbeingScore",
      "overallLifeScore", "monthlySavings", "monthlyIncome", "emergencyFund",
    ];

    const updateData: Record<string, unknown> = {};
    for (const field of allowedFields) {
      if (body[field] !== undefined) {
        updateData[field] = body[field];
      }
    }

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json({ error: "No valid fields to update" }, { status: 400 });
    }

    const updated = await User.findByIdAndUpdate(
      session.userId,
      { $set: updateData },
      { new: true }
    );

    return NextResponse.json({ user: updated });
  } catch (error) {
    console.error("Profile update error:", error);
    return NextResponse.json({ error: "Profile update failed" }, { status: 500 });
  }
}

