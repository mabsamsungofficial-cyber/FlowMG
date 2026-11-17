import React from 'react';
import { useVideoConfig, spring } from 'remotion';
import { ComparisonSide } from '../../ai/types';

interface ComparisonCardProps {
  title?: string;
  subtitle?: string;
  comparison?: {
    sideA: ComparisonSide;
    sideB: ComparisonSide;
  };
  sceneFrame: number;
}

export const ComparisonCard: React.FC<ComparisonCardProps> = ({
  title = 'Direct Comparison',
  subtitle = 'Traditional vs Modern Strategy',
  comparison = {
    sideA: {
      title: 'Traditional Model',
      points: ['High Real Estate', 'Heavy Fixed Costs', 'Slow Expansion'],
    },
    sideB: {
      title: 'Disruptor Model',
      points: ['Cloud Operations', 'Variable Gig Labor', '10x Faster Scale'],
      highlight: true,
    },
  },
  sceneFrame,
}) => {
  const { fps } = useVideoConfig();

  const containerSpring = spring({
    frame: sceneFrame,
    fps,
    config: { damping: 14, stiffness: 120 },
  });

  return (
    <div
      style={{
        width: 960,
        backgroundColor: '#0F131C',
        borderRadius: 28,
        border: '2px solid rgba(255, 42, 58, 0.4)',
        boxShadow: '0 25px 60px rgba(0, 0, 0, 0.85)',
        padding: '36px 40px',
        transform: `scale(${containerSpring})`,
        display: 'flex',
        flexDirection: 'column',
        gap: 28,
      }}
    >
      {/* Title */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
          <div style={{ width: 8, height: 24, backgroundColor: '#FF2A3A', borderRadius: 4 }} />
          <h2
            style={{
              fontSize: 32,
              fontWeight: 900,
              color: '#FFFFFF',
              letterSpacing: '0.02em',
              textTransform: 'uppercase',
              margin: 0,
            }}
          >
            {title}
          </h2>
        </div>
        <p style={{ fontSize: 18, color: '#94A3B8', margin: 0, marginLeft: 18 }}>
          {subtitle}
        </p>
      </div>

      {/* Two Comparison Columns */}
      <div style={{ display: 'flex', gap: 24 }}>
        {/* Side A */}
        {(() => {
          const sideASpring = spring({
            frame: Math.max(0, sceneFrame - 10),
            fps,
            config: { damping: 12, stiffness: 150 },
          });

          return (
            <div
              style={{
                flex: 1,
                backgroundColor: '#161B26',
                borderRadius: 20,
                padding: '28px 24px',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                transform: `scale(${sideASpring})`,
              }}
            >
              <div
                style={{
                  color: '#94A3B8',
                  fontSize: 22,
                  fontWeight: 800,
                  textTransform: 'uppercase',
                  marginBottom: 20,
                  borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
                  paddingBottom: 12,
                }}
              >
                {comparison.sideA.title}
              </div>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 16 }}>
                {comparison.sideA.points.map((pt, i) => (
                  <li key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, color: '#CBD5E1', fontSize: 18 }}>
                    <span style={{ color: '#EF4444', fontWeight: 900, fontSize: 20 }}>✕</span>
                    <span>{pt}</span>
                  </li>
                ))}
              </ul>
            </div>
          );
        })()}

        {/* Side B (Highlight Disruptor) */}
        {(() => {
          const sideBSpring = spring({
            frame: Math.max(0, sceneFrame - 18),
            fps,
            config: { damping: 10, stiffness: 170 },
          });

          return (
            <div
              style={{
                flex: 1,
                backgroundColor: 'rgba(255, 42, 58, 0.08)',
                borderRadius: 20,
                padding: '28px 24px',
                border: '2px solid #FF2A3A',
                boxShadow: '0 0 35px rgba(255, 42, 58, 0.25)',
                transform: `scale(${sideBSpring})`,
                position: 'relative',
              }}
            >
              <div
                style={{
                  position: 'absolute',
                  top: -14,
                  right: 24,
                  backgroundColor: '#FF2A3A',
                  color: '#FFFFFF',
                  fontSize: 12,
                  fontWeight: 900,
                  letterSpacing: '0.1em',
                  padding: '3px 12px',
                  borderRadius: 12,
                  textTransform: 'uppercase',
                }}
              >
                WINNER
              </div>

              <div
                style={{
                  color: '#FF2A3A',
                  fontSize: 22,
                  fontWeight: 900,
                  textTransform: 'uppercase',
                  marginBottom: 20,
                  borderBottom: '1px solid rgba(255, 42, 58, 0.2)',
                  paddingBottom: 12,
                }}
              >
                {comparison.sideB.title}
              </div>

              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 16 }}>
                {comparison.sideB.points.map((pt, i) => (
                  <li key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, color: '#FFFFFF', fontSize: 18, fontWeight: 700 }}>
                    <span style={{ color: '#22C55E', fontWeight: 900, fontSize: 20 }}>✓</span>
                    <span>{pt}</span>
                  </li>
                ))}
              </ul>
            </div>
          );
        })()}
      </div>
    </div>
  );
};
