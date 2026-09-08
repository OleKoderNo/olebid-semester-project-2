export const API_BASE = "https://v2.api.noroff.dev";

interface ApiErrorResponse {
  errors?: {
    message?: string;
  }[];
}

/**
 * Reads a JSON response and reports unsuccessful requests.
 *
 * @param response - The response returned by fetch.
 * @param fallbackMessage - Message used when no API error is available.
 * @returns The complete response body, including pagination when present.
 * @throws If the request fails or its JSON cannot be read.
 */
export async function getJson<T>(
  response: Response,
  fallbackMessage: string,
): Promise<T> {
  let result: unknown;

  try {
    result = await response.json();
  } catch {
    throw new Error(`${fallbackMessage} (${response.status})`);
  }

  if (!response.ok) {
    const error = result as ApiErrorResponse | null;

    throw new Error(
      error?.errors?.[0]?.message || `${fallbackMessage} (${response.status})`,
    );
  }

  return result as T;
}
