import { getFormSnapshot } from "../../utils/form-snapshot";

export interface UnsavedChangesGuard {
  confirmDiscard: () => boolean;
  destroy: () => void;
}

/**
 * Warns before leaving a form with unsaved changes.
 *
 * @param form - Form whose initial values represent the saved state.
 * @param message - Confirmation message for cancellation and link navigation.
 * @returns Controls for confirming cancellation and removing listeners.
 */
export function initUnsavedChanges(
  form: HTMLFormElement,
  message = "You have unsaved changes. Discard them and leave?",
): UnsavedChangesGuard {
  const initialSnapshot = getFormSnapshot(form);

  let destroyed = false;
  let unloadListenerAttached = false;

  function hasChanges(): boolean {
    return (
      !destroyed &&
      form.isConnected &&
      getFormSnapshot(form) !== initialSnapshot
    );
  }

  function confirmDiscard(): boolean {
    return !hasChanges() || window.confirm(message);
  }

  function handleBeforeUnload(event: BeforeUnloadEvent): void {
    if (hasChanges()) {
      event.preventDefault();
    }
  }

  function updateWarning(): void {
    const shouldWarn = hasChanges();

    if (shouldWarn && !unloadListenerAttached) {
      window.addEventListener("beforeunload", handleBeforeUnload);
      unloadListenerAttached = true;
    } else if (!shouldWarn && unloadListenerAttached) {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      unloadListenerAttached = false;
    }
  }

  function handleLinkClick(event: MouseEvent): void {
    if (
      event.defaultPrevented ||
      event.button !== 0 ||
      event.ctrlKey ||
      event.metaKey ||
      event.shiftKey ||
      event.altKey ||
      !(event.target instanceof Element)
    ) {
      return;
    }

    const link = event.target.closest<HTMLAnchorElement>("a[href]");

    if (
      !link ||
      link.hasAttribute("download") ||
      (link.target && link.target !== "_self")
    ) {
      return;
    }

    const destination = new URL(link.href);

    if (!["http:", "https:"].includes(destination.protocol)) {
      return;
    }

    // In-page anchor links do not discard the form.
    if (
      destination.origin === window.location.origin &&
      destination.pathname === window.location.pathname &&
      destination.search === window.location.search &&
      destination.hash
    ) {
      return;
    }

    if (!hasChanges()) {
      return;
    }

    if (!confirmDiscard()) {
      event.preventDefault();
      return;
    }

    // Avoid a second warning from beforeunload.
    destroy();
  }

  function destroy(): void {
    destroyed = true;

    form.removeEventListener("input", updateWarning);
    form.removeEventListener("change", updateWarning);
    document.removeEventListener("click", handleLinkClick);
    window.removeEventListener("beforeunload", handleBeforeUnload);

    unloadListenerAttached = false;
  }

  form.addEventListener("input", updateWarning);
  form.addEventListener("change", updateWarning);
  document.addEventListener("click", handleLinkClick);

  return { confirmDiscard, destroy };
}
