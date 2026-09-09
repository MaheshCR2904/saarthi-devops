import { NextRequest, NextResponse } from "next/server";
import { parseGoalText } from "@/lib/ml";

export async function POST(req: NextRequest) {
  try {
    const { text } = await req.json();

    if (!text || typeof text !== "string") {
      return NextResponse.json({ error: "Goal text is required" }, { status: 400 });
    }

    const result = parseGoalText(text);
    return NextResponse.json(result);
  } catch (error) {
    console.error("Goal parse error:", error);
    return NextResponse.json({ error: "Parsing failed" }, { status: 500 });
  }
}

