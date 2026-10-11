import { profile } from '../../src/data/profile';
import type { Experience, Project, SkillGroup } from '../../src/types/profile';
import { periodWithDuration } from '../../src/utils/experience';
import { groupByEmployer, resumeExperiencesOf, resumeProjectsOf } from '../../src/utils/resume';
import { bulletList, escapeHtml, externalLink, plainLink } from './html.helper';
import { RESUME_STYLES } from './resumeStyles';

const CONTACT_SEPARATOR = ' · ';

// Full resume document built from the same profile data the site renders.
export function renderResumeHtml(): string {
  const fullName = `${profile.firstName} ${profile.lastName}`;
  const sections = [
    renderBlock('About', `<p>${escapeHtml(profile.resumeSummary)}</p>`),
    renderBlock('Technical Skills', profile.skillGroups.map(renderSkillGroup).join('')),
    renderBlock('Experience', groupByEmployer(resumeExperiencesOf(profile)).map(renderEmployerGroup).join('')),
    renderBlock('Projects', resumeProjectsOf(profile).map(renderProject).join('')),
    renderBlock('Achievements', bulletList(profile.achievements)),
    renderBlock('Certifications', bulletList(profile.certifications)),
    renderBlock('Education', renderEducation()),
  ];

  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<title>${escapeHtml(fullName)} · Resume</title>
<meta name="author" content="${escapeHtml(fullName)}" />
<style>${RESUME_STYLES}</style>
</head>
<body>
${renderHeader(fullName)}
${sections.join('\n')}
</body>
</html>`;
}

// Name, headline and contact line with clickable links.
function renderHeader(fullName: string): string {
  const contactItems = [
    `<a href="mailto:${escapeHtml(profile.email)}">${escapeHtml(profile.email)}</a>`,
    `Portfolio: ${externalLink(profile.portfolioUrl)}`,
    ...profile.links.map((link) => plainLink(link.href)),
  ];
  return `<header class="header">
<h1>${escapeHtml(fullName)}</h1>
<p class="headline">${escapeHtml(profile.headline)}</p>
<p class="contact">${contactItems.join(CONTACT_SEPARATOR)}</p>
</header>`;
}

// One titled resume section.
function renderBlock(title: string, body: string): string {
  return `<section class="block"><h2>${escapeHtml(title)}</h2>${body}</section>`;
}

// One "Category: skill, skill" line.
function renderSkillGroup(group: SkillGroup): string {
  return `<p><strong>${escapeHtml(group.category)}:</strong> ${escapeHtml(group.skills.join(', '))}</p>`;
}

// An employer header when it holds several roles, then each role.
function renderEmployerGroup({ employer, roles }: { employer: string; roles: Experience[] }): string {
  const header = roles.length > 1 ? `<h3 class="employer">${escapeHtml(employer)}</h3>` : '';
  return `${header}${roles.map((role) => renderExperience(role, roles.length > 1)).join('')}`;
}

// Role, dates with duration, company with location, then highlights.
function renderExperience(experience: Experience, isGrouped: boolean): string {
  const companyLine = [experience.company, experience.location].filter(Boolean).join(CONTACT_SEPARATOR);
  return `<div class="entry${isGrouped ? ' entry--grouped' : ''}">
<div class="entry-head"><strong>${escapeHtml(experience.title)}</strong><span>${escapeHtml(periodWithDuration(experience))}</span></div>
<div class="entry-sub">${escapeHtml(companyLine)}</div>
${bulletList(experience.highlights)}
</div>`;
}

// Project name, summary and its tech stack.
function renderProject(project: Project): string {
  return `<p><strong>${escapeHtml(project.name)}.</strong> ${escapeHtml(project.summary)} <span class="stack">Tech: ${escapeHtml(project.stack.join(', '))}.</span></p>`;
}

// Degree, years, school and score.
function renderEducation(): string {
  const { degree, period, school, score } = profile.education;
  return `<div class="entry-head"><strong>${escapeHtml(degree)}</strong><span>${escapeHtml(period)}</span></div>
<p>${escapeHtml(school)}${CONTACT_SEPARATOR}${escapeHtml(score)}</p>`;
}
