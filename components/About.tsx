import React from 'react';
import { Section } from './Section';

export const About: React.FC = () => {
  return (
    <Section 
      id="about"
      title="About Me"
      className="-mt-24 pt-32 md:-mt-32 md:pt-40 bg-black/70 backdrop-blur-lg clip-wave-top"
    >
      <div className="max-w-3xl mx-auto text-lg text-gray-400 text-center leading-relaxed">
        <p className="mb-4">
          Hi, I'm Neelaksh Bhatia. I'm a passionate Software Engineer currently building the future of video at YouTube. I thrive on solving complex problems and creating performant, scalable, and user-friendly applications. My expertise lies in full-stack development, distributed systems, and cloud infrastructure.
        </p>
        <p>
          When I'm not coding, you can find me behind a camera lens capturing moments, exploring new hiking trails, or diving into a good sci-fi novel. I'm driven by a curiosity to learn and a desire to build things that make a difference.
        </p>
      </div>
    </Section>
  );
};