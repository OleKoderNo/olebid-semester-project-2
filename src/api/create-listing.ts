import type { Listing } from "../types/listing";
import type { CreateListingRequest } from "../types/listing-input";
import { authenticatedRequest } from "./authenticated-request";
import { getJson } from "./client";

interface CreateListingResponse {
  data: Listing;
}

/**
 * Creates an auction using the current authenticated session.
 *
 * @param listing - Title, deadline and optional listing details.
 * @returns The listing created by the API.
 * @throws If required values are invalid or the API rejects the request.
 */
export async function createListing(
  listing: CreateListingRequest,
): Promise<CreateListingResponse> {
  const title = listing.title.trim();
  const deadline = Date.parse(listing.endsAt);

  if (!title) {
    throw new Error("A listing title is required.");
  }

  if (!Number.isFinite(deadline) || deadline <= Date.now()) {
    throw new Error("Choose an auction deadline in the future.");
  }

  const body: CreateListingRequest = {
    ...listing,
    title,
    endsAt: new Date(deadline).toISOString(),
  };

  const response = await authenticatedRequest("/auction/listings", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  return getJson<CreateListingResponse>(
    response,
    "Unable to create your listing. Please try again.",
  );
}
