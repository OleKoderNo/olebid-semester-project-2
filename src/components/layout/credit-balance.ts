import { getProfile } from "../../api/profiles";
import { getSession } from "../../auth/session";

const creditFormatter = new Intl.NumberFormat("en-US");

/**
 * Loads and displays the current user's credit balance.
 *
 * Ignores the result if the session changes during the request.
 *
 * @param container - Element where the balance should appear.
 */
export async function initCreditBalance(container: HTMLElement): Promise<void> {
  const session = getSession();

  if (!session) {
    container.textContent = "";
    return;
  }

  container.setAttribute("role", "status");
  container.setAttribute("aria-atomic", "true");
  container.setAttribute("aria-busy", "true");
  container.textContent = "Loading credits…";

  try {
    const { data } = await getProfile(session.name);

    if (getSession()?.accessToken !== session.accessToken) {
      container.textContent = "";
      return;
    }

    if (!Number.isFinite(data.credits) || data.credits < 0) {
      throw new Error("The profile returned an invalid credit balance.");
    }

    container.textContent = `Credits: ${creditFormatter.format(data.credits)}`;
  } catch {
    container.textContent =
      getSession()?.accessToken === session.accessToken
        ? "Credits unavailable"
        : "";
  } finally {
    container.setAttribute("aria-busy", "false");
  }
}
