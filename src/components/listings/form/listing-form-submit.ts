import { createListing } from "../../../api";
import { readListingForm } from "./read-listing-form";

interface ListingSubmitOptions {
  updateValidity: () => void;
  validateImages: () => Promise<boolean>;
  onCreated: () => void;
}

/**
 * Connects listing validation and API submission.
 *
 * Local and asynchronous validation finish before controls are disabled,
 * because disabled controls do not participate in browser validation.
 *
 * Failed requests preserve entered values for another attempt.
 * Successful requests clear the unsaved-change warning and redirect
 * to the created auction.
 *
 * @param form - The rendered listing creation form.
 * @param options - Validation functions and successful-save cleanup.
 * @throws If submission controls or feedback elements are missing.
 */
export function initListingFormSubmit(
  form: HTMLFormElement,
  options: ListingSubmitOptions,
): void {
  const submitButton = form.querySelector<HTMLButtonElement>(
    "[data-listing-submit]",
  );
  const error = form.querySelector<HTMLParagraphElement>(
    "[data-listing-error]",
  );
  const status = form.querySelector<HTMLParagraphElement>(
    "[data-listing-status]",
  );

  if (!submitButton || !error || !status) {
    throw new Error("Listing form is missing submission controls.");
  }

  const elements = { submitButton, error, status };
  let isSubmitting = false;
  let listingCreated = false;
  let formVersion = 0;

  // Run validation ourselves so previous image errors can be rechecked.
  form.noValidate = true;
  elements.submitButton.disabled = false;

  form.addEventListener("input", () => {
    formVersion += 1;
  });

  /**
   * Validates the current values, creates the listing, and opens its page.
   *
   * Edits made while image checks are running cancel this save attempt.
   * Duplicate submissions are blocked throughout validation and saving.
   */
  async function submitListing(): Promise<void> {
    if (isSubmitting || listingCreated) {
      return;
    }

    isSubmitting = true;

    const version = formVersion;
    const originalLabel = elements.submitButton.textContent;
    const disabledStates = new Map<
      HTMLInputElement | HTMLTextAreaElement | HTMLButtonElement,
      boolean
    >();

    elements.error.textContent = "";
    elements.status.textContent = "Checking your listing…";
    elements.submitButton.disabled = true;
    elements.submitButton.textContent = "Checking…";
    form.setAttribute("aria-busy", "true");

    try {
      options.updateValidity();
      const imagesValid = await options.validateImages();

      if (!form.isConnected) {
        return;
      }

      if (formVersion !== version) {
        elements.status.textContent =
          "Your listing changed while checking. Select Create listing again.";
        return;
      }

      // A deadline may have passed while image checks were running.
      options.updateValidity();

      if (!form.reportValidity() || !imagesValid) {
        elements.status.textContent =
          "Check the highlighted fields before creating your listing.";
        return;
      }

      const listing = readListingForm(form);

      // Capture each control's state so failed requests can restore it.
      form
        .querySelectorAll<
          HTMLInputElement | HTMLTextAreaElement | HTMLButtonElement
        >("input, textarea, button")
        .forEach((control) => {
          if (control === elements.submitButton) {
            return;
          }

          disabledStates.set(control, control.disabled);
          control.disabled = true;
        });

      elements.status.textContent = "Creating your listing…";
      elements.submitButton.textContent = "Creating…";

      const { data } = await createListing(listing);

      // Mark success before redirecting to prevent accidental resubmission.
      listingCreated = true;
      options.onCreated();

      elements.status.textContent =
        "Your listing has been created. Opening the auction…";
      elements.submitButton.textContent = "Created";

      window.location.assign(`/listing/?id=${encodeURIComponent(data.id)}`);
    } catch (error: unknown) {
      elements.status.textContent = "";

      if (listingCreated) {
        elements.error.textContent =
          "Your listing was created, but its page could not be opened. Find it under My listings in your profile.";
        return;
      }

      elements.error.textContent =
        error instanceof Error
          ? error.message
          : "Unable to create your listing. Please try again.";
    } finally {
      isSubmitting = false;
      form.setAttribute("aria-busy", "false");

      if (!listingCreated) {
        disabledStates.forEach((disabled, control) => {
          control.disabled = disabled;
        });

        elements.submitButton.disabled = false;
        elements.submitButton.textContent = originalLabel;
      }
    }
  }

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    void submitListing();
  });
}
