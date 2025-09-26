import { Project, BlogPost, Experience } from './types';

export const PROJECTS: Project[] = [
  {
    title: 'CamShare - Filetransfer using AR/ML',
    description: 'Adhoc alternative for proximity based filesharing using augmented reality and machine learning models. Uses Wi-Fi for fast transfers with a focus on privacy (Uses common P2P encryption protocols).',
    tags: ['Python', 'Swift'],
    imageUrl: 'https://miro.medium.com/v2/resize:fit:1100/1*nxH_q3wGJuC6xpVovrg8iw.gif',
    liveUrl: 'https://vrmars.medium.com/a-better-way-to-share-photos-cfee4427e8b6',

  },
];

export const BLOG_POSTS: BlogPost[] = [
  {
    title: 'A better way to share photos…',
    description:
      "Point your camera at a screen to share to it — embedded demo and visuals included.",
    publishDate: 'Mar 14, 2021',
    source: 'Medium',
    slug: 'a-better-way-to-share-photos',
    readTime: '2 min read',
    heroImage: 'https://miro.medium.com/1*nxH_q3wGJuC6xpVovrg8iw.gif',
    tags: ['AR', 'ML', 'filesharing'],
    content: [
      `<h2>A better way to share photos…</h2><figure><img src="https://miro.medium.com/v2/resize:fit:1100/1*e-pXtW1zDQFKE75cKZC7ow.png" alt="" loading="lazy" decoding="async"/><figcaption>cred. <a href="https://www.instagram.com/thebakinghobbyist/">@thebakinghobbyist</a></figcaption></figure><p>Picture this. You’ve just baked some awesome macarons and want to share your creation. After meticulously adjusting the lighting, you use your smartphone to take a great shot. Now all you need to do is touch it up in Photoshop and you’ll be ready to show it to the world.</p><p>You click the share button and now need to decide between the lesser of 3 evils:</p><figure><img src="https://miro.medium.com/v2/resize:fit:1100/1*3L7jBJZYzxFW68jbsMabYQ.png" alt="" loading="lazy" decoding="async"/></figure><h4>Bluetooth</h4><ul><li>Not every desktop supports this</li><li>Clunky to pair</li><li><strong>Slow</strong></li></ul><h4>Messenger</h4><ul><li>Facebook</li></ul><h4>Gmail</h4><ul><li>Uses up Google Drive storage</li><li>Cumbersome to deal with large files + multiple pictures</li></ul><p>There must be a better way…</p><figure><img src="https://miro.medium.com/v2/resize:fit:1100/1*nxH_q3wGJuC6xpVovrg8iw.gif" alt="" loading="lazy" decoding="async"/><figcaption>Ever since I was a kid, I’ve been fascinated by Iron Man’s tech. This scene in particular is the inspiration behind this project.</figcaption></figure><h3>Why can’t we just point our phones at a screen, and share data directly to (the PC behind) that screen?</h3><h2>Introducing CamShare!</h2><div class="relative w-full overflow-hidden rounded-2xl border border-white/10" style="padding-top:56.25%"><iframe class="absolute inset-0 h-full w-full" src="https://www.youtube.com/embed/rAzbdYmCuig" title="CamShare demo" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen loading="lazy"></iframe></div><p>Share any file directly to <strong>CamShare</strong>, point your camera at the device you want to share to, and the file automatically ends up in your Downloads folder!</p><ul><li>Faster than Bluetooth (uses Wi-Fi)</li><li>Setup is completely within your LAN; meaning you control your data</li><li>Ephemeral storage</li><li>Platform agnostic (Android/iOS -&gt; Windows/Mac/Linux/…)</li></ul><figure><img src="https://miro.medium.com/v2/resize:fit:1100/1*-FtBtSOy1wsGdnRhUJY8Mw.gif" alt="" loading="lazy" decoding="async"/></figure>`,
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
