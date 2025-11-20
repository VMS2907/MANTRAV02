
import React from 'react';

interface LogoProps {
  className?: string;
  animated?: boolean;
}

export const Logo: React.FC<LogoProps> = ({ className = "w-12 h-12", animated = false }) => {
  return (
    <svg 
      viewBox="0 0 100 100" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg" 
      className={className}
      aria-label="Mantra Logo"
    >
      <defs>
        <linearGradient id="mantraGradient" x1="10%" y1="100%" x2="90%" y2="0%">
          <stop offset="0%" stopColor="#7C3AED" /> {/* Violet 600 */}
          <stop offset="100%" stopColor="#DB2777" /> {/* Pink 600 */}
        </linearGradient>
        <linearGradient id="mantraLight" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#A78BFA" /> {/* Violet 400 */}
          <stop offset="100%" stopColor="#F472B6" /> {/* Pink 400 */}
        </linearGradient>
        <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="4" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>
      
      {/* 
         STORY: THE LOTUS OF INSIGHT
         "Rooted in experience, unfolding through emotion, rising to clarity."
      */}

      <g className={animated ? "animate-[float_6s_ease-in-out_infinite]" : ""}>
        {/* Left Petal - Acceptance */}
        <path 
            d="M 50 82 C 20 82 10 55 22 35" 
            stroke="url(#mantraGradient)" 
            strokeWidth="5" 
            strokeLinecap="round"
            className="opacity-60"
        />
        
        {/* Right Petal - Growth */}
        <path 
            d="M 50 82 C 80 82 90 55 78 35" 
            stroke="url(#mantraGradient)" 
            strokeWidth="5" 
            strokeLinecap="round"
            className="opacity-60"
        />

        {/* Center Core - The Inner Self (Rising Flame) */}
        <path 
            d="M 50 82 Q 32 55 50 25 Q 68 55 50 82 Z" 
            fill="url(#mantraGradient)"
            className={animated ? "animate-pulse" : ""}
            filter="url(#glow)"
        />
        
        {/* Inner Light - Highlight on the core */}
        <path 
            d="M 50 82 Q 40 55 50 35 Q 60 55 50 82 Z" 
            fill="url(#mantraLight)"
            opacity="0.4"
        />

        {/* The Epiphany (Floating Dot) */}
        <circle 
            cx="50" 
            cy="16" 
            r="4" 
            fill="#fff" 
            className={animated ? "animate-[ping_4s_cubic-bezier(0,0,0.2,1)_infinite]" : ""} 
            opacity="0.9" 
        />
        <circle cx="50" cy="16" r="2.5" fill="#fff" />
      </g>

      {/* Base Stability line (optional subtle ground) */}
      {/* <path d="M 40 90 L 60 90" stroke="white" strokeWidth="2" strokeLinecap="round" opacity="0.1" /> */}
    </svg>
  );
};
