import type { ListingsResponse } from "../types/listing";
import { API_BASE, getJson } from "./client";

/**
 * Fetches active auctions, optionally matching a search query.
 *
 * @param page - The results page, starting at 1.
 * @param query - Text to search for in titles and descriptions.
 * @param signal - Optional signal for cancelling the request.
 * @returns Listings and pagination information.
 * @throws If the page is invalid or the request fails.
 */
export async function getListings(
  page: number = 1,
  query: string = "",
  signal?: AbortSignal,
): Promise<ListingsResponse> {
  if (!Number.isInteger(page) || page < 1) {
    throw new Error("The page number must be a positive integer.");
  }

  const search = query.trim();

  const endpoint = search ? "/auction/listings/search" : "/auction/listings";

  const url = new URL(`${API_BASE}${endpoint}`);

  const parameters = new URLSearchParams({
    _active: "true",
    _bids: "true",
    limit: "6",
    page: String(page),
    sort: "created",
    sortOrder: "desc",
  });

  if (search) {
    parameters.set("q", search);
  }

  url.search = parameters.toString();

  const response = await fetch(url, { signal });

  return getJson<ListingsResponse>(
    response,
    "Unable to load auctions. Please try again.",
  );
}
