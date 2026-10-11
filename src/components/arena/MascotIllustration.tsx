import React from 'react';

export const MascotIllustration: React.FC<{ className?: string }> = ({ className = 'w-48 h-48' }) => {
  return (
    <div className={`relative flex items-center justify-center ${className}`}>
      {/* Ambient background glow */}
      <div className="absolute inset-0 bg-blue-500/20 blur-2xl rounded-full scale-90 pointer-events-none" />

      {/* SVG Robot Mascot */}
      <svg
        viewBox="0 0 240 240"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full drop-shadow-[0_10px_25px_rgba(22,139,255,0.35)] relative z-10"
      >
        <defs>
          <linearGradient id="chassisGrad" x1="40" y1="40" x2="200" y2="200" gradientUnits="userSpaceOnUse">
            <stop stopColor="#FFFFFF" />
            <stop offset="0.7" stopColor="#E2E8F0" />
            <stop offset="1" stopColor="#CBD5E1" />
          </linearGradient>

          <linearGradient id="blueAccent" x1="60" y1="30" x2="180" y2="200" gradientUnits="userSpaceOnUse">
            <stop stopColor="#38BDF8" />
            <stop offset="1" stopColor="#1E40AF" />
          </linearGradient>

          <linearGradient id="visorGrad" x1="70" y1="75" x2="170" y2="135" gradientUnits="userSpaceOnUse">
            <stop stopColor="#0B1329" />
            <stop offset="1" stopColor="#030712" />
          </linearGradient>

          <filter id="neonCyanGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Floating Robot Antenna */}
        <line x1="120" y1="42" x2="120" y2="25" stroke="#94A3B8" strokeWidth="4" strokeLinecap="round" />
        <circle cx="120" cy="22" r="7" fill="#38BDF8" filter="url(#neonCyanGlow)" />

        {/* Shoulders / Torso */}
        <path
          d="M 68 170 C 68 150, 172 150, 172 170 L 180 215 C 180 225, 60 225, 60 215 Z"
          fill="url(#chassisGrad)"
          stroke="#94A3B8"
          strokeWidth="2.5"
        />
        {/* Blue chest plate */}
        <path
          d="M 85 168 C 85 158, 155 158, 155 168 L 148 198 C 148 204, 92 204, 92 198 Z"
          fill="url(#blueAccent)"
        />
        {/* Chest core light */}
        <circle cx="120" cy="182" r="6" fill="#22D3EE" filter="url(#neonCyanGlow)" />

        {/* Outer Ears / Audio Sensors */}
        <rect x="42" y="85" width="14" height="42" rx="7" fill="url(#blueAccent)" />
        <rect x="184" y="85" width="14" height="42" rx="7" fill="url(#blueAccent)" />
        <circle cx="49" cy="106" r="4" fill="#22D3EE" filter="url(#neonCyanGlow)" />
        <circle cx="191" cy="106" r="4" fill="#22D3EE" filter="url(#neonCyanGlow)" />

        {/* Head Shell (White Glossy Round Head) */}
        <rect
          x="52"
          y="42"
          width="136"
          height="115"
          rx="52"
          fill="url(#chassisGrad)"
          stroke="#94A3B8"
          strokeWidth="2.5"
        />

        {/* Dark Visor Screen */}
        <rect
          x="66"
          y="62"
          width="108"
          height="76"
          rx="34"
          fill="url(#visorGrad)"
          stroke="#1E293B"
          strokeWidth="2"
        />

        {/* Glowing Cyan Eyes (Friendly Curved Cheerful Eyes) */}
        <path
          d="M 86 98 Q 98 84 108 98"
          stroke="#22D3EE"
          strokeWidth="5"
          strokeLinecap="round"
          fill="none"
          filter="url(#neonCyanGlow)"
        />
        <path
          d="M 132 98 Q 142 84 154 98"
          stroke="#22D3EE"
          strokeWidth="5"
          strokeLinecap="round"
          fill="none"
          filter="url(#neonCyanGlow)"
        />

        {/* Friendly Curved Smile */}
        <path
          d="M 108 118 Q 120 128 132 118"
          stroke="#22D3EE"
          strokeWidth="3.5"
          strokeLinecap="round"
          fill="none"
          filter="url(#neonCyanGlow)"
        />

        {/* Cheerful Blush Dots */}
        <circle cx="82" cy="116" r="4" fill="#38BDF8" opacity="0.6" />
        <circle cx="158" cy="116" r="4" fill="#38BDF8" opacity="0.6" />
      </svg>
    </div>
  );
};
