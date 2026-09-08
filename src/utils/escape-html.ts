/**
 * Escapes text for use in HTML content and quoted attributes.
 *
 * @param value - Text to escape.
 * @returns Text safe to insert into HTML.
 */
export function escapeHtml(value: string): string {
  const characters: Record<string, string> = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
  };

  return value.replace(/[&<>"']/g, (character) => characters[character]!);
}
