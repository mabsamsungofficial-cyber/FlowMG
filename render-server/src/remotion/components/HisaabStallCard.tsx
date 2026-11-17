import React from 'react';
import { useVideoConfig, spring } from 'remotion';

interface HisaabStallCardProps {
  sceneFrame: number;
  neededAmount?: string;
  availableAmount?: string;
}

export const HisaabStallCard: React.FC<HisaabStallCardProps> = ({
  sceneFrame,
  neededAmount = 'Rs 3,000',
  availableAmount = 'Rs 2,000',
}) => {
  const { fps } = useVideoConfig();

  const stallSpring = spring({
    frame: sceneFrame,
    fps,
    config: { damping: 14, stiffness: 130 },
  });

  const card1Spring = spring({
    frame: Math.max(0, sceneFrame - 10),
    fps,
    config: { damping: 12, stiffness: 160 },
  });

  const card2Spring = spring({
    frame: Math.max(0, sceneFrame - 20),
    fps,
    config: { damping: 12, stiffness: 160 },
  });

  return (
    <div
      style={{
        width: 960,
        height: 750,
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        transform: `scale(${stallSpring})`,
      }}
    >
      {/* --- FLOATING FINANCIAL WHITE CARDS (From Reference Video 1) --- */}
      <div style={{ position: 'absolute', top: 40, display: 'flex', flexDirection: 'column', gap: 20, zIndex: 30 }}>
        {/* Card 1: Thele ke liye chahiye */}
        <div
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: 20,
            padding: '16px 36px',
            boxShadow: '0 10px 30px rgba(0, 0, 0, 0.08)',
            border: '1px solid rgba(15, 23, 42, 0.08)',
            textAlign: 'center',
            transform: `scale(${card1Spring})`,
          }}
        >
          <div style={{ color: '#64748B', fontSize: 14, fontWeight: 900, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
            THELE KE LIYE CHAHIYE
          </div>
          <div style={{ color: '#0F172A', fontSize: 44, fontWeight: 900, marginTop: 4 }}>
            {neededAmount}
          </div>
        </div>

        {/* Card 2: Zaid ke paas */}
        <div
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: 20,
            padding: '16px 36px',
            boxShadow: '0 10px 30px rgba(0, 0, 0, 0.08)',
            border: '1px solid rgba(15, 23, 42, 0.08)',
            textAlign: 'center',
            transform: `scale(${card2Spring})`,
          }}
        >
          <div style={{ color: '#D97706', fontSize: 14, fontWeight: 900, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
            ZAID KE PAAS
          </div>
          <div style={{ color: '#D97706', fontSize: 44, fontWeight: 900, marginTop: 4 }}>
            {availableAmount}
          </div>
        </div>
      </div>

      {/* --- ILLUSTRATED 2D SHOP STALL (From Reference Video 1) --- */}
      <div
        style={{
          position: 'absolute',
          bottom: 20,
          width: 720,
          height: 480,
          zIndex: 10,
        }}
      >
        <svg width="720" height="480" viewBox="0 0 720 480" fill="none">
          {/* Awning Canopy with Yellow & Cream Stripes */}
          <g id="awning">
            <rect x="60" y="40" width="600" height="60" fill="#EAB308" />
            <path d="M 60 100 Q 110 130 160 100 Q 210 130 260 100 Q 310 130 360 100 Q 410 130 460 100 Q 510 130 560 100 Q 610 130 660 100 Z" fill="#EAB308" />
            {/* White stripes */}
            <rect x="160" y="40" width="100" height="60" fill="#FEF08A" />
            <rect x="360" y="40" width="100" height="60" fill="#FEF08A" />
            <rect x="560" y="40" width="100" height="60" fill="#FEF08A" />
          </g>

          {/* Wooden Poles */}
          <rect x="80" y="90" width="16" height="240" fill="#78350F" />
          <rect x="624" y="90" width="16" height="240" fill="#78350F" />

          {/* Nimbu Paani Signboard */}
          <rect x="180" y="110" width="360" height="50" rx="10" fill="#FFFFFF" stroke="#0F766E" strokeWidth="4" />
          <text x="360" y="144" textAnchor="middle" fill="#0F766E" fontSize="22" fontWeight="900" fontFamily="Montserrat, sans-serif">
            NIMBU PAANI · <tspan fill="#EA580C">Rs 20</tspan>
          </text>

          {/* Character behind stall */}
          <g id="stallPerson">
            <ellipse cx="360" cy="220" rx="42" ry="48" fill="#FBBF24" />
            <circle cx="345" cy="215" r="4" fill="#0F172A" />
            <circle cx="375" cy="215" r="4" fill="#0F172A" />
            <path d="M 350 235 Q 360 245 370 235" stroke="#0F172A" strokeWidth="3" fill="none" />
            <path d="M 300 300 L 360 260 L 420 300 Z" fill="#F59E0B" />
          </g>

          {/* Wooden Counter Table */}
          <rect x="40" y="280" width="640" height="180" rx="12" fill="#92400E" stroke="#78350F" strokeWidth="4" />
          <rect x="30" y="270" width="660" height="24" rx="6" fill="#B45309" />

          {/* Jug of Lemonade */}
          <rect x="140" y="220" width="60" height="60" rx="8" fill="rgba(254, 240, 138, 0.85)" stroke="#67E8F9" strokeWidth="3" />
          <circle cx="160" cy="245" r="6" fill="#FDE047" />
          <circle cx="180" cy="255" r="5" fill="#FDE047" />

          {/* Cash Box */}
          <rect x="460" y="240" width="90" height="40" rx="6" fill="#0F766E" stroke="#042F2E" strokeWidth="3" />
          <circle cx="505" cy="255" r="5" fill="#FDE047" />
        </svg>
      </div>
    </div>
  );
};
