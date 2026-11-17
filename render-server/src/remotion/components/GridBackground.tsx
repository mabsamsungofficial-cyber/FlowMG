import React from 'react';
import { useCurrentFrame, interpolate } from 'remotion';

export const GridBackground: React.FC = () => {
  const frame = useCurrentFrame();

  // Subtle pulsing ambient light
  const spotlightX = 540 + Math.sin(frame * 0.02) * 120;
  const spotlightY = 600 + Math.cos(frame * 0.015) * 150;
  const gridOffset = (frame * 0.5) % 60;

  return (
    <div
      style={{
        position: 'absolute',
        width: 1080,
        height: 1920,
        backgroundColor: '#07090E',
        overflow: 'hidden',
        zIndex: 0,
      }}
    >
      {/* Dynamic Radial Spotlight */}
      <div
        style={{
          position: 'absolute',
          left: spotlightX - 600,
          top: spotlightY - 600,
          width: 1200,
          height: 1200,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(229, 9, 20, 0.12) 0%, rgba(13, 17, 23, 0) 70%)',
          pointerEvents: 'none',
        }}
      />

      {/* Blueprint Grid Lines */}
      <svg width="1080" height="1920" style={{ position: 'absolute', top: 0, left: 0, opacity: 0.25 }}>
        <defs>
          <pattern id="smallGrid" width="60" height="60" patternUnits="userSpaceOnUse" y={gridOffset}>
            <path d="M 60 0 L 0 0 0 60" fill="none" stroke="rgba(255, 255, 255, 0.12)" strokeWidth="1" />
          </pattern>
          <pattern id="mainGrid" width="180" height="180" patternUnits="userSpaceOnUse" y={gridOffset}>
            <rect width="180" height="180" fill="url(#smallGrid)" />
            <path d="M 180 0 L 0 0 0 180" fill="none" stroke="rgba(255, 255, 255, 0.25)" strokeWidth="2" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#mainGrid)" />
      </svg>

      {/* Top Header Glow Bar */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: 8,
          background: 'linear-gradient(90deg, #E50914 0%, #FF2A3A 50%, #E50914 100%)',
          boxShadow: '0 0 25px rgba(229, 9, 20, 0.8)',
        }}
      />

      {/* High-Retention Top Right Watermark / Category Pill */}
      <div
        style={{
          position: 'absolute',
          top: 70,
          right: 60,
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          padding: '8px 20px',
          backgroundColor: 'rgba(255, 255, 255, 0.06)',
          border: '1px solid rgba(255, 255, 255, 0.12)',
          borderRadius: 24,
          backdropFilter: 'blur(8px)',
        }}
      >
        <div style={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: '#E50914', boxShadow: '0 0 8px #FF2A3A' }} />
        <span style={{ color: '#FFFFFF', fontSize: 18, fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase' }}>
          CASE STUDY
        </span>
      </div>
    </div>
  );
};
