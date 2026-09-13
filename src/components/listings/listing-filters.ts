import type { ListingFilters, ListingStatus } from "../../types/listing";
import { initSortSelect } from "../shared";

/**
 * Renders auction filters and connects their submit behaviour.
 * Call once per container.
 *
 * @param container - Element receiving the filter form.
 * @param onApply - Called with the submitted filter values.
 * @throws If required template elements are missing.
 */
export function initListingFilters(
  container: HTMLElement,
  onApply: (filters: ListingFilters) => void,
): void {
  container.innerHTML = `
    <form aria-label="Filter auctions">
      <div class="grid gap-4 sm:grid-cols-2">
        <div data-status class="min-w-0"></div>

        <label class="block min-w-0">
          <span class="mb-2 block text-base leading-6 font-medium">
            Filter by tag
          </span>

          <input
            data-tag
            name="tag"
            type="text"
            placeholder="For example: photography"
            aria-describedby="listing-tag-hint"
            class="min-h-13.5 w-full rounded-lg border border-muted bg-surface px-4 py-3 text-base placeholder:text-muted focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-ink"
          >
        </label>
      </div>

      <div class="mt-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p
          id="listing-tag-hint"
          class="text-sm leading-6 text-muted"
        >
          Enter one tag. Leave it blank to include all tags.
        </p>

        <button
          type="submit"
          class="min-h-13.5 shrink-0 rounded-lg border border-burgundy px-6 py-3 font-medium text-burgundy hover:bg-burgundy-soft"
        >
          Apply filters
        </button>
      </div>
    </form>
  `;

  const form = container.querySelector<HTMLFormElement>("form");
  const statusContainer = container.querySelector<HTMLElement>("[data-status]");
  const tagInput = container.querySelector<HTMLInputElement>("[data-tag]");

  if (!form || !statusContainer || !tagInput) {
    throw new Error("Listing filters are missing required elements.");
  }

  let selectedStatus: ListingStatus = "active";

  initSortSelect<ListingStatus>(statusContainer, {
    label: "Auction status",
    initialValue: selectedStatus,
    options: [
      { value: "active", label: "Active auctions" },
      { value: "all", label: "All auctions" },
    ],
    onChange: (value) => {
      selectedStatus = value;
    },
  });

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    onApply({
      status: selectedStatus,
      tag: tagInput.value.trim(),
    });
  });
}
