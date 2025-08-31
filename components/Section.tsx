import React, { useRef, useEffect, useState, useContext } from 'react';
import { ActiveSectionContext } from '../App';

interface SectionProps {
  children: React.ReactNode;
  className?: string;
  id?: string;
  title: string;
  highlightedWordOverride?: string;
}

export const Section: React.FC<SectionProps> = ({ children, className = '', id, title, highlightedWordOverride }) => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement | null>(null);
  const setActiveSection = useContext(ActiveSectionContext);

  // Observer for animations and active section tracking
  useEffect(() => {
    if (!id) return;
    
    const observer = new IntersectionObserver(
      ([entry]) => {
        // Fade-in animation
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
        // Set active section for background change
        if (entry.isIntersecting) {
          setActiveSection(id);
        }
      },
      {
        root: null,
        // Trigger when the element is centered in the viewport
        rootMargin: '-50% 0px -50% 0px',
        threshold: 0,
      }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        // eslint-disable-next-line react-hooks/exhaustive-deps
        observer.unobserve(sectionRef.current);
      }
    };
  }, [id, setActiveSection]);

  const [firstWord, ...restOfTitleArray] = title.split(' ');
  
  const highlightedText = highlightedWordOverride || firstWord;
  const remainingText = highlightedWordOverride
    ? title.substring(highlightedWordOverride.length)
    : ' ' + restOfTitleArray.join(' ');

  return (
    <section
      id={id}
      ref={sectionRef}
      className={`py-20 lg:py-32 transition-all duration-1000 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
      } ${className}`}
    >
      <div className="container mx-auto px-6 lg:px-8">
        <div className="lg:grid lg:grid-cols-12 lg:gap-x-12">
          <header className="lg:col-span-4">
            {/* Desktop-only sticky header. Always on the left. */}
            <h2 className="hidden lg:block text-2xl font-bold text-white sticky top-24 z-20">
              <span className="text-red-500">{highlightedText}</span>{remainingText}
            </h2>
          </header>
          <div className="lg:col-span-8">
            {/* Mobile-only in-flow header */}
            <h2 className="text-4xl text-center mb-16 font-bold text-white lg:hidden">
              <span className="text-red-500">{highlightedText}</span>{remainingText}
            </h2>
            {children}
          </div>
        </div>
      </div>
    </section>
  );
};