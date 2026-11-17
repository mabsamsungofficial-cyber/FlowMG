import React from 'react';
import { useVideoConfig, spring, interpolate } from 'remotion';

interface AudienceMatrixCardProps {
  title?: string;
  sceneFrame: number;
}

export const AudienceMatrixCard: React.FC<AudienceMatrixCardProps> = ({
  title = 'VIDEO चली = VIEWS',
  sceneFrame,
}) => {
  const { fps } = useVideoConfig();

  const containerSpring = spring({
    frame: sceneFrame,
    fps,
    config: { damping: 14, stiffness: 120 },
  });

  // 10 columns x 8 rows = 80 audience person icons
  const totalIcons = 80;
  const redIndices = [0, 11, 14, 21, 28, 35, 42, 49, 56, 63, 70, 77];

  return (
    <div
      style={{
        width: 960,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        transform: `scale(${containerSpring})`,
      }}
    >
      {/* Big Headline */}
      <div style={{ marginBottom: 28, textAlign: 'center' }}>
        <h1
          style={{
            fontSize: 64,
            fontFamily: 'Impact, Montserrat, Anton, sans-serif',
            letterSpacing: '0.04em',
            margin: 0,
            color: '#0F172A',
            textTransform: 'uppercase',
          }}
        >
          <span style={{ color: '#E11D48' }}>VIDEO</span> चली = VIEWS
        </h1>
      </div>

      {/* Grid of Audience Icons */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(10, 1fr)',
          gap: '16px 32px',
          padding: '24px 40px',
          backgroundColor: '#FFFFFF',
          borderRadius: 24,
          border: '2px solid rgba(15, 23, 42, 0.1)',
          boxShadow: '0 12px 35px rgba(0, 0, 0, 0.06)',
        }}
      >
        {Array.from({ length: totalIcons }).map((_, i) => {
          const isRed = redIndices.includes(i);
          const iconSpring = spring({
            frame: Math.max(0, sceneFrame - Math.floor(i / 2)),
            fps,
            config: { damping: 10, stiffness: 180 },
          });

          return (
            <div
              key={i}
              style={{
                transform: `scale(${iconSpring})`,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
              }}
            >
              <svg width="24" height="32" viewBox="0 0 24 32" fill="none">
                {/* Head */}
                <circle cx="12" cy="7" r="5" fill={isRed ? '#E11D48' : '#1E293B'} />
                {/* Torso */}
                <path
                  d="M 4 28 C 4 19 8 16 12 16 C 16 16 20 19 20 28 Z"
                  fill={isRed ? '#E11D48' : '#1E293B'}
                />
              </svg>
            </div>
          );
        })}
      </div>
    </div>
  );
};
