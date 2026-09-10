import { getProfileListings } from "../api";
import { getSession } from "../auth/session";
import { renderListingGrid } from "./listing-grid";
import { initPagination } from "./pagination";

/**
 * Displays a profile's listings with pagination and retry controls.
 *
 * @param container - Element where the section should be rendered.
 * @param name - Username whose listings should be displayed.
 */
export function initProfileListings(
  container: HTMLElement,
  name: string,
): void {
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

  const elements = { heading, status, retry, grid };
  let requestedPage = 1;
  let isLoading = false;

  const pagination = initPagination(
    paginationContainer,
    (page) => {
      requestedPage = page;
      elements.heading.focus();
      void loadListings();
    },
    "My listings pages",
  );

  /**
   * Loads the requested page without rendering stale session data.
   */
  async function loadListings(): Promise<void> {
    if (isLoading) {
      return;
    }

    const session = getSession();

    if (!session || session.name !== name) {
      container.replaceChildren();
      return;
    }

    isLoading = true;
    pagination.hide();

    elements.grid.replaceChildren();
    elements.grid.setAttribute("aria-busy", "true");
    elements.status.textContent = "Loading your listings…";
    elements.retry.disabled = true;

    try {
      const response = await getProfileListings(name, requestedPage);

      if (
        !container.isConnected ||
        getSession()?.accessToken !== session.accessToken
      ) {
        container.replaceChildren();
        return;
      }

      renderListingGrid(elements.grid, response.data);

      if (response.data.length === 0) {
        elements.status.textContent =
          response.meta.totalCount === 0
            ? "You haven't created any listings yet."
            : "No listings were found on this page.";
      } else {
        elements.status.textContent =
          `Page ${response.meta.currentPage} of ${response.meta.pageCount}. ` +
          `Showing ${response.data.length} of ${response.meta.totalCount} listings.`;
      }

      pagination.update(response.meta);

      if (document.activeElement === elements.retry) {
        elements.heading.focus();
      }

      elements.retry.hidden = true;
    } catch (error: unknown) {
      if (
        !container.isConnected ||
        getSession()?.accessToken !== session.accessToken
      ) {
        container.replaceChildren();
        return;
      }

      elements.status.textContent =
        error instanceof Error
          ? error.message
          : "Unable to load your listings. Please try again.";

      elements.retry.hidden = false;
    } finally {
      isLoading = false;
      elements.grid.setAttribute("aria-busy", "false");
      elements.retry.disabled = false;
    }
  }

  elements.retry.addEventListener("click", () => {
    void loadListings();
  });

  void loadListings();
}
