import type { CreateListingRequest } from "../../../types/listing-input";
import type { ListingMedia } from "../../../types/listing";
import { localDateTimeToIso } from "../../../utils/date-time";

/**
 * Reads image URLs and descriptions in their displayed order.
 *
 * Completely empty image fields are omitted. The first included image
 * becomes the listing's cover image.
 *
 * @param form - Listing form containing the image fields.
 * @returns Images prepared for the API.
 * @throws If an image field is incomplete or its controls are missing.
 */
function readImages(form: HTMLFormElement): ListingMedia[] {
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

/**
 * Reads validated listing fields and prepares a creation request.
 *
 * Trims surrounding whitespace, splits comma-separated tags, removes
 * empty and duplicate tags, and preserves the displayed image order.
 * Tag spelling and capitalization are preserved.
 *
 * The deadline is entered in the creator's device-local time and
 * converted to a UTC ISO timestamp representing the same instant.
 *
 * Call after local validation and asynchronous image checks succeed.
 * This function does not send a request or change the form.
 *
 * @param form - The rendered listing creation form.
 * @returns Listing data ready to send to the API.
 * @throws If required controls are missing or the deadline is invalid.
 */
export function readListingForm(form: HTMLFormElement): CreateListingRequest {
  const title = form.querySelector<HTMLInputElement>('[name="title"]');
  const description = form.querySelector<HTMLTextAreaElement>(
    '[name="description"]',
  );
  const tags = form.querySelector<HTMLInputElement>('[name="tags"]');
  const deadline = form.querySelector<HTMLInputElement>('[name="endsAt"]');

  if (!title || !description || !tags || !deadline) {
    throw new Error("Listing form is missing required controls.");
  }

  const tagValues = tags.value
    .split(",")
    .map((tag) => tag.trim())
    .filter((tag) => tag.length > 0);

  return {
    title: title.value.trim(),
    description: description.value.trim(),
    tags: [...new Set(tagValues)],
    endsAt: localDateTimeToIso(deadline.value),
    media: readImages(form),
  };
}
