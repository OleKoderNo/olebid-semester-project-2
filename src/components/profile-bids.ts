import { getSession } from "../auth/session";
import { createProfileBidListingsLoader } from "../utils/load-profile-bid-listings";
import { renderListingGrid } from "./listings";
import { initPagination } from "./shared";
import {
  getProfileBidsStatus,
  renderProfileBidsView,
} from "./profile-bids-view";

/**
 * Loads and controls a profile's unique auction bidding activity.
 *
 * @param container - Element where the section should appear.
 * @param name - Username whose bidding activity should be displayed.
 */
export function initProfileBids(container: HTMLElement, name: string): void {
  const elements = renderProfileBidsView(container);
  const loadListings = createProfileBidListingsLoader(name);

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
   * Loads the requested page of unique auctions.
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
      const result = await loadListings(requestedPage);

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
