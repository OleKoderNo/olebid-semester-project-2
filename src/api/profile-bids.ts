import type { ProfileBidsResponse } from "../types/profile-bid";
import { authenticatedRequest } from "./authenticated-request";
import { getJson } from "./client";

/**
 * Fetches one page of bids made by a profile, newest first.
 *
 * @param name - Username whose bids should be retrieved.
 * @param page - Results page, starting at 1.
 * @returns Bid records, associated listing IDs and pagination.
 * @throws If the username or page is invalid, or the request fails.
 */
export async function getProfileBids(
  name: string,
  page = 1,
): Promise<ProfileBidsResponse> {
  const username = name.trim();

  if (!username) {
    throw new Error("A username is required.");
  }

  if (!Number.isInteger(page) || page < 1) {
    throw new Error("The page number must be a positive integer.");
  }

  const params = new URLSearchParams({
    _listings: "true",
    limit: "6",
    page: String(page),
    sort: "created",
    sortOrder: "desc",
  });

  const response = await authenticatedRequest(
    `/auction/profiles/${encodeURIComponent(username)}/bids?${params}`,
  );

  return getJson<ProfileBidsResponse>(
    response,
    "Unable to load your bidding activity. Please try again.",
  );
}
