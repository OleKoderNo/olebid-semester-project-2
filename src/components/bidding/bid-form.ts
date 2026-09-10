import type { ListingDetails } from "../../types/listing";
import { escapeHtml } from "../../utils/escape-html";

const numberFormatter = new Intl.NumberFormat("en-US");

/**
 * Creates bidding controls for the current auction and user.
 *
 * @param listing - Auction details, including seller and bids.
 * @param username - Signed-in username, or null for a visitor.
 * @returns Bidding form or an explanation of why bidding is unavailable.
 */
export function createBidForm(
  listing: ListingDetails,
  username: string | null,
): string {
  const deadline = Date.parse(listing.endsAt);

  if (!Number.isFinite(deadline)) {
    return createMessage(
      "Bidding is unavailable because the deadline is invalid.",
    );
  }

  if (deadline <= Date.now()) {
    return createMessage("This auction has ended. Bidding is closed.");
  }

  if (!username) {
    return `
      <p class="text-sm leading-6 text-muted">
        Log in to place a bid on this auction.
      </p>

      <a
        href="/login/"
        class="mt-4 inline-flex min-h-12 items-center justify-center rounded-lg bg-burgundy px-6 py-3 font-medium text-surface hover:bg-burgundy-hover"
      >
        Log in to bid
      </a>
    `;
  }

  if (!listing.seller?.name) {
    return createMessage(
      "Bidding is unavailable because seller information is missing.",
    );
  }

  if (listing.seller.name === username) {
    return createMessage("You cannot bid on your own auction.");
  }

  if (!listing.bids && listing._count.bids > 0) {
    return createMessage("Reload the auction to retrieve its current bids.");
  }

  const highestBid = (listing.bids ?? []).reduce(
    (highest, bid) => Math.max(highest, bid.amount),
    0,
  );

  const minimumBid = highestBid + 1;

  if (!Number.isSafeInteger(minimumBid) || minimumBid < 1) {
    return createMessage("Bidding is currently unavailable for this auction.");
  }

  return `
    <form data-bid-form class="space-y-4">
      <label class="block">
        <span class="text-base font-semibold">
          Your bid in credits
        </span>

        <input
          data-bid-amount
          name="amount"
          type="number"
          inputmode="numeric"
          min="${minimumBid}"
          step="1"
          required
          class="mt-2 block min-h-12 w-full rounded-lg border border-muted bg-surface px-4 py-3 text-ink focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-ink"
        />

        <span class="mt-2 block text-sm leading-6 text-muted">
          Minimum bid: ${numberFormatter.format(minimumBid)} credits.
          Enter your total bid amount.
        </span>
      </label>

      <p
        data-bid-error
        role="alert"
        class="text-sm leading-6 text-error"
      ></p>

      <p
        data-bid-status
        role="status"
        class="text-sm leading-6 text-muted"
      ></p>

      <button
        data-bid-submit
        type="submit"
        class="min-h-12 w-full rounded-lg bg-burgundy px-6 py-3 font-medium text-surface hover:bg-burgundy-hover disabled:cursor-wait disabled:opacity-60"
      >
        Place bid
      </button>
    </form>
  `;
}

/**
 * Creates a bidding availability message.
 *
 * @param message - Explanation to display.
 * @returns Escaped message markup.
 */
function createMessage(message: string): string {
  return `
    <p class="text-sm leading-6 text-muted">
      ${escapeHtml(message)}
    </p>
  `;
}
