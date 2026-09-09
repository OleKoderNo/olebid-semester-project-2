import type { AuthSession, LoginUser } from "../types/auth";

const SESSION_KEY = "olebid.session";

/**
 * Checks that stored data contains the expected session fields.
 * This validates its structure, not the token's authenticity.
 *
 * @param value - Parsed browser-storage data.
 * @returns Whether the value has the required session fields.
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
 * Saves the account information needed between page loads.
 *
 * @param user - Account information returned by a successful login.
 * @throws If the session is invalid or browser storage is unavailable.
 */
export function saveSession(user: LoginUser): void {
  const session: AuthSession = {
    name: user.name,
    email: user.email,
    accessToken: user.accessToken,
  };

  if (!isAuthSession(session)) {
    throw new Error("The login response did not contain a valid session.");
  }

  localStorage.setItem(SESSION_KEY, JSON.stringify(session));
}

/**
 * Reads the saved session, tolerating missing or malformed data.
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

    if (!isAuthSession(parsed)) {
      localStorage.removeItem(SESSION_KEY);
      return null;
    }

    return parsed;
  } catch {
    return null;
  }
}

/**
 * Removes OleBid's saved session when logging out.
 */
export function clearSession(): void {
  localStorage.removeItem(SESSION_KEY);
}
