import type { AuthSession, LoginUser } from "../types/auth";
import { isTokenExpired } from "./token";

const SESSION_KEY = "olebid.session";

/**
 * Checks the structure of stored session data.
 * This does not verify the access token's authenticity.
 *
 * @param value - Parsed browser-storage data.
 * @returns Whether the required fields are present.
 */
function isAuthSession(value: unknown): value is AuthSession {
  if (typeof value !== "object" || value === null) {
    return false;
  }

  return (
    "name" in value &&
    typeof value.name === "string" &&
    value.name.trim().length > 0 &&
    "email" in value &&
    typeof value.email === "string" &&
    value.email.trim().length > 0 &&
    "accessToken" in value &&
    typeof value.accessToken === "string" &&
    value.accessToken.trim().length > 0
  );
}

/**
 * Saves account information after login.
 *
 * @param user - Account information returned by the API.
 * @throws If the session is unusable or storage is unavailable.
 */
export function saveSession(user: LoginUser): void {
  const session: AuthSession = {
    name: user.name,
    email: user.email,
    accessToken: user.accessToken,
  };

  if (!isAuthSession(session) || isTokenExpired(session.accessToken)) {
    throw new Error("The login response did not contain a usable session.");
  }

  localStorage.setItem(SESSION_KEY, JSON.stringify(session));
}

/**
 * Reads a session and discards malformed or expired data.
 *
 * @returns Stored account information, or null.
 */
export function getSession(): AuthSession | null {
  try {
    const stored = localStorage.getItem(SESSION_KEY);

    if (!stored) {
      return null;
    }

    const parsed: unknown = JSON.parse(stored);

    if (!isAuthSession(parsed) || isTokenExpired(parsed.accessToken)) {
      clearSession();
      return null;
    }

    return parsed;
  } catch {
    return null;
  }
}

/**
 * Removes OleBid's saved session.
 */
export function clearSession(): void {
  localStorage.removeItem(SESSION_KEY);
}
