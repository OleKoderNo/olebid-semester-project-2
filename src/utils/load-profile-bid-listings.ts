import { getListingById, getProfileBids } from "../api";
import type { ListingDetails, PaginationMeta } from "../types/listing";

export interface ProfileBidListings {
  listings: ListingDetails[];
  meta: PaginationMeta;
  unavailableBidCount: number;
}

interface BidListingIndex {
  listingIds: string[];
  unavailableBidCount: number;
}

/**
 * Collects unique listing IDs from all pages of profile bids.
 * Preserves the order of each auction's most recent bid.
 *
 * @param name - Username whose bids should be retrieved.
 * @returns Unique listing IDs and the number of unassociated bids.
 */
async function getBidListingIndex(name: string): Promise<BidListingIndex> {
  const listingIds = new Set<string>();
  let unavailableBidCount = 0;
  let page = 1;

  while (true) {
    const response = await getProfileBids(name, page);

    response.data.forEach((bid) => {
      const listingId = bid.listing?.id;

      if (listingId) {
        listingIds.add(listingId);
      } else {
        unavailableBidCount += 1;
      }
    });

    if (response.meta.isLastPage) {
      break;
    }

    const nextPage = response.meta.nextPage;

    if (nextPage === null || nextPage <= page) {
      throw new Error("Unable to read the next page of bidding activity.");
    }

    page = nextPage;
  }

  return {
    listingIds: Array.from(listingIds),
    unavailableBidCount,
  };
}

/**
 * Creates a loader that paginates unique auctions for one profile.
 * Shares the collected auction IDs between page requests.
 *
 * @param name - Username whose bidding activity should be loaded.
 * @returns A function that loads one page of unique auctions.
 */
export function createProfileBidListingsLoader(
  name: string,
): (page?: number) => Promise<ProfileBidListings> {
  const pageSize = 6;
  let indexPromise: Promise<BidListingIndex> | undefined;

  return async (page = 1): Promise<ProfileBidListings> => {
    if (!Number.isInteger(page) || page < 1) {
      throw new Error("The page number must be a positive integer.");
    }

    if (!indexPromise) {
      indexPromise = getBidListingIndex(name).catch((error: unknown) => {
        // Allow retrying if collecting the bid records failed.
        indexPromise = undefined;
        throw error;
      });
    }

    const index = await indexPromise;
    const totalCount = index.listingIds.length;
    const pageCount = Math.ceil(totalCount / pageSize);

    if (page > Math.max(1, pageCount)) {
      throw new Error("This bidding activity page does not exist.");
    }

    const start = (page - 1) * pageSize;
    const pageIds = index.listingIds.slice(start, start + pageSize);

    const responses = await Promise.all(
      pageIds.map((id) => getListingById(id)),
    );

    return {
      listings: responses.map((response) => response.data),
      unavailableBidCount: index.unavailableBidCount,
      meta: {
        currentPage: page,
        pageCount,
        totalCount,
        isFirstPage: page === 1,
        isLastPage: page >= pageCount,
        previousPage: page > 1 ? page - 1 : null,
        nextPage: page < pageCount ? page + 1 : null,
      },
    };
  };
}
