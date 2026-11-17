import React from 'react';
import { useVideoConfig, spring, interpolate } from 'remotion';
import { MathItem } from '../../ai/types';

interface MathBreakdownCardProps {
  title?: string;
  subtitle?: string;
  mathEquation?: {
    total: string;
    parts: MathItem[];
    operator?: string;
  };
  sceneFrame: number;
}

export const MathBreakdownCard: React.FC<MathBreakdownCardProps> = ({
  title = 'Unit Economics Breakdown',
  subtitle = 'Where does each Rupee go?',
  mathEquation = {
    total: '₹100 Retail Price',
    parts: [
      { label: 'COGS & Delivery', value: '₹40' },
      { label: 'Customer Acquisition', value: '₹35' },
      { label: 'Net Profit', value: '₹25', isResult: true },
    ],
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
        backgroundColor: '#0E121B',
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

      {/* Top Main Total Box */}
      {(() => {
        const topSpring = spring({
          frame: Math.max(0, sceneFrame - 8),
          fps,
          config: { damping: 12, stiffness: 170 },
        });

        return (
          <div
            style={{
              backgroundColor: '#181E2C',
              borderRadius: 20,
              padding: '24px 32px',
              border: '2px solid #FFFFFF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              transform: `scale(${topSpring})`,
              boxShadow: '0 10px 30px rgba(0, 0, 0, 0.5)',
            }}
          >
            <div>
              <div style={{ color: '#94A3B8', fontSize: 16, fontWeight: 700, textTransform: 'uppercase' }}>
                Total Benchmark
              </div>
              <div style={{ color: '#FFFFFF', fontSize: 40, fontWeight: 900, marginTop: 4 }}>
                {mathEquation.total}
              </div>
            </div>
            <div
              style={{
                width: 56,
                height: 56,
                borderRadius: '50%',
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#FFFFFF',
                fontSize: 36,
                fontWeight: 900,
              }}
            >
              =
            </div>
          </div>
        );
      })()}

      {/* Mathematical Breakdown Parts */}
      <div style={{ display: 'flex', gap: 16, justifyContent: 'space-between' }}>
        {mathEquation.parts.map((item, idx) => {
          const itemSpring = spring({
            frame: Math.max(0, sceneFrame - (16 + idx * 10)),
            fps,
            config: { damping: 10, stiffness: 160 },
          });

          const isHighlight = item.isResult;

          return (
            <div
              key={`math-part-${idx}`}
              style={{
                flex: 1,
                backgroundColor: isHighlight ? 'rgba(255, 42, 58, 0.12)' : '#151923',
                borderRadius: 18,
                padding: '24px 20px',
                border: isHighlight ? '2px solid #FF2A3A' : '1px solid rgba(255, 255, 255, 0.1)',
                boxShadow: isHighlight
                  ? '0 0 30px rgba(255, 42, 58, 0.35)'
                  : '0 8px 24px rgba(0,0,0,0.3)',
                transform: `scale(${itemSpring})`,
                textAlign: 'center',
                position: 'relative',
              }}
            >
              {isHighlight && (
                <div
                  style={{
                    position: 'absolute',
                    top: -14,
                    left: '50%',
                    transform: 'translateX(-50%)',
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
                  SURPLUS
                </div>
              )}

              <div
                style={{
                  color: isHighlight ? '#FF2A3A' : '#FFFFFF',
                  fontSize: 36,
                  fontWeight: 900,
                  marginBottom: 8,
                }}
              >
                {item.value}
              </div>

              <div
                style={{
                  color: '#94A3B8',
                  fontSize: 15,
                  fontWeight: 700,
                  lineHeight: 1.3,
                }}
              >
                {item.label}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
