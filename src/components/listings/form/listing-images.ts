import { createListingImageField } from "./listing-image-field";
import { initListingImagePreview } from "./listing-image-preview";

/**
 * Initializes repeatable image fields for a listing form.
 *
 * @param container - The form's image-controls container.
 */
export function initListingImages(container: HTMLElement): void {
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
   * Notifies form listeners when image fields are added or removed.
   */
  function notifyChange(): void {
    container.dispatchEvent(new Event("input", { bubbles: true }));
  }

  elements.addButton.addEventListener("click", () => {
    const id = nextId++;

    elements.fields.insertAdjacentHTML(
      "beforeend",
      createListingImageField(id),
    );

    const field = elements.fields.lastElementChild;

    if (!(field instanceof HTMLElement)) {
      return;
    }

    initListingImagePreview(field);

    const removeButton = field.querySelector<HTMLButtonElement>(
      "[data-remove-image]",
    );

    removeButton?.addEventListener("click", () => {
      field.remove();
      elements.addButton.focus();
      elements.status.textContent = `Image ${id} removed.`;
      notifyChange();
    });

    field.querySelector<HTMLInputElement>("[data-image-url]")?.focus();
    elements.status.textContent = `Image ${id} added.`;
    notifyChange();
  });
}
