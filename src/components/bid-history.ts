import type { ListingBid } from "../types/listing";
import { escapeHtml } from "../utils/escape-html";

const creditFormatter = new Intl.NumberFormat("en-US");

const dateFormatter = new Intl.DateTimeFormat("en-US", {
  timeZone: "Europe/Oslo",
  month: "short",
  day: "numeric",
  year: "numeric",
  hour: "numeric",
  minute: "2-digit",
  timeZoneName: "short",
});

/**
 * Formats a bid timestamp as an HTML time element.
 *
 * @param value - Timestamp supplied by the API.
 * @returns Formatted time markup or an unavailable message.
 */
function createBidDate(value: string): string {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Date unavailable";
  }

  return `
    <time datetime="${date.toISOString()}">
      ${escapeHtml(dateFormatter.format(date))}
    </time>
  `;
}

/**
 * Creates one row of bid history.
 *
 * @param bid - Bid to display.
 * @returns Table row with escaped bidder information.
 */
function createBidRow(bid: ListingBid): string {
  const bidder = escapeHtml(bid.bidder?.name || "Unavailable");

  return `
    <tr class="border-t border-disabled">
      <th
        scope="row"
        class="px-6 py-4 text-left font-normal wrap-anywhere"
      >
        ${bidder}
      </th>

      <td class="px-6 py-4 font-semibold">
        ${creditFormatter.format(bid.amount)} credits
      </td>

      <td class="px-6 py-4 text-muted">
        ${createBidDate(bid.created)}
      </td>
    </tr>
  `;
}

/**
 * Creates bid history ordered from newest to oldest.
 * The original bids array is left unchanged.
 *
 * @param bids - Bids returned by the API, if included.
 * @param bidCount - Total bid count reported by the API.
 * @returns Bid-history markup or an explanatory message.
 */
export function createBidHistory(
  bids: ListingBid[] | undefined,
  bidCount: number,
): string {
  if (bidCount === 0) {
    return `
      <section class="mt-10">
        <h2 class="font-heading text-[1.75rem] leading-9 font-semibold">
          Bid history
        </h2>

        <p class="mt-4 rounded-xl bg-surface p-6 text-lg leading-7 text-muted">
          No bids have been placed yet.
        </p>
      </section>
    `;
  }

  if (!bids?.length) {
    return `
      <section class="mt-10">
        <h2 class="font-heading text-[1.75rem] leading-9 font-semibold">
          Bid history
        </h2>

        <p class="mt-4 rounded-xl bg-surface p-6 text-lg leading-7 text-muted">
          Bid history is currently unavailable. Please reload the page.
        </p>
      </section>
    `;
  }

  const sortedBids = [...bids].sort((first, second) => {
    const firstDate = Date.parse(first.created) || 0;
    const secondDate = Date.parse(second.created) || 0;

    return secondDate - firstDate;
  });

  return `
    <section class="mt-10">
      <h2 class="font-heading text-[1.75rem] leading-9 font-semibold">
        Bid history
      </h2>

      <p class="mt-2 text-sm leading-6 text-muted">
        Newest bids first. Times are shown in Norwegian time.
        On smaller screens, scroll the table horizontally.
      </p>

      <div
        role="region"
        aria-label="Bid history table"
        tabindex="0"
        class="mt-4 overflow-x-auto rounded-xl bg-surface focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-ink"
      >
        <table class="w-full min-w-160 text-left text-base leading-6">
          <caption class="sr-only">
            Auction bids, ordered from newest to oldest
          </caption>

          <thead>
            <tr>
              <th scope="col" class="px-6 py-4 font-medium">
                Bidder
              </th>
              <th scope="col" class="px-6 py-4 font-medium">
                Bid amount
              </th>
              <th scope="col" class="px-6 py-4 font-medium">
                Date and time
              </th>
            </tr>
          </thead>

          <tbody>
            ${sortedBids.map(createBidRow).join("")}
          </tbody>
        </table>
      </div>
    </section>
  `;
}
