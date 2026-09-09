import type { ListingsResponse } from "../types/listing";
import { authenticatedRequest } from "./authenticated-request";
import { getJson } from "./client";

/**
 * Fetches one page of listings created by a profile.
 * Includes active and ended listings, newest first.
 *
 * @param name - Username whose listings should be retrieved.
 * @param page - Results page, starting at 1.
 * @returns Listings and pagination information.
 * @throws If the username or page is invalid, or the request fails.
 */
export async function getProfileListings(
  name: string,
  page = 1,
): Promise<ListingsResponse> {
  const username = name.trim();

  if (!username) {
    throw new Error("A username is required.");
  }

  if (!Number.isInteger(page) || page < 1) {
    throw new Error("The page number must be a positive integer.");
  }

  const params = new URLSearchParams({
    _bids: "true",
    limit: "6",
    page: String(page),
    sort: "created",
    sortOrder: "desc",
  });

  const response = await authenticatedRequest(
    `/auction/profiles/${encodeURIComponent(username)}/listings?${params}`,
  );

  return getJson<ListingsResponse>(
    response,
    "Unable to load your listings. Please try again.",
  );
}
