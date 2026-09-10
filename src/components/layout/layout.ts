import headerMarkup from "./header.html?raw";
import footerMarkup from "./footer.html?raw";
import { initAuthNavigation } from "./auth-navigation";

/**
 * Normalises equivalent page paths for navigation matching.
 *
 * @param path - URL pathname.
 * @returns Path without index.html or a trailing slash.
 */
function normalisePath(path: string): string {
  return path.replace(/\/index\.html$/, "/").replace(/\/$/, "") || "/";
}

/**
 * Inserts the shared layout and initialises account controls.
 * Call once per page, before initialising mobile navigation.
 *
 * @throws If the page is missing its layout containers.
 */
export function renderLayout(): void {
  const headerContainer = document.querySelector<HTMLElement>("#site-header");
  const footerContainer = document.querySelector<HTMLElement>("#site-footer");

  if (!headerContainer || !footerContainer) {
    throw new Error("The page needs site-header and site-footer containers.");
  }

  headerContainer.innerHTML = headerMarkup;
  footerContainer.innerHTML = footerMarkup;

  initAuthNavigation(headerContainer);

  const currentPath = normalisePath(window.location.pathname);

  const links =
    headerContainer.querySelectorAll<HTMLAnchorElement>("nav a[href]");

  links.forEach((link) => {
    const linkPath = normalisePath(new URL(link.href).pathname);

    if (linkPath === currentPath) {
      link.setAttribute("aria-current", "page");
      link.classList.add("underline", "underline-offset-4");
    }
  });
}
