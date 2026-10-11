import type { CardFinishName } from '../config/theme';

export interface ProfileLink {
  label: string;
  href: string;
  display: string;
}

export interface HangingTag {
  shortTitle: string;
  company: string;
}

export interface Experience {
  id: string;
  title: string;
  company: string;
  location?: string;
  period: string;
  highlights: string[];
  companyBlurb?: string;
  logoUrl?: string;
  cardFinish?: CardFinishName;
  tag?: HangingTag;
}

export interface Project {
  name: string;
  summary: string;
  stack: string[];
}

export interface SkillGroup {
  category: string;
  skills: string[];
}

export interface Education {
  degree: string;
  school: string;
  period: string;
  score: string;
}

export interface Profile {
  firstName: string;
  lastName: string;
  currentTitle: string;
  currentCompany: string;
  currentPeriod: string;
  tagline: string;
  about: string[];
  resumeSummary: string;
  email: string;
  portfolioUrl: string;
  links: ProfileLink[];
  photoUrl?: string;
  experiences: Experience[];
  projects: Project[];
  skillGroups: SkillGroup[];
  achievements: string[];
  certifications: string[];
  education: Education;
}
