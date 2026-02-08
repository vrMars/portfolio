import React, { useEffect, useRef, useContext } from 'react';
import { ActiveSectionContext } from '../App';
import { GitHubIcon } from './icons/GitHubIcon';
import { LinkedInIcon } from './icons/LinkedInIcon';
import { ResumeIcon } from './icons/ResumeIcon';

export const Header: React.FC = () => {
  const setActiveSection = useContext(ActiveSectionContext);
  const headerRef = useRef<HTMLElement | null>(null);

  // Observer for active section tracking
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setActiveSection('header');
        }
      },
      {
        root: null,
        // Trigger when the element is centered in the viewport
        rootMargin: '-50% 0px -50% 0px',
        threshold: 0,
      }
    );

    if (headerRef.current) {
      observer.observe(headerRef.current);
    }

    return () => {
      if (headerRef.current) {
        // eslint-disable-next-line react-hooks/exhaustive-deps
        observer.unobserve(headerRef.current);
      }
    };
  }, [setActiveSection]);

  const handleScrollToProjects = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const targetElement = document.getElementById('projects');
    if (targetElement) {
      const navbarHeight = 80; // h-20 is 80px
      const offsetPosition = targetElement.offsetTop - navbarHeight;
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  return (
    <section id="header" ref={headerRef} className="relative min-h-[100svh] md:min-h-screen flex items-center justify-center overflow-hidden">
      <div className="relative z-10 px-6 sm:px-8">
        <div className="glass-panel rounded-[2.75rem] px-8 py-10 md:px-14 md:py-16 text-center max-w-4xl mx-auto">
          <span className="inline-flex items-center gap-2 rounded-full glass-button px-4 py-2 text-xs uppercase tracking-[0.4em] text-gray-500 mb-6">
            Software Engineer
          </span>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-semibold tracking-tight leading-tight">
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
              Neelaksh Bhatia
            </span>
          </h1>
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <a
              href="https://github.com/vrMars"
              target="_blank"
              rel="noopener noreferrer"
              className="glass-button rounded-full px-4 py-2 text-gray-600 hover:text-indigo-500 transition-colors"
            >
              <GitHubIcon className="w-6 h-6" />
            </a>
            <a
              href="https://www.linkedin.com/in/neelakshb/"
              target="_blank"
              rel="noopener noreferrer"
              className="glass-button rounded-full px-4 py-2 text-gray-600 hover:text-indigo-500 transition-colors"
            >
              <LinkedInIcon className="w-6 h-6" />
            </a>
            <a
              href="/resume.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="glass-button rounded-full px-4 py-2 text-gray-600 hover:text-indigo-500 transition-colors"
            >
              <ResumeIcon className="w-6 h-6" />
            </a>
          </div>
        </div>
      </div>
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20">
        <a href="#projects" onClick={handleScrollToProjects} className="glass-button rounded-full p-3 text-gray-500 hover:text-indigo-500 transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </a>
      </div>
    </section>
  );
};
