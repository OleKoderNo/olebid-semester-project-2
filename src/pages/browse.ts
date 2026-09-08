import { getListings } from "../api";
import {
  getListingStatus,
  renderListingGrid,
} from "../components/listing-grid";
import { initPagination } from "../components/pagination";

interface BrowseElements {
  grid: HTMLUListElement;
  status: HTMLParagraphElement;
  retryButton: HTMLButtonElement;
  searchForm: HTMLFormElement;
  searchInput: HTMLInputElement;
  paginationContainer: HTMLElement;
  heading: HTMLHeadingElement;
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
  const paginationContainer = document.querySelector<HTMLElement>(
    "#listing-pagination",
  );
  const heading =
    document.querySelector<HTMLHeadingElement>("#auctions-heading");

  if (
    !grid ||
    !status ||
    !retryButton ||
    !searchForm ||
    !searchInput ||
    !paginationContainer ||
    !heading
  ) {
    return null;
  }

  return {
    grid,
    status,
    retryButton,
    searchForm,
    searchInput,
    paginationContainer,
    heading,
  };
}

/**
 * Initialises browsing, search, pagination and retry behaviour.
 * Cancels earlier requests when a new request starts.
 */
export function initBrowsePage(): void {
  const elements = getBrowseElements();

  if (!elements) {
    return;
  }

  const {
    grid,
    status,
    retryButton,
    searchForm,
    searchInput,
    paginationContainer,
    heading,
  } = elements;

  let currentQuery = "";
  let requestedPage = 1;
  let activeController: AbortController | undefined;

  const pagination = initPagination(
    paginationContainer,
    (page) => {
      requestedPage = page;
      heading.focus();
      void loadListings();
    },
    "Auction results pages",
  );

  /**
   * Loads the requested page for the last submitted search.
   */
  async function loadListings(): Promise<void> {
    activeController?.abort();

    const controller = new AbortController();
    activeController = controller;

    const query = currentQuery;
    const page = requestedPage;

    pagination.hide();
    grid.setAttribute("aria-busy", "true");
    grid.replaceChildren();
    status.textContent = `Loading page ${page}…`;
    retryButton.disabled = true;

    try {
      const response = await getListings(page, query, controller.signal);

      if (controller.signal.aborted) {
        return;
      }

      renderListingGrid(grid, response.data);
      status.textContent = getListingStatus(response, query);
      pagination.update(response.meta);

      if (document.activeElement === retryButton) {
        heading.focus();
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
    requestedPage = 1;

    void loadListings();
  });

  retryButton.addEventListener("click", () => {
    void loadListings();
  });

  void loadListings();
}
