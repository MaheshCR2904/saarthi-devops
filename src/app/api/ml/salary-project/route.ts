import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { connectDB } from "@/db";
import { User, Prediction } from "@/db/schema";
import { projectSalary } from "@/lib/ml";

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

    const input = {
      currentSalary: body.currentSalary || user.currentSalary || 400000,
      careerPath: body.careerPath || user.targetRole || "Software Engineer",
      experienceYears: body.experienceYears || user.experienceYears || 0,
      skills: (body.skills || user.skills || []) as string[],
      location: body.location || user.location || "Bangalore",
    };

    const projections = projectSalary(input);

    await Prediction.create({
      userId: session.userId,
      modelType: "salary_projection",
      inputFeatures: input as unknown as Record<string, unknown>,
      outputPrediction: projections as unknown as Record<string, unknown>,
      confidenceScore: 75,
    });

    return NextResponse.json({ projections });
  } catch (error) {
    console.error("Salary projection error:", error);
    return NextResponse.json({ error: "Projection failed" }, { status: 500 });
  }
}

