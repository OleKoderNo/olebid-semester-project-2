import { updateProfile } from "../api";
import { getSession } from "../auth/session";
import type { AuctionProfile, UpdateProfileRequest } from "../types/profile";
import { initProfileEditValidation } from "./profile-edit-validation";

/**
 * Connects validation and saving for a profile editing form.
 *
 * @param form - The rendered editing form.
 * @param profile - Profile being edited.
 * @param onSaved - Receives the updated profile after a successful save.
 * @throws If required form controls are missing.
 */
export function initProfileEditSubmit(
  form: HTMLFormElement,
  profile: AuctionProfile,
  onSaved: (profile: AuctionProfile) => void,
): void {
  const saveButton = form.querySelector<HTMLButtonElement>(
    "[data-profile-edit-save]",
  );
  const cancelButton = form.querySelector<HTMLButtonElement>(
    "[data-profile-edit-cancel]",
  );
  const error = form.querySelector<HTMLParagraphElement>(
    "[data-profile-edit-error]",
  );
  const status = form.querySelector<HTMLParagraphElement>(
    "[data-profile-edit-status]",
  );

  if (!saveButton || !cancelButton || !error || !status) {
    throw new Error("Profile form is missing submission controls.");
  }

  const controls = { saveButton, cancelButton, error, status };

  const inputs = form.querySelectorAll<HTMLInputElement | HTMLTextAreaElement>(
    "input, textarea",
  );

  const validate = initProfileEditValidation(form);
  let isSubmitting = false;

  form.noValidate = true;

  /**
   * Prevents changes and duplicate submissions while processing.
   */
  function setPending(pending: boolean): void {
    controls.saveButton.disabled = pending;
    controls.cancelButton.disabled = pending;

    inputs.forEach((input) => {
      input.readOnly = pending;
    });

    controls.saveButton.textContent = pending ? "Saving…" : "Save changes";
  }

  /**
   * Reads editable values from the form.
   * Blank image URLs leave the corresponding images unchanged.
   */
  function readUpdates(): UpdateProfileRequest {
    const values = new FormData(form);

    function read(name: string): string {
      const value = values.get(name);
      return typeof value === "string" ? value.trim() : "";
    }

    const updates: UpdateProfileRequest = {
      bio: read("bio"),
    };

    const avatarUrl = read("avatarUrl");
    const bannerUrl = read("bannerUrl");

    if (avatarUrl) {
      updates.avatar = {
        url: avatarUrl,
        alt: read("avatarAlt"),
      };
    }

    if (bannerUrl) {
      updates.banner = {
        url: bannerUrl,
        alt: read("bannerAlt"),
      };
    }

    return updates;
  }

  form.addEventListener("input", () => {
    controls.error.textContent = "";
    controls.status.textContent = "";
  });

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    if (isSubmitting) {
      return;
    }

    const session = getSession();

    if (!session || session.name !== profile.name) {
      window.location.replace("/login/?reason=auth-required");
      return;
    }

    isSubmitting = true;
    setPending(true);

    controls.error.textContent = "";
    controls.status.textContent = "Checking your profile changes…";

    try {
      const valid = await validate();

      if (!form.isConnected) {
        return;
      }

      if (!valid) {
        controls.status.textContent = "";
        return;
      }

      if (getSession()?.accessToken !== session.accessToken) {
        window.location.reload();
        return;
      }

      controls.status.textContent = "Saving your profile…";

      const { data } = await updateProfile(session.name, readUpdates());

      if (!form.isConnected) {
        return;
      }

      if (getSession()?.accessToken !== session.accessToken) {
        window.location.reload();
        return;
      }

      onSaved(data);
    } catch (error: unknown) {
      if (!form.isConnected) {
        return;
      }

      controls.status.textContent = "";
      controls.error.textContent =
        error instanceof Error
          ? error.message
          : "Unable to update your profile. Please try again.";
    } finally {
      isSubmitting = false;

      if (form.isConnected) {
        setPending(false);
      }
    }
  });
}
