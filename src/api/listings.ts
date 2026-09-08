import type {
  ListingFilters,
  ListingsResponse,
  ListingSort,
} from "../types/listing";
import { API_BASE, getJson } from "./client";

const sorting: Record<
  ListingSort,
  { sort: string; sortOrder: "asc" | "desc" }
> = {
  newest: {
    sort: "created",
    sortOrder: "desc",
  },
  oldest: {
    sort: "created",
    sortOrder: "asc",
  },
  "ending-soon": {
    sort: "endsAt",
    sortOrder: "asc",
  },
};

/**
 * Fetches auctions with search, sorting and filters.
 *
 * @param page - The results page, starting at 1.
 * @param query - Text to search for in titles and descriptions.
 * @param signal - Optional signal for cancelling the request.
 * @param order - Sorting choice for the results.
 * @param filters - Auction status and optional tag.
 * @returns Listings and pagination information.
 * @throws If the page is invalid or the request fails.
 */
export async function getListings(
  page: number = 1,
  query: string = "",
  signal?: AbortSignal,
  order: ListingSort = "newest",
  filters: ListingFilters = { status: "active", tag: "" },
): Promise<ListingsResponse> {
  if (!Number.isInteger(page) || page < 1) {
    throw new Error("The page number must be a positive integer.");
  }

  const search = query.trim();
  const tag = filters.tag.trim();

  const endpoint = search ? "/auction/listings/search" : "/auction/listings";

  const url = new URL(`${API_BASE}${endpoint}`);

  const parameters = new URLSearchParams({
    _bids: "true",
    limit: "6",
    page: String(page),
    ...sorting[order],
  });

  if (filters.status === "active") {
    parameters.set("_active", "true");
  }

  if (tag) {
    parameters.set("_tag", tag);
  }

  if (search) {
    parameters.set("q", search);
  }

  url.search = parameters.toString();

  const response = await fetch(url, { signal });

  return getJson<ListingsResponse>(
    response,
    "Unable to load auctions. Please try again.",
  );
}
