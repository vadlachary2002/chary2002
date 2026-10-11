import { profile, SECTION_IDS } from '../../data/profile';
import { periodWithDuration } from '../../utils/experience';
import { experienceElementId } from '../../utils/scroll';
import { Section } from '../layout/Section';

// Vertical timeline of every role, newest first.
export function ExperienceTimeline() {
  return (
    <Section id={SECTION_IDS.experience} eyebrow="Experience" title="Where I've built things.">
      <ol className="timeline">
        {profile.experiences.map((experience) => (
          <li key={experience.id} id={experienceElementId(experience.id)} className="timeline__item">
            <div className="timeline__marker" aria-hidden="true" />
            <div className="timeline__header">
              <h3>{experience.title}</h3>
              <span className="timeline__period">{periodWithDuration(experience)}</span>
            </div>
            <p className="timeline__company">
              {experience.company}
              {experience.location && <span> · {experience.location}</span>}
            </p>
            <ul className="timeline__highlights">
              {experience.highlights.map((highlight) => (
                <li key={highlight}>{highlight}</li>
              ))}
            </ul>
          </li>
        ))}
      </ol>
    </Section>
  );
}
