import { getProfile } from "../api";
import { requireAuth } from "../auth/require-auth";
import { getSession } from "../auth/session";
import { createProfileSummary } from "../components/profile-summary";
import { initProfileImages } from "../components/profile-image";

/**
 * Loads the signed-in user's profile.
 * Requires a session before fetching or rendering account information.
 */
export function initProfilePage(): void {
  if (!requireAuth()) {
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
  let isLoading = false;

  /**
   * Fetches fresh profile information for the current session.
   */
  async function loadProfile(): Promise<void> {
    if (isLoading) {
      return;
    }

    const session = requireAuth();

    if (!session) {
      elements.content.replaceChildren();
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

      // Do not render an old response after the session has changed.
      if (getSession()?.accessToken !== session.accessToken) {
        window.location.reload();
        return;
      }

      elements.content.innerHTML = createProfileSummary(data);
      initProfileImages(elements.content);

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

  // Recheck authentication if Back restores this page from browser cache.
  window.addEventListener("pageshow", (event) => {
    if (event.persisted) {
      elements.content.replaceChildren();
      window.location.reload();
    }
  });

  // Remove protected content if another tab changes the login session.
  window.addEventListener("storage", (event) => {
    if (event.key === "olebid.session" || event.key === null) {
      elements.content.replaceChildren();
      window.location.reload();
    }
  });

  void loadProfile();
}
