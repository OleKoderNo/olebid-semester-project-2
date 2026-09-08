import type { PaginationMeta } from "../types/listing";
import { escapeHtml } from "../utils/escape-html";

interface PaginationControls {
  update: (meta: PaginationMeta) => void;
  hide: () => void;
}

/**
 * Creates the pagination markup.
 *
 * @param label - Accessible name describing the paginated content.
 * @returns Navigation markup containing the pagination controls.
 */
function createPaginationMarkup(label: string): string {
  const buttonClasses =
    "min-h-12 rounded-lg border border-burgundy px-6 py-3 " +
    "font-medium text-burgundy hover:bg-burgundy-soft " +
    "disabled:cursor-not-allowed disabled:border-disabled " +
    "disabled:bg-disabled disabled:text-muted";

  return `
    <nav aria-label="${escapeHtml(label)}" hidden>
      <div class="flex flex-wrap items-center justify-center gap-4">
        <button
          data-previous
          type="button"
          class="${buttonClasses}"
        >
          Previous
        </button>

        <p data-page-label class="text-base leading-6"></p>

        <button
          data-next
          type="button"
          class="${buttonClasses}"
        >
          Next
        </button>
      </div>
    </nav>
  `;
}

/**
 * Renders and initialises an independent pagination component.
 * Call once per container.
 *
 * @param container - Element receiving the component.
 * @param onPageChange - Called with the requested page number.
 * @param label - Accessible name for this pagination instance.
 * @returns Methods for updating or hiding the component.
 * @throws If required template elements are missing.
 */
export function initPagination(
  container: HTMLElement,
  onPageChange: (page: number) => void,
  label: string = "Results pages",
): PaginationControls {
  container.innerHTML = createPaginationMarkup(label);

  const navigation = container.querySelector<HTMLElement>("nav");
  const previous =
    container.querySelector<HTMLButtonElement>("[data-previous]");
  const next = container.querySelector<HTMLButtonElement>("[data-next]");
  const pageLabel =
    container.querySelector<HTMLParagraphElement>("[data-page-label]");

  if (!navigation || !previous || !next || !pageLabel) {
    throw new Error("Pagination template is missing required elements.");
  }

  let previousPage: number | null = null;
  let nextPage: number | null = null;

  previous.addEventListener("click", () => {
    if (previousPage !== null) {
      onPageChange(previousPage);
    }
  });

  next.addEventListener("click", () => {
    if (nextPage !== null) {
      onPageChange(nextPage);
    }
  });

  return {
    update(meta): void {
      previousPage = meta.previousPage;
      nextPage = meta.nextPage;

      previous.disabled = previousPage === null;
      next.disabled = nextPage === null;

      pageLabel.textContent = `Page ${meta.currentPage} of ${meta.pageCount}`;

      navigation.hidden = meta.pageCount <= 1;
    },

    hide(): void {
      previousPage = null;
      nextPage = null;
      navigation.hidden = true;
    },
  };
}
