/** An image attached to an auction listing. */
export interface ListingMedia {
  url: string;
  alt: string;
}

/** Bid information used to display prices and bid history. */
export interface ListingBid {
  id: string;
  amount: number;
  bidder: {
    name: string;
  };
  created: string;
}

/** An auction listing, optionally including its bids. */
export interface Listing {
  id: string;
  title: string;
  description: string | null;
  tags: string[];
  media: ListingMedia[];
  created: string;
  updated: string;
  endsAt: string;
  bids?: ListingBid[];
  _count: {
    bids: number;
  };
}

/** Pagination information returned with a collection. */
export interface PaginationMeta {
  isFirstPage: boolean;
  isLastPage: boolean;
  currentPage: number;
  previousPage: number | null;
  nextPage: number | null;
  pageCount: number;
  totalCount: number;
}

/** The response returned when requesting auction listings. */
export interface ListingsResponse {
  data: Listing[];
  meta: PaginationMeta;
}

/** Available sorting choices for auction listings. */
export type ListingSort = "newest" | "oldest" | "ending-soon";

/** Available auction-status filters. */
export type ListingStatus = "active" | "all";

/** Filters applied to an auction request. */
export interface ListingFilters {
  status: ListingStatus;
  tag: string;
}

/** Seller information displayed on an auction page. */
export interface ListingSeller {
  name: string;
  bio: string | null;
  avatar: ListingMedia | null;
}

/** An auction requested with seller information and bids. */
export interface ListingDetails extends Listing {
  seller?: ListingSeller | null;
}

/** The response returned when requesting one auction. */
export interface ListingDetailsResponse {
  data: ListingDetails;
}
