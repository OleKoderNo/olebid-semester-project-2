import { createProfileImageValidator } from "./profile-image-validation";

/**
 * Connects profile text, URL and image-loading validation.
 *
 * @param form - The rendered profile editing form.
 * @returns An asynchronous function that validates the whole form.
 * @throws If a required form field is missing.
 */
export function initProfileEditValidation(
  form: HTMLFormElement,
): () => Promise<boolean> {
  const bio = form.querySelector<HTMLTextAreaElement>('[name="bio"]');
  const avatarUrl = form.querySelector<HTMLInputElement>('[name="avatarUrl"]');
  const avatarAlt = form.querySelector<HTMLInputElement>('[name="avatarAlt"]');
  const bannerUrl = form.querySelector<HTMLInputElement>('[name="bannerUrl"]');
  const bannerAlt = form.querySelector<HTMLInputElement>('[name="bannerAlt"]');

  if (!bio || !avatarUrl || !avatarAlt || !bannerUrl || !bannerAlt) {
    throw new Error("Profile form is missing validation fields.");
  }

  const fields = { bio, avatarUrl, bannerUrl };

  const avatar = createProfileImageValidator(form, avatarUrl, avatarAlt);
  const banner = createProfileImageValidator(form, bannerUrl, bannerAlt);

  let formVersion = 0;

  /**
   * Updates validity without displaying browser feedback.
   */
  function updateValidity(): void {
    fields.bio.setCustomValidity(
      fields.bio.value.trim().length >= 160
        ? "Keep your bio under 160 characters."
        : "",
    );

    avatar.update();
    banner.update();
  }

  form.addEventListener("input", (event) => {
    formVersion += 1;

    if (event.target === fields.avatarUrl) {
      avatar.invalidate();
    } else if (event.target === fields.bannerUrl) {
      banner.invalidate();
    }

    updateValidity();
  });

  form.addEventListener("focusout", (event) => {
    const field = event.target;

    if (
      field instanceof HTMLInputElement &&
      (field === fields.avatarUrl || field === fields.bannerUrl)
    ) {
      const validator = field === fields.avatarUrl ? avatar : banner;
      const version = formVersion;

      void validator.check().then(() => {
        if (form.isConnected && formVersion === version) {
          field.reportValidity();
        }
      });

      return;
    }

    if (
      field instanceof HTMLInputElement ||
      field instanceof HTMLTextAreaElement
    ) {
      updateValidity();
      field.reportValidity();
    }
  });

  updateValidity();

  return async () => {
    const version = formVersion;

    await Promise.all([avatar.check(), banner.check()]);

    if (!form.isConnected || formVersion !== version) {
      return false;
    }

    updateValidity();
    return form.reportValidity();
  };
}
