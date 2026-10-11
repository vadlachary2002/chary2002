const HTML_ESCAPES: Record<string, string> = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };
const HTML_ESCAPE_PATTERN = /[&<>"']/g;

// Escapes text so it can be placed inside HTML markup.
export function escapeHtml(text: string): string {
  return text.replace(HTML_ESCAPE_PATTERN, (character) => HTML_ESCAPES[character]);
}

// Renders a bulleted list from plain text items.
export function bulletList(items: string[]): string {
  return `<ul>${items.map((item) => `<li>${escapeHtml(item)}</li>`).join('')}</ul>`;
}

// Renders a link whose visible text is the URL without its protocol and trailing slash.
export function plainLink(href: string): string {
  const visibleText = href.replace(/^https?:\/\//, '').replace(/\/$/, '');
  return `<a href="${escapeHtml(href)}">${escapeHtml(visibleText)}</a>`;
}
