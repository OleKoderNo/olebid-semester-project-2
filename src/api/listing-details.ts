import type { ListingDetailsResponse } from "../types/listing";
import { API_BASE, getJson } from "./client";

/**
 * Fetches an auction with its seller information and bid history.
 *
 * @param id - Identifier of the auction to retrieve.
 * @param signal - Optional signal for cancelling the request.
 * @returns The requested auction.
 * @throws If the identifier is empty or the request fails.
 */
export async function getListingById(
  id: string,
  signal?: AbortSignal,
): Promise<ListingDetailsResponse> {
  const listingId = id.trim();

  if (!listingId) {
    throw new Error("An auction ID is required.");
  }

  const url = new URL(
    `${API_BASE}/auction/listings/${encodeURIComponent(listingId)}`,
  );

  url.search = new URLSearchParams({
    _seller: "true",
    _bids: "true",
  }).toString();

  const response = await fetch(url, { signal });

  if (response.status === 404) {
    throw new Error("This auction could not be found.");
  }

  return getJson<ListingDetailsResponse>(
    response,
    "Unable to load this auction. Please try again.",
  );
}
