import React from 'react';

interface SectionDividerProps {
  topColor: string;
  bottomColor: string;
}

export const SectionDivider: React.FC<SectionDividerProps> = ({ topColor, bottomColor }) => (
  <div className="relative w-full overflow-hidden -my-px" style={{ backgroundColor: bottomColor }}>
    <svg
      viewBox="0 0 1440 80"
      preserveAspectRatio="none"
      className="block w-full"
      style={{ height: '60px' }}
    >
      <path
        d="M0,0 C480,80 960,20 1440,60 L1440,0 L0,0 Z"
        fill={topColor}
      />
    </svg>
  </div>
);
