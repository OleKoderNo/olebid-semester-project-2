import type { Listing } from "../../../types/listing";
import { initUnsavedChanges } from "../../shared";
import { initListingDetailsValidation } from "./listing-details-validation";
import { initListingEditSubmit } from "./listing-edit-submit";
import { createListingForm } from "./listing-form";
import { initListingImages } from "./listing-images";
import { initListingImageValidation } from "./listing-image-validation";

/**
 * Renders and connects an existing listing's editing form.
 *
 * Prefills images before recording the unsaved-change baseline.
 * The calling page must verify ownership before initializing the editor.
 *
 * @param container - Element receiving the editing form.
 * @param listing - Existing listing to edit.
 * @returns Cleanup function for the unsaved-change warning.
 */
export function initListingEditor(
  container: HTMLElement,
  listing: Listing,
): () => void {
  container.innerHTML = createListingForm(listing);

  const form = container.querySelector<HTMLFormElement>("[data-listing-form]");
  const images = container.querySelector<HTMLElement>("[data-listing-images]");

  if (!form || !images) {
    throw new Error("Listing editor is missing required form elements.");
  }

  initListingImages(images, listing.media);

  const updateValidity = initListingDetailsValidation(form, "edit");
  const validateImages = initListingImageValidation(form);

  const unsavedChanges = initUnsavedChanges(
    form,
    "You haven't saved your listing changes yet. Discard them and leave?",
  );

  initListingEditSubmit(form, listing.id, {
    updateValidity,
    validateImages,
    onSaved: () => {
      unsavedChanges.destroy();
    },
  });

  return () => {
    unsavedChanges.destroy();
  };
}
