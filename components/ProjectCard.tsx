import React from 'react';
import { Project } from '../types';
import { GitHubIcon } from './icons/GitHubIcon';
import { ExternalLinkIcon } from './icons/ExternalLinkIcon';

interface ProjectCardProps {
  project: Project;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({ project }) => {
  return (
    <article className="group relative glass-panel rounded-3xl border border-white/10 overflow-hidden transition-transform duration-500 hover:-translate-y-2">
      <div className="relative h-48 overflow-hidden">
        <img
          src={project.imageUrl}
          alt={project.title}
          loading="lazy"
          decoding="async"
          fetchpriority="low"
          className="h-full w-full object-cover transition-transform duration-[1200ms] group-hover:scale-110"
          style={{ willChange: 'transform' }}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
        <div className="absolute top-4 right-4 flex space-x-3">
          {project.githubUrl && (
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="glass-button rounded-full p-2 text-slate-200/90 hover:text-white transition-colors"
            >
              <GitHubIcon className="h-5 w-5" />
            </a>
          )}
          {project.liveUrl && (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="glass-button rounded-full p-2 text-slate-200/90 hover:text-white transition-colors"
            >
              <ExternalLinkIcon className="h-5 w-5" />
            </a>
          )}
        </div>
      </div>
      <div className="p-6 md:p-7 lg:p-8 space-y-4">
        <h3 className="text-xl font-semibold text-white/90 tracking-tight">{project.title}</h3>
        <p className="text-sm md:text-base leading-relaxed text-slate-200/80">{project.description}</p>
        <div className="flex flex-wrap gap-2">
          {project.tags.map((tag) => (
            <span
              key={tag}
              className="glass-button text-xs uppercase tracking-wide text-slate-100/80 px-3 py-1 rounded-full"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </article>
  );
};
