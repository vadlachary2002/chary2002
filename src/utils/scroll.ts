const HIGHLIGHT_CLASS = 'is-highlighted';
const HIGHLIGHT_DURATION_MS = 1800;

// Builds the DOM id used for an experience entry.
export function experienceElementId(experienceId: string): string {
  return `experience-${experienceId}`;
}

// Smoothly scrolls a section into view.
export function scrollToSection(sectionId: string): void {
  document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// Scrolls to an experience entry and briefly highlights it.
export function scrollToExperience(experienceId: string): void {
  const element = document.getElementById(experienceElementId(experienceId));
  if (!element) return;
  element.scrollIntoView({ behavior: 'smooth', block: 'center' });
  element.classList.add(HIGHLIGHT_CLASS);
  window.setTimeout(() => element.classList.remove(HIGHLIGHT_CLASS), HIGHLIGHT_DURATION_MS);
}
