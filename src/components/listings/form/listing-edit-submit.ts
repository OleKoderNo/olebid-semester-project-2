import { updateListing } from "../../../api";
import { readListingEditForm } from "./read-listing-form";
import { initListingSubmitController } from "./listing-submit-controller";

interface ListingEditSubmitOptions {
  updateValidity: () => void;
  validateImages: () => Promise<boolean>;
  onSaved: () => void;
}

/**
 * Connects an editing form to the authenticated listing update API.
 *
 * Sends the editable fields without a deadline. Failed requests preserve
 * edits. Successful saves run cleanup and open the updated auction.
 *
 * The editing page checks ownership before rendering the form.
 * The API remains responsible for authorizing the update request.
 *
 * @param form - The rendered listing editing form.
 * @param id - ID of the listing being edited.
 * @param options - Validation functions and successful-save cleanup.
 */
export function initListingEditSubmit(
  form: HTMLFormElement,
  id: string,
  options: ListingEditSubmitOptions,
): void {
  initListingSubmitController(form, {
    updateValidity: options.updateValidity,
    validateImages: options.validateImages,
    onSaved: options.onSaved,

    save: async () => {
      const changes = readListingEditForm(form);
      await updateListing(id, changes);

      return id;
    },

    pendingMessage: "Saving your changes…",
    pendingLabel: "Saving…",
    successMessage: "Your changes have been saved. Opening the auction…",
    successLabel: "Saved",
    errorMessage: "Unable to save your changes. Please try again.",
  });
}
