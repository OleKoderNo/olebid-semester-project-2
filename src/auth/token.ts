/**
 * Reads the expiry timestamp from a JWT payload.
 * This does not verify the token's authenticity.
 *
 * @param token - Access token returned by the API.
 * @returns Expiry time in milliseconds, or null for an invalid payload.
 */
export function getTokenExpiry(token: string): number | null {
  try {
    const parts = token.split(".");

    if (parts.length !== 3 || !parts[1]) {
      return null;
    }

    const base64 = parts[1].replace(/-/g, "+").replace(/_/g, "/");
    const padded = base64.padEnd(Math.ceil(base64.length / 4) * 4, "=");

    const payload: unknown = JSON.parse(atob(padded));

    if (
      typeof payload !== "object" ||
      payload === null ||
      !("exp" in payload) ||
      typeof payload.exp !== "number" ||
      !Number.isFinite(payload.exp)
    ) {
      return null;
    }

    const expiry = payload.exp * 1000;

    return Number.isFinite(expiry) ? expiry : null;
  } catch {
    return null;
  }
}

/**
 * Checks whether a token's declared expiry has passed.
 * A missing expiry does not establish whether a token is valid.
 * The API remains responsible for accepting or rejecting it.
 *
 * @param token - Access token to inspect.
 * @returns Whether a readable expiry timestamp has passed.
 */
export function isTokenExpired(token: string): boolean {
  const expiry = getTokenExpiry(token);

  return expiry !== null && expiry <= Date.now();
}
