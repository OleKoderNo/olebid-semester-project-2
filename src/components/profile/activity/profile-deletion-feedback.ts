/**
 * Displays deletion feedback when arriving from a successful deletion.
 *
 * Consumes the URL marker so refreshing does not repeat the message.
 * Keeps feedback separate from the listings request status.
 *
 * @param container - The rendered My listings container.
 * @returns A function that focuses My listings after initial profile loading.
 */
export function initProfileDeletionFeedback(
  container: HTMLElement,
): () => void {
  const url = new URL(window.location.href);

  if (url.searchParams.get("listingDeleted") !== "1") {
    return () => {};
  }

  const heading = container.querySelector<HTMLHeadingElement>(
    "[data-listings-heading]",
  );

  if (!heading) {
    throw new Error("Deletion feedback is missing the My listings heading.");
  }

  const message = document.createElement("p");
  message.id = "listing-deletion-feedback";
  message.className = "mt-4 text-base leading-6 text-ink";
  message.textContent = "Your listing was deleted.";

  heading.after(message);

  const descriptionIds = heading.getAttribute("aria-describedby");

  heading.setAttribute(
    "aria-describedby",
    [descriptionIds, message.id].filter(Boolean).join(" "),
  );

  url.searchParams.delete("listingDeleted");

  window.history.replaceState(
    window.history.state,
    "",
    `${url.pathname}${url.search}${url.hash}`,
  );

  return () => {
    if (heading.isConnected) {
      heading.focus();
    }
  };
}
