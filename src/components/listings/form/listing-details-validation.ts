import { localDateTimeToIso } from "../../../utils/date-time";

/**
 * Connects title and deadline validation for a listing form.
 *
 * The deadline is interpreted in the creator's device timezone.
 * Validation is repeated when requested because a previously valid
 * deadline may have passed while the form was open.
 *
 * @param form - Form containing the title and deadline inputs.
 * @returns A function that updates the fields' validation messages.
 * @throws If required fields are missing.
 */
export function initListingDetailsValidation(
  form: HTMLFormElement,
): () => void {
  const title = form.querySelector<HTMLInputElement>('[name="title"]');
  const deadline = form.querySelector<HTMLInputElement>('[name="endsAt"]');

  if (!title || !deadline) {
    throw new Error("Listing form is missing its title or deadline.");
  }

  const fields = { title, deadline };

  /**
   * Rejects titles containing only whitespace.
   */
  function validateTitle(): void {
    fields.title.setCustomValidity(
      fields.title.value.trim() ? "" : "Enter a listing title.",
    );
  }

  /**
   * Checks that the local deadline represents a future instant.
   */
  function validateDeadline(): void {
    fields.deadline.setCustomValidity("");

    try {
      const timestamp = localDateTimeToIso(fields.deadline.value);

      if (Date.parse(timestamp) <= Date.now()) {
        fields.deadline.setCustomValidity(
          "Choose an auction deadline in the future.",
        );
      }
    } catch (error: unknown) {
      fields.deadline.setCustomValidity(
        error instanceof Error
          ? error.message
          : "Enter a valid auction deadline.",
      );
    }
  }

  function updateValidity(): void {
    validateTitle();
    validateDeadline();
  }

  fields.title.addEventListener("input", validateTitle);
  fields.deadline.addEventListener("input", validateDeadline);

  fields.title.addEventListener("change", () => {
    validateTitle();
    fields.title.reportValidity();
  });

  fields.deadline.addEventListener("change", () => {
    validateDeadline();
    fields.deadline.reportValidity();
  });

  updateValidity();

  return updateValidity;
}
