import { getSession } from "../../auth/session";
import type { ListingDetails } from "../../types/listing";
import { escapeHtml } from "../../utils/escape-html";

/**
 * Creates management actions for the signed-in listing owner.
 *
 * Returns no markup for visitors, other users, or missing seller data.
 * This controls visibility only; the editing page checks ownership
 * separately, and the API authorizes update requests.
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
    <div class="mt-6 flex flex-wrap gap-3">
      <a
        href="${escapeHtml(editUrl)}"
        class="inline-flex min-h-12 items-center justify-center rounded-lg border border-burgundy px-6 py-3 font-medium text-burgundy hover:bg-burgundy-soft"
      >
        Edit listing
      </a>
    </div>
  `;
}
