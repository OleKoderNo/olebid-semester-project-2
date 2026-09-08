/**
 * Toggles listing images and their fallback text after loading.
 *
 * @param container - Element containing the listing images.
 */
export function initImageFallbacks(container: HTMLElement): void {
  const images = container.querySelectorAll<HTMLImageElement>(
    "[data-listing-image]",
  );

  images.forEach((image) => {
    const fallback = image.parentElement?.querySelector<HTMLElement>(
      "[data-image-fallback]",
    );

    const updateImage = (): void => {
      const loaded = image.naturalWidth > 0;

      image.hidden = !loaded;

      if (fallback) {
        fallback.hidden = loaded;
      }
    };

    image.addEventListener("load", updateImage, { once: true });
    image.addEventListener("error", updateImage, { once: true });

    if (image.complete) {
      updateImage();
    }
  });
}
