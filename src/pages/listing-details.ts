import { getListingById } from "../api";
import { initListingGallery } from "../components/listing-gallery";
import { createListingSummary } from "../components/listing-summary";

/**
 * Loads the auction identified by the URL's id parameter.
 * Includes gallery initialisation, loading, error and retry feedback.
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
   * Fetches the selected auction and renders its summary and gallery.
   */
  async function loadListing(): Promise<void> {
    if (isLoading) {
      return;
    }

    isLoading = true;

    elements.content.setAttribute("aria-busy", "true");
    elements.status.classList.remove("sr-only");
    elements.status.textContent = "Loading auction…";
    elements.retryButton.disabled = true;

    try {
      const { data } = await getListingById(listingId);

      elements.content.innerHTML = createListingSummary(data);

      const gallery = elements.content.querySelector<HTMLElement>(
        "[data-listing-gallery]",
      );

      if (!gallery) {
        throw new Error("The listing template is missing its gallery.");
      }

      initListingGallery(gallery, data.media, data.title.trim() || "Auction");

      document.title = `${data.title.trim() || "Auction"} | OleBid`;

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
    } catch (error: unknown) {
      elements.status.classList.remove("sr-only");

      elements.status.textContent =
        error instanceof Error
          ? error.message
          : "Unable to load this auction. Please try again.";

      elements.retryButton.hidden = false;
      document.title = "Unable to load auction | OleBid";
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
