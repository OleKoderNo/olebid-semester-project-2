import type { ListingMedia } from "../../../types/listing";

/**
 * Reads image URLs and descriptions in their displayed order.
 *
 * Completely empty fields are omitted. Returns an empty array when
 * no images remain, allowing an update to remove existing images.
 *
 * Call after image validation has succeeded.
 *
 * @param form - Listing form containing the image fields.
 * @returns Images prepared for an API request.
 * @throws If image controls are missing or a description has no URL.
 */
export function readListingImages(form: HTMLFormElement): ListingMedia[] {
  const fields = form.querySelectorAll<HTMLElement>(
    "[data-listing-image-field]",
  );

  const images: ListingMedia[] = [];

  fields.forEach((field) => {
    const urlInput = field.querySelector<HTMLInputElement>("[data-image-url]");
    const altInput = field.querySelector<HTMLInputElement>("[data-image-alt]");

    if (!urlInput || !altInput) {
      throw new Error("An image field is missing its controls.");
    }

    const url = urlInput.value.trim();
    const alt = altInput.value.trim();

    if (!url) {
      if (alt) {
        throw new Error("Add an image URL or clear its description.");
      }

      return;
    }

    images.push({ url, alt });
  });

  return images;
}
