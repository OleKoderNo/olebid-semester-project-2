import type {
  CreateListingRequest,
  UpdateListingRequest,
} from "../../../types/listing-input";
import { localDateTimeToIso } from "../../../utils/date-time";
import { readListingImages } from "./read-listing-images";

type ListingFormValues = Required<UpdateListingRequest>;

/**
 * Reads the editable fields shared by creation and editing.
 *
 * Trims surrounding whitespace and removes empty or duplicate tags.
 * Tag capitalization and image order are preserved.
 *
 * Empty descriptions and arrays are included so users can clear
 * existing descriptions, tags, or images when saving an edit.
 *
 * Call after local validation and image checks succeed.
 *
 * @param form - The rendered listing form.
 * @returns Editable listing values ready for an API request.
 * @throws If required controls are missing or image fields are incomplete.
 */
export function readListingEditForm(form: HTMLFormElement): ListingFormValues {
  const title = form.querySelector<HTMLInputElement>('[name="title"]');
  const description = form.querySelector<HTMLTextAreaElement>(
    '[name="description"]',
  );
  const tags = form.querySelector<HTMLInputElement>('[name="tags"]');

  if (!title || !description || !tags) {
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
    media: readListingImages(form),
  };
}

/**
 * Reads a validated creation form and includes its auction deadline.
 *
 * Converts the creator's device-local deadline to a UTC ISO timestamp
 * representing the same instant.
 *
 * @param form - The rendered listing creation form.
 * @returns Listing data ready for the creation API.
 * @throws If controls are missing or the deadline is invalid.
 */
export function readListingForm(form: HTMLFormElement): CreateListingRequest {
  const deadline = form.querySelector<HTMLInputElement>('[name="endsAt"]');

  if (!deadline) {
    throw new Error("Listing creation form is missing its deadline.");
  }

  return {
    ...readListingEditForm(form),
    endsAt: localDateTimeToIso(deadline.value),
  };
}
