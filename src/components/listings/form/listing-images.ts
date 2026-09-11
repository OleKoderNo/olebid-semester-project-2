import type { ListingMedia } from "../../../types/listing";
import { createListingImageField } from "./listing-image-field";
import { initListingImagePreview } from "./listing-image-preview";

/**
 * Initializes repeatable image fields for a listing form.
 *
 * Existing images are inserted in their original order without moving
 * focus or announcing changes. Initialize the unsaved-change guard
 * after this function so prefilled images become part of its baseline.
 *
 * Call once after the image-controls container is rendered.
 *
 * @param container - The form's image-controls container.
 * @param media - Existing listing images; omit when creating a listing.
 */
export function initListingImages(
  container: HTMLElement,
  media: ListingMedia[] = [],
): void {
  container.innerHTML = `
    <section>
      <h2 class="font-heading text-2xl font-semibold">Images</h2>

      <p class="mt-2 text-sm leading-6 text-muted">
        Images are optional. The first image will be the listing’s cover.
      </p>

      <div data-image-fields class="mt-4 space-y-6"></div>

      <button
        data-add-image
        type="button"
        class="mt-4 min-h-12 rounded-lg border border-burgundy px-6 py-3 font-medium text-burgundy hover:bg-burgundy-soft"
      >
        Add image
      </button>

      <p
        data-image-status
        role="status"
        class="mt-3 text-sm leading-6 text-muted"
      ></p>
    </section>
  `;

  const fields = container.querySelector<HTMLElement>("[data-image-fields]");
  const addButton =
    container.querySelector<HTMLButtonElement>("[data-add-image]");
  const status = container.querySelector<HTMLParagraphElement>(
    "[data-image-status]",
  );

  if (!fields || !addButton || !status) {
    throw new Error("Listing image controls are missing required elements.");
  }

  const elements = { fields, addButton, status };
  let nextId = 1;

  /**
   * Notifies form listeners when users add or remove image fields.
   */
  function notifyChange(): void {
    container.dispatchEvent(new Event("input", { bubbles: true }));
  }

  /**
   * Appends an image field and connects its preview and removal button.
   *
   * Only user-initiated additions move focus and announce a change.
   */
  function appendImage(image?: ListingMedia, userInitiated = false): void {
    const id = nextId++;

    elements.fields.insertAdjacentHTML(
      "beforeend",
      createListingImageField(id, image),
    );

    const field = elements.fields.lastElementChild;

    if (!(field instanceof HTMLElement)) {
      throw new Error("Unable to render the listing image field.");
    }

    initListingImagePreview(field);

    const urlInput = field.querySelector<HTMLInputElement>("[data-image-url]");
    const removeButton = field.querySelector<HTMLButtonElement>(
      "[data-remove-image]",
    );

    if (!urlInput || !removeButton) {
      throw new Error("Listing image field is missing required controls.");
    }

    removeButton.addEventListener("click", () => {
      field.remove();
      elements.addButton.focus();
      elements.status.textContent = `Image ${id} removed.`;
      notifyChange();
    });

    if (image) {
      // Start the prefilled preview using its existing change listener.
      // This event stays on the input and does not bubble to the form.
      urlInput.dispatchEvent(new Event("change"));
    }

    if (userInitiated) {
      urlInput.focus();
      elements.status.textContent = `Image ${id} added.`;
      notifyChange();
    }
  }

  media.forEach((image) => {
    appendImage(image);
  });

  elements.addButton.addEventListener("click", () => {
    appendImage(undefined, true);
  });
}
