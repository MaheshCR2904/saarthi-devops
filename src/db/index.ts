import mongoose, { type Mongoose } from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI ?? "";

if (!MONGODB_URI) {
  throw new Error("MONGODB_URI is required in environment variables");
}

const globalForDb = globalThis as typeof globalThis & {
  __saarthiMongooseConnection?: Mongoose;
};

export async function connectDB() {
  if (globalForDb.__saarthiMongooseConnection?.connection?.readyState === 1) {
    return globalForDb.__saarthiMongooseConnection;
  }

  try {
    const conn = await mongoose.connect(MONGODB_URI, {
      dbName: "saarthi",
      serverSelectionTimeoutMS: 5000,
    });
    globalForDb.__saarthiMongooseConnection = conn;
    console.log("✅ Connected to MongoDB —", conn.connection.host);
    return conn;
  } catch (error) {
    console.error("❌ MongoDB connection error:", error);
    throw error;
  }
}

export const db = mongoose.connection;

// Auto-connect in development
if (process.env.NODE_ENV !== "production") {
  connectDB().catch((err) => console.error("Initial DB connect failed:", err));
}

export default mongoose;

