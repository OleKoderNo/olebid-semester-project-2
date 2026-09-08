import type { ListingsResponse } from "../types/listing";
import { API_BASE, getJson } from "./client";

/**
 * Fetches one page of active auctions, newest first, including bids.
 *
 * @param page - The results page to request, starting at 1.
 * @returns Listings and pagination information.
 * @throws If the page is invalid or the request fails.
 */
export async function getListings(page: number = 1): Promise<ListingsResponse> {
  if (!Number.isInteger(page) || page < 1) {
    throw new Error("The page number must be a positive integer.");
  }

  const url = new URL(`${API_BASE}/auction/listings`);

  url.search = new URLSearchParams({
    _active: "true",
    _bids: "true",
    limit: "6",
    page: String(page),
    sort: "created",
    sortOrder: "desc",
  }).toString();

  const response = await fetch(url);

  return getJson<ListingsResponse>(
    response,
    "Unable to load auctions. Please try again.",
  );
}
