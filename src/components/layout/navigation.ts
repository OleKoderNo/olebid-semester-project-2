/**
 * Initialises the responsive navigation toggle.
 *
 * Mobile navigation starts collapsed. Desktop navigation stays visible.
 * Escape closes an open mobile menu and returns focus to its button.
 * Call once after the page's header exists.
 */
export function initNavigation(): void {
  const toggle = document.querySelector<HTMLButtonElement>("#menu-toggle");
  const navigation = document.querySelector<HTMLElement>("#main-navigation");

  if (!toggle || !navigation) {
    return;
  }

  const desktop = window.matchMedia("(min-width: 48rem)");
  let isOpen = false;

  /**
   * Synchronises visibility, button text and the expanded state.
   * Moves focus before hiding a control that currently contains it.
   */
  function render(): void {
    if (!toggle || !navigation) {
      return;
    }

    const isDesktop = desktop.matches;
    const showNavigation = isDesktop || isOpen;

    if (isDesktop && document.activeElement === toggle) {
      navigation.hidden = false;
      navigation.querySelector<HTMLAnchorElement>("a")?.focus();
    }

    toggle.hidden = isDesktop;

    if (!showNavigation && navigation.contains(document.activeElement)) {
      toggle.focus();
    }

    navigation.hidden = !showNavigation;
    toggle.setAttribute("aria-expanded", String(showNavigation));
    toggle.textContent = isOpen && !isDesktop ? "Close menu" : "Menu";
  }

  toggle.addEventListener("click", () => {
    isOpen = !isOpen;
    render();
  });

  document.addEventListener("keydown", (event: KeyboardEvent) => {
    if (
      event.key !== "Escape" ||
      desktop.matches ||
      !isOpen ||
      !(
        navigation.contains(document.activeElement) ||
        document.activeElement === toggle
      )
    ) {
      return;
    }

    isOpen = false;
    render();
    toggle.focus();
  });

  desktop.addEventListener("change", () => {
    isOpen = false;
    render();
  });

  render();
}
