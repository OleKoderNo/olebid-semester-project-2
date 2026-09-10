import type { ListingBid } from "../../types/listing";
import { escapeHtml } from "../../utils/escape-html";

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
 * Creates a stacked bid entry for smaller screens.
 *
 * @param bid - Bid to display.
 * @returns A list item containing labelled bid information.
 */
function createMobileBid(bid: ListingBid): string {
  const bidder = escapeHtml(bid.bidder?.name || "Unavailable");
  const amount = creditFormatter.format(bid.amount);

  return `
    <li class="p-5">
      <dl class="grid min-w-0 grid-cols-2 gap-4">
        <div class="min-w-0">
          <dt class="text-sm leading-6 text-muted">Bidder</dt>
          <dd class="mt-1 font-medium wrap-anywhere">
            ${bidder}
          </dd>
        </div>

        <div class="min-w-0 text-right">
          <dt class="text-sm leading-6 text-muted">Bid amount</dt>
          <dd class="mt-1 font-bold wrap-anywhere">
            ${amount} credits
          </dd>
        </div>

        <div class="col-span-2 min-w-0">
          <dt class="text-sm leading-6 text-muted">Date and time</dt>
          <dd class="mt-1 text-sm leading-6 wrap-anywhere">
            ${createBidDate(bid.created)}
          </dd>
        </div>
      </dl>
    </li>
  `;
}

/**
 * Creates one row for the desktop bid table.
 *
 * @param bid - Bid to display.
 * @returns Table row with escaped bidder information.
 */
function createDesktopBid(bid: ListingBid): string {
  const bidder = escapeHtml(bid.bidder?.name || "Unavailable");

  return `
    <tr class="border-t border-disabled">
      <th
        scope="row"
        class="px-6 py-4 text-left font-normal wrap-anywhere"
      >
        ${bidder}
      </th>

      <td class="px-6 py-4 font-semibold wrap-anywhere">
        ${creditFormatter.format(bid.amount)} credits
      </td>

      <td class="px-6 py-4 text-muted wrap-anywhere">
        ${createBidDate(bid.created)}
      </td>
    </tr>
  `;
}

/**
 * Creates responsive bid history ordered from newest to oldest.
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
  const heading = `
    <h2 class="font-heading text-[1.75rem] leading-9 font-semibold">
      Bid history
    </h2>
  `;

  if (bidCount === 0 || !bids?.length) {
    const message =
      bidCount === 0
        ? "No bids have been placed yet."
        : "Bid history is currently unavailable. Please reload the page.";

    return `
      <section class="mt-10">
        ${heading}

        <p class="mt-4 rounded-xl bg-surface p-6 text-lg leading-7 text-muted">
          ${message}
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
      ${heading}

      <p class="mt-2 text-sm leading-6 text-muted">
        Newest bids first. Times are shown in Norwegian time.
      </p>

      <ul
        aria-label="Auction bids, newest first"
        class="mt-4 divide-y divide-disabled rounded-xl bg-surface text-base leading-6 md:hidden"
      >
        ${sortedBids.map(createMobileBid).join("")}
      </ul>

      <div class="mt-4 hidden rounded-xl bg-surface md:block">
        <table class="w-full table-fixed text-left text-base leading-6">
          <caption class="sr-only">
            Auction bids, ordered from newest to oldest
          </caption>

          <thead>
            <tr>
              <th scope="col" class="w-1/3 px-6 py-4 font-medium">
                Bidder
              </th>
              <th scope="col" class="w-1/4 px-6 py-4 font-medium">
                Bid amount
              </th>
              <th scope="col" class="px-6 py-4 font-medium">
                Date and time
              </th>
            </tr>
          </thead>

          <tbody>
            ${sortedBids.map(createDesktopBid).join("")}
          </tbody>
        </table>
      </div>
    </section>
  `;
}
