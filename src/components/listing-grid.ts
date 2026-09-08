import type { ListingFilters, ListingsResponse } from "../types/listing";
import { initImageFallbacks } from "../utils/image-fallback";
import { createListingCard } from "./listing-card";

/**
 * Renders auction cards and initialises their image fallbacks.
 *
 * @param container - List element receiving the cards.
 * @param listings - Auctions to display.
 */
export function renderListingGrid(
  container: HTMLUListElement,
  listings: ListingsResponse["data"],
): void {
  container.innerHTML = listings
    .map(
      (listing) => `
        <li class="min-w-0">
          ${createListingCard(listing)}
        </li>
      `,
    )
    .join("");

  initImageFallbacks(container);
}

/**
 * Describes the displayed results and applied filters.
 *
 * @param response - Listings and pagination information.
 * @param query - Submitted search text.
 * @param filters - Applied status and tag filters.
 * @returns Plain text suitable for the status element.
 */
export function getListingStatus(
  { data, meta }: ListingsResponse,
  query: string,
  filters: ListingFilters = { status: "active", tag: "" },
): string {
  const auctionType =
    filters.status === "active" ? "active auctions" : "auctions";

  const searchContext = query ? ` matching "${query}"` : "";
  const tagContext = filters.tag ? ` tagged "${filters.tag}"` : "";
  const context = `${searchContext}${tagContext}`;

  if (data.length === 0) {
    return `No ${auctionType}${context} found on this page. Try changing your search or filters.`;
  }

  return (
    `Page ${meta.currentPage} of ${meta.pageCount}. ` +
    `Showing ${data.length} of ${meta.totalCount} ${auctionType}${context}.`
  );
}
