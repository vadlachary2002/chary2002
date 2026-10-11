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

const EXTERNAL_LINK_ICON = '<svg class="external-icon" viewBox="0 0 12 12" aria-hidden="true"><path d="M7 1h4v4M11 1 5.5 6.5M9.5 7.5V11h-8.5V2.5H4.5" fill="none" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/></svg>';

// Renders a plain link followed by an external-link icon.
export function externalLink(href: string): string {
  return `${plainLink(href)}${EXTERNAL_LINK_ICON}`;
}
