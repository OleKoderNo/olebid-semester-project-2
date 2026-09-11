import { formatLocalDateTime } from "../../../utils/date-time";
import { escapeHtml } from "../../../utils/escape-html";

/**
 * Creates an editable deadline for creation or a fixed deadline for editing.
 *
 * Existing timestamps are displayed in the viewer's device-local timezone.
 * The edit form does not include a deadline input because the documented
 * update endpoint does not support changing it.
 *
 * @param inputClasses - Shared styling for the creation input.
 * @param endsAt - Existing API timestamp, supplied when editing.
 * @returns Deadline markup for the selected mode.
 */
export function createListingFormDeadline(
  inputClasses: string,
  endsAt?: string,
): string {
  if (endsAt !== undefined) {
    return `
      <div>
        <p class="text-base font-medium">
          Auction deadline
        </p>

        <p class="mt-2 text-base leading-6">
          ${escapeHtml(formatLocalDateTime(endsAt))}
        </p>

        <p class="mt-2 text-sm leading-6 text-muted">
          Shown in your device’s local time.
          The deadline cannot be changed when editing this listing.
        </p>
      </div>
    `;
  }

  return `
    <label class="block">
      <span class="text-base font-medium">
        Auction deadline (required)
      </span>

      <input
        name="endsAt"
        type="datetime-local"
        required
        aria-describedby="listing-deadline-hint"
        class="${inputClasses}"
      />
    </label>

    <p
      id="listing-deadline-hint"
      class="text-sm leading-6 text-muted"
    >
      Enter the deadline in your device’s local time.
      Each visitor will see it in their own local time.
    </p>
  `;
}
