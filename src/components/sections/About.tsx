import { profile, SECTION_IDS } from '../../data/profile';
import { Section } from '../layout/Section';

const QUICK_FACTS = [
  { value: '2+', label: 'years shipping production systems' },
  { value: '3000+', label: 'job board APIs integrated' },
  { value: '600+', label: 'LeetCode problems solved' },
  { value: '9.2', label: 'B.Tech CGPA, IIIT Basar' },
];

// Short bio plus a row of headline numbers.
export function About() {
  return (
    <Section id={SECTION_IDS.about} eyebrow="About" title="I think in systems.">
      <div className="about">
        <div className="about__text">
          {profile.about.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
        <dl className="about__facts">
          {QUICK_FACTS.map((fact) => (
            <div key={fact.label} className="fact">
              <dt>{fact.value}</dt>
              <dd>{fact.label}</dd>
            </div>
          ))}
        </dl>
      </div>
    </Section>
  );
}
