import { deleteListing } from "../../api";
import { getSession } from "../../auth/session";
import type { ListingDetails } from "../../types/listing";

/**
 * Connects the owner's delete button to confirmation and deletion.
 *
 * Cancellation sends no request. Pending requests cannot be repeated.
 * Failed requests display an error and allow another attempt.
 *
 * @param container - Element containing the owner actions.
 * @param listing - The displayed auction and its seller information.
 */
export function initListingDelete(
  container: HTMLElement,
  listing: ListingDetails,
): void {
  const button = container.querySelector<HTMLButtonElement>(
    "[data-delete-listing]",
  );
  const status = container.querySelector<HTMLParagraphElement>(
    "[data-delete-status]",
  );
  const error = container.querySelector<HTMLParagraphElement>(
    "[data-delete-error]",
  );

  if (!button || !status || !error) {
    throw new Error("Listing deletion controls are missing required elements.");
  }

  const elements = { button, status, error };
  let isDeleting = false;
  let deleted = false;

  /**
   * Confirms the named auction and sends one deletion request.
   *
   * Rechecks the current session before acting. Successful deletion
   * redirects to the profile; the API authorizes the actual request.
   */
  async function handleDelete(): Promise<void> {
    if (isDeleting || deleted) {
      return;
    }

    elements.error.textContent = "";
    elements.status.textContent = "";

    const session = getSession();

    if (!session || listing.seller?.name !== session.name) {
      elements.error.textContent =
        "You must be signed in as the owner to delete this listing.";
      return;
    }

    const title = listing.title.trim() || "Untitled auction";
    const confirmed = window.confirm(
      `Delete "${title}" permanently? This cannot be undone.`,
    );

    if (!confirmed) {
      return;
    }

    isDeleting = true;
    elements.button.disabled = true;
    elements.button.textContent = "Deleting…";
    elements.status.textContent = "Deleting your listing…";

    try {
      await deleteListing(listing.id);

      deleted = true;
      elements.button.textContent = "Deleted";
      elements.status.textContent =
        "Your listing was deleted. Opening your profile…";

      window.location.assign("/profile/?listingDeleted=1");
    } catch (error: unknown) {
      elements.status.textContent =
        "Your listing was deleted. Opening My listings…";

      elements.error.textContent = deleted
        ? "Your listing was deleted, but your profile could not be opened. Use My profile to view your remaining listings."
        : error instanceof Error
          ? error.message
          : "Unable to delete your listing. Please try again.";
    } finally {
      isDeleting = false;

      if (!deleted) {
        elements.button.disabled = false;
        elements.button.textContent = "Delete listing";
      }
    }
  }

  elements.button.addEventListener("click", () => {
    void handleDelete();
  });
}
