import headerMarkup from "./header.html?raw";
import footerMarkup from "./footer.html?raw";

/**
 * Removes a trailing slash and index.html so equivalent page URLs match.
 */
function normalisePath(path: string): string {
  return path.replace(/\/index\.html$/, "/").replace(/\/$/, "") || "/";
}

/**
 * Inserts the shared header and footer and identifies the current page.
 *
 * Call once per page, before initialising navigation behaviour.
 * Only trusted, local HTML templates are inserted here.
 */
export function renderLayout(): void {
  const headerContainer = document.querySelector<HTMLElement>("#site-header");
  const footerContainer = document.querySelector<HTMLElement>("#site-footer");

  if (!headerContainer || !footerContainer) {
    throw new Error("The page needs site-header and site-footer containers.");
  }

  headerContainer.innerHTML = headerMarkup;
  footerContainer.innerHTML = footerMarkup;

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
