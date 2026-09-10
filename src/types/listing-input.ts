import type { ListingMedia } from "./listing";

/** Information sent when creating an auction listing. */
export interface CreateListingRequest {
  title: string;
  endsAt: string;
  description?: string;
  tags?: string[];
  media?: ListingMedia[];
}
