import type { CSSProperties, ReactNode, SyntheticEvent } from 'react';
import type { Experience } from '../../types/profile';
import { profile, SECTION_IDS, SITE_HOST } from '../../data/profile';
import { useResumeProtection } from '../../hooks/useResumeProtection';
import { buildResumeRequestHref } from '../../utils/contact';
import { periodWithDuration } from '../../utils/experience';
import { groupByEmployer, resumeExperiencesOf, resumeProjectsOf } from '../../utils/resume';
import { buildWatermarkImage } from '../../utils/watermark';
import { Section } from '../layout/Section';

// Cancels copy, cut, drag and context-menu events inside the viewer.
function blockEvent(event: SyntheticEvent) {
  event.preventDefault();
}

// In-page resume that can be read but not easily saved, printed or copied.
export function ResumeViewer() {
  const isConcealed = useResumeProtection();
  const fullName = `${profile.firstName} ${profile.lastName}`;
  const watermarkStyle = { '--watermark-image': buildWatermarkImage(`${SITE_HOST} · ${fullName}`) } as CSSProperties;

  return (
    <Section id={SECTION_IDS.resume} eyebrow="Resume" title="Read it here.">
      <p className="resume__note">
        Want a PDF copy? <a href={buildResumeRequestHref(profile.email)}>Request it by email</a> and I&apos;ll send it over.
      </p>
      <div
        className={`resume ${isConcealed ? 'is-concealed' : ''}`}
        onContextMenu={blockEvent}
        onCopy={blockEvent}
        onCut={blockEvent}
        onDragStart={blockEvent}
        style={watermarkStyle}
      >
        <article className="resume__paper">
          <header className="resume__header">
            <h3>{fullName}</h3>
            <p className="resume__headline">{profile.headline}</p>
            <p>
              {profile.email} · {profile.links.map((link) => link.display).join(' · ')}
            </p>
          </header>

          <ResumeBlock title="About">
            <p>{profile.resumeSummary}</p>
          </ResumeBlock>

          <ResumeBlock title="Technical Skills">
            {profile.skillGroups.map((group) => (
              <p key={group.category}>
                <strong>{group.category}:</strong> {group.skills.join(', ')}
              </p>
            ))}
          </ResumeBlock>

          <ResumeBlock title="Experience">
            {groupByEmployer(resumeExperiencesOf(profile)).map(({ employer, roles }) => (
              <div key={employer}>
                {roles.length > 1 && <h5 className="resume__employer">{employer}</h5>}
                {roles.map((experience) => (
                  <ResumeEntry key={experience.id} experience={experience} isGrouped={roles.length > 1} />
                ))}
              </div>
            ))}
          </ResumeBlock>

          <ResumeBlock title="Projects">
            {resumeProjectsOf(profile).map((project) => (
              <p key={project.name}>
                <strong>{project.name}.</strong> {project.summary}
              </p>
            ))}
          </ResumeBlock>

          <ResumeBlock title="Achievements">
            <ul>
              {profile.achievements.map((achievement) => (
                <li key={achievement}>{achievement}</li>
              ))}
            </ul>
          </ResumeBlock>

          <ResumeBlock title="Education">
            <div className="resume__entry-head">
              <strong>{profile.education.degree}</strong>
              <span>{profile.education.period}</span>
            </div>
            <p>
              {profile.education.school} · {profile.education.score}
            </p>
          </ResumeBlock>
        </article>
        <div className="resume__concealed-message" aria-hidden={!isConcealed}>
          Resume hidden while this window is not in focus.
        </div>
      </div>
    </Section>
  );
}

// One role: title, dates with duration, company, then highlights.
function ResumeEntry({ experience, isGrouped }: { experience: Experience; isGrouped: boolean }) {
  return (
    <div className={`resume__entry ${isGrouped ? 'resume__entry--grouped' : ''}`}>
      <div className="resume__entry-head">
        <strong>{experience.title}</strong>
        <span>{periodWithDuration(experience)}</span>
      </div>
      <em>{experience.company}</em>
      <ul>
        {experience.highlights.map((highlight) => (
          <li key={highlight}>{highlight}</li>
        ))}
      </ul>
    </div>
  );
}

// One titled block of the resume.
function ResumeBlock({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="resume__block">
      <h4>{title}</h4>
      {children}
    </section>
  );
}
