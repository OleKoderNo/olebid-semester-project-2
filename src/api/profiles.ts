import type { ProfileResponse, UpdateProfileRequest } from "../types/profile";
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

/**
 * Updates a profile using the current authenticated session.
 *
 * @param name - Username of the profile to update.
 * @param updates - Bio and optional avatar or banner updates.
 * @returns The updated profile returned by the API.
 * @throws If the username is empty or the request fails.
 */
export async function updateProfile(
  name: string,
  updates: UpdateProfileRequest,
): Promise<ProfileResponse> {
  const username = name.trim();

  if (!username) {
    throw new Error("A username is required.");
  }

  const response = await authenticatedRequest(
    `/auction/profiles/${encodeURIComponent(username)}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updates),
    },
  );

  return getJson<ProfileResponse>(
    response,
    "Unable to update your profile. Please try again.",
  );
}
