/**
 * Checks whether the browser can load a URL as an image.
 *
 * @param url - Complete image URL.
 * @param timeoutMs - Maximum time to wait for the image.
 * @returns Whether the image loaded successfully.
 */
export function canLoadImage(
  url: string,
  timeoutMs = 10_000,
): Promise<boolean> {
  return new Promise((resolve) => {
    const image = new Image();

    const timeout = window.setTimeout(() => {
      finish(false);
    }, timeoutMs);

    function finish(loaded: boolean): void {
      window.clearTimeout(timeout);

      image.onload = null;
      image.onerror = null;
      image.removeAttribute("src");

      resolve(loaded);
    }

    image.onload = () => {
      finish(image.naturalWidth > 0 && image.naturalHeight > 0);
    };

    image.onerror = () => {
      finish(false);
    };

    image.src = url;
  });
}
