import { getListings } from "../api";
import {
  getListingStatus,
  renderListingGrid,
} from "../components/listing-grid";

interface BrowseElements {
  grid: HTMLUListElement;
  status: HTMLParagraphElement;
  retryButton: HTMLButtonElement;
  searchForm: HTMLFormElement;
  searchInput: HTMLInputElement;
}

/**
 * Finds the elements required by the browsing page.
 *
 * @returns Page elements, or null when the page is unavailable.
 */
function getBrowseElements(): BrowseElements | null {
  const grid = document.querySelector<HTMLUListElement>("#listing-grid");
  const status =
    document.querySelector<HTMLParagraphElement>("#listing-status");
  const retryButton =
    document.querySelector<HTMLButtonElement>("#listing-retry");
  const searchForm = document.querySelector<HTMLFormElement>(
    "#listing-search-form",
  );
  const searchInput =
    document.querySelector<HTMLInputElement>("#listing-search");

  if (!grid || !status || !retryButton || !searchForm || !searchInput) {
    return null;
  }

  return { grid, status, retryButton, searchForm, searchInput };
}

/**
 * Initialises auction browsing, search and retry behaviour.
 * Cancels earlier requests when a new search is submitted.
 */
export function initBrowsePage(): void {
  const elements = getBrowseElements();

  if (!elements) {
    return;
  }

  const { grid, status, retryButton, searchForm, searchInput } = elements;

  let currentQuery = "";
  let activeController: AbortController | undefined;

  /**
   * Loads results for the last submitted search.
   */
  async function loadListings(): Promise<void> {
    activeController?.abort();

    const controller = new AbortController();
    activeController = controller;

    const query = currentQuery;

    grid.setAttribute("aria-busy", "true");
    grid.replaceChildren();
    status.textContent = query ? "Searching auctions…" : "Loading auctions…";
    retryButton.disabled = true;

    try {
      const response = await getListings(1, query, controller.signal);

      if (controller.signal.aborted) {
        return;
      }

      renderListingGrid(grid, response.data);
      status.textContent = getListingStatus(response, query);

      if (document.activeElement === retryButton) {
        const firstLink = grid.querySelector<HTMLAnchorElement>("a");

        if (firstLink) {
          firstLink.focus();
        } else {
          status.tabIndex = -1;
          status.focus();
        }
      }

      retryButton.hidden = true;
    } catch (error: unknown) {
      if (controller.signal.aborted) {
        return;
      }

      status.textContent =
        error instanceof Error
          ? error.message
          : "Unable to load auctions. Please try again.";

      retryButton.hidden = false;
    } finally {
      if (!controller.signal.aborted) {
        grid.setAttribute("aria-busy", "false");
        retryButton.disabled = false;
      }
    }
  }

  searchForm.addEventListener("submit", (event) => {
    event.preventDefault();
    currentQuery = searchInput.value.trim();
    void loadListings();
  });

  retryButton.addEventListener("click", () => {
    void loadListings();
  });

  void loadListings();
}
