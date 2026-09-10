import { getListingById, getProfileBids } from "../api";
import type { ListingDetails, PaginationMeta } from "../types/listing";

export interface ProfileBidListings {
  listings: ListingDetails[];
  meta: PaginationMeta;
  unavailableBidCount: number;
}

/**
 * Loads current auction details for one page of profile bids.
 * Retrieves each associated listing only once within the page.
 *
 * @param name - Username whose bidding activity should be loaded.
 * @param page - Bid results page, starting at 1.
 * @returns Auction details and the original bid pagination.
 * @throws If the bids or an associated auction cannot be loaded.
 */
export async function loadProfileBidListings(
  name: string,
  page = 1,
): Promise<ProfileBidListings> {
  const response = await getProfileBids(name, page);

  const listingIds = new Set<string>();
  let unavailableBidCount = 0;

  response.data.forEach((bid) => {
    const listingId = bid.listing?.id;

    if (!listingId) {
      unavailableBidCount += 1;
      return;
    }

    listingIds.add(listingId);
  });

  const listingResponses = await Promise.all(
    Array.from(listingIds, (id) => getListingById(id)),
  );

  return {
    listings: listingResponses.map((result) => result.data),
    meta: response.meta,
    unavailableBidCount,
  };
}
