export interface Project {
  title: string;
  description: string;
  tags: string[];
  imageUrl: string;
  liveUrl?: string;
  githubUrl?: string;
}

export interface BlogPost {
  title:string;
  description: string;
  publishDate: string;
  url: string;
  source: string;
}

export interface Experience {
  role: string;
  company: string;
  period: string;
  description: string;
  technologies: string[];
}
