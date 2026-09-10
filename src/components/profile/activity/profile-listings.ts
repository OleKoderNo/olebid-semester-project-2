import { getProfileListings } from "../../../api";
import { getSession } from "../../../auth/session";
import { renderListingGrid } from "../../listings";
import { initPagination } from "../../shared";
import {
  getProfileListingsStatus,
  renderProfileListingsView,
} from "./profile-listings-view";

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
  const elements = renderProfileListingsView(container);

  let requestedPage = 1;
  let isLoading = false;

  const pagination = initPagination(
    elements.paginationContainer,
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
      elements.status.textContent = getProfileListingsStatus(response);
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
