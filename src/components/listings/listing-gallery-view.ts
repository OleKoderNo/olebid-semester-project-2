import type { ListingMedia } from "../../types/listing";
import { escapeHtml } from "../../utils/escape-html";

/**
 * Creates the gallery frame and thumbnail buttons.
 *
 * @param images - Images with accepted URLs.
 * @returns Gallery markup.
 */
export function createGalleryMarkup(images: ListingMedia[]): string {
  return `
    <section aria-label="Auction photos">
      <div
        data-main-image
        class="flex aspect-8/5 items-center justify-center overflow-hidden rounded-xl bg-disabled"
      ></div>

      ${
        images.length > 1
          ? `
            <div class="mt-4 flex flex-wrap gap-3">
              ${images
                .map(
                  (image, index) => `
                    <button
                      data-image-index="${index}"
                      type="button"
                      aria-label="Show photo ${index + 1} of ${images.length}"
                      aria-pressed="false"
                      class="w-24 rounded-lg border-2 border-transparent p-1 text-sm text-ink aria-pressed:border-burgundy"
                    >
                      <img
                        data-thumbnail
                        src="${escapeHtml(image.url)}"
                        alt=""
                        loading="lazy"
                        class="h-14 w-full rounded-sm bg-disabled object-cover"
                      >
                      <span class="mt-1 block">Photo ${index + 1}</span>
                    </button>
                  `,
                )
                .join("")}
            </div>
          `
          : ""
      }
    </section>
  `;
}
