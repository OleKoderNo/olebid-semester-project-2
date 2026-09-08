import type { ListingsResponse } from "../types/listing";
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
 * Describes the displayed results and current page.
 *
 * @param response - Listings and pagination information.
 * @param query - Submitted search text.
 * @returns Plain text suitable for the page's status element.
 */
export function getListingStatus(
  { data, meta }: ListingsResponse,
  query: string,
): string {
  if (data.length === 0) {
    return query
      ? `No active auctions found for "${query}". Try another search.`
      : "No active auctions are available on this page.";
  }

  const context = query ? ` matching "${query}"` : "";

  return (
    `Page ${meta.currentPage} of ${meta.pageCount}. ` +
    `Showing ${data.length} of ${meta.totalCount} active auctions${context}.`
  );
}
