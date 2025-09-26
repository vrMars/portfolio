import React, { useState, useEffect } from 'react';
import { UpArrowIcon } from './icons/UpArrowIcon';

export const ScrollToTopButton: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);

  // Show button when page is scrolled down
  const toggleVisibility = () => {
    const next = window.pageYOffset > 300;
    setIsVisible((prev) => (prev !== next ? next : prev));
  };

  // Set up event listener for scrolling
  useEffect(() => {
    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        toggleVisibility();
        ticking = false;
      });
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll as EventListener);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <button
      type="button"
      onClick={scrollToTop}
      className={`fixed bottom-8 right-8 z-50 glass-button p-3 rounded-full text-slate-100/80 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-200/60 transition-all duration-500 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 pointer-events-none'
      }`}
      aria-label="Scroll to top"
      aria-hidden={!isVisible}
      tabIndex={isVisible ? 0 : -1}
    >
      <UpArrowIcon className="w-6 h-6" />
    </button>
  );
};
