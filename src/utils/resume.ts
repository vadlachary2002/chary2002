import type { Experience, Profile, Project } from '../types/profile';

// Experiences that belong on the printed resume, in the profile's order.
export function resumeExperiencesOf(profile: Profile): Experience[] {
  return profile.experiences.filter((experience) => experience.isOnResume !== false);
}

// Projects that belong on the printed resume, in the profile's order.
export function resumeProjectsOf(profile: Profile): Project[] {
  return profile.projects.filter((project) => project.isOnResume !== false);
}

// Groups consecutive experiences that share an employer, so promotions sit under one header.
export function groupByEmployer(experiences: Experience[]): { employer: string; roles: Experience[] }[] {
  const groups: { employer: string; roles: Experience[] }[] = [];
  for (const experience of experiences) {
    const employer = experience.employer ?? experience.company;
    const lastGroup = groups[groups.length - 1];
    if (lastGroup?.employer === employer) lastGroup.roles.push(experience);
    else groups.push({ employer, roles: [experience] });
  }
  return groups;
}
