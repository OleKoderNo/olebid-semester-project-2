import type { Listing } from "../types/listing";
import { authenticatedRequest } from "./authenticated-request";
import { getJson } from "./client";

interface PlaceBidResponse {
  data: Listing;
}

/**
 * Places a bid using the current authenticated session.
 *
 * @param listingId - ID of the auction receiving the bid.
 * @param amount - Total bid amount in whole credits.
 * @returns The updated listing returned by the API.
 * @throws If the ID or amount is invalid, or the API rejects the bid.
 */
export async function placeBid(
  listingId: string,
  amount: number,
): Promise<PlaceBidResponse> {
  const id = listingId.trim();

  if (!id) {
    throw new Error("A listing ID is required.");
  }

  if (!Number.isSafeInteger(amount) || amount < 1) {
    throw new Error("Enter a bid amount in whole credits greater than zero.");
  }

  const response = await authenticatedRequest(
    `/auction/listings/${encodeURIComponent(id)}/bids`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ amount }),
    },
  );

  return getJson<PlaceBidResponse>(
    response,
    "Unable to place your bid. Please try again.",
  );
}
