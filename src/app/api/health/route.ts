import { connectDB } from "@/db";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    await connectDB();
    const db = (await import("mongoose")).default.connection;
    const isConnected = db.readyState === 1;
    return Response.json({ ok: isConnected, dbState: db.readyState });
  } catch (error) {
    console.error("Health check failed:", error);
    return Response.json({ ok: false, error: "Database not connected" }, { status: 500 });
  }
}

