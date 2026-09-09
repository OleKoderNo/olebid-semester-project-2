import type { AuctionProfile } from "../types/profile";
import { createProfileEditForm } from "./profile-edit-form";
import { initProfileEditValidation } from "./profile-edit-validation";
import { initProfileImages } from "./profile-image";
import { createProfileSummary } from "./profile-summary";

/**
 * Displays a profile and connects its editing controls.
 *
 * @param container - Element containing the profile.
 * @param profile - Current account information.
 */
export function initProfileEditor(
  container: HTMLElement,
  profile: AuctionProfile,
): void {
  /**
   * Restores the profile and optionally focuses its edit button.
   */
  function showProfile(restoreFocus = false): void {
    container.innerHTML = `
      ${createProfileSummary(profile)}

      <div class="mt-6">
        <button
          data-profile-edit
          type="button"
          class="min-h-12 rounded-lg border border-burgundy px-6 py-3 font-medium text-burgundy hover:bg-burgundy-soft"
        >
          Edit profile
        </button>
      </div>
    `;

    initProfileImages(container);

    const editButton = container.querySelector<HTMLButtonElement>(
      "[data-profile-edit]",
    );

    editButton?.addEventListener("click", showEditor);

    if (restoreFocus) {
      editButton?.focus();
    }
  }

  /**
   * Opens the form using the currently loaded profile.
   */
  function showEditor(): void {
    container.innerHTML = createProfileEditForm(profile);

    const form = container.querySelector<HTMLFormElement>(
      "[data-profile-edit-form]",
    );

    const heading = container.querySelector<HTMLHeadingElement>(
      "[data-profile-edit-heading]",
    );

    const cancelButton = container.querySelector<HTMLButtonElement>(
      "[data-profile-edit-cancel]",
    );

    const saveButton = container.querySelector<HTMLButtonElement>(
      "[data-profile-edit-save]",
    );

    if (!form || !heading || !cancelButton || !saveButton) {
      throw new Error("Profile editor is missing required elements.");
    }

    const validate = initProfileEditValidation(form);

    // Report validation ourselves when submission is connected.
    form.noValidate = true;

    // Saving will be enabled when the API update is connected.
    saveButton.disabled = true;
    saveButton.classList.remove("disabled:cursor-wait");

    form.addEventListener("submit", (event) => {
      event.preventDefault();
      validate();
    });

    cancelButton.addEventListener("click", () => {
      showProfile(true);
    });

    heading.focus();
  }

  showProfile();
}
