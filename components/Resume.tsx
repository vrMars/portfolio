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
        <div className="absolute left-4 top-0 bottom-0 w-[2px] bg-gradient-to-b from-sky-200/40 via-white/15 to-rose-200/40" />
        <ul className="space-y-10">
          {EXPERIENCES.map((exp) => (
            <li key={`${exp.company}-${exp.period}`} className="relative pl-12">
              <span className="absolute left-3 top-3 h-3 w-3 rounded-full bg-gradient-to-r from-sky-200 via-emerald-200 to-rose-200 shadow-[0_0_25px_rgba(120,210,255,0.7)]" />
              <div className="rounded-2xl border border-white/10 bg-[rgba(12,16,28,0.7)] p-6 md:p-8 backdrop-blur-lg">
                <p className="text-xs uppercase tracking-[0.3em] text-slate-200/60 mb-4">{exp.period}</p>
                <h3 className="text-xl font-semibold text-white/90">{exp.role}</h3>
                <p className="text-sm font-semibold text-slate-200/70 mb-4">{exp.company}</p>
                {exp.description && (
                  <p className="text-sm md:text-base text-slate-200/75 leading-relaxed mb-6">
                    {exp.description}
                  </p>
                )}
                {exp.technologies.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {exp.technologies.map((tech) => (
                      <span
                        key={tech}
                        className="glass-button text-xs uppercase tracking-wide text-slate-100/80 px-3 py-1 rounded-full"
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
