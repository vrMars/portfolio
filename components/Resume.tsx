import React from 'react';
import { Section } from './Section';
import { EXPERIENCES } from '../constants';

export const Resume: React.FC = () => {
  return (
    <Section
      id="resume"
      title="Experience & Education"
      surfaceClassName="space-y-12"
    >
      <div className="max-w-3xl mx-auto relative">
        <div className="absolute left-4 top-0 bottom-0 w-[2px] bg-gradient-to-b from-indigo-300/60 via-purple-300/40 to-pink-300/60" />
        <ul className="space-y-10">
          {EXPERIENCES.map((exp) => (
            <li key={`${exp.company}-${exp.period}`} className="relative pl-12">
              <span className="absolute left-3 top-3 h-3 w-3 rounded-full bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 shadow-[0_0_15px_rgba(102,126,234,0.5)]" />
              <div className="glass-panel rounded-[20px] p-6 md:p-8">
                <p className="text-xs uppercase tracking-[0.3em] text-gray-400 mb-4">{exp.period}</p>
                <h3 className="text-xl font-semibold text-gray-800">{exp.role}</h3>
                <p className="text-sm font-semibold text-gray-500 mb-4">{exp.company}</p>
                {exp.description && (
                  <p className="text-sm md:text-base text-gray-600 leading-relaxed mb-6">
                    {exp.description}
                  </p>
                )}
                {exp.technologies.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {exp.technologies.map((tech) => (
                      <span
                        key={tech}
                        className="glass-button text-xs uppercase tracking-wide text-gray-500 px-3 py-1 rounded-full"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </Section>
  );
};
