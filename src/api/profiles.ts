import type { ProfileResponse } from "../types/profile";
import { authenticatedRequest } from "./authenticated-request";
import { getJson } from "./client";

/**
 * Fetches an auction profile using the current session.
 *
 * @param name - Username of the profile to retrieve.
 * @returns Profile information, including the credit balance.
 * @throws If the username is empty or the request fails.
 */
export async function getProfile(name: string): Promise<ProfileResponse> {
  const username = name.trim();

  if (!username) {
    throw new Error("A username is required.");
  }

  const response = await authenticatedRequest(
    `/auction/profiles/${encodeURIComponent(username)}`,
  );

  return getJson<ProfileResponse>(
    response,
    "Unable to load the profile. Please try again.",
  );
}
