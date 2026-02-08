import React, { useState, useEffect, useCallback } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { NAV_LINKS } from '../constants';

export const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const next = window.scrollY > 10;
        // Only update when the value actually changes
        setIsScrolled((prev) => (prev !== next ? next : prev));
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
        <div className="flex items-center justify-between h-20">
          <Link
            to="/"
            onClick={(event) => handleNavigate(event, 'header')}
            className="text-xl font-semibold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 hover:from-indigo-600 hover:via-purple-600 hover:to-pink-600 transition-colors"
          >
            Neelaksh Bhatia
          </Link>
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
