import type { AuctionProfile } from "../types/profile";
import { escapeHtml } from "../utils/escape-html";
import { createProfileImage } from "./profile-image";

const numberFormatter = new Intl.NumberFormat("en-US");

/**
 * Creates the profile's banner, identity, bio and balance.
 * Includes a container for account actions.
 *
 * @param profile - Account information returned by the API.
 * @returns Escaped profile markup.
 */
export function createProfileSummary(profile: AuctionProfile): string {
  const name = escapeHtml(profile.name);
  const bio = escapeHtml(profile.bio?.trim() || "No bio added yet.");
  const credits = numberFormatter.format(profile.credits);

  const banner = createProfileImage({
    image: profile.banner,
    variant: "banner",
    name: profile.name,
  });

  const avatar = createProfileImage({
    image: profile.avatar,
    variant: "avatar",
    name: profile.name,
  });

  return `
    <div>
      ${banner}

      <div class="relative -mt-14 flex min-w-0 flex-col gap-4 px-4 sm:flex-row sm:items-end sm:gap-6 md:-mt-18 md:px-6">
        <div class="shrink-0 self-start rounded-full ring-4 ring-ivory">
          ${avatar}
        </div>

        <div class="flex min-w-0 flex-1 flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <h2 class="min-w-0 font-heading text-3xl leading-tight font-semibold wrap-anywhere">
            ${name}
          </h2>

          <div
            data-profile-actions
            class="flex shrink-0 flex-wrap gap-3 empty:hidden"
          ></div>
        </div>
      </div>

      <p class="mt-6 text-base leading-7 text-muted whitespace-pre-wrap wrap-anywhere">${bio}</p>

      <p class="mt-6 text-lg leading-7 font-semibold wrap-anywhere">
        Available balance: ${credits} credits
      </p>
    </div>
  `;
}
