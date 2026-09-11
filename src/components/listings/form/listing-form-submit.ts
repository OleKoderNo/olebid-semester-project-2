import { createListing } from "../../../api";
import { readListingForm } from "./read-listing-form";
import { initListingSubmitController } from "./listing-submit-controller";

interface ListingSubmitOptions {
  updateValidity: () => void;
  validateImages: () => Promise<boolean>;
  onCreated: () => void;
}

/**
 * Connects the creation form to the authenticated listing API.
 *
 * Uses the shared submission controller for validation, pending states,
 * errors, and redirecting after success.
 *
 * @param form - The rendered listing creation form.
 * @param options - Validation functions and successful-creation cleanup.
 */
export function initListingFormSubmit(
  form: HTMLFormElement,
  options: ListingSubmitOptions,
): void {
  initListingSubmitController(form, {
    updateValidity: options.updateValidity,
    validateImages: options.validateImages,
    onSaved: options.onCreated,

    save: async () => {
      const listing = readListingForm(form);
      const { data } = await createListing(listing);

      return data.id;
    },

    pendingMessage: "Creating your listing…",
    pendingLabel: "Creating…",
    successMessage: "Your listing has been created. Opening the auction…",
    successLabel: "Created",
    errorMessage: "Unable to create your listing. Please try again.",
  });
}
