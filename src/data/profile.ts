import { CARD_FINISHES } from '../config/theme';
import type { Profile } from '../types/profile';

export const SITE_HOST = 'vadlachary2002.github.io';

const ASSET_BASE = import.meta.env.BASE_URL;
const WHITECARROT_AI_LOGO_URL = `${ASSET_BASE}logos/whitecarrot-ai.png`;
const WHITECARROT_IO_LOGO_URL = `${ASSET_BASE}logos/whitecarrot-io.svg`;

export const SECTION_IDS = {
  about: 'about',
  experience: 'experience',
  projects: 'projects',
  skills: 'skills',
  resume: 'resume',
  contact: 'contact',
} as const;

export const profile: Profile = {
  firstName: 'Nagaraju',
  lastName: 'Vadla',
  currentTitle: 'Applied AI Software Engineer',
  currentCompany: 'Whitecarrot.ai',
  currentPeriod: 'Jan 2024 — Present',
  tagline:
    'I build AI agent workflows and the backend systems underneath them: event-driven services, multi-tenant platforms and real-time interfaces.',
  about: [
    'Software engineer with 2+ years of experience building scalable backend systems, distributed workflows, event-driven services and AI-powered applications with Python, TypeScript, PostgreSQL and AWS.',
    'I like thinking in systems. Most of my work goes beyond CRUD: recursive approval engines, policy-based RBAC, concurrency-safe credit systems, and integrations with 3000+ job boards that have to survive third-party failures.',
    'Lately I work on applied AI at Whitecarrot.ai: LangGraph agents, multi-LLM orchestration, streaming over SSE, and evaluating models in Langfuse on accuracy, latency and cost. My favourite build is AI Headhunt, a Temporal-powered pipeline that turns about 1,000 sourced profiles into a reviewed shortlist of 20 in under 30 minutes.',
  ],
  resumeSummary:
    'Applied AI Software Engineer with 2+ years of experience building scalable backend systems, distributed workflows, event-driven services and AI-powered applications with Python, TypeScript, PostgreSQL and AWS. I build LangGraph agent workflows, multi-LLM orchestration with real-time SSE streaming, and Langfuse evaluation on accuracy, latency and cost. Built AI Headhunt, a Temporal-powered pipeline that turns about 1,000 sourced profiles into a reviewed shortlist of 20 in under 30 minutes.',
  email: 'vadlanagarajuchary2002@gmail.com',
  portfolioUrl: 'https://vadlachary2002.github.io/chary2002/',
  links: [
    { label: 'LinkedIn', href: 'https://www.linkedin.com/in/nagarajuchary/', display: 'linkedin.com/in/nagarajuchary' },
    { label: 'GitHub', href: 'https://github.com/vadlachary2002', display: 'github.com/vadlachary2002' },
    { label: 'LeetCode', href: 'https://leetcode.com/u/chary2002/', display: 'leetcode.com/u/chary2002' },
  ],
  experiences: [
    {
      id: 'whitecarrot-applied-ai',
      title: 'Applied AI Software Engineer',
      company: 'Whitecarrot.ai',
      period: 'Jan 2024 — Present',
      logoUrl: WHITECARROT_AI_LOGO_URL,
      companyBlurb:
        'Whitecarrot.ai is an AI recruiter that runs the entire hiring process: an all-in-one recruitment agent and ATS that sources, screens and engages candidates for hiring teams.',
      highlights: [
        'Built AI Headhunt, Whitecarrot.ai\'s headhunting agent, as reliable distributed background workflows on Temporal: it sources around 1,000 candidate profiles in under 30 minutes, then reviews, scores and shortlists the top 20.',
        'Built AI agent workflows using LangGraph, tool orchestration, search pipelines and candidate enrichment across multiple external services.',
        'Engineered real-time AI infrastructure using Server-Sent Events and multi-LLM integrations for low-latency streaming interactions.',
        'Designed and evaluated multi-model agent workflows, choosing models and orchestration strategies by accuracy, reliability, latency and cost.',
        'Used Langfuse for prompt management, tracing, datasets, experimentation and evaluation of production AI workflows.',
        'Built cost-aware AI workflows with usage and credit controls: configurable limits, recurring quotas and pay-as-you-go execution.',
        'Improved agent reliability through structured tool execution, failure handling, retries and controlled orchestration.',
        'Evolved database architecture and data access patterns toward scalable, tenant-oriented workloads as usage grew.',
        'Connected agent execution to existing backend services, business logic, async processing and real-time interfaces.',
      ],
    },
    {
      id: 'whitecarrot-founding',
      title: 'Founding Engineer — Full Stack',
      company: 'Whitecarrot.io',
      period: 'Jan 2024 — Dec 2025',
      logoUrl: WHITECARROT_IO_LOGO_URL,
      tag: { shortTitle: 'Founding Engineer', company: 'Whitecarrot' },
      highlights: [
        'Built and evolved core backend systems for an AI-powered recruitment platform with multi-tenant workflows, automation and integrations.',
        'Architected recursive workflow engines with configurable approval hierarchies and nested AND/OR rule evaluation.',
        'Designed multi-tenant RBAC with structured permission resolution for fine-grained access control.',
        'Developed concurrency-safe transactional credit systems for high-volume job posting and resume processing.',
        'Implemented event-driven workflows on AWS EventBridge and SQS with retries, scheduling and fault-tolerant queue processing.',
        'Integrated 3000+ external job board APIs with resilient request workflows for third-party failures and high volume.',
        'Tuned PostgreSQL queries, indexes and data access patterns for responsiveness under concurrent load.',
        'Built monitoring and observability with Datadog: logging, alerting and production diagnostics.',
        'Built React components that run inside the existing Vue.js app, enabling incremental migration without a rewrite.',
      ],
    },
    {
      id: 'techrangers',
      title: 'Software Engineer Intern',
      company: 'TechRangers.in',
      cardFinish: CARD_FINISHES.mint,
      location: 'Hyderabad, India',
      period: 'Jun 2023 — Jul 2023',
      tag: { shortTitle: 'SWE Intern', company: 'TechRangers' },
      highlights: [
        'Developed reusable frontend components and contributed to backend API integration for internal platform features.',
        'Diagnosed and resolved frontend and backend production issues to improve stability.',
      ],
    },
    {
      id: 'shorebirdie',
      title: 'Full Stack Developer',
      company: 'Shorebirdie.com',
      cardFinish: CARD_FINISHES.champagne,
      location: 'Remote, Canada',
      period: 'Jan 2023 — May 2023',
      tag: { shortTitle: 'Full Stack Dev', company: 'Shorebirdie' },
      highlights: [
        'Built the product end to end on the MERN stack with React, TypeScript, Node.js and Express.',
        'Built JWT-based authentication and authorization with secure REST APIs.',
        'Integrated Stripe and third-party APIs with retry handling and error recovery.',
        'Deployed production applications on AWS.',
      ],
    },
    {
      id: 'mazibai',
      title: 'Frontend Developer',
      company: 'MaziBai.com',
      cardFinish: CARD_FINISHES.lavender,
      location: 'Nagpur, India',
      period: 'Jun 2022 — Aug 2022',
      tag: { shortTitle: 'Frontend Dev', company: 'MaziBai' },
      highlights: ['Built the homepage and contact page, and designed the user and admin dashboards.'],
    },
  ],
  projects: [
    {
      name: 'AI Headhunt',
      summary:
        'Headhunting agent for Whitecarrot.ai running as durable background workflows on Temporal. In under 30 minutes it sources about 1,000 profiles, reviews and ranks them with LangGraph agents, and hands recruiters a shortlist of the top 20, with every run traced in Langfuse.',
      stack: ['Temporal', 'LangGraph', 'Langfuse', 'TypeScript', 'PostgreSQL'],
    },
    {
      name: 'AI Recruitment Agent System',
      summary:
        'AI-native recruitment infrastructure: natural language workflow execution, candidate sourcing pipelines, multi-LLM orchestration, tool integration and real-time streaming.',
      stack: ['LangGraph', 'OpenAI', 'Claude', 'SSE', 'NestJS'],
    },
    {
      name: 'Staff Management System',
      summary: 'Backend and frontend architecture with JWT authentication, RBAC and administrative workflows.',
      stack: ['MongoDB', 'Express', 'React', 'Node.js'],
    },
    {
      name: 'E-Vehicle Charging Slot Platform',
      summary: 'Transactional booking and payment workflows with scalable APIs and a responsive frontend.',
      stack: ['Node.js', 'PostgreSQL', 'Stripe', 'React'],
    },
    {
      name: "Virtual Rubik's Cube Simulator",
      summary: 'Interactive cube simulator with complex state management and cube transformation logic.',
      stack: ['JavaScript', 'State machines'],
    },
  ],
  skillGroups: [
    { category: 'Languages', skills: ['Python', 'TypeScript', 'JavaScript', 'Java', 'SQL', 'C'] },
    {
      category: 'Backend',
      skills: ['Node.js', 'NestJS', 'Express.js', 'REST APIs', 'SSE', 'Temporal', 'Durable Workflows', 'Event-Driven Architecture', 'Distributed Systems', 'Concurrency'],
    },
    { category: 'Databases', skills: ['PostgreSQL', 'MySQL', 'MongoDB', 'Query Tuning', 'Data Modeling', 'Multi-Tenant Architecture'] },
    { category: 'Cloud', skills: ['AWS EC2', 'S3', 'RDS', 'SQS', 'EventBridge', 'Fault Tolerance', 'Retry Mechanisms'] },
    { category: 'AI Engineering', skills: ['LangGraph', 'Multi-LLM Systems', 'Agent Workflows', 'Prompt Management', 'Tracing', 'Evaluation', 'Langfuse'] },
    { category: 'Observability', skills: ['Datadog', 'Logging', 'Alerting', 'Monitoring', 'Workflow Tracing'] },
    { category: 'Frontend', skills: ['React', 'Vue.js', 'TypeScript', 'Cross-Framework Components'] },
    { category: 'Core CS', skills: ['Data Structures', 'Algorithms', 'OOP', 'Concurrency', 'System Design'] },
  ],
  achievements: [
    'Solved 600+ DSA problems on LeetCode with a peak rating of 1707.',
    'Elite certification (67%) in NPTEL Competitive Programming.',
    'Organized 10+ coding contests and technical events.',
    'State 6th rank in the Telangana Maths Forum.',
  ],
  certifications: ['Stripe Certified Associate Developer', 'HackerRank Certified JavaScript (Basic)'],
  education: {
    degree: 'B.Tech in Computer Science Engineering',
    school: 'Rajiv Gandhi University of Knowledge Technologies (IIIT), Basar',
    period: '2020 — 2024',
    score: 'CGPA 9.2',
  },
};
