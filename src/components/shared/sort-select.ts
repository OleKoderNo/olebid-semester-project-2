import { escapeHtml } from "../../utils/escape-html";

interface SortOption<T extends string> {
  value: T;
  label: string;
}

interface SortSelectOptions<T extends string> {
  label: string;
  options: readonly SortOption<T>[];
  initialValue: T;
  onChange: (value: T) => void;
}

/**
 * Renders a labelled select and connects its change behaviour.
 * Call once per container.
 *
 * @param container - Element receiving the control.
 * @param settings - Label, available choices and change callback.
 * @throws If the initial value or template is invalid.
 */
export function initSortSelect<T extends string>(
  container: HTMLElement,
  settings: SortSelectOptions<T>,
): void {
  const { label, options, initialValue, onChange } = settings;

  if (!options.some((option) => option.value === initialValue)) {
    throw new Error("The initial sorting choice must exist in the options.");
  }

  container.innerHTML = `
    <label class="block">
      <span class="mb-2 block text-base leading-6 font-medium">
        ${escapeHtml(label)}
      </span>

      <select
        class="min-h-13.5 w-full rounded-lg border border-muted bg-surface px-4 py-3 text-base text-ink focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-ink"
      >
        ${options
          .map(
            (option) => `
              <option value="${escapeHtml(option.value)}">
                ${escapeHtml(option.label)}
              </option>
            `,
          )
          .join("")}
      </select>
    </label>
  `;

  const select = container.querySelector<HTMLSelectElement>("select");

  if (!select) {
    throw new Error("Sort select template is missing its select element.");
  }

  select.value = initialValue;

  select.addEventListener("change", () => {
    const selected = options.find((option) => option.value === select.value);

    if (selected) {
      onChange(selected.value);
    }
  });
}
