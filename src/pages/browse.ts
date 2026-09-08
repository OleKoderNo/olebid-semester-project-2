import { getListings } from "../api";
import { createListingCard } from "../components/listing-card";

/**
 * Shows fallback text when a listing image cannot load.
 *
 * @param container - Element containing the rendered cards.
 */
function initListingImages(container: HTMLElement): void {
  const images = container.querySelectorAll<HTMLImageElement>(
    "[data-listing-image]",
  );

  images.forEach((image) => {
    const fallback = image.parentElement?.querySelector<HTMLElement>(
      "[data-image-fallback]",
    );

    const updateImage = (): void => {
      const loaded = image.naturalWidth > 0;

      image.hidden = !loaded;

      if (fallback) {
        fallback.hidden = loaded;
      }
    };

    image.addEventListener("load", updateImage, { once: true });
    image.addEventListener("error", updateImage, { once: true });

    if (image.complete) {
      updateImage();
    }
  });
}

/**
 * Initialises the browsing page and loads its first page of auctions.
 * Includes loading, empty, error and retry feedback.
 */
export function initBrowsePage(): void {
  const grid = document.querySelector<HTMLUListElement>("#listing-grid");

  const status =
    document.querySelector<HTMLParagraphElement>("#listing-status");

  const retryButton =
    document.querySelector<HTMLButtonElement>("#listing-retry");

  if (!grid || !status || !retryButton) {
    return;
  }

  let isLoading = false;

  /**
   * Requests auctions and updates the results and feedback.
   */
  async function loadListings(): Promise<void> {
    if (!grid || !status || !retryButton || isLoading) {
      return;
    }

    isLoading = true;
    grid.setAttribute("aria-busy", "true");
    status.textContent = "Loading auctions…";
    retryButton.disabled = true;

    try {
      const { data } = await getListings();

      grid.innerHTML = data
        .map(
          (listing) => `
            <li class="min-w-0">
              ${createListingCard(listing)}
            </li>
          `,
        )
        .join("");

      initListingImages(grid);

      status.textContent =
        data.length === 0
          ? "No active auctions are available right now."
          : `${data.length} auctions loaded.`;

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
      status.textContent =
        error instanceof Error
          ? error.message
          : "Unable to load auctions. Please try again.";

      retryButton.hidden = false;
    } finally {
      isLoading = false;
      grid.setAttribute("aria-busy", "false");
      retryButton.disabled = false;
    }
  }

  retryButton.addEventListener("click", () => {
    void loadListings();
  });

  void loadListings();
}
