import { localDateTimeToIso } from "../../../utils/date-time";

/**
 * Connects title validation and, when creating, deadline validation.
 *
 * Editing does not require a deadline input because the update request
 * does not include the auction deadline.
 *
 * @param form - The rendered listing form.
 * @param mode - Whether the form creates or edits a listing.
 * @returns A function that refreshes validity before submission.
 * @throws If controls required by the selected mode are missing.
 */
export function initListingDetailsValidation(
  form: HTMLFormElement,
  mode: "create" | "edit" = "create",
): () => void {
  const title = form.querySelector<HTMLInputElement>('[name="title"]');
  const deadline = form.querySelector<HTMLInputElement>('[name="endsAt"]');

  if (!title || (mode === "create" && !deadline)) {
    throw new Error("Listing form is missing required validation controls.");
  }

  const fields = {
    title,
    deadline: mode === "create" ? deadline : null,
  };

  /**
   * Rejects empty titles, including titles containing only whitespace.
   */
  function validateTitle(): void {
    fields.title.setCustomValidity(
      fields.title.value.trim() ? "" : "Enter a listing title.",
    );
  }

  /**
   * Checks that a creation deadline represents a valid future instant.
   *
   * Converts device-local input to UTC before comparing timestamps.
   */
  function validateDeadline(): void {
    const input = fields.deadline;

    if (!input) {
      return;
    }

    input.setCustomValidity("");

    try {
      const timestamp = localDateTimeToIso(input.value);

      if (Date.parse(timestamp) <= Date.now()) {
        input.setCustomValidity("Choose an auction deadline in the future.");
      }
    } catch (error: unknown) {
      input.setCustomValidity(
        error instanceof Error
          ? error.message
          : "Enter a valid auction deadline.",
      );
    }
  }

  /**
   * Refreshes validity, including deadlines that have passed since entry.
   */
  function updateValidity(): void {
    validateTitle();
    validateDeadline();
  }

  fields.title.addEventListener("input", validateTitle);

  fields.title.addEventListener("change", () => {
    validateTitle();
    fields.title.reportValidity();
  });

  const deadlineInput = fields.deadline;

  if (deadlineInput) {
    deadlineInput.addEventListener("input", validateDeadline);

    deadlineInput.addEventListener("change", () => {
      validateDeadline();
      deadlineInput.reportValidity();
    });
  }

  updateValidity();

  return updateValidity;
}
