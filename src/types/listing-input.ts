import type { ListingMedia } from "./listing";

/** Information sent when creating an auction listing. */
export interface CreateListingRequest {
  title: string;
  endsAt: string;
  description?: string;
  tags?: string[];
  media?: ListingMedia[];
}

/**
 * Fields supported by the listing update endpoint.
 *
 * Omitted fields retain their existing values.
 * The auction deadline is excluded from the documented update fields.
 */
export interface UpdateListingRequest {
  title?: string;
  description?: string;
  tags?: string[];
  media?: ListingMedia[];
}
