import type { Listing } from "../../types/listing";
import { escapeHtml } from "../../utils/escape-html";

const creditFormatter = new Intl.NumberFormat("en-US");

const dateFormatter = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  year: "numeric",
  hour: "numeric",
  minute: "2-digit",
  timeZoneName: "short",
});

/**
 * Checks whether an image URL uses HTTP or HTTPS.
 *
 * @param value - Image URL supplied by the API.
 * @returns An accepted URL, or an empty string.
 */
function getImageUrl(value: string): string {
  try {
    const url = new URL(value);

    return ["https:", "http:"].includes(url.protocol) ? url.href : "";
  } catch {
    return "";
  }
}

/**
 * Creates HTML for an auction card, escaping user-provided content.
 *
 * @param listing - The auction to display, including its bids.
 * @returns Card markup ready to insert into a list item.
 */
export function createListingCard(listing: Listing): string {
  const listingTitle = listing.title.trim() || "Untitled auction";
  const title = escapeHtml(listingTitle);
  const tag = escapeHtml(listing.tags[0] || "General");

  const media = listing.media[0];
  const imageUrl = getImageUrl(media?.url || "");
  const imageAlt = escapeHtml(media?.alt?.trim() || listingTitle);

  let price = "View auction for price";

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
  let deadline = "End date unavailable";

  if (!Number.isNaN(endsAt.getTime())) {
    const label = endsAt.getTime() <= Date.now() ? "Ended" : "Ends";

    deadline = `
      ${label}
      <time datetime="${endsAt.toISOString()}">
        ${escapeHtml(dateFormatter.format(endsAt))}
      </time>
    `;
  }

  const href = escapeHtml(`/listing/?id=${encodeURIComponent(listing.id)}`);

  return `
    <article class="flex h-full min-w-0 flex-col rounded-xl bg-surface">
      <div class="relative aspect-8/5 overflow-hidden rounded-t-xl bg-disabled">
        <span
          data-image-fallback
          class="absolute inset-0 flex items-center justify-center p-4 text-sm text-muted"
        >
          No image available
        </span>

        ${
          imageUrl
            ? `
              <img
                data-listing-image
                src="${escapeHtml(imageUrl)}"
                alt="${imageAlt}"
                loading="lazy"
                decoding="async"
                class="relative h-full w-full bg-disabled object-cover"
              >
            `
            : ""
        }
      </div>

      <div class="flex flex-1 flex-col items-start gap-3 p-6">
        <p class="text-sm leading-6 text-muted">${tag}</p>

        <h3 class="font-heading text-2xl leading-8 font-semibold wrap-anywhere">
          ${title}
        </h3>

        <div>
          <p class="text-sm leading-6 text-muted">
            ${listing._count.bids === 0 ? "Bidding" : "Current bid"}
          </p>

          <p class="mt-1 text-xl leading-7 font-bold">${price}</p>
        </div>

        <p class="text-sm leading-6 text-muted">${deadline}</p>

        <a
          href="${href}"
          aria-label="View auction: ${title}"
          class="mt-auto inline-flex min-h-12 items-center justify-center rounded-lg border border-burgundy px-6 py-3 font-medium text-burgundy hover:bg-burgundy-soft"
        >
          View auction
        </a>
      </div>
    </article>
  `;
}
