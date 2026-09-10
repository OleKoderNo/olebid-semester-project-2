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
export function createMobileBid(bid: ListingBid): string {
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
export function createDesktopBid(bid: ListingBid): string {
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
