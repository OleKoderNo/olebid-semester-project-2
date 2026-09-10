import type { ProfileImage } from "../../types/profile";
import { escapeHtml } from "../../utils/escape-html";

interface ProfileImageOptions {
  image: ProfileImage | null;
  variant: "avatar" | "banner";
  name: string;
}

/**
 * Creates an avatar or banner with a fallback.
 *
 * @param options - Image, appearance and account name.
 * @returns Escaped image markup.
 */
export function createProfileImage({
  image,
  variant,
  name,
}: ProfileImageOptions): string {
  let imageUrl = "";

  try {
    const url = new URL(image?.url ?? "");

    if (url.protocol === "https:" || url.protocol === "http:") {
      imageUrl = url.href;
    }
  } catch {
    // Missing or invalid URLs use the fallback.
  }

  const isAvatar = variant === "avatar";

  const containerClasses = isAvatar
    ? "size-28 shrink-0 rounded-full md:size-36"
    : "h-40 w-full rounded-xl md:h-64";

  const fallback = isAvatar ? "No avatar" : "No banner added";
  const alt = image?.alt.trim() || `${name}'s ${variant}`;

  return `
    <div
      data-profile-image
      class="relative overflow-hidden bg-burgundy-soft ${containerClasses}"
    >
      <span
        data-profile-image-fallback
        class="absolute inset-0 flex items-center justify-center p-4 text-center text-sm leading-6 text-muted"
      >
        ${fallback}
      </span>

      ${
        imageUrl
          ? `
            <img
              data-profile-image-content
              src="${escapeHtml(imageUrl)}"
              alt="${escapeHtml(alt)}"
              class="relative h-full w-full object-cover"
              decoding="async"
              hidden
            />
          `
          : ""
      }
    </div>
  `;
}

/**
 * Connects load and error handling for rendered profile images.
 *
 * Also handles images that finished loading before initialization.
 *
 * @param container - Element containing the profile images.
 */
export function initProfileImages(container: HTMLElement): void {
  const images = container.querySelectorAll<HTMLImageElement>(
    "[data-profile-image-content]",
  );

  images.forEach((image) => {
    const wrapper = image.closest<HTMLElement>("[data-profile-image]");

    const fallback = wrapper?.querySelector<HTMLElement>(
      "[data-profile-image-fallback]",
    );

    if (!fallback) {
      return;
    }

    function updateImage(): void {
      const loaded = image.complete && image.naturalWidth > 0;

      image.hidden = !loaded;
      fallback!.hidden = loaded;
    }

    image.addEventListener("load", updateImage, { once: true });
    image.addEventListener("error", updateImage, { once: true });

    updateImage();
  });
}
