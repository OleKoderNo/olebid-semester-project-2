import type { Listing } from "../../../types/listing";
import { escapeHtml } from "../../../utils/escape-html";
import { createListingFormDeadline } from "./listing-form-deadline";

/**
 * Creates the shared auction creation or editing form.
 *
 * Without a listing, renders an empty creation form.
 * With a listing, prefills text fields, displays its fixed deadline,
 * and links Cancel back to that auction.
 *
 * API-supplied text is escaped before insertion into the markup.
 * Image controls and their initial values are connected separately.
 *
 * @param listing - Existing listing when editing; omit when creating.
 * @returns Listing form markup.
 */
export function createListingForm(listing?: Listing): string {
  const isEditing = listing !== undefined;

  const inputClasses =
    "mt-2 block min-h-12 w-full rounded-lg border border-muted bg-surface px-4 py-3 text-ink focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-ink";

  const title = escapeHtml(listing?.title ?? "");
  const description = escapeHtml(listing?.description ?? "");
  const tags = escapeHtml(listing?.tags.join(", ") ?? "");

  const cancelUrl = listing
    ? `/listing/?id=${encodeURIComponent(listing.id)}`
    : "/profile/";

  return `
    <form data-listing-form class="space-y-6">
      <p class="text-sm leading-6 text-muted">
        ${
          isEditing
            ? "Title is required."
            : "Title and auction deadline are required."
        }
      </p>

      <label class="block">
        <span class="text-base font-medium">
          Title (required)
        </span>

        <input
          name="title"
          type="text"
          value="${title}"
          required
          class="${inputClasses}"
        />
      </label>

      <label class="block">
        <span class="text-base font-medium">
          Description
        </span>

        <textarea
          name="description"
          rows="5"
          class="${inputClasses} min-h-36 resize-y"
        >${description}</textarea>
      </label>

      <label class="block">
        <span class="text-base font-medium">
          Tags
        </span>

        <input
          name="tags"
          type="text"
          value="${tags}"
          aria-describedby="listing-tags-hint"
          class="${inputClasses}"
        />
      </label>

      <p
        id="listing-tags-hint"
        class="text-sm leading-6 text-muted"
      >
        Separate tags with commas, for example: photography, cameras.
      </p>

      ${createListingFormDeadline(inputClasses, listing?.endsAt)}

      <div data-listing-images></div>

      <p
        data-listing-error
        role="alert"
        class="text-sm leading-6 text-error"
      ></p>

      <p
        data-listing-status
        role="status"
        class="text-sm leading-6 text-muted"
      ></p>

      <div class="flex flex-col gap-3 sm:flex-row">
        <button
          data-listing-submit
          type="submit"
          class="min-h-12 rounded-lg bg-burgundy px-6 py-3 font-medium text-surface hover:bg-burgundy-hover disabled:cursor-wait disabled:opacity-60"
        >
          ${isEditing ? "Save changes" : "Create listing"}
        </button>

        <a
          href="${escapeHtml(cancelUrl)}"
          class="inline-flex min-h-12 items-center justify-center rounded-lg border border-burgundy px-6 py-3 font-medium text-burgundy hover:bg-burgundy-soft"
        >
          Cancel
        </a>
      </div>
    </form>
  `;
}
