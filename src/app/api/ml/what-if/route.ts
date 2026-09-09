import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { connectDB } from "@/db";
import { WhatIfScenario } from "@/db/schema";
import { simulateWhatIf } from "@/lib/ml";

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    await connectDB();
    const body = await req.json();
    const { scenarioA, scenarioB } = body;

    if (!scenarioA || !scenarioB) {
      return NextResponse.json({ error: "Both scenarios are required" }, { status: 400 });
    }

    const { resultA, resultB } = simulateWhatIf(scenarioA, scenarioB);

    // Save to DB
    await WhatIfScenario.create({
      userId: session.userId,
      scenarioA,
      scenarioB,
      resultA,
      resultB,
    });

    return NextResponse.json({ resultA, resultB });
  } catch (error) {
    console.error("What-if error:", error);
    return NextResponse.json({ error: "Simulation failed" }, { status: 500 });
  }
}

