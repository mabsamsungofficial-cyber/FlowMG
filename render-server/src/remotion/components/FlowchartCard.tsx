import React from 'react';
import { useVideoConfig, spring } from 'remotion';
import { FlowchartNode } from '../../ai/types';

interface FlowchartCardProps {
  title?: string;
  subtitle?: string;
  nodes?: FlowchartNode[];
  sceneFrame: number;
}

export const FlowchartCard: React.FC<FlowchartCardProps> = ({
  title = 'Value Chain Breakdown',
  subtitle = 'How revenue flows through the model',
  nodes = [],
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
        boxShadow: '0 25px 60px rgba(0, 0, 0, 0.85), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
        padding: '36px 40px',
        transform: `scale(${containerSpring})`,
        display: 'flex',
        flexDirection: 'column',
        gap: 28,
      }}
    >
      {/* Header */}
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

      {/* Nodes and Connecting Animated Arrows */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
        {nodes.map((node, index) => {
          const nodeDelay = 10 + index * 14;
          const nodeSpring = spring({
            frame: Math.max(0, sceneFrame - nodeDelay),
            fps,
            config: { damping: 11, stiffness: 160 },
          });

          const isLast = index === nodes.length - 1;

          return (
            <React.Fragment key={node.id}>
              {/* Node Card */}
              <div
                style={{
                  width: '100%',
                  backgroundColor: '#181E2B',
                  borderRadius: 18,
                  border: index === 1 ? '2px solid #FF2A3A' : '1px solid rgba(255, 255, 255, 0.12)',
                  padding: '20px 28px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  boxShadow: index === 1 ? '0 0 25px rgba(255, 42, 58, 0.3)' : '0 8px 20px rgba(0,0,0,0.4)',
                  transform: `scale(${nodeSpring})`,
                  opacity: Math.min(1, nodeSpring * 1.5),
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
                  <div
                    style={{
                      width: 44,
                      height: 44,
                      borderRadius: 12,
                      backgroundColor: index === 1 ? '#FF2A3A' : 'rgba(255, 255, 255, 0.1)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#FFFFFF',
                      fontSize: 20,
                      fontWeight: 900,
                    }}
                  >
                    0{index + 1}
                  </div>
                  <div>
                    <div style={{ color: '#FFFFFF', fontSize: 24, fontWeight: 800 }}>
                      {node.label}
                    </div>
                    {node.subtext && (
                      <div style={{ color: '#94A3B8', fontSize: 16, marginTop: 4 }}>
                        {node.subtext}
                      </div>
                    )}
                  </div>
                </div>

                {index === 1 && (
                  <div
                    style={{
                      backgroundColor: 'rgba(255, 42, 58, 0.2)',
                      border: '1px solid #FF2A3A',
                      color: '#FF2A3A',
                      padding: '6px 14px',
                      borderRadius: 20,
                      fontSize: 14,
                      fontWeight: 800,
                      letterSpacing: '0.08em',
                      textTransform: 'uppercase',
                    }}
                  >
                    CRITICAL STEP
                  </div>
                )}
              </div>

              {/* Connecting Trim-Path Arrow */}
              {!isLast && (
                <div style={{ height: 42, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <ConnectingArrow sceneFrame={sceneFrame} delay={nodeDelay + 6} />
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};

const ConnectingArrow: React.FC<{ sceneFrame: number; delay: number }> = ({ sceneFrame, delay }) => {
  const { fps } = useVideoConfig();
  const arrowSpring = spring({
    frame: Math.max(0, sceneFrame - delay),
    fps,
    config: { damping: 12, stiffness: 180 },
  });

  const arrowLength = 40;
  const strokeDashoffset = arrowLength * (1 - arrowSpring);

  return (
    <svg width="24" height="42" viewBox="0 0 24 42" fill="none">
      <path
        d="M12 0 L12 36 M6 30 L12 38 L18 30"
        stroke="#FF2A3A"
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeDasharray={arrowLength}
        strokeDashoffset={strokeDashoffset}
      />
    </svg>
  );
};
