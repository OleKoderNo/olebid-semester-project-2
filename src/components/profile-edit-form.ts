import type { AuctionProfile } from "../types/profile";
import { escapeHtml } from "../utils/escape-html";

interface ImageFieldOptions {
  label: string;
  name: string;
  url: string;
  alt: string;
}

/**
 * Creates URL and alternative-text fields for a profile image.
 *
 * @param options - Image labels and current values.
 * @returns Escaped image-field markup.
 */
function createImageFields({
  label,
  name,
  url,
  alt,
}: ImageFieldOptions): string {
  const inputClasses =
    "mt-2 min-h-12 w-full rounded-lg border border-muted bg-surface px-4 py-3 text-ink focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-ink";

  return `
    <fieldset class="min-w-0 space-y-4">
      <legend class="text-lg font-semibold">
        ${escapeHtml(label)}
      </legend>

      <label class="block">
        <span class="text-sm font-medium">Image URL</span>

        <input
          type="url"
          name="${name}Url"
          value="${escapeHtml(url)}"
          class="${inputClasses}"
        />
      </label>

      <label class="block">
        <span class="text-sm font-medium">Image description</span>

        <input
          type="text"
          name="${name}Alt"
          value="${escapeHtml(alt)}"
          class="${inputClasses}"
        />
      </label>
    </fieldset>
  `;
}

/**
 * Creates an edit form populated with the current profile.
 *
 * @param profile - Current account information.
 * @returns Escaped form markup.
 */
export function createProfileEditForm(profile: AuctionProfile): string {
  const avatarFields = createImageFields({
    label: "Avatar",
    name: "avatar",
    url: profile.avatar?.url ?? "",
    alt: profile.avatar?.alt ?? "",
  });

  const bannerFields = createImageFields({
    label: "Banner",
    name: "banner",
    url: profile.banner?.url ?? "",
    alt: profile.banner?.alt ?? "",
  });

  return `
    <form data-profile-edit-form class="space-y-6">
      <h2
        data-profile-edit-heading
        tabindex="-1"
        class="font-heading text-2xl leading-8 font-semibold"
      >
        Edit profile
      </h2>

      <label class="block">
        <span class="text-sm font-medium">Bio</span>

        <textarea
          name="bio"
          rows="4"
          class="mt-2 block min-h-32 w-full resize-y rounded-lg border border-muted bg-surface px-4 py-3 text-ink focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-ink"
        >${escapeHtml(profile.bio ?? "")}</textarea>
      </label>

      <div class="grid gap-6 md:grid-cols-2">
        ${avatarFields}
        ${bannerFields}
      </div>

      <p
        data-profile-edit-error
        role="alert"
        class="text-sm leading-6 text-error"
      ></p>

      <p
        data-profile-edit-status
        role="status"
        class="text-sm leading-6 text-muted"
      ></p>

      <div class="flex flex-col gap-3 sm:flex-row">
        <button
          data-profile-edit-save
          type="submit"
          class="min-h-12 rounded-lg bg-burgundy px-6 py-3 font-medium text-surface hover:bg-burgundy-hover disabled:cursor-wait disabled:opacity-60"
        >
          Save changes
        </button>

        <button
          data-profile-edit-cancel
          type="button"
          class="min-h-12 rounded-lg border border-burgundy px-6 py-3 font-medium text-burgundy hover:bg-burgundy-soft"
        >
          Cancel
        </button>
      </div>
    </form>
  `;
}
