import { clearSession, getSession } from "../../auth/session";
import { escapeHtml } from "../../utils/escape-html";
import { initCreditBalance } from "./credit-balance";

/**
 * Renders account controls for the current stored session.
 *
 * Signed-in users receive listing creation and profile links,
 * their credit balance, and a logout button.
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
    <div
      class="flex flex-wrap items-center justify-between gap-x-4 gap-y-2 rounded-lg bg-burgundy-soft px-4 py-3 md:justify-start md:gap-4 md:bg-transparent md:p-0"
    >
      <span class="min-w-0 text-sm leading-6 text-muted wrap-anywhere">
        Signed in as
        <span class="font-medium text-ink">
          ${escapeHtml(session.name)}
        </span>
      </span>

      <span
        data-credit-balance
        role="status"
        aria-atomic="true"
        class="text-sm leading-6 font-medium text-burgundy md:inline-flex md:min-h-12 md:min-w-28 md:items-center md:font-normal md:text-muted"
      ></span>
    </div>

    <a
      href="/profile/"
      class="flex min-h-12 items-center justify-center rounded-lg border border-burgundy px-6 py-3 font-medium text-burgundy underline-offset-4 hover:bg-burgundy-soft md:justify-start md:border-0 md:px-0 md:hover:bg-transparent md:hover:underline"
    >
      My profile
    </a>

    <a
      href="/listing/create/"
      class="flex min-h-12 items-center justify-center rounded-lg bg-burgundy px-6 py-3 font-medium text-surface underline-offset-4 hover:bg-burgundy-hover md:justify-start md:bg-transparent md:px-0 md:text-burgundy md:hover:bg-transparent md:hover:underline"
    >
      Create listing
    </a>

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

  const creditBalance = container.querySelector<HTMLElement>(
    "[data-credit-balance]",
  );

  const logoutButton =
    container.querySelector<HTMLButtonElement>("[data-logout]");

  const error = container.querySelector<HTMLSpanElement>("[data-logout-error]");

  if (creditBalance) {
    void initCreditBalance(creditBalance);
  }

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
