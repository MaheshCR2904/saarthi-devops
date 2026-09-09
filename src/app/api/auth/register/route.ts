import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/db";
import { User } from "@/db/schema";
import bcrypt from "bcryptjs";
import { signToken, attachSessionCookies } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const { name, email, password, dateOfBirth } = await req.json();
    const normalizedName = typeof name === "string" ? name.trim() : "";
    const normalizedEmail = typeof email === "string" ? email.trim().toLowerCase() : "";

    if (!normalizedName || !normalizedEmail || typeof password !== "string") {
      return NextResponse.json({ error: "Name, email, and password are required" }, { status: 400 });
    }
    if (!/^\S+@\S+\.\S+$/.test(normalizedEmail)) {
      return NextResponse.json({ error: "Please enter a valid email address" }, { status: 400 });
    }
    if (password.length < 6) {
      return NextResponse.json({ error: "Password must be at least 6 characters" }, { status: 400 });
    }

    // Check existing user
    const existing = await User.findOne({ email: normalizedEmail });
    if (existing) {
      return NextResponse.json({ error: "Email already registered" }, { status: 409 });
    }

    // Calculate age from DOB
    let age: number | undefined;
    if (dateOfBirth) {
      const dob = new Date(dateOfBirth);
      const today = new Date();
      age = today.getFullYear() - dob.getFullYear();
      const monthDiff = today.getMonth() - dob.getMonth();
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
        age--;
      }
    }

    // Determine life stage
    let lifeStage: "stage_1" | "stage_2" | "stage_3" = "stage_1";
    if (age) {
      if (age >= 22) lifeStage = "stage_3";
      else if (age >= 18) lifeStage = "stage_2";
    }

    const passwordHash = await bcrypt.hash(password, 12);

    const user = await User.create({
      name: normalizedName,
      email: normalizedEmail,
      passwordHash,
      dateOfBirth: dateOfBirth || undefined,
      age,
      lifeStage,
    });

    const { token, refreshToken } = await signToken({
      userId: user._id.toString(),
      email: user.email,
      role: user.role || "user",
    });

    const response = NextResponse.json({
      user: { id: user._id.toString(), name: user.name, email: user.email, role: user.role, lifeStage },
      token,
    });

    return attachSessionCookies(response, token, refreshToken);
  } catch (error: unknown) {
    console.error("Registration error:", error);
    const errMessage = error instanceof Error ? error.message : "";
    if (errMessage.includes("ECONNREFUSED") || errMessage.includes("Server selection timed out") || errMessage.includes("MongoServerSelectionError")) {
      return NextResponse.json({ error: "Database unavailable. Please ensure MongoDB is running." }, { status: 503 });
    }
    return NextResponse.json({ error: "Registration failed. Please try again." }, { status: 500 });
  }
}
