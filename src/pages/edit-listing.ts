import { getListingById } from "../api";
import { requireAuth } from "../auth/require-auth";
import { getSession } from "../auth/session";
import { initListingEditor } from "../components/listings/form";

/**
 * Loads the requested listing and opens its editor for the owner.
 *
 * Checks authentication before loading and checks the session again
 * after the request. The API independently authorizes saved updates.
 */
export function initEditListingPage(): void {
  const session = requireAuth();

  if (!session) {
    return;
  }

  const content = document.querySelector<HTMLDivElement>(
    "#listing-edit-content",
  );
  const status = document.querySelector<HTMLParagraphElement>(
    "#listing-edit-status",
  );
  const retry = document.querySelector<HTMLButtonElement>(
    "#listing-edit-retry",
  );
  const heading = document.querySelector<HTMLHeadingElement>(
    "#listing-edit-heading",
  );

  if (!content || !status || !retry || !heading) {
    throw new Error("Edit listing page is missing required elements.");
  }

  const elements = { content, status, retry, heading };
  const id = new URLSearchParams(window.location.search).get("id")?.trim();

  if (!id) {
    elements.status.textContent =
      "No auction was selected. Open one of your listings to edit it.";
    document.title = "Auction not selected | OleBid";
    return;
  }

  const listingId = id;
  const ownerSession = session;
  let isLoading = false;
  let destroyEditor: (() => void) | undefined;

  /**
   * Clears the editor and reloads so authentication is checked again.
   */
  function reloadPage(): void {
    destroyEditor?.();
    elements.content.replaceChildren();
    window.location.reload();
  }

  /**
   * Determines whether the session still matches the original owner.
   */
  function hasCurrentSession(): boolean {
    const current = getSession();

    return (
      current?.name === ownerSession.name &&
      current?.accessToken === ownerSession.accessToken
    );
  }

  /**
   * Loads the listing and renders its editor after verifying ownership.
   *
   * Failed requests can be retried without leaving the page.
   */
  async function loadListing(): Promise<void> {
    if (isLoading) {
      return;
    }

    if (!hasCurrentSession()) {
      reloadPage();
      return;
    }

    isLoading = true;
    elements.content.setAttribute("aria-busy", "true");
    elements.status.textContent = "Loading your listing…";
    elements.retry.disabled = true;

    try {
      const { data } = await getListingById(listingId);

      if (!elements.content.isConnected) {
        return;
      }

      if (!hasCurrentSession()) {
        reloadPage();
        return;
      }

      if (data.seller?.name !== ownerSession.name) {
        elements.status.textContent =
          "You can only edit listings that belong to your account.";
        elements.retry.hidden = true;
        document.title = "Unable to edit auction | OleBid";
        return;
      }

      destroyEditor?.();
      destroyEditor = initListingEditor(elements.content, data);

      const title = data.title.trim() || "Auction";
      document.title = `Edit ${title} | OleBid`;
      elements.status.textContent = "Your listing is ready to edit.";

      if (document.activeElement === elements.retry) {
        elements.heading.focus();
      }

      elements.retry.hidden = true;
    } catch (error: unknown) {
      if (!elements.content.isConnected) {
        return;
      }

      if (!hasCurrentSession()) {
        reloadPage();
        return;
      }

      destroyEditor?.();
      destroyEditor = undefined;
      elements.content.replaceChildren();

      elements.status.textContent =
        error instanceof Error
          ? error.message
          : "Unable to load your listing. Please try again.";

      elements.retry.hidden = false;
      document.title = "Unable to load auction | OleBid";
    } finally {
      isLoading = false;
      elements.content.setAttribute("aria-busy", "false");
      elements.retry.disabled = false;
    }
  }

  elements.retry.addEventListener("click", () => {
    void loadListing();
  });

  window.addEventListener("pageshow", (event) => {
    if (event.persisted) {
      reloadPage();
    }
  });

  window.addEventListener("storage", (event) => {
    if (event.key === "olebid.session" || event.key === null) {
      reloadPage();
    }
  });

  void loadListing();
}
