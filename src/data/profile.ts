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
  articles: 'articles',
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
  headline: 'Software Engineer · Applied AI & Backend Systems',
  tagline:
    'I build AI agent workflows and the backend systems underneath them: event-driven services, multi-tenant platforms and real-time interfaces.',
  about: [
    'Software engineer with 2+ years of experience building scalable backend systems, distributed workflows, event-driven services and AI-powered applications with Python, TypeScript, PostgreSQL and AWS.',
    'I like thinking in systems. Most of my work goes beyond CRUD: recursive approval engines, policy-based RBAC, concurrency-safe credit systems, and integrations with 3000+ job boards that have to survive third-party failures.',
    'Lately I work on applied AI at Whitecarrot.ai: LangGraph agents, multi-LLM orchestration, streaming over SSE, and evaluating models in Langfuse on accuracy, latency and cost. My favourite build is AI Headhunt, a Temporal-powered agent that sources 4k–6k profiles and hands recruiters a reviewed top-20 shortlist, stopping early once the target is met.',
  ],
  resumeSummary:
    'Software engineer with 2+ years of experience owning backend systems and AI agent workflows in production at Whitecarrot, an AI recruiting platform. I build Temporal workflows, event-driven services on AWS, PostgreSQL data models and LangGraph agents with RAG on pgvector, evaluated in Langfuse. Built AI Headhunt, an agent that sources 4k–6k profiles and delivers a reviewed top-20 shortlist while stopping early to keep costs low. Strong in TypeScript, Python, distributed systems and system design.',
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
      employer: 'Whitecarrot',
      period: 'Jan 2024 — Present',
      logoUrl: WHITECARROT_AI_LOGO_URL,
      companyBlurb:
        'Whitecarrot.ai is an AI recruiter that runs the entire hiring process: an all-in-one recruitment agent and ATS that sources, screens and engages candidates for hiring teams.',
      highlights: [
        'Built AI Headhunt, Whitecarrot.ai\'s headhunting agent, as durable distributed workflows on Temporal. It sources 4k–6k candidate profiles, then reviews, scores and shortlists the top 20. It stops sourcing and scoring as soon as the shortlist target is met, for example after 1,000 profiles, so no money goes on extra scraping or LLM calls.',
        'Built LangGraph agent workflows with function calling, structured outputs validated against JSON schemas and Model Context Protocol (MCP) tools, enriching candidates through SignalHire for contact data and Apify for LinkedIn profile scraping.',
        'Designed multi-model agent workflows with dynamic prompt injection, and built RAG on PostgreSQL with pgvector, combining vector and keyword search with reranking to ground agents in candidate and job data. Chose models by accuracy, latency and cost.',
        'Ran evaluation in Langfuse with prompt versioning, tracing, golden datasets and LLM-as-judge scoring. Every agent turn and observation gets a score, so prompt regressions show up in real time and drive continuous improvement.',
        'Built cost-aware AI workflows with prompt caching and usage and credit controls: configurable limits, recurring quotas and pay-as-you-go execution.',
        'Made agent workflows reliable with idempotent Temporal activities, retry policies with exponential backoff, heartbeats for long-running scrapes and dead-letter handling for failed batches.',
        'Added guardrails to agent outputs: JSON-schema validation, PII redaction in prompts and traces, and model fallbacks when a provider call fails.',
      ],
    },
    {
      id: 'whitecarrot-founding',
      title: 'Founding Engineer — Full Stack',
      company: 'Whitecarrot.io',
      employer: 'Whitecarrot',
      period: 'Jan 2024 — Dec 2025',
      logoUrl: WHITECARROT_IO_LOGO_URL,
      tag: { shortTitle: 'Founding Engineer', company: 'Whitecarrot' },
      highlights: [
        'Architected a recursive approval engine that evaluates nested AND/OR rules across approval hierarchies of any depth, so each customer can model its own sign-off process for requisitions and offers without code changes.',
        'Designed multi-tenant RBAC with structured permission resolution for fine-grained access control.',
        'Developed concurrency-safe transactional credit systems for high-volume job posting and resume processing, using PostgreSQL row-level locks and serializable transactions to prevent double spending.',
        'Implemented event-driven workflows on AWS EventBridge and SQS with idempotent consumers, retries, scheduling and dead-letter queues for fault-tolerant processing.',
        'Integrated 3000+ external job board APIs behind resilient request workflows: rate limiting, exponential backoff with jitter and circuit breakers to survive third-party failures at high volume.',
        'Tuned PostgreSQL queries, indexes and connection pooling, and added Redis caching for hot reads, to keep responses fast under concurrent load.',
        'Owned the delivery pipeline: Docker images, GitHub Actions CI/CD, Jest unit and integration tests, and Datadog logging, alerting and dashboards for production diagnostics.',
        'Built framework-agnostic React components that mount inside the existing Vue.js app, or any other host framework, allowing migration feature by feature instead of a rewrite.',
        'Built route-level micro-frontends so Vue.js and Next.js apps serve different routes of one product, sharing session and user data through cookies for seamless navigation between them.',
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
      highlights: ['Built reusable frontend components and backend API integrations, and fixed production issues across the stack.'],
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
        'Built the product end to end on the MERN stack with React, TypeScript, Node.js and Express, deployed on AWS.',
        'Built JWT-based authentication and authorization with secure REST APIs.',
        'Integrated Stripe and third-party APIs with retry handling and error recovery.',
      ],
    },
    {
      id: 'mazibai',
      title: 'Frontend Developer',
      company: 'MaziBai.com',
      cardFinish: CARD_FINISHES.lavender,
      location: 'Nagpur, India',
      period: 'Jun 2022 — Aug 2022',
      isOnResume: false,
      tag: { shortTitle: 'Frontend Dev', company: 'MaziBai' },
      highlights: ['Built the homepage and contact page, and designed the user and admin dashboards.'],
    },
  ],
  projects: [
    {
      name: 'AI Headhunt',
      summary:
        'Headhunting agent for Whitecarrot.ai built as durable Temporal workflows. A search stage gathers about 4k profiles, which de-duplicate to about 2k unique candidates. Full profiles are then scraped through Apify\'s LinkedIn scraper in batches of 100, and each batch is shortlisted as soon as it arrives against recruiter-defined criteria of 4 must-haves, 5 nice-to-haves and a target shortlist percentage. Prompt caching keeps LLM costs low. Recruiters can edit the criteria and re-evaluate every candidate at any time, so a criteria mistake never loses a good candidate. Every run and decision is recorded for future audits.',
      stack: ['Temporal', 'LangGraph', 'Apify', 'Langfuse', 'TypeScript', 'PostgreSQL'],
    },
    {
      name: 'Interactive 3D Portfolio',
      summary:
        'This site. A scroll-driven experience ring where each role hangs from an elastic strap, powered by a custom deterministic swing model instead of a physics engine, with canvas-rendered card textures, a Web Audio gear sound and a protected in-page resume viewer. Deployed through GitHub Actions to GitHub Pages.',
      stack: ['React 19', 'TypeScript', 'Three.js', 'React Three Fiber', 'Vite', 'GitHub Actions'],
    },
    {
      name: 'AI Recruitment Agent System',
      summary:
        'AI-native recruitment infrastructure: natural language workflow execution, candidate sourcing pipelines, multi-LLM orchestration, tool integration and real-time streaming.',
      stack: ['LangGraph', 'OpenAI', 'Claude', 'SSE', 'NestJS'],
      isOnResume: false,
    },
    {
      name: 'Staff Management System',
      summary: 'Backend and frontend architecture with JWT authentication, RBAC and administrative workflows.',
      stack: ['MongoDB', 'Express', 'React', 'Node.js'],
      isOnResume: false,
    },
    {
      name: 'E-Vehicle Charging Slot Platform',
      summary: 'Transactional booking and payment workflows with scalable APIs and a responsive frontend.',
      stack: ['Node.js', 'PostgreSQL', 'Stripe', 'React'],
      isOnResume: false,
    },
    {
      name: "Virtual Rubik's Cube Simulator",
      summary: 'Interactive cube simulator with complex state management and cube transformation logic.',
      stack: ['JavaScript', 'State machines'],
      isOnResume: false,
    },
  ],
  articles: [
    {
      title: 'Moving a Legacy App to React Without a Rewrite',
      url: 'https://medium.com/@charynagarajuvadla1999/moving-a-legacy-app-to-react-without-a-rewrite-4b399c1a9a4e',
      publisher: 'Medium',
      topics: [
        'Standalone React bundles on a plain URL',
        'CSS isolation with Shadow DOM',
        'Two-way communication with legacy code',
        'The first-load problem, still open',
      ],
      excerpt: [
        'There is no "Migrate to React" button. We checked. 😉',
        'We reached the point where we didn\'t want to build another feature in our legacy frontend. New hires knew React, our new product surfaces were heading toward Next.js, and every change to the old code felt like paying interest on a loan we had stopped wanting.',
        'But the old app is a live product. It has real users, real customers and years of behaviour baked into it. This is the story of how we started moving it to React one page at a time, without freezing features and without a big-bang cut-over.',
      ],
    },
  ],
  writingProfileUrl: 'https://medium.com/@charynagarajuvadla1999',
  skillGroups: [
    { category: 'Languages', skills: ['TypeScript', 'JavaScript', 'Python', 'Java', 'SQL'] },
    { category: 'Backend', skills: ['Node.js', 'NestJS', 'Express.js', 'REST APIs', 'Temporal', 'Event-Driven Architecture', 'Distributed Systems'] },
    { category: 'Databases & Caching', skills: ['PostgreSQL', 'pgvector', 'Redis', 'MongoDB', 'Data Modeling', 'Query Tuning'] },
    { category: 'Cloud & DevOps', skills: ['AWS (EC2, S3, RDS, SQS, EventBridge)', 'Docker', 'GitHub Actions', 'CI/CD', 'Datadog'] },
    {
      category: 'AI Engineering',
      skills: ['LangGraph', 'RAG', 'Function Calling', 'Structured Outputs', 'MCP', 'Prompt Engineering', 'Prompt Caching', 'LLM Evaluation', 'Langfuse'],
    },
    { category: 'Frontend', skills: ['React', 'Next.js', 'Vue.js', 'Micro-frontends', 'Cross-Framework Components'] },
    { category: 'Core CS', skills: ['Data Structures', 'Algorithms', 'System Design', 'Low-Level Design', 'Concurrency'] },
  ],
  achievements: ['Solved 600+ DSA problems on LeetCode with a peak contest rating of 1707.', 'Elite certification in NPTEL Competitive Programming.'],
  certifications: ['Stripe Certified Associate Developer'],
  education: {
    degree: 'B.Tech in Computer Science Engineering',
    school: 'Rajiv Gandhi University of Knowledge Technologies (IIIT), Basar',
    period: '2020 — 2024',
    score: 'CGPA 9.2',
  },
};
