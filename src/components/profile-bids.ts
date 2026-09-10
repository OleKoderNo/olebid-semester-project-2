import { getSession } from "../auth/session";
import { loadProfileBidListings } from "../utils/load-profile-bid-listings";
import { renderListingGrid } from "./listing-grid";
import { initPagination } from "./pagination";
import {
  getProfileBidsStatus,
  renderProfileBidsView,
} from "./profile-bids-view";

/**
 * Loads and controls a profile's bidding activity.
 *
 * @param container - Element where the section should appear.
 * @param name - Username whose bidding activity should be displayed.
 */
export function initProfileBids(container: HTMLElement, name: string): void {
  const elements = renderProfileBidsView(container);

  let requestedPage = 1;
  let isLoading = false;

  const pagination = initPagination(
    elements.paginationContainer,
    (page) => {
      requestedPage = page;
      elements.heading.focus();
      void loadBids();
    },
    "My bidding activity pages",
  );

  /**
   * Checks whether a response still belongs to the displayed session.
   */
  function isCurrentSession(accessToken: string): boolean {
    return container.isConnected && getSession()?.accessToken === accessToken;
  }

  /**
   * Loads auctions for the requested page of bid records.
   */
  async function loadBids(): Promise<void> {
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
    elements.status.textContent = "Loading your bidding activity…";
    elements.retry.disabled = true;

    try {
      const result = await loadProfileBidListings(name, requestedPage);

      if (!isCurrentSession(session.accessToken)) {
        container.replaceChildren();
        return;
      }

      renderListingGrid(elements.grid, result.listings);
      elements.status.textContent = getProfileBidsStatus(result);
      pagination.update(result.meta);

      if (document.activeElement === elements.retry) {
        elements.heading.focus();
      }

      elements.retry.hidden = true;
    } catch (error: unknown) {
      if (!isCurrentSession(session.accessToken)) {
        container.replaceChildren();
        return;
      }

      elements.status.textContent =
        error instanceof Error
          ? error.message
          : "Unable to load your bidding activity. Please try again.";

      elements.retry.hidden = false;
    } finally {
      isLoading = false;
      elements.grid.setAttribute("aria-busy", "false");
      elements.retry.disabled = false;
    }
  }

  elements.retry.addEventListener("click", () => {
    void loadBids();
  });

  void loadBids();
}
