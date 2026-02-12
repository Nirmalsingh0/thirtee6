import "server-only";

import { cookies } from "next/headers";
import { SignJWT, jwtVerify } from "jose";
import { prisma } from "@/lib/prisma";

const COOKIE_NAME = "pd_session";

function getAuthSecret() {
  const fromJwt = process.env.JWT_SECRET;
  const fromAuth = process.env.AUTH_SECRET;
  const secret = fromJwt || fromAuth;
  if (!secret) throw new Error("Missing JWT_SECRET (or AUTH_SECRET) env var");
  return new TextEncoder().encode(secret);
}

type SessionPayload = {
  sub: string; // admin user id
  email: string;
};

export async function createSessionCookie(payload: SessionPayload) {
  const secret = getAuthSecret();
  const token = await new SignJWT({ email: payload.email })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(payload.sub)
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(secret);

  cookies().set(COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7
  });
}

export function clearSessionCookie() {
  cookies().set(COOKIE_NAME, "", { path: "/", maxAge: 0 });
}

export async function getSession() {
  const token = cookies().get(COOKIE_NAME)?.value;
  if (!token) return null;

  try {
    const secret = getAuthSecret();
    const { payload } = await jwtVerify(token, secret);
    const sub = typeof payload.sub === "string" ? payload.sub : undefined;
    const email = typeof payload.email === "string" ? payload.email : undefined;
    if (!sub || !email) return null;
    return { adminId: sub, email };
  } catch {
    return null;
  }
}

export async function requireAdmin() {
  const session = await getSession();
  if (!session) return null;

  const admin = await prisma.adminUser.findUnique({ where: { id: session.adminId } });
  if (!admin) return null;
  return admin;
}

