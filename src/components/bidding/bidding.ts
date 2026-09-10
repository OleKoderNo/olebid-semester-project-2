import { getSession } from "../../auth/session";
import type { ListingDetails } from "../../types/listing";
import { createBidForm } from "./bid-form";
import { initBidSubmit } from "./bid-submit";

/**
 * Renders bidding controls and connects eligible users' submissions.
 *
 * @param container - Auction summary's bidding-controls container.
 * @param listing - Current auction details.
 * @param onPlaced - Refreshes the page after an accepted bid.
 */
export function initBidding(
  container: HTMLElement,
  listing: ListingDetails,
  onPlaced: () => Promise<void>,
): void {
  const session = getSession();

  container.innerHTML = createBidForm(listing, session?.name ?? null);

  const form = container.querySelector<HTMLFormElement>("[data-bid-form]");

  if (form) {
    initBidSubmit(form, listing, onPlaced);
  }
}
