import { profile, SECTION_IDS } from '../../data/profile';
import { buildResumeRequestHref } from '../../utils/contact';
import { Section } from '../layout/Section';

// Email call-to-action and profile links.
export function Contact() {
  return (
    <Section id={SECTION_IDS.contact} eyebrow="Contact" title="Let's build something.">
      <div className="contact">
        <a className="contact__email" href={`mailto:${profile.email}`}>
          {profile.email}
        </a>
        <div className="contact__links">
          {profile.links.map((link) => (
            <a key={link.label} href={link.href} target="_blank" rel="noreferrer" className="contact__link">
              <span>{link.label}</span>
              <span className="contact__link-handle">{link.display}</span>
            </a>
          ))}
          <a href={buildResumeRequestHref(profile.email)} className="contact__link contact__link--accent">
            <span>Resume</span>
            <span className="contact__link-handle">Request the PDF</span>
          </a>
        </div>
      </div>
    </Section>
  );
}
