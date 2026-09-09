import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { connectDB } from "@/db";
import { User, LifeEvent, MoodLog, Prediction, Alert } from "@/db/schema";

export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    await connectDB();
    const userId = session.userId;

    // User profile
    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Recent life events
    const recentEvents = await LifeEvent.find({ userId })
      .sort({ occurredAt: -1 })
      .limit(10)
      .lean();

    // Recent mood logs
    const recentMoods = await MoodLog.find({ userId })
      .sort({ createdAt: -1 })
      .limit(14)
      .lean();

    // Active predictions
    const activePredictions = await Prediction.find({ userId })
      .sort({ createdAt: -1 })
      .limit(5)
      .lean();

    // Unread alerts
    const unreadAlerts = await Alert.find({ userId, isRead: false })
      .sort({ createdAt: -1 })
      .limit(10)
      .lean();

    // Life stage info
    const stageInfo = {
      stage_1: {
        name: "Explorer",
        description: "Choosing your stream and targeting colleges",
        ageRange: "16-18",
        focus: ["Stream selection", "College preparation", "Interest discovery"],
      },
      stage_2: {
        name: "Builder",
        description: "Building skills, internships, and college experience",
        ageRange: "18-22",
        focus: ["CGPA maintenance", "Internships", "Skill building", "Networking"],
      },
      stage_3: {
        name: "Launcher",
        description: "First job, career path, and early growth",
        ageRange: "22-26",
        focus: ["Job search", "Upskilling", "Salary growth", "Career path"],
      },
      stage_4: {
        name: "Accelerator",
        description: "Career growth, specialization, and financial building",
        ageRange: "26-35",
        focus: ["Career advancement", "Salary benchmarking", "Investments"],
      },
      stage_5: {
        name: "Transformer",
        description: "Mid-career decisions, leadership, and wealth building",
        ageRange: "35-50",
        focus: ["Leadership", "Mid-career switch", "Wealth management"],
      },
      stage_6: {
        name: "Legacy Builder",
        description: "Retirement planning and creating lasting impact",
        ageRange: "50-60",
        focus: ["Retirement planning", "Wealth projection", "Legacy"],
      },
    };

    return NextResponse.json({
      user: {
        id: user._id.toString(),
        name: user.name,
        age: user.age,
        lifeStage: user.lifeStage,
        stream: user.stream,
        college: user.college,
        cgpa: user.cgpa,
        currentRole: user.currentRole,
        targetRole: user.targetRole,
        skills: user.skills,
        interests: user.interests,
        careerScore: user.careerScore,
        financeScore: user.financeScore,
        skillsScore: user.skillsScore,
        wellbeingScore: user.wellbeingScore,
        overallLifeScore: user.overallLifeScore,
        currentStreak: user.currentStreak,
        longestStreak: user.longestStreak,
        currentSalary: user.currentSalary,
        monthlySavings: user.monthlySavings,
      },
      stageInfo: stageInfo[(user.lifeStage || "stage_1") as keyof typeof stageInfo],
      recentEvents,
      recentMoods,
      activePredictions,
      unreadAlerts,
    });
  } catch (error) {
    console.error("Dashboard error:", error);
    return NextResponse.json({ error: "Dashboard fetch failed" }, { status: 500 });
  }
}

