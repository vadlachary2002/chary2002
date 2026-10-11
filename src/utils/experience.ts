import type { Experience } from '../types/profile';

const YEAR_PATTERN = /\d{4}/;
const DOMAIN_SUFFIX_PATTERN = /\.[a-z]+$/i;
const CAPITAL_PATTERN = /[A-Z]/g;
const MONOGRAM_LENGTH = 2;
const MONTH_YEAR_PATTERN = /(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec) (\d{4})/g;
const MONTH_INDEX: Record<string, number> = { Jan: 0, Feb: 1, Mar: 2, Apr: 3, May: 4, Jun: 5, Jul: 6, Aug: 7, Sep: 8, Oct: 9, Nov: 10, Dec: 11 };
const MONTHS_PER_YEAR = 12;
const DURATION_SEPARATOR = ' · ';

// Returns the first four-digit year in a period like "Jan 2025 — Present".
export function startYearOf(experience: Experience): string {
  return experience.period.match(YEAR_PATTERN)?.[0] ?? '';
}

// Text printed along an experience's lanyard strap.
export function strapLabelOf(experience: Experience): string {
  return (experience.tag?.company ?? experience.company).toUpperCase();
}

// Two-letter monogram from a company name, e.g. "TechRangers.in" becomes "TR".
export function monogramOf(company: string): string {
  const name = company.replace(DOMAIN_SUFFIX_PATTERN, '');
  const capitals = name.match(CAPITAL_PATTERN) ?? [];
  const letters = capitals.length >= MONOGRAM_LENGTH ? capitals.join('') : name;
  return letters.slice(0, MONOGRAM_LENGTH).toUpperCase();
}

// Months between two month indexes, counting both the first and the last month.
function inclusiveMonths(startMonthIndex: number, endMonthIndex: number): number {
  return Math.max(endMonthIndex - startMonthIndex + 1, 1);
}

// Short duration label: "3 mos" under a year, otherwise years to one decimal such as "2.8 yrs".
function formatDuration(months: number): string {
  if (months < MONTHS_PER_YEAR) return `${months} ${months === 1 ? 'mo' : 'mos'}`;
  const years = Number((months / MONTHS_PER_YEAR).toFixed(1));
  return `${years} ${years === 1 ? 'yr' : 'yrs'}`;
}

// How long a role lasted, from its period text; an open-ended role runs to the given date.
export function durationOf(experience: Experience, today: Date = new Date()): string {
  const [start, end] = [...experience.period.matchAll(MONTH_YEAR_PATTERN)].map(([, month, year]) => Number(year) * MONTHS_PER_YEAR + MONTH_INDEX[month]);
  if (start === undefined) return '';
  const endIndex = end ?? today.getFullYear() * MONTHS_PER_YEAR + today.getMonth();
  return formatDuration(inclusiveMonths(start, endIndex));
}

// Period text with its duration appended, e.g. "Jan 2024 — Present · 2.8 yrs".
export function periodWithDuration(experience: Experience, today: Date = new Date()): string {
  const duration = durationOf(experience, today);
  return duration ? `${experience.period}${DURATION_SEPARATOR}${duration}` : experience.period;
}
