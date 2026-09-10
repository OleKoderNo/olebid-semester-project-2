import type { ProfileBidListings } from "../utils/load-profile-bid-listings";

export interface ProfileBidsElements {
  heading: HTMLHeadingElement;
  status: HTMLParagraphElement;
  retry: HTMLButtonElement;
  grid: HTMLUListElement;
  paginationContainer: HTMLElement;
}

/**
 * Renders the bidding activity section and finds its controls.
 *
 * @param container - Element where the section should appear.
 * @returns The rendered section's elements.
 * @throws If required elements are missing.
 */
export function renderProfileBidsView(
  container: HTMLElement,
): ProfileBidsElements {
  container.innerHTML = `
    <section class="mt-12">
      <h2
        data-bids-heading
        tabindex="-1"
        class="font-heading text-2xl leading-8 font-semibold"
      >
        Listings I’ve bid on
      </h2>

      <p class="mt-3 text-sm leading-6 text-muted">
        Ordered by your newest bids. An auction may appear on more than
        one page if you have bid on it multiple times.
      </p>

      <p
        data-bids-status
        role="status"
        class="mt-4 text-sm leading-6 text-muted"
      ></p>

      <button
        data-bids-retry
        type="button"
        hidden
        class="mt-4 min-h-12 rounded-lg border border-burgundy px-6 py-3 font-medium text-burgundy hover:bg-burgundy-soft"
      >
        Try again
      </button>

      <ul
        data-bids-grid
        class="mt-6 grid gap-6 md:grid-cols-2 lg:grid-cols-3"
      ></ul>

      <div data-bids-pagination class="mt-6"></div>
    </section>
  `;

  const heading = container.querySelector<HTMLHeadingElement>(
    "[data-bids-heading]",
  );
  const status =
    container.querySelector<HTMLParagraphElement>("[data-bids-status]");
  const retry = container.querySelector<HTMLButtonElement>("[data-bids-retry]");
  const grid = container.querySelector<HTMLUListElement>("[data-bids-grid]");
  const paginationContainer = container.querySelector<HTMLElement>(
    "[data-bids-pagination]",
  );

  if (!heading || !status || !retry || !grid || !paginationContainer) {
    throw new Error("Profile bidding activity is missing required elements.");
  }

  return { heading, status, retry, grid, paginationContainer };
}

/**
 * Describes the loaded page of bidding activity.
 *
 * @param result - Listings and their bid pagination information.
 * @returns A status message for the section.
 */
export function getProfileBidsStatus(result: ProfileBidListings): string {
  const { listings, meta, unavailableBidCount } = result;

  if (meta.totalCount === 0) {
    return "You haven't placed any bids yet.";
  }

  let message =
    `Bidding activity page ${meta.currentPage} of ${meta.pageCount}. ` +
    `Showing ${listings.length} ${
      listings.length === 1 ? "auction" : "auctions"
    }.`;

  if (unavailableBidCount > 0) {
    message += " Some bids no longer have an associated listing available.";
  }

  return message;
}
