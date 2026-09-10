import type { ListingMedia } from "../../types/listing";
import { escapeHtml } from "../../utils/escape-html";

/**
 * Keeps images with valid HTTP or HTTPS URLs.
 *
 * @param media - Images supplied by the API.
 * @returns Images with accepted URLs.
 */
function getValidImages(media: ListingMedia[]): ListingMedia[] {
  return media.flatMap((image) => {
    try {
      const url = new URL(image.url);

      if (!["https:", "http:"].includes(url.protocol)) {
        return [];
      }

      return [{ ...image, url: url.href }];
    } catch {
      return [];
    }
  });
}

/**
 * Creates the gallery frame and thumbnail buttons.
 *
 * @param images - Images with accepted URLs.
 * @returns Gallery markup.
 */
function createGalleryMarkup(images: ListingMedia[]): string {
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

/**
 * Renders an image gallery with keyboard-accessible thumbnail buttons.
 * Call once per container, or again when displaying another listing.
 *
 * @param container - Element receiving the gallery.
 * @param media - Listing images.
 * @param title - Listing title used when image descriptions are missing.
 */
export function initListingGallery(
  container: HTMLElement,
  media: ListingMedia[],
  title: string,
): void {
  const images = getValidImages(media);

  container.innerHTML = createGalleryMarkup(images);

  const mainImage =
    container.querySelector<HTMLDivElement>("[data-main-image]");

  if (!mainImage) {
    throw new Error("Gallery template is missing its image container.");
  }

  const imageContainer = mainImage;

  const buttons =
    container.querySelectorAll<HTMLButtonElement>("[data-image-index]");

  /**
   * Displays the selected image and updates thumbnail selection.
   */
  function showImage(index: number): void {
    const mediaItem = images[index];

    if (!mediaItem) {
      imageContainer.innerHTML = `
        <p class="p-6 text-center text-muted">No photos available.</p>
      `;
      return;
    }

    const message = document.createElement("p");
    message.className = "p-6 text-center text-muted";
    message.setAttribute("role", "status");
    message.textContent = "Loading photo…";

    const image = document.createElement("img");
    image.alt =
      mediaItem.alt?.trim() ||
      `${title} — photo ${index + 1} of ${images.length}`;
    image.className = "h-full w-full object-contain";
    image.decoding = "async";
    image.hidden = true;

    image.addEventListener(
      "load",
      () => {
        message.remove();
        image.hidden = false;
      },
      { once: true },
    );

    image.addEventListener(
      "error",
      () => {
        image.remove();
        message.textContent = "This photo could not be loaded.";
      },
      { once: true },
    );

    imageContainer.replaceChildren(message, image);
    image.src = mediaItem.url;

    buttons.forEach((button) => {
      const selected = Number(button.dataset.imageIndex) === index;
      button.setAttribute("aria-pressed", String(selected));
    });
  }

  buttons.forEach((button) => {
    button.addEventListener("click", () => {
      showImage(Number(button.dataset.imageIndex));
    });
  });

  container
    .querySelectorAll<HTMLImageElement>("[data-thumbnail]")
    .forEach((image) => {
      const hideBrokenThumbnail = (): void => {
        image.hidden = true;
      };

      image.addEventListener("error", hideBrokenThumbnail, { once: true });

      if (image.complete && image.naturalWidth === 0) {
        hideBrokenThumbnail();
      }
    });

  showImage(0);
}
