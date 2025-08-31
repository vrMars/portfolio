import React from 'react';
import { Section } from './Section';
import { EXPERIENCES } from '../constants';

export const Resume: React.FC = () => {
  return (
    <Section 
      id="resume"
      title="Experience & Education"
      className="pb-32 md:pb-40 bg-black/70 backdrop-blur-lg clip-wave-bottom"
    >
      <div className="max-w-3xl mx-auto relative border-l-2 border-gray-700 pl-10">
        {EXPERIENCES.map((exp, index) => (
          <div key={index} className="mb-12">
            <div className="absolute -left-[11px] top-1 w-5 h-5 bg-red-500 rounded-full border-4 border-black"></div>
            <p className="text-sm text-blue-400 mb-1">{exp.period}</p>
            <h3 className="text-xl font-bold text-white">{exp.role}</h3>
            <p className="text-md text-gray-400 font-semibold mb-3">{exp.company}</p>
            <p className="text-gray-400 mb-4">{exp.description}</p>
            <div className="flex flex-wrap gap-2">
              {exp.technologies.map(tech => (
                <span key={tech} className="bg-gray-800 text-gray-300 text-xs font-medium px-2.5 py-1 rounded">
                  {tech}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
      <div className="text-center mt-16">
        <a href="#" className="inline-block bg-blue-600 text-white font-bold py-3 px-8 rounded-lg hover:bg-blue-500 transition-colors duration-300">
          Download Full Resume
        </a>
      </div>
    </Section>
  );
};