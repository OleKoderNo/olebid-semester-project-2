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
