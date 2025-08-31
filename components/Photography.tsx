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
      className="bg-black/70 backdrop-blur-lg"
    >
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {photos.map((photo, index) => (
          <div key={index} className="overflow-hidden rounded-lg shadow-lg group">
            <img 
              src={photo} 
              alt={`Photography sample ${index + 1}`} 
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
          </div>
        ))}
      </div>
    </Section>
  );
};