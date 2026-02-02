import React from 'react';

const NetworkGraphic = () => (
  <svg width="450" height="450" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Central Glow */}
    <defs>
      <radialGradient id="glow" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.3" />
        <stop offset="100%" stopColor="#38bdf8" stopOpacity="0" />
      </radialGradient>
    </defs>
    <circle cx="100" cy="100" r="80" fill="url(#glow)" />

    {/* Connecting Lines */}
    <path d="M60 60 L140 140 M140 60 L60 140 M100 40 L100 160 M40 100 L160 100" stroke="#38bdf8" strokeWidth="0.5" strokeDasharray="2 2" opacity="0.5" />
    
    {/* Nodes */}
    <circle cx="100" cy="100" r="4" fill="#38bdf8" />
    <circle cx="60" cy="60" r="3" fill="#38bdf8" opacity="0.8" />
    <circle cx="140" cy="140" r="3" fill="#818cf8" opacity="0.8" />
    <circle cx="140" cy="60" r="3" fill="#38bdf8" opacity="0.8" />
    <circle cx="60" cy="140" r="3" fill="#818cf8" opacity="0.8" />
  </svg>
);

export default NetworkGraphic;