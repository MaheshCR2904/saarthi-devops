import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/db";
import { User } from "@/db/schema";
import bcrypt from "bcryptjs";
import { signToken, attachSessionCookies } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const { email, password } = await req.json();
    const normalizedEmail = typeof email === "string" ? email.trim().toLowerCase() : "";

    if (!normalizedEmail || typeof password !== "string" || !password) {
      return NextResponse.json({ error: "Email and password required" }, { status: 400 });
    }

    const user = await User.findOne({ email: normalizedEmail });
    if (!user) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    const { token, refreshToken } = await signToken({
      userId: user._id.toString(),
      email: user.email,
      role: user.role || "user",
    });

    const response = NextResponse.json({
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        role: user.role,
        lifeStage: user.lifeStage,
        interests: user.interests,
        skills: user.skills,
        age: user.age,
        stream: user.stream,
      },
      token,
    });

    return attachSessionCookies(response, token, refreshToken);
  } catch (error: unknown) {
    console.error("Login error:", error);
    const errMessage = error instanceof Error ? error.message : "";
    if (errMessage.includes("ECONNREFUSED") || errMessage.includes("Server selection timed out") || errMessage.includes("MongoServerSelectionError")) {
      return NextResponse.json({ error: "Database unavailable. Please ensure MongoDB is running." }, { status: 503 });
    }
    return NextResponse.json({ error: "Login failed. Please try again." }, { status: 500 });
  }
}
