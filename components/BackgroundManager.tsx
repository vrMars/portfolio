import React from 'react';

// Full-page hero background with animated gradient mesh, waves, and texture overlays
export const BackgroundManager: React.FC = () => {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      {/* Base deep space gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#0a0f21] via-[#060914] to-[#0b1020]" />

      {/* Animated gradient mesh layer (subtle) */}
      <div
        className="absolute inset-0 opacity-70 animate-gradient-xy-slow pointer-events-none bg-mesh"
        style={{
          background:
            'radial-gradient(60% 70% at 12% 8%, rgba(99, 168, 255, 0.24) 0%, rgba(99, 168, 255, 0) 60%),\
             radial-gradient(70% 60% at 85% 12%, rgba(255, 146, 220, 0.20) 0%, rgba(255, 146, 220, 0) 65%),\
             radial-gradient(65% 70% at 18% 80%, rgba(152, 238, 210, 0.18) 0%, rgba(152, 238, 210, 0) 68%),\
             radial-gradient(55% 55% at 78% 68%, rgba(255, 220, 170, 0.16) 0%, rgba(255, 220, 170, 0) 70%)',
        }}
      />

      {/* Hero waves - top and bottom soft vignettes using predefined clip paths */}
      <div
        className="absolute top-0 inset-x-0 h-[45vh] clip-wave-top opacity-50 pointer-events-none bg-waves"
        style={{
          background:
            'linear-gradient(180deg, rgba(120, 175, 255, 0.22) 0%, rgba(120, 175, 255, 0.10) 35%, rgba(10, 15, 32, 0) 100%)',
          filter: 'blur(20px)'
        }}
      />
      <div
        className="absolute bottom-0 inset-x-0 h-[40vh] clip-wave-bottom opacity-40 pointer-events-none bg-waves"
        style={{
          background:
            'linear-gradient(0deg, rgba(245, 195, 255, 0.16) 0%, rgba(245, 195, 255, 0.08) 40%, rgba(10, 15, 32, 0) 100%)',
          filter: 'blur(16px)'
        }}
      />

      {/* Subtle blobs for depth (static to avoid perf cost) */}
      <div className="absolute inset-0 pointer-events-none bg-blobs">
        <div
          className="absolute -top-[18%] -left-[18%] w-[70vw] md:w-[50vw] aspect-square rounded-full blur-[150px]"
          style={{
            background: 'radial-gradient(circle at 30% 30%, rgba(106, 183, 255, 0.45) 0%, rgba(106, 183, 255, 0) 70%)'
          }}
        />
        <div
          className="absolute top-[8%] right-[-10%] w-[60vw] md:w-[40vw] aspect-square rounded-full blur-[160px]"
          style={{
            background: 'radial-gradient(circle at 70% 25%, rgba(255, 160, 228, 0.38) 0%, rgba(255, 160, 228, 0) 75%)'
          }}
        />
        <div
          className="absolute bottom-[-20%] left-[10%] w-[65vw] md:w-[38vw] aspect-square rounded-full blur-[170px]"
          style={{
            background: 'radial-gradient(circle at 35% 60%, rgba(164, 237, 210, 0.34) 0%, rgba(164, 237, 210, 0) 78%)'
          }}
        />
        <div
          className="absolute top-[45%] right-[35%] w-[42vw] md:w-[28vw] aspect-square rounded-full blur-[150px]"
          style={{
            background: 'radial-gradient(circle at 60% 40%, rgba(255, 214, 163, 0.32) 0%, rgba(255, 214, 163, 0) 72%)'
          }}
        />
      </div>

      {/* Glassy depth + texture (disable heavy backdrop blur on mobile) */}
      <div className="absolute inset-0 bg-[rgba(8,11,22,0.74)] md:backdrop-blur-[110px]" />
      <div className="absolute inset-0 lattice-overlay opacity-25" />
      <div className="absolute inset-0 grain-overlay opacity-20" />
    </div>
  );
};
