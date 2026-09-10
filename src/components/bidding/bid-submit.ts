import { placeBid } from "../../api";
import { getSession } from "../../auth/session";
import type { ListingDetails } from "../../types/listing";
import { initUnsavedChanges } from "../shared";

/**
 * Connects bid validation, submission and unsaved-change warnings.
 *
 * @param form - Rendered bid form.
 * @param listing - Auction receiving the bid.
 * @param onPlaced - Refreshes the page after an accepted bid.
 */
export function initBidSubmit(
  form: HTMLFormElement,
  listing: ListingDetails,
  onPlaced: () => Promise<void>,
): void {
  const input = form.querySelector<HTMLInputElement>("[data-bid-amount]");
  const button = form.querySelector<HTMLButtonElement>("[data-bid-submit]");
  const error = form.querySelector<HTMLParagraphElement>("[data-bid-error]");
  const status = form.querySelector<HTMLParagraphElement>("[data-bid-status]");

  if (!input || !button || !error || !status) {
    throw new Error("Bid form is missing required elements.");
  }

  const elements = { input, button, error, status };

  const unsavedChanges = initUnsavedChanges(
    form,
    "You haven’t placed your bid yet. Leave without submitting it?",
  );

  let isSubmitting = false;
  let bidAccepted = false;

  form.noValidate = true;

  input.addEventListener("input", () => {
    elements.input.setCustomValidity("");
    elements.error.textContent = "";
  });

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    if (isSubmitting || bidAccepted) {
      return;
    }

    const session = getSession();

    if (!session) {
      window.location.assign("/login/?reason=auth-required");
      return;
    }

    elements.error.textContent = "";

    const deadline = Date.parse(listing.endsAt);

    if (!Number.isFinite(deadline) || deadline <= Date.now()) {
      elements.error.textContent = "This auction has ended. Bidding is closed.";
      return;
    }

    if (!listing.seller?.name || listing.seller.name === session.name) {
      elements.error.textContent = "You cannot bid on this auction.";
      return;
    }

    const amount = elements.input.valueAsNumber;
    elements.input.setCustomValidity("");

    if (!Number.isSafeInteger(amount) || amount < 1) {
      elements.input.setCustomValidity(
        "Enter a bid amount in whole credits greater than zero.",
      );
    }

    if (!form.reportValidity()) {
      return;
    }

    isSubmitting = true;
    elements.button.disabled = true;
    elements.input.readOnly = true;
    elements.status.textContent = "Placing your bid…";

    try {
      await placeBid(listing.id, amount);

      bidAccepted = true;
      unsavedChanges.destroy();
    } catch (error: unknown) {
      if (form.isConnected) {
        elements.status.textContent = "";
        elements.error.textContent =
          error instanceof Error
            ? error.message
            : "Unable to place your bid. Please try again.";
      }
    } finally {
      isSubmitting = false;

      if (form.isConnected && !bidAccepted) {
        elements.button.disabled = false;
        elements.input.readOnly = false;
      }
    }

    if (!bidAccepted || !form.isConnected) {
      return;
    }

    if (getSession()?.accessToken !== session.accessToken) {
      window.location.reload();
      return;
    }

    elements.status.textContent = "Your bid was placed. Updating the auction…";

    try {
      await onPlaced();
    } catch {
      if (form.isConnected) {
        elements.status.textContent =
          "Your bid was placed, but the page could not refresh. Reload to see the latest auction.";
      }
    }
  });
}
