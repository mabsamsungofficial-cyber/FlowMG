import React from 'react';
import { useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';
import { DetectivePin } from '../../ai/types';

interface DetectiveBoardProps {
  title?: string;
  pins?: DetectivePin[];
  sceneFrame: number;
}

export const DetectiveBoard: React.FC<DetectiveBoardProps> = ({ title, pins = [], sceneFrame }) => {
  const { fps } = useVideoConfig();

  // Slow investigative push-in
  const cameraScale = interpolate(sceneFrame, [0, 300], [1, 1.05], { extrapolateRight: 'clamp' });

  return (
    <div
      style={{
        width: 960,
        height: 800,
        backgroundColor: '#121620',
        borderRadius: 24,
        border: '2px solid rgba(255, 42, 58, 0.3)',
        boxShadow: '0 20px 60px rgba(0, 0, 0, 0.8), inset 0 0 80px rgba(0, 0, 0, 0.6)',
        position: 'relative',
        overflow: 'hidden',
        transform: `scale(${cameraScale})`,
      }}
    >
      {/* Board Header Stamp */}
      <div
        style={{
          position: 'absolute',
          top: 24,
          left: 32,
          display: 'flex',
          alignItems: 'center',
          gap: 12,
        }}
      >
        <div
          style={{
            backgroundColor: '#E50914',
            color: '#FFFFFF',
            fontSize: 14,
            fontWeight: 900,
            padding: '4px 12px',
            borderRadius: 4,
            letterSpacing: '0.15em',
          }}
        >
          CONFIDENTIAL
        </div>
        <div style={{ color: '#E0E0E0', fontSize: 24, fontWeight: 800 }}>
          {title || 'EVIDENCE BOARD'}
        </div>
      </div>

      {/* Red Threads Connecting Pins (Animated Trim Path) */}
      <svg
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          pointerEvents: 'none',
          zIndex: 5,
        }}
      >
        {pins.map((pin) => {
          if (!pin.connectedTo) return null;
          const targetPin = pins.find((p) => p.id === pin.connectedTo);
          if (!targetPin) return null;

          const x1 = (pin.x / 100) * 960;
          const y1 = (pin.y / 100) * 800;
          const x2 = (targetPin.x / 100) * 960;
          const y2 = (targetPin.y / 100) * 800;

          // String draw spring animation
          const lineSpring = spring({
            frame: Math.max(0, sceneFrame - 15),
            fps,
            config: { damping: 14, stiffness: 120 },
          });

          const dx = x2 - x1;
          const dy = y2 - y1;
          const length = Math.sqrt(dx * dx + dy * dy);
          const strokeDashoffset = length * (1 - lineSpring);

          return (
            <g key={`thread-${pin.id}-${targetPin.id}`}>
              {/* String shadow */}
              <line
                x1={x1 + 3}
                y1={y1 + 5}
                x2={x2 + 3}
                y2={y2 + 5}
                stroke="rgba(0,0,0,0.5)"
                strokeWidth="5"
                strokeDasharray={length}
                strokeDashoffset={strokeDashoffset}
              />
              {/* Vibrant Red string */}
              <line
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                stroke="#FF2A3A"
                strokeWidth="4"
                strokeLinecap="round"
                strokeDasharray={length}
                strokeDashoffset={strokeDashoffset}
              />
            </g>
          );
        })}
      </svg>

      {/* Pinned Evidence Cards */}
      {pins.map((pin, idx) => {
        const pinSpring = spring({
          frame: Math.max(0, sceneFrame - idx * 10),
          fps,
          config: { damping: 10, mass: 0.7, stiffness: 160 },
        });

        const left = (pin.x / 100) * 960 - 130;
        const top = (pin.y / 100) * 800 - 80;
        const tilt = (idx % 2 === 0 ? -4 : 5) * (1 - pinSpring * 0.2);

        return (
          <div
            key={pin.id}
            style={{
              position: 'absolute',
              left,
              top,
              width: 260,
              padding: '24px 20px 16px 20px',
              backgroundColor: '#1E2433',
              borderRadius: 12,
              border: '1px solid rgba(255, 255, 255, 0.15)',
              boxShadow: '0 12px 35px rgba(0, 0, 0, 0.7)',
              transform: `scale(${pinSpring}) rotate(${tilt}deg)`,
              transformOrigin: 'top center',
              zIndex: 10,
            }}
          >
            {/* Red Pushpin */}
            <div
              style={{
                position: 'absolute',
                top: -12,
                left: '50%',
                transform: 'translateX(-50%)',
                width: 22,
                height: 22,
                borderRadius: '50%',
                backgroundColor: '#FF2A3A',
                border: '2px solid #FFFFFF',
                boxShadow: '0 4px 10px rgba(0, 0, 0, 0.6), inset 0 2px 4px rgba(255, 255, 255, 0.6)',
                zIndex: 20,
              }}
            />

            <div
              style={{
                color: '#FF2A3A',
                fontSize: 13,
                fontWeight: 900,
                letterSpacing: '0.1em',
                marginBottom: 6,
                textTransform: 'uppercase',
              }}
            >
              EXHIBIT #{idx + 1}
            </div>

            <div
              style={{
                color: '#FFFFFF',
                fontSize: 20,
                fontWeight: 800,
                lineHeight: 1.25,
                marginBottom: 8,
              }}
            >
              {pin.title}
            </div>

            <div
              style={{
                color: '#94A3B8',
                fontSize: 14,
                lineHeight: 1.4,
              }}
            >
              {pin.description}
            </div>
          </div>
        );
      })}
    </div>
  );
};
