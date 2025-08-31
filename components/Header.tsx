import React, { useState, useEffect, useRef, useContext } from 'react';
import { ActiveSectionContext } from '../App';
import { GitHubIcon } from './icons/GitHubIcon';
import { LinkedInIcon } from './icons/LinkedInIcon';
import { MediumIcon } from './icons/MediumIcon';

export const Header: React.FC = () => {
  const [offsetY, setOffsetY] = useState(0);
  const handleScroll = () => setOffsetY(window.pageYOffset);

  const setActiveSection = useContext(ActiveSectionContext);
  const headerRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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

  const handleScrollToAbout = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const targetElement = document.getElementById('about');
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
    <section ref={headerRef} className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <div 
        className="absolute inset-0 bg-black"
        style={{ transform: `translateY(${offsetY * 0.5}px)` }}
      >
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-blue-600/20 via-black to-black animate-gradient-xy"></div>
        <div className="absolute bottom-0 right-0 w-full h-full bg-gradient-to-tl from-red-600/10 via-black to-black animate-gradient-xy-slow"></div>
      </div>
      <div className="relative z-10 text-center px-4">
        <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-white uppercase tracking-tighter">
          <span><span className="text-red-500">Neel</span>aksh</span><span className="ml-6 md:ml-8">Bhatia</span>
        </h1>
        <p className="mt-4 text-xl md:text-2xl text-blue-400 font-medium">
          Software Engineer at YouTube
        </p>
        <div className="mt-8 flex justify-center space-x-6">
          <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors duration-300">
            <GitHubIcon className="w-8 h-8" />
          </a>
          <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors duration-300">
            <LinkedInIcon className="w-8 h-8" />
          </a>
          <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors duration-300">
            <MediumIcon className="w-8 h-8" />
          </a>
        </div>
      </div>
       <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20">
        <a href="#about" onClick={handleScrollToAbout} className="animate-bounce">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </a>
      </div>
    </section>
  );
};