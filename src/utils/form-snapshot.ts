/**
 * Serializes named form controls for change detection.
 * Includes disabled controls.
 *
 * @param form - Form whose current values should be captured.
 * @returns A comparable snapshot of the form values.
 */
export function getFormSnapshot(form: HTMLFormElement): string {
  const values: string[] = [];

  for (const element of Array.from(form.elements)) {
    if (element instanceof HTMLInputElement) {
      if (
        !element.name ||
        ["button", "submit", "reset", "image"].includes(element.type)
      ) {
        continue;
      }

      if (element.type === "file") {
        const files = Array.from(element.files ?? []).map((file) => ({
          name: file.name,
          size: file.size,
          lastModified: file.lastModified,
        }));

        values.push(JSON.stringify({ name: element.name, files }));
        continue;
      }

      values.push(
        JSON.stringify({
          name: element.name,
          value: element.value,
          checked:
            element.type === "checkbox" || element.type === "radio"
              ? element.checked
              : undefined,
        }),
      );

      continue;
    }

    if (element instanceof HTMLTextAreaElement && element.name) {
      values.push(
        JSON.stringify({
          name: element.name,
          value: element.value,
        }),
      );

      continue;
    }

    if (element instanceof HTMLSelectElement && element.name) {
      values.push(
        JSON.stringify({
          name: element.name,
          selected: Array.from(
            element.selectedOptions,
            (option) => option.value,
          ),
        }),
      );
    }
  }

  return JSON.stringify(values);
}
