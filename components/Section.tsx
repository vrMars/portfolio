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
}

export const Section: React.FC<SectionProps> = ({
  children,
  className = '',
  id,
  title,
  highlightedWordOverride,
  initiallyVisible = false,
  activeSectionOverride,
  withSurface = true,
  surfaceClassName,
}) => {
  const sectionRef = useRef<HTMLDivElement | null>(null);
  const setActiveSection = useContext(ActiveSectionContext);
  const targetSectionId = activeSectionOverride ?? id;

  // Observer for animations and active section tracking
  useEffect(() => {
    if (!id || initiallyVisible) {
      if (initiallyVisible && targetSectionId) {
        setActiveSection(targetSectionId);
      }
      return;
    }
    
    const observer = new IntersectionObserver(
      ([entry]) => {
        // Set active section for background change
        if (entry.isIntersecting && targetSectionId) {
          setActiveSection(targetSectionId);
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
  }, [id, initiallyVisible, setActiveSection, targetSectionId]);

  const [firstWord, ...restOfTitleArray] = title.split(' ');
  
  const highlightedText = highlightedWordOverride || firstWord;
  const remainingText = highlightedWordOverride
    ? title.substring(highlightedWordOverride.length)
    : ' ' + restOfTitleArray.join(' ');

  const surfaceClasses = withSurface
    ? `glass-panel relative overflow-hidden p-8 md:p-12 lg:p-14 rounded-3xl border border-white/10 shadow-[0_25px_80px_rgba(8,11,24,0.45)] ${
        surfaceClassName ?? ''
      }`
    : surfaceClassName ?? '';

  return (
    <section
      id={id}
      ref={sectionRef}
      className={`relative py-24 lg:py-32 ${className}`}
    >
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-28 right-[-25%] h-64 w-64 rounded-full bg-gradient-to-br from-white/10 to-transparent blur-[110px]" />
        <div className="absolute bottom-[-35%] left-[-15%] h-72 w-72 rounded-full bg-gradient-to-br from-white/8 to-transparent blur-[120px]" />
      </div>
      <div className="container mx-auto px-6 lg:px-8">
        <div className="lg:grid lg:grid-cols-12 lg:gap-x-12">
          <header className="lg:col-span-4">
            {/* Desktop-only sticky header. Always on the left. */}
            <h2 className="hidden lg:block text-3xl font-semibold text-white/90 sticky top-28 z-20">
              <span className="bg-gradient-to-r from-sky-200 via-blue-200 to-rose-200 bg-clip-text text-transparent">
                {highlightedText}
              </span>
              <span className="text-slate-200/80">{remainingText}</span>
            </h2>
          </header>
          <div className="lg:col-span-8">
            {/* Mobile-only in-flow header */}
            <h2 className="text-4xl text-center mb-10 font-semibold text-white/90 lg:hidden">
              <span className="bg-gradient-to-r from-sky-200 via-blue-200 to-rose-200 bg-clip-text text-transparent">
                {highlightedText}
              </span>
              <span className="text-slate-200/80">{remainingText}</span>
            </h2>
            {withSurface ? (
              <div className={surfaceClasses}>{children}</div>
            ) : surfaceClassName ? (
              <div className={surfaceClassName}>{children}</div>
            ) : (
              <>{children}</>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
