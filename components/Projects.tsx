import React from 'react';
import { Section } from './Section';
import { ProjectCard } from './ProjectCard';
import { PROJECTS } from '../constants';

export const Projects: React.FC = () => {
  return (
    <Section id="projects" title="Personal Projects" className="bg-black/70 backdrop-blur-lg">
      <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
        {PROJECTS.map((project, index) => (
          <ProjectCard key={index} project={project} />
        ))}
      </div>
    </Section>
  );
};