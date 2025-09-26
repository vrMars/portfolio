import React from 'react';
import { Section } from './Section';
import { ProjectCard } from './ProjectCard';
import { PROJECTS } from '../constants';

export const Projects: React.FC = () => {
  return (
    <Section
      id="projects"
      title="Projects"
      surfaceClassName="space-y-8"
    >
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2">
        {PROJECTS.map((project) => (
          <ProjectCard key={project.title} project={project} />
        ))}
      </div>
    </Section>
  );
};
