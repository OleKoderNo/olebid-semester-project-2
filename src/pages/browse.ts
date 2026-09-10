import { getListings } from "../api";
import { initListingFilters } from "../components/listing-filters";
import {
  getListingStatus,
  renderListingGrid,
} from "../components/listing-grid";
import { initPagination, initSortSelect } from "../components/shared";
import type { ListingFilters, ListingSort } from "../types/listing";

interface BrowseElements {
  grid: HTMLUListElement;
  status: HTMLParagraphElement;
  retryButton: HTMLButtonElement;
  searchForm: HTMLFormElement;
  searchInput: HTMLInputElement;
  paginationContainer: HTMLElement;
  heading: HTMLHeadingElement;
  sortContainer: HTMLElement;
  filtersContainer: HTMLElement;
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
  const sortContainer = document.querySelector<HTMLElement>("#listing-sort");
  const filtersContainer =
    document.querySelector<HTMLElement>("#listing-filters");

  if (
    !grid ||
    !status ||
    !retryButton ||
    !searchForm ||
    !searchInput ||
    !paginationContainer ||
    !heading ||
    !sortContainer ||
    !filtersContainer
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
    sortContainer,
    filtersContainer,
  };
}

/**
 * Connects browsing controls to auction requests and results.
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
    sortContainer,
    filtersContainer,
  } = elements;

  let currentQuery = "";
  let requestedPage = 1;
  let currentSort: ListingSort = "newest";
  let currentFilters: ListingFilters = { status: "active", tag: "" };
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

  initSortSelect<ListingSort>(sortContainer, {
    label: "Sort auctions",
    initialValue: currentSort,
    options: [
      { value: "newest", label: "Newest first" },
      { value: "oldest", label: "Oldest first" },
      { value: "ending-soon", label: "Ending soon" },
    ],
    onChange: (value) => {
      currentSort = value;
      requestedPage = 1;
      void loadListings();
    },
  });

  initListingFilters(filtersContainer, (filters) => {
    currentFilters = filters;
    requestedPage = 1;
    void loadListings();
  });

  /**
   * Loads results using the submitted search, sorting and filters.
   */
  async function loadListings(): Promise<void> {
    activeController?.abort();

    const controller = new AbortController();
    activeController = controller;

    const query = currentQuery;
    const page = requestedPage;
    const order = currentSort;
    const filters = { ...currentFilters };

    pagination.hide();
    grid.setAttribute("aria-busy", "true");
    grid.replaceChildren();
    status.textContent = `Loading page ${page}…`;
    retryButton.disabled = true;

    try {
      const response = await getListings(
        page,
        query,
        controller.signal,
        order,
        filters,
      );

      if (controller.signal.aborted) {
        return;
      }

      renderListingGrid(grid, response.data);
      status.textContent = getListingStatus(response, query, filters);
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
