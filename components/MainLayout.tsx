import React, { useEffect } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';

export const MainLayout: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const targetId = (location.state as { scrollTo?: string } | null)?.scrollTo;
    if (!targetId) {
      return;
    }

    const scroll = () => {
      if (targetId === 'top' || targetId === 'header') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }

      const element = document.getElementById(targetId);
      if (element) {
        const navbarHeight = 80;
        const offsetPosition = Math.max(element.offsetTop - navbarHeight, 0);
        window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
      }
    };

    const animationFrame = window.requestAnimationFrame(scroll);

    // Clear the state so the scroll only runs once after navigation
    navigate(location.pathname, { replace: true, state: {} });

    return () => window.cancelAnimationFrame(animationFrame);
  }, [location, navigate]);

  return <Outlet />;
};
