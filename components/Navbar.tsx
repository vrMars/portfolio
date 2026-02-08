import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { NAV_LINKS } from '../constants';

export const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [navbarLabel, setNavbarLabel] = useState('');
  const location = useLocation();
  const navigate = useNavigate();

  // --- Animated label state ---
  const [displayedLabel, setDisplayedLabel] = useState('');
  const [labelFadedIn, setLabelFadedIn] = useState(false);
  const prevLabelRef = useRef('');

  const showLabel = location.pathname === '/' && navbarLabel !== '';

  // Orchestrate fade-out → swap text → fade-in when navbarLabel changes
  useEffect(() => {
    const prev = prevLabelRef.current;
    prevLabelRef.current = navbarLabel;
    if (navbarLabel === prev) return;

    // Label disappearing (scrolled back to top)
    if (!navbarLabel) {
      setLabelFadedIn(false);
      const t = setTimeout(() => setDisplayedLabel(''), 250);
      return () => clearTimeout(t);
    }

    // Label appearing for the first time
    if (!prev) {
      setDisplayedLabel(navbarLabel);
      // Double-rAF so the browser paints the element before transitioning
      requestAnimationFrame(() => {
        requestAnimationFrame(() => setLabelFadedIn(true));
      });
      return;
    }

    // Label swapping (section → section): fade out, change, fade in
    setLabelFadedIn(false);
    const t = setTimeout(() => {
      setDisplayedLabel(navbarLabel);
      requestAnimationFrame(() => {
        requestAnimationFrame(() => setLabelFadedIn(true));
      });
    }, 200);
    return () => clearTimeout(t);
  }, [navbarLabel]);

  // --- Name collapse state ---
  const [nameCollapsed, setNameCollapsed] = useState(false);
  const prevShowLabelRef = useRef(false);

  useEffect(() => {
    const prev = prevShowLabelRef.current;
    prevShowLabelRef.current = showLabel;
    if (showLabel === prev) return;
    // Small stagger: collapse name slightly before label fades in, expand after label fades out
    if (showLabel) {
      setNameCollapsed(true);
    } else {
      const t = setTimeout(() => setNameCollapsed(false), 200);
      return () => clearTimeout(t);
    }
  }, [showLabel]);

  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const next = window.scrollY > 10;
        setIsScrolled((prev) => (prev !== next ? next : prev));

        // Find the last section heading that has scrolled past the navbar
        const headings = document.querySelectorAll('[data-section-heading]');
        let lastId = '';
        headings.forEach((heading) => {
          if (heading.getBoundingClientRect().bottom < 80) {
            lastId = heading.getAttribute('data-section-heading') || '';
          }
        });
        const name = lastId
          ? NAV_LINKS.find((l) => l.href === `#${lastId}`)?.name ?? ''
          : '';
        setNavbarLabel((prev) => (prev !== name ? name : prev));

        ticking = false;
      });
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll as EventListener);
    };
  }, []);

  const scrollToSection = useCallback((targetId: string) => {
    if (targetId === 'top' || targetId === 'header') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    const element = document.getElementById(targetId);
    if (element) {
      const navbarHeight = 80; // h-20 is 80px
      const offsetPosition = Math.max(element.offsetTop - navbarHeight, 0);
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      });
    }
  }, []);

  const handleNavigate = useCallback(
    (event: React.MouseEvent<HTMLAnchorElement>, targetId: string) => {
      event.preventDefault();

      if (location.pathname !== '/') {
        navigate('/', { state: { scrollTo: targetId } });
        return;
      }

      scrollToSection(targetId);
    },
    [location.pathname, navigate, scrollToSection]
  );

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${isScrolled || location.pathname !== '/'
          ? 'shadow-[6px_6px_12px_#c8ccd4,-6px_-6px_12px_#ffffff]'
          : ''
        }`}
      style={{ background: '#F0F2F5' }}
    >
      <div className="container mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 relative">
          <Link
            to="/"
            onClick={(event) => handleNavigate(event, 'header')}
            className="text-xl font-semibold tracking-tight"
          >
            {/* Desktop: always full name */}
            <span className="hidden md:inline text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
              Neelaksh Bhatia
            </span>
            {/* Mobile: crossfade between full name and initials */}
            <span className="md:hidden relative inline-flex items-center">
              <span className={`text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 transition-opacity duration-300 ease-out ${
                nameCollapsed ? 'opacity-0' : 'opacity-100'
              }`}>
                Neelaksh Bhatia
              </span>
              <span className={`absolute left-0 text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 transition-opacity duration-300 ease-out ${
                nameCollapsed ? 'opacity-100' : 'opacity-0'
              }`}>
                NB
              </span>
            </span>
          </Link>

          {/* Mobile: active section label — animated fade/slide */}
          <span
            className={`absolute left-1/2 -translate-x-1/2 md:hidden text-xs font-medium uppercase tracking-[0.15em] text-gray-400 whitespace-nowrap transition-all duration-250 ease-out ${
              labelFadedIn
                ? 'opacity-100 translate-y-0'
                : 'opacity-0 -translate-y-2 pointer-events-none'
            }`}
          >
            {displayedLabel}
          </span>

          <nav className="hidden md:flex items-center space-x-8">
            {NAV_LINKS.map((link) => {
              const targetId = link.href === '#' ? 'header' : link.href.replace('#', '');
              return (
                <Link
                  key={link.name}
                  to="/"
                  onClick={(event) => handleNavigate(event, targetId)}
                  className="text-sm font-medium uppercase tracking-[0.3em] text-gray-500 hover:text-indigo-500 transition-colors"
                >
                  {link.name}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>
    </header>
  );
};
