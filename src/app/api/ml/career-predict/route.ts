import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { connectDB } from "@/db";
import { User, Prediction } from "@/db/schema";
import { predictCareerPaths } from "@/lib/ml";

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
      age: body.age || user.age || 21,
      interests: (body.interests || user.interests || []) as string[],
      skills: (body.skills || user.skills || []) as string[],
      cgpa: body.cgpa || user.cgpa || 7.0,
      stream: body.stream || user.stream || "Science",
      education: body.education || user.education || "B.Tech",
      location: body.location || user.location || "Bangalore",
      goals: (body.goals || user.goals || []) as string[],
    };

    const result = predictCareerPaths(input);

    // Save prediction to DB
    await Prediction.create({
      userId: session.userId,
      modelType: "career_path",
      inputFeatures: input,
      outputPrediction: result as unknown as Record<string, unknown>,
      confidenceScore: result[0]?.probability || 0,
    });

    return NextResponse.json({ predictions: result });
  } catch (error) {
    console.error("Career prediction error:", error);
    return NextResponse.json({ error: "Prediction failed" }, { status: 500 });
  }
}

