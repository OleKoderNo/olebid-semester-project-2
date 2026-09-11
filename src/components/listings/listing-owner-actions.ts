import { getSession } from "../../auth/session";
import type { ListingDetails } from "../../types/listing";
import { escapeHtml } from "../../utils/escape-html";

/**
 * Creates management actions for the signed-in listing owner.
 *
 * Returns no markup for visitors, other users, or missing seller data.
 * The API independently authorizes editing and deletion requests.
 *
 * @param listing - Auction details including seller information.
 * @returns Owner-action markup or an empty string.
 */
export function createListingOwnerActions(listing: ListingDetails): string {
  const session = getSession();

  if (!session || listing.seller?.name !== session.name) {
    return "";
  }

  const editUrl = `/listing/edit/?id=${encodeURIComponent(listing.id)}`;

  return `
    <div data-listing-owner-actions class="mt-6">
      <div class="flex flex-wrap gap-3">
        <a
          href="${escapeHtml(editUrl)}"
          class="inline-flex min-h-12 items-center justify-center rounded-lg border border-burgundy px-6 py-3 font-medium text-burgundy hover:bg-burgundy-soft"
        >
          Edit listing
        </a>

        <button
          data-delete-listing
          type="button"
          class="min-h-12 rounded-lg border border-error px-6 py-3 font-medium text-error disabled:cursor-wait disabled:opacity-60"
        >
          Delete listing
        </button>
      </div>

      <p
        data-delete-status
        role="status"
        class="mt-3 text-sm leading-6 text-muted"
      ></p>

      <p
        data-delete-error
        role="alert"
        class="mt-3 text-sm leading-6 text-error"
      ></p>
    </div>
  `;
}
