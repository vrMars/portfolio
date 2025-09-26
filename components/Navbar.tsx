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
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled || location.pathname !== '/'
          ? 'bg-white/10 backdrop-blur-2xl shadow-[0_12px_40px_rgba(6,10,22,0.35)]'
          : 'bg-white/5 backdrop-blur-xl'
      }`}
    >
      <div className="container mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <Link
            to="/"
            onClick={(event) => handleNavigate(event, 'header')}
            className="text-xl font-semibold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-sky-200 via-emerald-200 to-rose-200 hover:from-sky-100 hover:via-emerald-100 hover:to-rose-100 transition-colors"
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
                  className="text-sm font-medium uppercase tracking-[0.3em] text-slate-200/70 hover:text-white transition-colors"
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
