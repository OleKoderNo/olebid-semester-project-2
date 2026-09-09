import { clearSession, getSession } from "../auth/session";
import { API_BASE } from "./client";

/**
 * Sends a request with the user's token and application API key.
 * Redirects to login when a session is missing or rejected.
 *
 * @param path - API path beginning with a single slash.
 * @param options - Fetch options such as method, headers and body.
 * @returns The API response for the calling module to handle.
 * @throws If configuration is missing or the request fails.
 */
export async function authenticatedRequest(
  path: string,
  options: RequestInit = {},
): Promise<Response> {
  if (!path.startsWith("/") || path.startsWith("//")) {
    throw new Error("An API path beginning with a single slash is required.");
  }

  const session = getSession();

  if (!session) {
    window.location.replace("/login/?reason=auth-required");
    throw new Error("Please log in to continue.");
  }

  const apiKey = import.meta.env.VITE_NOROFF_API_KEY?.trim();

  if (!apiKey) {
    throw new Error("OleBid's API key has not been configured.");
  }

  const headers = new Headers(options.headers);

  headers.set("Authorization", `Bearer ${session.accessToken}`);
  headers.set("X-Noroff-API-Key", apiKey);

  const response = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers,
  });

  if (response.status === 401) {
    // Avoid clearing a newer session created while this request ran.
    const currentSession = getSession();

    if (!currentSession || currentSession.accessToken === session.accessToken) {
      clearSession();
      window.location.replace("/login/?reason=session-expired");
    }

    throw new Error("Your session could not be verified. Please log in again.");
  }

  return response;
}
