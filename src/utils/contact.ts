const RESUME_REQUEST_SUBJECT = 'Resume request from your portfolio';

// Builds the mailto link recruiters use to request the PDF resume.
export function buildResumeRequestHref(email: string): string {
  return `mailto:${email}?subject=${encodeURIComponent(RESUME_REQUEST_SUBJECT)}`;
}
