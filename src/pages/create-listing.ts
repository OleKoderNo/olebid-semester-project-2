import { requireAuth } from "../auth/require-auth";
import {
  createListingForm,
  initListingDetailsValidation,
  initListingFormSubmit,
  initListingImages,
  initListingImageValidation,
} from "../components/listings/form";
import { initUnsavedChanges } from "../components/shared";

/**
 * Initializes the protected listing creation page.
 *
 * Connects image controls, validation, submission, and warnings about
 * leaving with unsaved changes.
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
  content.innerHTML = createListingForm();

  const form = content.querySelector<HTMLFormElement>("[data-listing-form]");
  const images = content.querySelector<HTMLElement>("[data-listing-images]");

  if (!form || !images) {
    throw new Error("Create listing page is missing required form elements.");
  }

  initListingImages(images);

  const updateValidity = initListingDetailsValidation(form);
  const validateImages = initListingImageValidation(form);

  const unsavedChanges = initUnsavedChanges(
    form,
    "You haven’t created your listing yet. Discard your changes and leave?",
  );

  initListingFormSubmit(form, {
    updateValidity,
    validateImages,
    onCreated: () => {
      unsavedChanges.destroy();
    },
  });

  /**
   * Reloads the page so authentication is checked again.
   *
   * Clears the old form and its warning before reloading.
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
