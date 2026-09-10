import type { ListingBid, PaginationMeta } from "./listing";

/**
 * A bid made by a profile, optionally including its associated listing.
 * Only the listing ID is needed to retrieve current auction details.
 */
export interface ProfileBid extends ListingBid {
  listing?: {
    id: string;
  } | null;
}

/** Paginated response containing a profile's bid records. */
export interface ProfileBidsResponse {
  data: ProfileBid[];
  meta: PaginationMeta;
}
