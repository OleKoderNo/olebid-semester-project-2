import type { ListingsResponse } from "../../../types/listing";

export interface ProfileListingsElements {
  heading: HTMLHeadingElement;
  status: HTMLParagraphElement;
  retry: HTMLButtonElement;
  grid: HTMLUListElement;
  paginationContainer: HTMLElement;
}

/**
 * Renders the profile listings section and finds its controls.
 *
 * @param container - Element receiving the section.
 * @returns The rendered section's elements.
 * @throws If required elements are missing.
 */
export function renderProfileListingsView(
  container: HTMLElement,
): ProfileListingsElements {
  container.innerHTML = `
    <section class="mt-12">
      <h2
        data-listings-heading
        tabindex="-1"
        class="font-heading text-2xl leading-8 font-semibold"
      >
        My listings
      </h2>

      <p
        data-listings-status
        role="status"
        class="mt-4 text-sm leading-6 text-muted"
      ></p>

      <button
        data-listings-retry
        type="button"
        hidden
        class="mt-4 min-h-12 rounded-lg border border-burgundy px-6 py-3 font-medium text-burgundy hover:bg-burgundy-soft"
      >
        Try again
      </button>

      <ul
        data-listings-grid
        class="mt-6 grid gap-6 md:grid-cols-2 lg:grid-cols-3"
      ></ul>

      <div data-listings-pagination class="mt-6"></div>
    </section>
  `;

  const heading = container.querySelector<HTMLHeadingElement>(
    "[data-listings-heading]",
  );
  const status = container.querySelector<HTMLParagraphElement>(
    "[data-listings-status]",
  );
  const retry = container.querySelector<HTMLButtonElement>(
    "[data-listings-retry]",
  );
  const grid = container.querySelector<HTMLUListElement>(
    "[data-listings-grid]",
  );
  const paginationContainer = container.querySelector<HTMLElement>(
    "[data-listings-pagination]",
  );

  if (!heading || !status || !retry || !grid || !paginationContainer) {
    throw new Error("Profile listings are missing required elements.");
  }

  return { heading, status, retry, grid, paginationContainer };
}

/**
 * Describes the loaded page of profile listings.
 *
 * @param response - Listings and pagination returned by the API.
 * @returns Page information or an empty-state message.
 */
export function getProfileListingsStatus(response: ListingsResponse): string {
  if (response.data.length === 0) {
    return response.meta.totalCount === 0
      ? "You haven't created any listings yet."
      : "No listings were found on this page.";
  }

  return (
    `Page ${response.meta.currentPage} of ${response.meta.pageCount}. ` +
    `Showing ${response.data.length} of ${response.meta.totalCount} listings.`
  );
}
