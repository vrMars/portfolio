import React, { useRef, useEffect, useContext } from 'react';
import { ActiveSectionContext } from '../App';

interface SectionProps {
  children: React.ReactNode;
  className?: string;
  id?: string;
  title: string;
  highlightedWordOverride?: string;
  initiallyVisible?: boolean;
  activeSectionOverride?: string;
  withSurface?: boolean;
  surfaceClassName?: string;
  bgColor?: string;
}

export const Section: React.FC<SectionProps> = ({
  children,
  className = '',
  id,
  title,
  initiallyVisible = false,
  activeSectionOverride,
  surfaceClassName,
  bgColor,
}) => {
  const sectionRef = useRef<HTMLDivElement | null>(null);
  const setActiveSection = useContext(ActiveSectionContext);
  const targetSectionId = activeSectionOverride ?? id;

  useEffect(() => {
    if (!id || initiallyVisible) {
      if (initiallyVisible && targetSectionId) {
        setActiveSection(targetSectionId);
      }
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && targetSectionId) {
          setActiveSection(targetSectionId);
        }
      },
      {
        root: null,
        rootMargin: '-50% 0px -50% 0px',
        threshold: 0,
      }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, [id, initiallyVisible, setActiveSection, targetSectionId]);

  return (
    <section
      id={id}
      ref={sectionRef}
      className={`relative py-12 md:py-20 lg:py-24 ${className}`}
      style={bgColor ? { backgroundColor: bgColor } : undefined}
    >
      <div className="max-w-6xl mx-auto px-6 lg:px-8">
        <div className="mb-8 md:mb-12">
          <h2
            data-section-heading={id}
            className="font-serif text-3xl md:text-4xl font-semibold text-black tracking-tight"
          >
            {title}
          </h2>
        </div>

        <div className={surfaceClassName ?? ''}>
          {children}
        </div>
      </div>
    </section>
  );
};
