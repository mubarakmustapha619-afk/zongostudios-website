import { createHmac, timingSafeEqual } from "crypto";

export const SESSION_COOKIE_NAME = "admin_session";
export const SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 * 7; // 7 days

function getSecret(): string {
  const secret = process.env.SESSION_SECRET;
  if (!secret) {
    throw new Error("SESSION_SECRET environment variable is not set");
  }
  return secret;
}

function sign(payload: string): string {
  return createHmac("sha256", getSecret()).update(payload).digest("hex");
}

export function createSessionToken(): string {
  const expiresAt = Date.now() + SESSION_MAX_AGE_SECONDS * 1000;
  const payload = `admin.${expiresAt}`;
  return `${payload}.${sign(payload)}`;
}

export function verifySessionToken(token: string | undefined | null): boolean {
  if (!token) return false;

  const parts = token.split(".");
  if (parts.length !== 3) return false;
  const [role, expiresAtRaw, signature] = parts;

  const payload = `${role}.${expiresAtRaw}`;
  const expectedSignature = sign(payload);

  const provided = Buffer.from(signature);
  const expected = Buffer.from(expectedSignature);
  if (provided.length !== expected.length) return false;
  if (!timingSafeEqual(provided, expected)) return false;

  const expiresAt = Number(expiresAtRaw);
  if (!Number.isFinite(expiresAt) || Date.now() > expiresAt) return false;

  return role === "admin";
}
