/**
 * Connects validation for profile text and image URLs.
 *
 * @param form - The rendered profile editing form.
 * @returns A function that validates and reports invalid fields.
 * @throws If a required form field is missing.
 */
export function initProfileEditValidation(
  form: HTMLFormElement,
): () => boolean {
  const bio = form.querySelector<HTMLTextAreaElement>('[name="bio"]');
  const avatarUrl = form.querySelector<HTMLInputElement>('[name="avatarUrl"]');
  const avatarAlt = form.querySelector<HTMLInputElement>('[name="avatarAlt"]');
  const bannerUrl = form.querySelector<HTMLInputElement>('[name="bannerUrl"]');
  const bannerAlt = form.querySelector<HTMLInputElement>('[name="bannerAlt"]');

  if (!bio || !avatarUrl || !avatarAlt || !bannerUrl || !bannerAlt) {
    throw new Error("Profile form is missing validation fields.");
  }

  const fields = { bio, avatarUrl, avatarAlt, bannerUrl, bannerAlt };

  /**
   * Sets validation feedback for an image URL and description.
   */
  function validateImage(
    urlInput: HTMLInputElement,
    altInput: HTMLInputElement,
  ): void {
    const value = urlInput.value.trim();
    const description = altInput.value.trim();

    urlInput.setCustomValidity("");
    altInput.setCustomValidity("");

    if (value) {
      try {
        const url = new URL(value);

        if (url.protocol !== "https:" && url.protocol !== "http:") {
          urlInput.setCustomValidity(
            "Enter an image URL starting with https:// or http://.",
          );
        }
      } catch {
        urlInput.setCustomValidity("Enter a complete, valid image URL.");
      }
    }

    if (description.length >= 120) {
      altInput.setCustomValidity(
        "Keep the image description under 120 characters.",
      );
    } else if (description && !value) {
      altInput.setCustomValidity("Add an image URL or clear its description.");
    }
  }

  /**
   * Updates validation messages without interrupting typing.
   */
  function updateValidity(): void {
    fields.bio.setCustomValidity(
      fields.bio.value.trim().length >= 160
        ? "Keep your bio under 160 characters."
        : "",
    );

    validateImage(fields.avatarUrl, fields.avatarAlt);
    validateImage(fields.bannerUrl, fields.bannerAlt);
  }

  form.addEventListener("input", updateValidity);

  form.addEventListener("focusout", (event) => {
    const field = event.target;

    if (
      field instanceof HTMLInputElement ||
      field instanceof HTMLTextAreaElement
    ) {
      updateValidity();
      field.reportValidity();
    }
  });

  updateValidity();

  return () => {
    updateValidity();
    return form.reportValidity();
  };
}
