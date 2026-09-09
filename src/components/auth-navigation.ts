import { clearSession, getSession } from "../auth/session";
import { escapeHtml } from "../utils/escape-html";

/**
 * Renders account controls for the current stored session.
 * Connects logout when a session exists.
 *
 * @param header - The rendered shared header.
 * @throws If the account-controls container is missing.
 */
export function initAuthNavigation(header: HTMLElement): void {
  const container = header.querySelector<HTMLElement>(
    "[data-account-controls]",
  );

  if (!container) {
    throw new Error("Header is missing its account-controls container.");
  }

  const session = getSession();

  if (!session) {
    container.innerHTML = `
      <a
        href="/login/"
        class="flex min-h-12 items-center justify-center rounded-lg border border-burgundy px-6 py-3 font-medium text-burgundy hover:bg-burgundy-soft"
      >
        Log in
      </a>

      <a
        href="/register/"
        class="flex min-h-12 items-center justify-center rounded-lg bg-burgundy px-6 py-3 font-medium text-surface hover:bg-burgundy-hover"
      >
        Register
      </a>
    `;

    return;
  }

  container.innerHTML = `
    <span class="min-w-0 py-3 text-sm leading-6 text-muted wrap-anywhere">
      Signed in as
      <span class="font-medium text-ink">
        ${escapeHtml(session.name)}
      </span>
    </span>

    <button
      data-logout
      type="button"
      class="min-h-12 rounded-lg border border-burgundy px-6 py-3 font-medium text-burgundy hover:bg-burgundy-soft"
    >
      Log out
    </button>

    <span
      data-logout-error
      role="alert"
      class="text-sm leading-6 text-error"
    ></span>
  `;

  const logoutButton =
    container.querySelector<HTMLButtonElement>("[data-logout]");
  const error = container.querySelector<HTMLSpanElement>("[data-logout-error]");

  logoutButton?.addEventListener("click", () => {
    try {
      clearSession();
      window.location.assign("/");
    } catch {
      if (error) {
        error.textContent = "Unable to clear your session. Please try again.";
      }
    }
  });
}
