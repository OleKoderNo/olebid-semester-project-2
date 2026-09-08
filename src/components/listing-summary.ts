import type { ListingDetails } from "../types/listing";
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
 * Creates the title, seller information and summary for an auction.
 *
 * @param listing - The auction to display.
 * @returns HTML with escaped user-provided content.
 */
export function createListingSummary(listing: ListingDetails): string {
  const title = escapeHtml(listing.title.trim() || "Untitled auction");
  const seller = escapeHtml(listing.seller?.name || "Unavailable");
  const description = escapeHtml(
    listing.description?.trim() || "No description provided.",
  );

  let price = "Bid information unavailable";

  if (listing._count.bids === 0) {
    price = "No bids yet";
  } else if (listing.bids?.length) {
    const highestBid = listing.bids.reduce(
      (highest, bid) => Math.max(highest, bid.amount),
      0,
    );

    price = `${creditFormatter.format(highestBid)} credits`;
  }

  const endsAt = new Date(listing.endsAt);
  const validDate = !Number.isNaN(endsAt.getTime());
  const ended = validDate && endsAt.getTime() <= Date.now();

  const deadline = validDate
    ? `
      <time datetime="${endsAt.toISOString()}">
        ${escapeHtml(dateFormatter.format(endsAt))}
      </time>
    `
    : "End date unavailable";

  return `
    <h1 class="font-heading text-[2rem] leading-tight font-semibold wrap-anywhere md:text-[2.5rem]">
      ${title}
    </h1>

    <p class="mt-4 text-base leading-6 text-muted wrap-anywhere">
      Listed by ${seller}
    </p>
    
    <div data-listing-gallery class="mt-8 max-w-200"></div>

    <div class="mt-8 grid gap-6 lg:grid-cols-3">
      <section class="min-w-0 rounded-xl bg-surface p-6 lg:col-span-2">
        <h2 class="font-heading text-[1.75rem] leading-9 font-semibold">
          About this item
        </h2>

        <p class="mt-4 text-lg leading-7 whitespace-pre-wrap wrap-anywhere">${description}</p>
      </section>

      <section class="min-w-0 rounded-xl bg-surface p-6">
        <h2 class="font-heading text-2xl leading-8 font-semibold">
          Auction summary
        </h2>

        <dl class="mt-6 space-y-6">
          <div>
            <dt class="text-sm leading-6 text-muted">
              ${ended ? "Highest bid" : "Current bid"}
            </dt>
            <dd class="mt-1 text-xl leading-7 font-bold">
              ${price}
            </dd>
          </div>

          <div>
            <dt class="text-sm leading-6 text-muted">
              ${ended ? "Auction ended" : "Auction ends"}
            </dt>
            <dd class="mt-1 text-base leading-6">
              ${deadline}
            </dd>
          </div>

          <div>
            <dt class="text-sm leading-6 text-muted">Number of bids</dt>
            <dd class="mt-1 text-base leading-6">
              ${creditFormatter.format(listing._count.bids)}
            </dd>
          </div>
        </dl>
      </section>
    </div>
  `;
}
