import { Project, BlogPost, Experience } from './types';

export const PROJECTS: Project[] = [
  {
    title: 'Streamify - Video Platform',
    description: 'A full-stack video streaming platform inspired by YouTube, featuring video uploads, processing, and a recommendation engine.',
    tags: ['React', 'Node.js', 'Express', 'MongoDB', 'AWS S3'],
    imageUrl: 'https://picsum.photos/seed/project1/600/400',
    liveUrl: '#',
    githubUrl: '#',
  },
  {
    title: 'CodeCollab - Real-time Editor',
    description: 'A collaborative code editor using WebSockets for real-time synchronization between multiple users.',
    tags: ['Next.js', 'TypeScript', 'Socket.io', 'Redis'],
    imageUrl: 'https://picsum.photos/seed/project2/600/400',
    githubUrl: '#',
  },
  {
    title: 'PixelArt AI Generator',
    description: 'An AI-powered web app that generates pixel art from text prompts, utilizing the Gemini API for image creation.',
    tags: ['React', 'Gemini API', 'Tailwind CSS', 'Vite'],
    imageUrl: 'https://picsum.photos/seed/project3/600/400',
    liveUrl: '#',
  },
  {
    title: 'Smart Home Dashboard',
    description: 'A responsive dashboard to monitor and control IoT devices in a smart home environment.',
    tags: ['Vue.js', 'Firebase', 'Chart.js'],
    imageUrl: 'https://picsum.photos/seed/project4/600/400',
    githubUrl: '#',
  },
];

export const BLOG_POSTS: BlogPost[] = [
  {
    title: 'Scaling Microservices at YouTube',
    description: 'A deep dive into the architectural patterns and challenges of scaling backend services for a global user base.',
    publishDate: 'Oct 12, 2023',
    url: '#',
    source: 'Medium',
  },
  {
    title: 'Mastering React Hooks: Beyond useState',
    description: 'Exploring advanced React hooks like useReducer, useCallback, and custom hooks for cleaner, more performant code.',
    publishDate: 'Jul 28, 2023',
    url: '#',
    source: 'Medium',
  },
  {
    title: 'The Art of Photography: Composition and Light',
    description: 'My personal journey and tips on how to improve your photography by understanding core principles.',
    publishDate: 'Apr 05, 2023',
    url: '#',
    source: 'Medium',
  },
];

export const EXPERIENCES: Experience[] = [
  {
    role: 'Software Engineer',
    company: 'YouTube',
    period: '2021 - Present',
    description: 'Developing and maintaining core features for the YouTube platform, focusing on creator tools and video processing pipelines. Worked on improving API performance and scalability, impacting millions of users daily.',
    technologies: ['Go', 'Python', 'Kubernetes', 'Google Cloud Platform', 'Bigtable'],
  },
  {
    role: 'Software Engineering Intern',
    company: 'Google',
    period: 'Summer 2020',
    description: 'Contributed to the Google Photos team, implementing a new feature for automatic album creation using machine learning signals. Wrote design docs and conducted code reviews.',
    technologies: ['Java', 'Angular', 'Spanner'],
  },
  {
    role: 'B.S. in Computer Science',
    company: 'University of California, Berkeley',
    period: '2017 - 2021',
    description: 'Graduated with honors. Focused on distributed systems, artificial intelligence, and human-computer interaction. Teaching Assistant for Data Structures.',
    technologies: ['Data Structures', 'Algorithms', 'AI/ML', 'Operating Systems'],
  },
];

export const NAV_LINKS = [
  { name: 'About', href: '#about' },
  { name: 'Projects', href: '#projects' },
  { name: 'Photography', href: '#photography' },
  { name: 'Blog', href: '#blog' },
  { name: 'Resume', href: '#resume' },
];