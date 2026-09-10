import { canLoadImage } from "../../../utils/can-load-image";

interface ImageCheck {
  url: string;
  loaded: boolean;
}

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

  const fields = { bio, avatarUrl, avatarAlt, bannerUrl, bannerAlt };

  const imageChecks = new WeakMap<HTMLInputElement, ImageCheck>();
  const requestIds = new WeakMap<HTMLInputElement, number>();

  let formVersion = 0;

  /**
   * Checks the URL format and image description.
   * Preserves a failed loading result for the same URL.
   */
  function validateImageFields(
    urlInput: HTMLInputElement,
    altInput: HTMLInputElement,
  ): void {
    const urlValue = urlInput.value.trim();
    const description = altInput.value.trim();

    urlInput.setCustomValidity("");
    altInput.setCustomValidity("");

    if (urlValue) {
      try {
        const url = new URL(urlValue);

        if (url.protocol !== "https:" && url.protocol !== "http:") {
          urlInput.setCustomValidity(
            "Enter an image URL starting with https:// or http://.",
          );
        }
      } catch {
        urlInput.setCustomValidity("Enter a complete, valid image URL.");
      }

      const previousCheck = imageChecks.get(urlInput);

      if (
        urlInput.validity.valid &&
        previousCheck?.url === urlValue &&
        !previousCheck.loaded
      ) {
        urlInput.setCustomValidity(
          "This URL could not be loaded as an image. Check the link and try again.",
        );
      }
    }

    if (description.length >= 120) {
      altInput.setCustomValidity(
        "Keep the image description under 120 characters.",
      );
    } else if (description && !urlValue) {
      altInput.setCustomValidity("Add an image URL or clear its description.");
    }
  }

  /**
   * Updates local validation without displaying browser feedback.
   */
  function updateValidity(): void {
    fields.bio.setCustomValidity(
      fields.bio.value.trim().length >= 160
        ? "Keep your bio under 160 characters."
        : "",
    );

    validateImageFields(fields.avatarUrl, fields.avatarAlt);
    validateImageFields(fields.bannerUrl, fields.bannerAlt);
  }

  /**
   * Checks that a URL loads as an image.
   * Discards results from earlier checks or an unmounted form.
   */
  async function checkImage(
    input: HTMLInputElement,
    description: HTMLInputElement,
  ): Promise<void> {
    const requestId = (requestIds.get(input) ?? 0) + 1;
    requestIds.set(input, requestId);

    // Allow another attempt after a previous loading failure.
    imageChecks.delete(input);
    validateImageFields(input, description);

    const url = input.value.trim();

    if (!url || !input.validity.valid) {
      return;
    }

    const loaded = await canLoadImage(url);

    if (
      !form.isConnected ||
      requestIds.get(input) !== requestId ||
      input.value.trim() !== url
    ) {
      return;
    }

    imageChecks.set(input, { url, loaded });
    validateImageFields(input, description);
  }

  form.addEventListener("input", (event) => {
    formVersion += 1;

    const input = event.target;

    if (
      input instanceof HTMLInputElement &&
      (input === fields.avatarUrl || input === fields.bannerUrl)
    ) {
      requestIds.set(input, (requestIds.get(input) ?? 0) + 1);
      imageChecks.delete(input);
    }

    updateValidity();
  });

  form.addEventListener("focusout", (event) => {
    const field = event.target;

    if (
      field instanceof HTMLInputElement &&
      (field === fields.avatarUrl || field === fields.bannerUrl)
    ) {
      const description =
        field === fields.avatarUrl ? fields.avatarAlt : fields.bannerAlt;

      const version = formVersion;

      void checkImage(field, description).then(() => {
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

    await Promise.all([
      checkImage(fields.avatarUrl, fields.avatarAlt),
      checkImage(fields.bannerUrl, fields.bannerAlt),
    ]);

    if (!form.isConnected || formVersion !== version) {
      return false;
    }

    updateValidity();
    return form.reportValidity();
  };
}
