/**
 * Connects the preview for one image field.
 *
 * @param field - Fieldset containing the image inputs and preview.
 */
export function initListingImagePreview(field: HTMLElement): void {
  const urlInput = field.querySelector<HTMLInputElement>("[data-image-url]");
  const altInput = field.querySelector<HTMLInputElement>("[data-image-alt]");
  const preview = field.querySelector<HTMLElement>("[data-image-preview]");

  if (!urlInput || !altInput || !preview) {
    throw new Error("Listing image field is missing preview elements.");
  }

  const elements = { urlInput, altInput, preview };
  let timeout: number | undefined;

  function showMessage(text: string): void {
    const message = document.createElement("p");
    message.className = "p-4 text-center text-sm text-muted";
    message.textContent = text;
    elements.preview.replaceChildren(message);
  }

  function updatePreview(): void {
    if (!field.isConnected) {
      return;
    }

    const value = elements.urlInput.value.trim();

    if (!value) {
      showMessage("Enter an image URL to preview it.");
      return;
    }

    let url: URL;

    try {
      url = new URL(value);

      if (!["https:", "http:"].includes(url.protocol)) {
        throw new Error("Unsupported image URL.");
      }
    } catch {
      showMessage("Enter a complete HTTP or HTTPS image URL.");
      return;
    }

    showMessage("Loading preview…");

    const image = new Image();
    image.className = "h-full w-full object-contain";
    image.alt = elements.altInput.value.trim();
    image.hidden = true;

    image.addEventListener(
      "load",
      () => {
        if (image.parentElement !== elements.preview) {
          return;
        }

        elements.preview.replaceChildren(image);
        image.hidden = false;
      },
      { once: true },
    );

    image.addEventListener(
      "error",
      () => {
        if (image.parentElement === elements.preview) {
          showMessage("Preview unavailable. Check the image URL.");
        }
      },
      { once: true },
    );

    elements.preview.append(image);
    image.src = url.href;
  }

  elements.urlInput.addEventListener("input", () => {
    window.clearTimeout(timeout);
    showMessage("Waiting for image URL…");
    timeout = window.setTimeout(updatePreview, 400);
  });

  elements.urlInput.addEventListener("change", () => {
    window.clearTimeout(timeout);
    updatePreview();
  });

  elements.altInput.addEventListener("input", () => {
    const image = elements.preview.querySelector("img");

    if (image) {
      image.alt = elements.altInput.value.trim();
    }
  });
}
