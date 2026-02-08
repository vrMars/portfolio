import React from 'react';

// Neumorphic background - clean, light, airy
export const BackgroundManager: React.FC = () => {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      {/* Base neumorphic background */}
      <div
        className="absolute inset-0"
        style={{ background: '#F0F2F5' }}
      />

      {/* Subtle gradient accents for visual interest */}
      <div
        className="absolute inset-0 opacity-30 pointer-events-none"
        style={{
          background:
            'radial-gradient(60% 50% at 20% 15%, rgba(102, 126, 234, 0.08) 0%, transparent 70%),' +
            'radial-gradient(50% 40% at 80% 20%, rgba(118, 75, 162, 0.06) 0%, transparent 65%),' +
            'radial-gradient(55% 45% at 75% 80%, rgba(102, 126, 234, 0.05) 0%, transparent 70%)'
        }}
      />

      {/* Very subtle texture overlay */}
      <div className="absolute inset-0 grain-overlay opacity-20" />
    </div>
  );
};
