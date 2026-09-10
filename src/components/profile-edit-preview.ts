import { createProfileImage, initProfileImages } from "./profile";

interface PreviewOptions {
  variant: "avatar" | "banner";
  name: string;
}

/**
 * Connects an image preview to its URL and description fields.
 *
 * @param form - The rendered profile editing form.
 * @param options - Image variant and account name.
 * @throws If the image fields or their fieldset are missing.
 */
function initImagePreview(
  form: HTMLFormElement,
  { variant, name }: PreviewOptions,
): void {
  const urlInput = form.querySelector<HTMLInputElement>(
    `[name="${variant}Url"]`,
  );

  const altInput = form.querySelector<HTMLInputElement>(
    `[name="${variant}Alt"]`,
  );

  const fieldset = urlInput?.closest("fieldset");

  if (!urlInput || !altInput || !fieldset) {
    throw new Error(`Profile form is missing its ${variant} fields.`);
  }

  const fields = { url: urlInput, alt: altInput };

  const preview = document.createElement("div");
  preview.className = "mt-4";

  const label = document.createElement("p");
  label.className = "mb-2 text-sm font-medium";
  label.textContent =
    variant === "avatar" ? "Avatar preview" : "Banner preview";

  const imageContainer = document.createElement("div");

  preview.append(label, imageContainer);
  fieldset.append(preview);

  let timeout: number | undefined;

  /**
   * Renders the image using the current form values.
   */
  function renderPreview(): void {
    if (!form.isConnected) {
      return;
    }

    const url = fields.url.value.trim();

    imageContainer.innerHTML = createProfileImage({
      image: url
        ? {
            url,
            alt: fields.alt.value.trim(),
          }
        : null,
      variant,
      name,
    });

    const fallback = imageContainer.querySelector<HTMLElement>(
      "[data-profile-image-fallback]",
    );

    if (fallback) {
      fallback.textContent = url
        ? "Preview unavailable"
        : "Enter an image URL to preview it.";
    }

    initProfileImages(imageContainer);
  }

  fields.url.addEventListener("input", () => {
    window.clearTimeout(timeout);

    // Remove the previous image while the new URL is being entered.
    imageContainer.replaceChildren();

    timeout = window.setTimeout(renderPreview, 400);
  });

  fields.url.addEventListener("change", () => {
    window.clearTimeout(timeout);
    renderPreview();
  });

  fields.alt.addEventListener("input", () => {
    const image = imageContainer.querySelector<HTMLImageElement>(
      "[data-profile-image-content]",
    );

    if (image) {
      image.alt = fields.alt.value.trim() || `${name}'s ${variant}`;
    }
  });

  renderPreview();
}

/**
 * Adds avatar and banner previews to the profile editing form.
 *
 * @param form - The rendered profile editing form.
 * @param name - Account name used for fallback alternative text.
 */
export function initProfileEditPreviews(
  form: HTMLFormElement,
  name: string,
): void {
  initImagePreview(form, { variant: "avatar", name });
  initImagePreview(form, { variant: "banner", name });
}
