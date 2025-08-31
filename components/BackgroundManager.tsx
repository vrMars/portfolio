import React from 'react';

const backgrounds: { [key: string]: string } = {
  header: 'https://images.unsplash.com/photo-1531297484001-80022131f5a1?q=80&w=2020&auto=format&fit=crop',
  about: 'https://images.unsplash.com/photo-1550745165-9bc0b252726a?q=80&w=2070&auto=format&fit=crop',
  projects: 'https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=2070&auto=format&fit=crop',
  photography: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=1964&auto=format&fit=crop',
  blog: 'https://images.unsplash.com/photo-1457305237443-44c3d5a30b89?q=80&w=2074&auto=format&fit=crop',
  resume: 'https://images.unsplash.com/photo-1587620962725-abab7fe55159?q=80&w=1931&auto=format&fit=crop',
};

interface BackgroundManagerProps {
  activeSection: string;
}

export const BackgroundManager: React.FC<BackgroundManagerProps> = ({ activeSection }) => {
  return (
    <div className="fixed inset-0 -z-10">
      {Object.entries(backgrounds).map(([key, imageUrl]) => (
        <div
          key={key}
          className={`absolute inset-0 bg-cover bg-center transition-opacity duration-1000 ease-in-out ${
            activeSection === key ? 'opacity-100' : 'opacity-0'
          }`}
          style={{ backgroundImage: `linear-gradient(to bottom, rgba(0, 0, 0, 0.95), rgba(0, 0, 0, 1)), url('${imageUrl}')` }}
        />
      ))}
    </div>
  );
};