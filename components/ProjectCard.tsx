import React from 'react';
import { Project } from '../types';
import { GitHubIcon } from './icons/GitHubIcon';
import { ExternalLinkIcon } from './icons/ExternalLinkIcon';

interface ProjectCardProps {
  project: Project;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({ project }) => {
  return (
    <div className="group relative bg-gray-900/50 rounded-lg overflow-hidden shadow-lg transition-all duration-300 hover:shadow-blue-500/20 hover:-translate-y-2 border border-gray-800">
      <img src={project.imageUrl} alt={project.title} className="w-full h-48 object-cover" />
      <div className="p-6">
        <h3 className="text-xl font-bold text-white mb-2">{project.title}</h3>
        <p className="text-gray-400 mb-4 text-sm leading-relaxed">{project.description}</p>
        <div className="flex flex-wrap gap-2 mb-4">
          {project.tags.map((tag) => (
            <span key={tag} className="bg-blue-900/50 text-blue-300 text-xs font-semibold px-2.5 py-1 rounded-full">
              {tag}
            </span>
          ))}
        </div>
      </div>
      <div className="absolute top-4 right-4 flex space-x-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        {project.githubUrl && (
          <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-blue-400 transition-colors">
            <GitHubIcon className="w-6 h-6" />
          </a>
        )}
        {project.liveUrl && (
          <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-blue-400 transition-colors">
            <ExternalLinkIcon className="w-6 h-6" />
          </a>
        )}
      </div>
    </div>
  );
};