import { canLoadImage } from "../../../utils/can-load-image";

interface ImageCheck {
  url: string;
  loaded: boolean;
}

interface ProfileImageValidator {
  update: () => void;
  invalidate: () => void;
  check: () => Promise<void>;
}

/**
 * Creates validation for one profile image and its description.
 *
 * @param form - Form containing the image fields.
 * @param urlInput - Image URL field.
 * @param altInput - Image description field.
 * @returns Controls for updating and checking image validity.
 */
export function createProfileImageValidator(
  form: HTMLFormElement,
  urlInput: HTMLInputElement,
  altInput: HTMLInputElement,
): ProfileImageValidator {
  let previousCheck: ImageCheck | undefined;
  let requestId = 0;

  /**
   * Updates URL and description validity without displaying feedback.
   */
  function update(): void {
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
   * Discards the previous result and invalidates pending checks.
   */
  function invalidate(): void {
    requestId += 1;
    previousCheck = undefined;
  }

  /**
   * Checks whether the current URL loads as an image.
   * Ignores outdated results and results for an unmounted form.
   */
  async function check(): Promise<void> {
    invalidate();

    const currentRequestId = requestId;
    update();

    const url = urlInput.value.trim();

    if (!url || !urlInput.validity.valid) {
      return;
    }

    const loaded = await canLoadImage(url);

    if (
      !form.isConnected ||
      requestId !== currentRequestId ||
      urlInput.value.trim() !== url
    ) {
      return;
    }

    previousCheck = { url, loaded };
    update();
  }

  return { update, invalidate, check };
}
