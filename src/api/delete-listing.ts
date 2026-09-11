import { authenticatedRequest } from "./authenticated-request";
import { getJson } from "./client";

/**
 * Deletes a listing through the authenticated API.
 *
 * Successful deletion returns an empty response, so JSON is parsed
 * only when the request fails, to retrieve the API's error message.
 *
 * The calling interface must obtain explicit confirmation first.
 * The API verifies whether the signed-in user may delete the listing.
 *
 * @param id - ID of the listing to delete.
 * @returns A promise that resolves when deletion succeeds.
 * @throws If the ID is empty, authentication fails, or deletion is rejected.
 */
export async function deleteListing(id: string): Promise<void> {
  const listingId = id.trim();

  if (!listingId) {
    throw new Error("A listing ID is required.");
  }

  const response = await authenticatedRequest(
    `/auction/listings/${encodeURIComponent(listingId)}`,
    {
      method: "DELETE",
    },
  );

  if (!response.ok) {
    await getJson<unknown>(
      response,
      "Unable to delete your listing. Please try again.",
    );
  }
}
