import React from 'react';
import { GitHubIcon } from './icons/GitHubIcon';
import { LinkedInIcon } from './icons/LinkedInIcon';
import { ResumeIcon } from './icons/ResumeIcon';

export const Footer: React.FC = () => {
  return (
    <footer className="py-16">
      <div className="container mx-auto px-6 lg:px-8">
        <div className="glass-panel rounded-3xl border border-white/10 px-8 py-10 md:px-12 md:py-12 text-center text-slate-200/70 space-y-6">
          <div className="flex justify-center gap-4">
            <a
              href="https://github.com/vrMars"
              target="_blank"
              rel="noopener noreferrer"
              className="glass-button rounded-full p-3 text-slate-100/80 hover:text-white transition-colors"
            >
              <GitHubIcon className="w-5 h-5" />
            </a>
            <a
              href="https://www.linkedin.com/in/neelakshb/"
              target="_blank"
              rel="noopener noreferrer"
              className="glass-button rounded-full p-3 text-slate-100/80 hover:text-white transition-colors"
            >
              <LinkedInIcon className="w-5 h-5" />
            </a>
            <a
              href="/resume.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="glass-button rounded-full p-3 text-slate-100/80 hover:text-white transition-colors"
            >
              <ResumeIcon className="w-5 h-5" />
            </a>
          </div>
          <p className="text-sm uppercase tracking-[0.4em] text-slate-200/50">Designed & Built by Neelaksh Bhatia</p>
          <p className="text-xs text-slate-200/50">&copy; {new Date().getFullYear()} — All Rights Reserved.</p>
        </div>
      </div>
    </footer>
  );
};
