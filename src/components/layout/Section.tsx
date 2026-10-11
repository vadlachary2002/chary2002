import type { ReactNode } from 'react';

interface SectionProps {
  id: string;
  eyebrow: string;
  title: string;
  children: ReactNode;
}

// Shared wrapper giving every content section the same heading rhythm.
export function Section({ id, eyebrow, title, children }: SectionProps) {
  return (
    <section id={id} className="section">
      <p className="section__eyebrow">{eyebrow}</p>
      <h2 className="section__title">{title}</h2>
      {children}
    </section>
  );
}
