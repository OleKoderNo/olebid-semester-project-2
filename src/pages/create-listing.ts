import { requireAuth } from "../auth/require-auth";
import {
  createListingForm,
  initListingImages,
  initListingDetailsValidation,
  initListingImageValidation,
} from "../components/listings/form";
import { initUnsavedChanges } from "../components/shared";

/**
 * Initializes the protected listing creation page.
 * Connects image controls and unsaved-change warnings.
 */
export function initCreateListingPage(): void {
  if (!requireAuth()) {
    return;
  }

  const container = document.querySelector<HTMLDivElement>(
    "#listing-create-content",
  );

  if (!container) {
    throw new Error("Create listing page is missing its content container.");
  }

  const content = container;

  container.innerHTML = createListingForm();

  const form = container.querySelector<HTMLFormElement>("[data-listing-form]");
  const images = container.querySelector<HTMLElement>("[data-listing-images]");
  const submitButton = container.querySelector<HTMLButtonElement>(
    "[data-listing-submit]",
  );

  if (!form || !images || !submitButton) {
    throw new Error("Create listing form is missing required elements.");
  }

  initListingImages(images);
  initListingDetailsValidation(form);
  initListingImageValidation(form);

  const unsavedChanges = initUnsavedChanges(
    form,
    "You haven't created your listing yet. Discard your changes and leave?",
  );

  // Submission will be enabled after validation and saving are connected.
  submitButton.disabled = true;
  submitButton.classList.remove("disabled:cursor-wait");

  form.addEventListener("submit", (event) => {
    event.preventDefault();
  });

  /**
   * Removes the form when its session needs to be rechecked.
   */
  function reloadPage(): void {
    unsavedChanges.destroy();
    content.replaceChildren();
    window.location.reload();
  }

  window.addEventListener("pageshow", (event) => {
    if (event.persisted) {
      reloadPage();
    }
  });

  window.addEventListener("storage", (event) => {
    if (event.key === "olebid.session" || event.key === null) {
      reloadPage();
    }
  });
}
