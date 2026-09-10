import {
  createListingImageValidator,
  isImageFieldValid,
  validateImageDescription,
} from "./listing-image-field-validation";

/**
 * Finds the image URL belonging to an input's image field.
 */
function getUrlInput(target: EventTarget | null): HTMLInputElement | null {
  if (!(target instanceof HTMLInputElement)) {
    return null;
  }

  return (
    target
      .closest("[data-listing-image-field]")
      ?.querySelector<HTMLInputElement>("[data-image-url]") ?? null
  );
}

/**
 * Connects listing image validation to the form.
 *
 * Fields are discovered when needed to support adding and removing
 * images. Call once after rendering the form.
 *
 * @param form - The rendered listing form.
 * @returns A function that checks all current image fields before saving.
 */
export function initListingImageValidation(
  form: HTMLFormElement,
): () => Promise<boolean> {
  const validator = createListingImageValidator(form);
  let formVersion = 0;

  form.addEventListener("input", (event) => {
    formVersion += 1;

    const input = getUrlInput(event.target);

    if (!input) {
      return;
    }

    if (event.target === input) {
      validator.invalidate(input);
      return;
    }

    if (
      event.target instanceof HTMLInputElement &&
      event.target.matches("[data-image-alt]")
    ) {
      validateImageDescription(input);
    }
  });

  form.addEventListener("focusout", (event) => {
    const input = getUrlInput(event.target);

    if (!input || event.target !== input) {
      return;
    }

    // Check without moving focus back from the next field.
    void validator.check(input);
  });

  /**
   * Checks all images and rejects results if the form changed while waiting.
   *
   * Adding and removing image fields must dispatch a bubbling input event,
   * as the listing image controls already do.
   */
  return async () => {
    const version = formVersion;
    const inputs = Array.from(
      form.querySelectorAll<HTMLInputElement>("[data-image-url]"),
    );

    await Promise.all(inputs.map(validator.check));

    if (!form.isConnected || formVersion !== version) {
      return false;
    }

    return inputs.every(isImageFieldValid);
  };
}
