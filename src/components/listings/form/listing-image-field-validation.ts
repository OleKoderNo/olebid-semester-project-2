import { canLoadImage } from "../../../utils/can-load-image";

interface ImageCheck {
  url: string;
  result: Promise<boolean>;
}

/**
 * Finds the description input associated with an image URL.
 */
function getDescriptionInput(input: HTMLInputElement): HTMLInputElement | null {
  return (
    input
      .closest("[data-listing-image-field]")
      ?.querySelector<HTMLInputElement>("[data-image-alt]") ?? null
  );
}

/**
 * Requires an image URL when a description has been entered.
 *
 * Updates only the description, preserving any image-loading error.
 */
export function validateImageDescription(input: HTMLInputElement): void {
  const description = getDescriptionInput(input);

  description?.setCustomValidity(
    description.value.trim() && !input.value.trim()
      ? "Add an image URL or clear its description."
      : "",
  );
}

/**
 * Validates an optional image URL and its description.
 *
 * Nonempty URLs must use HTTP or HTTPS.
 */
function validateImageFields(input: HTMLInputElement): void {
  const value = input.value.trim();

  input.setCustomValidity("");
  validateImageDescription(input);

  if (!value) {
    return;
  }

  try {
    const url = new URL(value);

    if (url.protocol !== "https:" && url.protocol !== "http:") {
      input.setCustomValidity(
        "Enter an image URL starting with https:// or http://.",
      );
    }
  } catch {
    input.setCustomValidity("Enter a complete, valid image URL.");
  }
}

/**
 * Creates image-loading validation scoped to one form.
 *
 * Concurrent checks for the same field and URL share a promise.
 * Failed checks can be retried on the next validation attempt.
 *
 * @param form - Form containing the image fields.
 * @returns Methods for checking images and invalidating changed URLs.
 */
export function createListingImageValidator(form: HTMLFormElement) {
  const checks = new WeakMap<HTMLInputElement, ImageCheck>();

  /**
   * Discards a previous check when the URL changes.
   */
  function invalidate(input: HTMLInputElement): void {
    checks.delete(input);
    validateImageFields(input);
  }

  /**
   * Checks whether the current URL loads as an image.
   *
   * Ignores results for removed fields, changed URLs, detached forms,
   * or checks replaced by a newer request.
   */
  async function check(input: HTMLInputElement): Promise<void> {
    validateImageFields(input);

    const url = input.value.trim();

    if (!url || !input.validity.valid) {
      return;
    }

    let imageCheck = checks.get(input);

    if (!imageCheck || imageCheck.url !== url) {
      imageCheck = {
        url,
        result: canLoadImage(url),
      };

      checks.set(input, imageCheck);
    }

    const loaded = await imageCheck.result;

    if (
      !form.isConnected ||
      !form.contains(input) ||
      checks.get(input) !== imageCheck ||
      input.value.trim() !== url
    ) {
      return;
    }

    validateImageFields(input);

    if (!loaded && input.validity.valid) {
      input.setCustomValidity(
        "This URL could not be loaded as an image. Check the link and try again.",
      );

      checks.delete(input);
    }
  }

  return { check, invalidate };
}

/**
 * Reports whether an image URL and its description are currently valid.
 *
 * Reads validity without displaying browser feedback.
 */
export function isImageFieldValid(input: HTMLInputElement): boolean {
  const description = getDescriptionInput(input);

  return input.validity.valid && (description?.validity.valid ?? true);
}
