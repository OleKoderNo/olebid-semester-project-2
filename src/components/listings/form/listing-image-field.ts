import type { ListingMedia } from "../../../types/listing";
import { escapeHtml } from "../../../utils/escape-html";

/**
 * Creates an image URL field, description field, and preview.
 *
 * Existing image values are escaped before insertion into attributes.
 *
 * @param id - Unique identifier for this image field.
 * @param image - Existing image to prefill when editing.
 * @returns Image-field markup.
 */
export function createListingImageField(
  id: number,
  image?: ListingMedia,
): string {
  const inputClasses =
    "mt-2 block min-h-12 w-full rounded-lg border border-muted bg-surface px-4 py-3 text-ink focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-ink";

  return `
    <fieldset
      data-listing-image-field
      class="min-w-0 rounded-xl border border-disabled p-5"
    >
      <legend class="px-2 font-semibold">
        Image ${id}
      </legend>

      <div class="space-y-4">
        <label class="block">
          <span class="text-sm font-medium">Image URL</span>

          <input
            data-image-url
            name="imageUrl-${id}"
            type="url"
            value="${escapeHtml(image?.url ?? "")}"
            aria-describedby="listing-image-hint-${id}"
            class="${inputClasses}"
          />
        </label>

        <p
          id="listing-image-hint-${id}"
          class="text-sm leading-6 text-muted"
        >
          Use a direct link to a publicly accessible image.
        </p>

        <label class="block">
          <span class="text-sm font-medium">Image description</span>

          <input
            data-image-alt
            name="imageAlt-${id}"
            type="text"
            value="${escapeHtml(image?.alt ?? "")}"
            class="${inputClasses}"
          />
        </label>

        <div
          data-image-preview
          class="flex aspect-8/5 items-center justify-center overflow-hidden rounded-lg bg-disabled"
        >
          <p class="p-4 text-center text-sm text-muted">
            Enter an image URL to preview it.
          </p>
        </div>

        <button
          data-remove-image
          type="button"
          aria-label="Remove image ${id}"
          class="min-h-12 rounded-lg border border-burgundy px-4 py-3 font-medium text-burgundy hover:bg-burgundy-soft"
        >
          Remove image
        </button>
      </div>
    </fieldset>
  `;
}
