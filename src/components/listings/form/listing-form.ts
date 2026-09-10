/**
 * Creates the form for a new auction listing.
 * Image controls are initialized separately.
 *
 * @returns Listing creation form markup.
 */
export function createListingForm(): string {
  const inputClasses =
    "mt-2 block min-h-12 w-full rounded-lg border border-muted bg-surface px-4 py-3 text-ink focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-ink";

  return `
    <form data-listing-form class="space-y-6">
      <p class="text-sm leading-6 text-muted">
        Title and auction deadline are required.
      </p>

      <label class="block">
        <span class="text-base font-medium">
          Title (required)
        </span>

        <input
          name="title"
          type="text"
          required
          class="${inputClasses}"
        />
      </label>

      <label class="block">
        <span class="text-base font-medium">
          Description
        </span>

        <textarea
          name="description"
          rows="5"
          class="${inputClasses} min-h-36 resize-y"
        ></textarea>
      </label>

      <label class="block">
        <span class="text-base font-medium">
          Tags
        </span>

        <input
          name="tags"
          type="text"
          aria-describedby="listing-tags-hint"
          class="${inputClasses}"
        />
      </label>

      <p
        id="listing-tags-hint"
        class="text-sm leading-6 text-muted"
      >
        Separate tags with commas, for example: photography, cameras.
      </p>

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

      <div data-listing-images></div>

      <p
        data-listing-error
        role="alert"
        class="text-sm leading-6 text-error"
      ></p>

      <p
        data-listing-status
        role="status"
        class="text-sm leading-6 text-muted"
      ></p>

      <div class="flex flex-col gap-3 sm:flex-row">
        <button
          data-listing-submit
          type="submit"
          class="min-h-12 rounded-lg bg-burgundy px-6 py-3 font-medium text-surface hover:bg-burgundy-hover disabled:cursor-wait disabled:opacity-60"
        >
          Create listing
        </button>

        <a
          href="/profile/"
          class="inline-flex min-h-12 items-center justify-center rounded-lg border border-burgundy px-6 py-3 font-medium text-burgundy hover:bg-burgundy-soft"
        >
          Cancel
        </a>
      </div>
    </form>
  `;
}
