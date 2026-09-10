import type { ListingBid } from "../../types/listing";
import { createDesktopBid, createMobileBid } from "./bid-history-entry";

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
