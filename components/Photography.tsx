import React from 'react';
import { Section } from './Section';

const photos = [
  'https://picsum.photos/seed/photo1/800/600',
  'https://picsum.photos/seed/photo2/600/800',
  'https://picsum.photos/seed/photo3/800/600',
  'https://picsum.photos/seed/photo4/800/600',
  'https://picsum.photos/seed/photo5/600/800',
  'https://picsum.photos/seed/photo6/800/600',
];

export const Photography: React.FC = () => {
  return (
    <Section
      id="photography"
      title="Photography"
      highlightedWordOverride="Photo"
      surfaceClassName="p-8 md:p-12"
    >
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
        {photos.map((photo, index) => (
          <div
            key={index}
            className="relative overflow-hidden rounded-3xl border border-white/12 bg-white/10 backdrop-blur-md group"
          >
            <img
              src={photo}
              alt={`Photography sample ${index + 1}`}
              loading="lazy"
              decoding="async"
              fetchpriority="low"
              className="w-full h-full object-cover transition-transform duration-[1200ms] group-hover:scale-110"
              style={{ willChange: 'transform' }}
            />
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          </div>
        ))}
      </div>
    </Section>
  );
};
