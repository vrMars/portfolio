import { Project, BlogPost, Experience } from './types';

export const PROJECTS: Project[] = [
  {
    title: 'CamShare - Filetransfer using AR/ML',
    description: 'Adhoc alternative for proximity based filesharing using augmented reality and machine learning models. Uses Wi-Fi for fast transfers with a focus on privacy (Uses common P2P encryption protocols).',
    tags: ['Python', 'Swift'],
    imageUrl: 'https://picsum.photos/seed/project1/600/400',
    liveUrl: 'https://vrmars.medium.com/a-better-way-to-share-photos-cfee4427e8b6',

  },
];

export const BLOG_POSTS: BlogPost[] = [
  {
    title: 'Scaling Microservices at YouTube',
    description: 'A deep dive into the architectural patterns and challenges of scaling backend services for a global user base.',
    publishDate: 'Oct 12, 2023',
    source: 'Engineering Notebook',
    slug: 'scaling-microservices-at-youtube',
    readTime: '6 min read',
    heroImage: 'https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=2070&auto=format&fit=crop',
    tags: ['microservices', 'distributed-systems'],
    content: [
      'Keeping YouTube’s merchant catalog fast is less about heroic rewrites and more about taming thousands of services that evolved on different timelines. At this scale, the smallest regression in a dependency graph has the potential to cascade into real dollars. I outline how we map critical paths, measure them, and renegotiate SLAs when reality diverges from design.',
      'The most impactful win came from leaning on request hedging and idempotent writes. We paired those with workload-aware autoscaling tuned around the Friday evening traffic spikes that often coincide with new drops. The takeaway: resilience is a product requirement, not a backend luxury.',
      'Towards the end I cover the debugging toolkit we rely on—Envoy tap sessions, distributed traces, and boring but vital dashboards. There’s also a section on the guardrails we add before each launch so merchant onboarding stays smooth.'
    ],
  },
  {
    title: 'Mastering React Hooks: Beyond useState',
    description: 'Exploring advanced React hooks like useReducer, useCallback, and custom hooks for cleaner, more performant code.',
    publishDate: 'Jul 28, 2023',
    source: 'Dev Notes',
    slug: 'mastering-react-hooks',
    readTime: '8 min read',
    heroImage: 'https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7?q=80&w=2070&auto=format&fit=crop',
    tags: ['react', 'hooks', 'frontend'],
    content: [
      'React hooks get interesting once you hit the limits of `useState`. I walk through patterns we use in production when reducers outgrow the switch anti-pattern, how to stabilise functions with `useCallback`, and why dependency arrays lie to you unless you pair them with ESLint.',
      'Custom hooks are reusable only if they encode a point of view. I share my litmus tests for extracting one, plus the debugging steps when a hook misbehaves—spoiler: most issues trace back to stale closures or overzealous memoisation.',
      'The post wraps with a fully typed data fetching hook that integrates SWR-style caching and suspense boundaries. Copy it into your next side project and bend it to your will.'
    ],
  },
  {
    title: 'The Art of Photography: Composition and Light',
    description: 'My personal journey and tips on how to improve your photography by understanding core principles.',
    publishDate: 'Apr 05, 2023',
    source: 'Field Notes',
    slug: 'art-of-photography',
    readTime: '5 min read',
    heroImage: 'https://images.unsplash.com/photo-1487412720507-6297e883e273?q=80&w=2070&auto=format&fit=crop',
    tags: ['photography', 'storytelling'],
    content: [
      'Most of my favourite frames were captured in terrible light. Instead of packing it in, I learned to lean on leading lines and shadow play to guide the viewer’s eye. In the essay I share how those instincts formed while shooting the back alleys of Tokyo.',
      'Great gear helps, but intent matters more. I unpack the questions I ask before pressing the shutter—what mood am I chasing, what part of the story am I compressing, and what can I afford to leave out?',
      'Finally, I round up a handful of editing workflows I rely on to keep colours honest while still nudging a scene toward how it felt. Lightroom presets are starting points; the nuance happens in the curves.'
    ],
  },
];

export const EXPERIENCES: Experience[] = [
  {
    role: 'Software Engineer L4, YouTube Shopping Merchant Team',
    company: 'YouTube',
    period: 'Jan 2024 - Present',
    description: 'Led the development of a scalable, international billing infrastructure for YouTube Shopping merchants, increasing GMV by over $10 million. Engineered enhanced traceability into financial pipelines, recovering thousands in discrepancies.',
    technologies: ['C++', 'Python', 'SQL'],
  },
  {
    role: 'Software Engineer L4, Ads Infrastructure',
    company: 'Google',
    period: 'Jan 2024 - Aug 2024',
    description: 'Led engineering efforts for 3P Brand Safety Verification, unblocking over $500M in ARR for Display campaigns. Owned the implementation of "Device Hints" for PMax campaigns, unlocking over $100M in additional spend.',
    technologies: ['Java'],
  },
  {
    role: 'Software Engineer II',
    company: 'Lacework',
    period: 'Apr 2021 - Jul 2022',
    description: 'Designed and implemented a scalable ingestion pipeline for security events and a new Azure resource-management pipeline for compliance checks. Led a program that reduced SEV incidents by 20% and helped migrate services to Prometheus, saving the company over $2 million.',
    technologies: ['Java', 'Python', 'SQL', 'Javascript/Typescript', 'GCP', 'Node', 'Apache Beam', 'GraphQL', 'Docker', 'Kubernetes', 'MySQL'],
  },
  {
    role: 'Software Engineering Intern',
    company: 'Splunk',
    period: 'May 2019 - Aug 2019',
    description: 'Designed and implemented a patented low-light QR code parsing framework, improving detection accuracy to 97% for over 700k MAUs. Developed AR functionality for viewing media, reducing CPU/GPU load by up to 22%.',
    technologies: ['Swift', 'SQL', 'Python'],
  },
  {
    role: 'Bachelor of Computer Science (Honors)',
    company: 'University of Waterloo',
    period: 'Sep 2016 - Apr 2021',
    description: '',
    technologies: [],
  },
];

export const NAV_LINKS = [

  { name: 'Projects', href: '#projects' },
  { name: 'Photography', href: '#photography' },
  { name: 'Blog', href: '#blog' },
  { name: 'Resume', href: '#resume' },
];
