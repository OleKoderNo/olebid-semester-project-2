import type { Listing } from "../types/listing";
import type { UpdateListingRequest } from "../types/listing-input";
import { authenticatedRequest } from "./authenticated-request";
import { getJson } from "./client";

interface UpdateListingResponse {
  data: Listing;
}

/**
 * Updates the permitted details of an existing listing.
 *
 * Explicitly builds the request body so creation-only fields such as
 * endsAt cannot accidentally be included when reusing form data.
 * Undefined properties are omitted during JSON serialization.
 *
 * The API verifies whether the signed-in user can update the listing.
 *
 * @param id - ID of the listing to update.
 * @param changes - Supported fields to update.
 * @returns The updated listing response.
 * @throws If the ID is empty, a supplied title is blank,
 * authentication fails, or the API rejects the request.
 */
export async function updateListing(
  id: string,
  changes: UpdateListingRequest,
): Promise<UpdateListingResponse> {
  const listingId = id.trim();

  if (!listingId) {
    throw new Error("A listing ID is required.");
  }

  const title = changes.title?.trim();

  if (title !== undefined && !title) {
    throw new Error("A listing title is required.");
  }

  const body: UpdateListingRequest = {
    title,
    description: changes.description,
    tags: changes.tags,
    media: changes.media,
  };

  const response = await authenticatedRequest(
    `/auction/listings/${encodeURIComponent(listingId)}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    },
  );

  return getJson<UpdateListingResponse>(
    response,
    "Unable to update your listing. Please try again.",
  );
}
