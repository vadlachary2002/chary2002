import type { ReactNode } from 'react';
import { profile, SECTION_IDS } from '../../data/profile';
import { scrollToSection } from '../../utils/scroll';

interface HeroCopyProps {
  children?: ReactNode;
}

// Name, role, tagline and primary actions shared by every hero variant.
export function HeroCopy({ children }: HeroCopyProps) {
  return (
    <div className="hero__copy">
      <div className="hero__avatar" aria-hidden={!profile.photoUrl}>
        {profile.photoUrl ? <img src={profile.photoUrl} alt={`${profile.firstName} ${profile.lastName}`} /> : `${profile.firstName[0]}${profile.lastName[0]}`}
      </div>
      <p className="hero__eyebrow">Hi, I&apos;m</p>
      <h1 className="hero__name">
        {profile.firstName} <span>{profile.lastName}</span>
      </h1>
      <p className="hero__role">
        {profile.currentTitle} <span className="hero__at">at</span> {profile.currentCompany}
      </p>
      <p className="hero__tagline">{profile.tagline}</p>

      <div className="hero__actions">
        <button type="button" className="button button--primary" onClick={() => scrollToSection(SECTION_IDS.experience)}>
          See my work
        </button>
        <button type="button" className="button" onClick={() => scrollToSection(SECTION_IDS.resume)}>
          Read resume
        </button>
      </div>
      {children}
    </div>
  );
}
