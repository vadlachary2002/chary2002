import { profile, SECTION_IDS } from '../../data/profile';
import { Section } from '../layout/Section';

// Grid of project cards.
export function Projects() {
  return (
    <Section id={SECTION_IDS.projects} eyebrow="Projects" title="Things I've made.">
      <div className="projects">
        {profile.projects.map((project, index) => (
          <article key={project.name} className="project">
            <span className="project__index">{String(index + 1).padStart(2, '0')}</span>
            <h3>{project.name}</h3>
            <p>{project.summary}</p>
            <ul className="project__stack">
              {project.stack.map((technology) => (
                <li key={technology}>{technology}</li>
              ))}
            </ul>
          </article>
        ))}
      </div>
    </Section>
  );
}
