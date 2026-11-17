import React from 'react';
import { useVideoConfig, spring, interpolate } from 'remotion';

interface KineticPunchCardProps {
  primaryText?: string;
  highlightText?: string;
  subtitle?: string;
  sceneFrame: number;
}

export const KineticPunchCard: React.FC<KineticPunchCardProps> = ({
  primaryText = 'मस्त',
  highlightText = 'PROMOTION',
  subtitle = 'ब्रांड का असली फायदा',
  sceneFrame,
}) => {
  const { fps } = useVideoConfig();

  const textSpring = spring({
    frame: sceneFrame,
    fps,
    config: { damping: 10, mass: 0.7, stiffness: 180 },
  });

  const lineSpring = spring({
    frame: Math.max(0, sceneFrame - 8),
    fps,
    config: { damping: 12, stiffness: 150 },
  });

  return (
    <div
      style={{
        width: 960,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '60px 40px',
      }}
    >
      {/* Giant Kinetic Word */}
      <div
        style={{
          display: 'flex',
          alignItems: 'baseline',
          gap: 20,
          transform: `scale(${textSpring})`,
        }}
      >
        <span
          style={{
            fontSize: 88,
            fontFamily: 'Montserrat, sans-serif',
            fontWeight: 900,
            color: '#0F172A',
          }}
        >
          {primaryText}
        </span>
        <span
          style={{
            fontSize: 96,
            fontFamily: 'Impact, Montserrat, Anton, sans-serif',
            fontWeight: 900,
            color: '#E11D48',
            letterSpacing: '0.04em',
            textTransform: 'uppercase',
          }}
        >
          {highlightText}
        </span>
      </div>

      {/* Bold Red Underline Rule */}
      <div
        style={{
          width: 580 * lineSpring,
          height: 10,
          backgroundColor: '#E11D48',
          borderRadius: 5,
          marginTop: 10,
        }}
      />

      {/* Subtitle */}
      {subtitle && (
        <div
          style={{
            marginTop: 24,
            fontSize: 28,
            fontWeight: 700,
            color: '#64748B',
            letterSpacing: '0.02em',
          }}
        >
          {subtitle}
        </div>
      )}
    </div>
  );
};
