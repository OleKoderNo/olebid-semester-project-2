import { getListingById } from "../api";
import { createBidHistory } from "../components/bid-history";
import { initBidding } from "../components/bidding";
import { initCreditBalance } from "../components/layout";
import { initListingGallery } from "../components/listing-gallery";
import { createListingSummary } from "../components/listing-summary";

/**
 * Loads the auction identified by the URL's id parameter.
 * Includes summary, gallery, bid history and bidding controls.
 */
export function initListingDetailsPage(): void {
  const content = document.querySelector<HTMLDivElement>("#listing-details");
  const status = document.querySelector<HTMLParagraphElement>(
    "#listing-details-status",
  );
  const retryButton = document.querySelector<HTMLButtonElement>(
    "#listing-details-retry",
  );

  if (!content || !status || !retryButton) {
    return;
  }

  const id = new URLSearchParams(window.location.search).get("id")?.trim();

  if (!id) {
    status.textContent =
      "No auction was selected. Use Back to auctions to choose a listing.";
    document.title = "Auction not selected | OleBid";
    return;
  }

  const elements = { content, status, retryButton };
  const listingId = id;
  let isLoading = false;

  /**
   * Refreshes auction details and header credits after an accepted bid.
   */
  async function handleBidPlaced(): Promise<void> {
    const creditBalance = document.querySelector<HTMLElement>(
      "[data-credit-balance]",
    );

    if (creditBalance) {
      void initCreditBalance(creditBalance);
    }

    const refreshed = await loadListing();

    elements.status.classList.remove("sr-only");
    elements.status.textContent = refreshed
      ? "Your bid was placed successfully."
      : "Your bid was placed, but the auction could not refresh. Use Try again to reload its details.";

    // Restore visible keyboard focus after replacing the bid form.
    elements.status.tabIndex = -1;
    elements.status.focus();
  }

  /**
   * Fetches and renders the auction.
   *
   * @returns Whether the auction was successfully rendered.
   */
  async function loadListing(): Promise<boolean> {
    if (isLoading) {
      return false;
    }

    isLoading = true;

    elements.content.setAttribute("aria-busy", "true");
    elements.status.classList.remove("sr-only");
    elements.status.textContent = "Loading auction…";
    elements.retryButton.disabled = true;

    try {
      const { data } = await getListingById(listingId);

      elements.content.innerHTML = `
        ${createListingSummary(data)}
        ${createBidHistory(data.bids, data._count.bids)}
      `;

      const gallery = elements.content.querySelector<HTMLElement>(
        "[data-listing-gallery]",
      );
      const bidding = elements.content.querySelector<HTMLElement>(
        "[data-bidding-controls]",
      );

      if (!gallery || !bidding) {
        throw new Error(
          "The listing template is missing its gallery or bidding controls.",
        );
      }

      const title = data.title.trim() || "Auction";

      initListingGallery(gallery, data.media, title);
      initBidding(bidding, data, handleBidPlaced);

      document.title = `${title} | OleBid`;
      elements.status.classList.add("sr-only");
      elements.status.textContent = "Auction loaded.";

      if (document.activeElement === elements.retryButton) {
        const heading =
          elements.content.querySelector<HTMLHeadingElement>("h1");

        if (heading) {
          heading.tabIndex = -1;
          heading.focus();
        }
      }

      elements.retryButton.hidden = true;
      return true;
    } catch (error: unknown) {
      elements.status.classList.remove("sr-only");
      elements.status.textContent =
        error instanceof Error
          ? error.message
          : "Unable to load this auction. Please try again.";

      elements.retryButton.hidden = false;
      document.title = "Unable to load auction | OleBid";
      return false;
    } finally {
      isLoading = false;
      elements.content.setAttribute("aria-busy", "false");
      elements.retryButton.disabled = false;
    }
  }

  elements.retryButton.addEventListener("click", () => {
    void loadListing();
  });

  void loadListing();
}
