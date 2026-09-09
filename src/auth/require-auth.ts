import type { AuthSession } from "../types/auth";
import { getSession } from "./session";

/**
 * Requires a locally usable session before rendering protected content.
 * The API must still authorise every protected request.
 *
 * @returns The session, or null after starting a login redirect.
 */
export function requireAuth(): AuthSession | null {
  const session = getSession();

  if (!session) {
    window.location.replace("/login/?reason=auth-required");
    return null;
  }

  return session;
}
