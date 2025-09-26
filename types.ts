export interface Project {
  title: string;
  description: string;
  tags: string[];
  imageUrl: string;
  liveUrl?: string;
  githubUrl?: string;
}

export interface BlogPost {
  title: string;
  description: string;
  publishDate: string;
  source: string;
  slug: string;
  content: string[];
  readTime?: string;
  heroImage?: string;
  tags?: string[];
}

export interface Experience {
  role: string;
  company: string;
  period: string;
  description: string;
  technologies: string[];
}
