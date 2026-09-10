import { escapeHtml } from "../../utils/escape-html";

interface FormFieldOptions {
  id: string;
  name: string;
  label: string;
  type?: "text" | "email" | "password";
  autocomplete: string;
  hint?: string;
  minLength?: number;
}

/**
 * Creates a required form field with an associated label and hint.
 *
 * @param options - Field configuration. IDs must be unique on the page.
 * @returns Field markup with escaped attribute values and text.
 */
export function createFormField(options: FormFieldOptions): string {
  const {
    id,
    name,
    label,
    type = "text",
    autocomplete,
    hint,
    minLength,
  } = options;

  return `
    <div data-form-field>
      <label
        for="${escapeHtml(id)}"
        class="mb-2 block text-base leading-6 font-medium"
      >
        ${escapeHtml(label)}
      </label>

      ${
        hint
          ? `
            <p
              id="${escapeHtml(id)}-hint"
              class="mb-2 text-sm leading-6 text-muted"
            >
              ${escapeHtml(hint)}
            </p>
          `
          : ""
      }

      <div class="flex items-stretch gap-2">
        <input
          id="${escapeHtml(id)}"
          name="${escapeHtml(name)}"
          type="${type}"
          autocomplete="${escapeHtml(autocomplete)}"
          ${hint ? `aria-describedby="${escapeHtml(id)}-hint"` : ""}
          ${minLength !== undefined ? `minlength="${minLength}"` : ""}
          required
          class="min-h-13.5 min-w-0 flex-1 rounded-lg border border-muted bg-surface px-4 py-3 text-lg leading-7 focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-ink"
        >

        ${
          type === "password"
            ? `
              <button
                data-password-toggle
                data-field-label="${escapeHtml(label)}"
                type="button"
                aria-controls="${escapeHtml(id)}"
                aria-label="Show ${escapeHtml(label.toLowerCase())}"
                class="min-h-13.5 shrink-0 rounded-lg border border-burgundy px-4 py-3 font-medium text-burgundy hover:bg-burgundy-soft"
              >
                Show
              </button>
            `
            : ""
        }
      </div>
    </div>
  `;
}
