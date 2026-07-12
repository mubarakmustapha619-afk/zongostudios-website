import { timingSafeEqual } from "crypto";
import { cookies } from "next/headers";
import { SESSION_COOKIE_NAME, verifySessionToken } from "@/lib/session";

export function verifyPassword(candidate: string): boolean {
  const expected = process.env.ADMIN_PASSWORD;
  if (!expected) return false;

  const candidateBuffer = Buffer.from(candidate);
  const expectedBuffer = Buffer.from(expected);
  if (candidateBuffer.length !== expectedBuffer.length) return false;

  return timingSafeEqual(candidateBuffer, expectedBuffer);
}

export async function isAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
  return verifySessionToken(token);
}
