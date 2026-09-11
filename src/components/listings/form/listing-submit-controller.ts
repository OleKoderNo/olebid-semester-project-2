interface ListingSubmitControllerOptions {
  updateValidity: () => void;
  validateImages: () => Promise<boolean>;
  save: () => Promise<string>;
  onSaved: () => void;
  pendingMessage: string;
  pendingLabel: string;
  successMessage: string;
  successLabel: string;
  errorMessage: string;
}

/**
 * Connects validation, pending states, and saving for a listing form.
 *
 * Validation finishes before controls are disabled. Failed requests
 * restore controls and preserve entered values. Successful saves
 * trigger cleanup and open the saved listing.
 *
 * @param form - The rendered listing form.
 * @param options - Validation, saving, cleanup, and feedback configuration.
 * @throws If submission controls or feedback elements are missing.
 */
export function initListingSubmitController(
  form: HTMLFormElement,
  options: ListingSubmitControllerOptions,
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
  let saved = false;
  let formVersion = 0;

  // Recheck previous image errors before displaying browser validation.
  form.noValidate = true;
  elements.submitButton.disabled = false;

  form.addEventListener("input", () => {
    formVersion += 1;
  });

  /**
   * Checks current values and saves once validation succeeds.
   *
   * Changes made during image checks cancel this attempt.
   * A completed save cannot be submitted again while redirecting.
   */
  async function submit(): Promise<void> {
    if (isSubmitting || saved) {
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
          "Your listing changed while checking. Submit the form again.";
        return;
      }

      options.updateValidity();

      if (!form.reportValidity() || !imagesValid) {
        elements.status.textContent =
          "Check the highlighted fields before submitting.";
        return;
      }

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

      elements.status.textContent = options.pendingMessage;
      elements.submitButton.textContent = options.pendingLabel;

      const id = await options.save();

      saved = true;
      options.onSaved();

      elements.status.textContent = options.successMessage;
      elements.submitButton.textContent = options.successLabel;

      window.location.assign(`/listing/?id=${encodeURIComponent(id)}`);
    } catch (error: unknown) {
      elements.status.textContent = "";

      if (saved) {
        elements.error.textContent =
          "Your listing was saved, but its page could not be opened. Find it under My listings in your profile.";
        return;
      }

      elements.error.textContent =
        error instanceof Error ? error.message : options.errorMessage;
    } finally {
      isSubmitting = false;
      form.setAttribute("aria-busy", "false");

      if (!saved) {
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
    void submit();
  });
}
