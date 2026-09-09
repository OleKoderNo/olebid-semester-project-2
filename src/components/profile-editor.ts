import type { AuctionProfile } from "../types/profile";
import { createProfileEditForm } from "./profile-edit-form";
import { initProfileEditSubmit } from "./profile-edit-submit";
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
  let currentProfile = profile;

  /**
   * Restores the profile and optionally focuses its edit button.
   */
  function showProfile(restoreFocus = false, saved = false): void {
    container.innerHTML = `
      ${createProfileSummary(currentProfile)}

      <p
        data-profile-save-feedback
        role="status"
        class="mt-4 text-sm leading-6 text-muted"
      ></p>
    `;

    const actions = container.querySelector<HTMLElement>(
      "[data-profile-actions]",
    );

    if (!actions) {
      throw new Error("Profile summary is missing its actions container.");
    }

    actions.innerHTML = `
      <button
        data-profile-edit
        type="button"
        class="min-h-12 rounded-lg border border-burgundy px-6 py-3 font-medium text-burgundy hover:bg-burgundy-soft"
      >
        Edit profile
      </button>
    `;

    initProfileImages(container);

    const editButton = actions.querySelector<HTMLButtonElement>(
      "[data-profile-edit]",
    );

    const feedback = container.querySelector<HTMLParagraphElement>(
      "[data-profile-save-feedback]",
    );

    editButton?.addEventListener("click", showEditor);

    if (restoreFocus) {
      editButton?.focus();
    }

    if (saved && feedback) {
      feedback.textContent = "Your profile has been updated.";
    }
  }

  /**
   * Opens the form using the latest profile information.
   */
  function showEditor(): void {
    container.innerHTML = createProfileEditForm(currentProfile);

    const form = container.querySelector<HTMLFormElement>(
      "[data-profile-edit-form]",
    );

    const heading = container.querySelector<HTMLHeadingElement>(
      "[data-profile-edit-heading]",
    );

    const cancelButton = container.querySelector<HTMLButtonElement>(
      "[data-profile-edit-cancel]",
    );

    if (!form || !heading || !cancelButton) {
      throw new Error("Profile editor is missing required elements.");
    }

    initProfileEditSubmit(form, currentProfile, (updatedProfile) => {
      currentProfile = updatedProfile;
      showProfile(true, true);
    });

    cancelButton.addEventListener("click", () => {
      showProfile(true);
    });

    heading.focus();
  }

  showProfile();
}
