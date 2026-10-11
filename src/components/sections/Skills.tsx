import { profile, SECTION_IDS } from '../../data/profile';
import { Section } from '../layout/Section';

// Skill groups followed by achievements and certifications.
export function Skills() {
  return (
    <Section id={SECTION_IDS.skills} eyebrow="Skills" title="What I work with.">
      <div className="skills">
        {profile.skillGroups.map((group) => (
          <div key={group.category} className="skills__group">
            <h3>{group.category}</h3>
            <ul>
              {group.skills.map((skill) => (
                <li key={skill}>{skill}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="recognition">
        <div>
          <h3>Achievements</h3>
          <ul>
            {profile.achievements.map((achievement) => (
              <li key={achievement}>{achievement}</li>
            ))}
          </ul>
        </div>
        <div>
          <h3>Certifications</h3>
          <ul>
            {profile.certifications.map((certification) => (
              <li key={certification}>{certification}</li>
            ))}
          </ul>
        </div>
      </div>
    </Section>
  );
}
