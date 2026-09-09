import { SignJWT, jwtVerify } from "jose";
import { cookies, headers } from "next/headers";
import type { NextRequest, NextResponse } from "next/server";
import type { IUser } from "@/db/schema";

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "saarthi-dev-secret-key-change-in-production-2024"
);

const REFRESH_SECRET = new TextEncoder().encode(
  process.env.REFRESH_SECRET || "saarthi-refresh-secret-key-change-2024"
);

export async function signToken(payload: { userId: string; email: string; role: string }) {
  const token = await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("24h")
    .sign(JWT_SECRET);

  const refreshToken = await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(REFRESH_SECRET);

  return { token, refreshToken };
}

export async function verifyToken(token: string) {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return payload as unknown as { userId: string; email: string; role: string };
  } catch {
    return null;
  }
}

export async function verifyRefreshToken(token: string) {
  try {
    const { payload } = await jwtVerify(token, REFRESH_SECRET);
    return payload as unknown as { userId: string; email: string; role: string };
  } catch {
    return null;
  }
}

export async function getSession(req?: NextRequest | Request) {
  let token: string | undefined;

  try {
    const cookieStore = await cookies();
    token = cookieStore.get("saarthi_token")?.value;
  } catch {
    // cookies() might not be available in certain contexts
  }

  if (!token) {
    let authHeader: string | null = null;
    if (req) {
      authHeader = req.headers.get("Authorization") || req.headers.get("authorization");
    } else {
      try {
        const headerStore = await headers();
        authHeader = headerStore.get("Authorization") || headerStore.get("authorization");
      } catch {
        // headers() might not be available
      }
    }

    if (authHeader?.startsWith("Bearer ")) {
      token = authHeader.substring(7).trim();
    }
  }

  if (!token) return null;
  return verifyToken(token);
}

export function attachSessionCookies(
  response: NextResponse,
  token: string,
  refreshToken: string
): NextResponse {
  response.cookies.set("saarthi_token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24, // 24 hours
    path: "/",
  });
  response.cookies.set("saarthi_refresh", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: "/",
  });
  return response;
}

export function clearSessionCookies(response: NextResponse): NextResponse {
  response.cookies.set("saarthi_token", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 0,
    path: "/",
  });
  response.cookies.set("saarthi_refresh", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 0,
    path: "/",
  });
  return response;
}

export async function setSessionCookie(token: string, refreshToken: string) {
  try {
    const cookieStore = await cookies();
    cookieStore.set("saarthi_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24, // 24 hours
      path: "/",
    });
    cookieStore.set("saarthi_refresh", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: "/",
    });
  } catch {
    // In Route Handlers, cookieStore.set is not supported; attachSessionCookies should be used instead
  }
}

export async function clearSessionCookie() {
  try {
    const cookieStore = await cookies();
    cookieStore.delete("saarthi_token");
    cookieStore.delete("saarthi_refresh");
  } catch {
    // In Route Handlers, cookieStore.delete is not supported; clearSessionCookies should be used instead
  }
}
