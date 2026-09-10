/**
 * Connects password visibility buttons within a form.
 * Call once after rendering its fields.
 *
 * @param container - Element containing the password fields.
 */
export function initPasswordToggles(container: HTMLElement): void {
  const buttons = container.querySelectorAll<HTMLButtonElement>(
    "[data-password-toggle]",
  );

  buttons.forEach((button) => {
    const input = button
      .closest("[data-form-field]")
      ?.querySelector<HTMLInputElement>("input");

    if (!input) {
      return;
    }

    button.addEventListener("click", () => {
      const showPassword = input.type === "password";
      const label = button.dataset.fieldLabel?.toLowerCase() || "password";

      input.type = showPassword ? "text" : "password";
      button.textContent = showPassword ? "Hide" : "Show";
      button.setAttribute(
        "aria-label",
        `${showPassword ? "Hide" : "Show"} ${label}`,
      );
    });
  });
}
