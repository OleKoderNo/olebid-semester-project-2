import type { AuctionProfile } from "../types/profile";
import { escapeHtml } from "../utils/escape-html";
import { createProfileImage } from "./profile-image";

const numberFormatter = new Intl.NumberFormat("en-US");

/**
 * Creates a profile summary with images, account details and credits.
 *
 * @param profile - Account information returned by the API.
 * @returns Escaped profile markup.
 */
export function createProfileSummary(profile: AuctionProfile): string {
  const name = escapeHtml(profile.name);
  const email = escapeHtml(profile.email);
  const bio = escapeHtml(profile.bio?.trim() || "No bio added yet.");

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
    <div class="space-y-6">
      ${banner}

      <div class="grid gap-6 lg:grid-cols-3">
        <section class="min-w-0 rounded-xl bg-surface p-6 lg:col-span-2">
          <h2 class="font-heading text-2xl leading-8 font-semibold">
            Account details
          </h2>

          <div class="mt-6 flex flex-col gap-6 sm:flex-row sm:items-center">
            ${avatar}

            <dl class="min-w-0">
              <div>
                <dt class="text-sm leading-6 text-muted">
                  Username
                </dt>

                <dd class="mt-1 text-xl leading-8 font-medium wrap-anywhere">
                  ${name}
                </dd>
              </div>
            </dl>
          </div>

          <dl class="mt-6 space-y-6">
            <div>
              <dt class="text-sm leading-6 text-muted">
                Email
              </dt>

              <dd class="mt-1 text-base leading-6 wrap-anywhere">
                ${email}
              </dd>
            </div>

            <div>
              <dt class="text-sm leading-6 text-muted">
                Bio
              </dt>

              <dd class="mt-1 text-base leading-7 whitespace-pre-wrap wrap-anywhere">${bio}</dd>
            </div>
          </dl>
        </section>

        <section class="min-w-0 self-start rounded-xl bg-surface p-6">
          <h2 class="font-heading text-2xl leading-8 font-semibold">
            Credit balance
          </h2>

          <p class="mt-4 text-3xl leading-tight font-bold wrap-anywhere">
            ${numberFormatter.format(profile.credits)} credits
          </p>

          <p class="mt-3 text-sm leading-6 text-muted">
            Your current balance for bidding on OleBid.
          </p>

          <dl class="mt-6 space-y-4 border-t border-disabled pt-6">
            <div class="flex justify-between gap-4">
              <dt class="text-muted">Listings created</dt>

              <dd class="font-medium">
                ${numberFormatter.format(profile._count.listings)}
              </dd>
            </div>

            <div class="flex justify-between gap-4">
              <dt class="text-muted">Auctions won</dt>

              <dd class="font-medium">
                ${numberFormatter.format(profile._count.wins)}
              </dd>
            </div>
          </dl>
        </section>
      </div>
    </div>
  `;
}
