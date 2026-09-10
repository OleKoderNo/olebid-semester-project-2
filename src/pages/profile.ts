import { getProfile } from "../api";
import { requireAuth } from "../auth/require-auth";
import { getSession } from "../auth/session";
import { initProfileEditor } from "../components/profile-editor";
import { initProfileListings } from "../components/profile-listings";

/**
 * Loads the signed-in user's profile and listing activity.
 * Requires authentication before displaying account information.
 */
export function initProfilePage(): void {
  const initialSession = requireAuth();

  if (!initialSession) {
    return;
  }

  const content = document.querySelector<HTMLDivElement>("#profile-content");
  const status =
    document.querySelector<HTMLParagraphElement>("#profile-status");
  const retry = document.querySelector<HTMLButtonElement>("#profile-retry");

  if (!content || !status || !retry) {
    throw new Error("Profile page is missing required elements.");
  }

  const elements = { content, status, retry };

  const activity = document.createElement("div");
  elements.content.after(activity);

  initProfileListings(activity, initialSession.name);

  let isLoading = false;

  /**
   * Removes displayed account information.
   */
  function clearProtectedContent(): void {
    elements.content.replaceChildren();
    activity.replaceChildren();
  }

  /**
   * Fetches fresh profile information for the current session.
   */
  async function loadProfile(): Promise<void> {
    if (isLoading) {
      return;
    }

    const session = requireAuth();

    if (!session) {
      clearProtectedContent();
      return;
    }

    isLoading = true;

    elements.content.replaceChildren();
    elements.content.setAttribute("aria-busy", "true");
    elements.status.classList.remove("sr-only");
    elements.status.textContent = "Loading your profile…";
    elements.retry.disabled = true;

    try {
      const { data } = await getProfile(session.name);

      if (getSession()?.accessToken !== session.accessToken) {
        clearProtectedContent();
        window.location.reload();
        return;
      }

      initProfileEditor(elements.content, data);

      document.title = `${data.name} | OleBid`;
      elements.status.classList.add("sr-only");
      elements.status.textContent = "Profile loaded.";

      if (document.activeElement === elements.retry) {
        const heading =
          document.querySelector<HTMLHeadingElement>("#profile-heading");

        heading?.focus();
      }

      elements.retry.hidden = true;
    } catch (error: unknown) {
      if (getSession()?.accessToken !== session.accessToken) {
        clearProtectedContent();
        window.location.reload();
        return;
      }

      elements.status.classList.remove("sr-only");
      elements.status.textContent =
        error instanceof Error
          ? error.message
          : "Unable to load your profile. Please try again.";

      elements.retry.hidden = false;
    } finally {
      isLoading = false;
      elements.content.setAttribute("aria-busy", "false");
      elements.retry.disabled = false;
    }
  }

  elements.retry.addEventListener("click", () => {
    void loadProfile();
  });

  // Recheck authentication when Back restores a cached page.
  window.addEventListener("pageshow", (event) => {
    if (event.persisted) {
      clearProtectedContent();
      window.location.reload();
    }
  });

  // Remove protected content when another tab changes the session.
  window.addEventListener("storage", (event) => {
    if (event.key === "olebid.session" || event.key === null) {
      clearProtectedContent();
      window.location.reload();
    }
  });

  void loadProfile();
}
