import React from 'react';
import { useVideoConfig, spring, interpolate } from 'remotion';

interface FiveStepPlanCardProps {
  title?: string;
  sceneFrame: number;
}

export const FiveStepPlanCard: React.FC<FiveStepPlanCardProps> = ({
  title = '5 STEP PLAN',
  sceneFrame,
}) => {
  const { fps } = useVideoConfig();

  const containerSpring = spring({
    frame: sceneFrame,
    fps,
    config: { damping: 14, stiffness: 120 },
  });

  const steps = [
    { num: '1', label: '₹500 मदद', isHighlight: true, x: 80, y: 160 },
    { num: '2', label: 'पूरी VIDEO', isHighlight: false, x: 500, y: 160 },
    { num: '3', label: 'BRAND', isHighlight: false, x: 580, y: 310 },
    { num: '4', label: 'SPONSOR', isHighlight: false, x: 90, y: 310 },
    { num: '5', label: 'VIEWS', isHighlight: false, x: 90, y: 460 },
  ];

  // Phone float and spring
  const phoneSpring = spring({
    frame: Math.max(0, sceneFrame - 12),
    fps,
    config: { damping: 12, stiffness: 150 },
  });
  const phoneTilt = -12 + Math.sin(sceneFrame * 0.04) * 2;

  return (
    <div
      style={{
        width: 960,
        height: 720,
        position: 'relative',
        transform: `scale(${containerSpring})`,
      }}
    >
      {/* Giant Title: 5 STEP PLAN */}
      <div style={{ textAlign: 'center', marginBottom: 20 }}>
        <h1
          style={{
            fontSize: 72,
            fontFamily: 'Impact, Montserrat, Anton, sans-serif',
            letterSpacing: '0.04em',
            margin: 0,
            color: '#0F172A',
            textTransform: 'uppercase',
          }}
        >
          <span style={{ color: '#E11D48' }}>5</span> STEP PLAN
        </h1>
      </div>

      {/* Connecting Dashed SVG Lines between Steps */}
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
        <path
          d="M 380 200 L 520 200"
          stroke="#F43F5E"
          strokeWidth="3.5"
          strokeDasharray="6 6"
        />
        <path
          d="M 680 250 L 680 330"
          stroke="#F43F5E"
          strokeWidth="3.5"
          strokeDasharray="6 6"
        />
        <path
          d="M 600 370 L 360 370"
          stroke="#F43F5E"
          strokeWidth="3.5"
          strokeDasharray="6 6"
        />
        <path
          d="M 230 400 L 230 480"
          stroke="#F43F5E"
          strokeWidth="3.5"
          strokeDasharray="6 6"
        />
      </svg>

      {/* Step Pills */}
      {steps.map((step, idx) => {
        const stepSpring = spring({
          frame: Math.max(0, sceneFrame - (idx * 8)),
          fps,
          config: { damping: 12, stiffness: 170 },
        });

        return (
          <div
            key={step.num}
            style={{
              position: 'absolute',
              left: step.x,
              top: step.y,
              display: 'flex',
              alignItems: 'center',
              backgroundColor: '#FFFFFF',
              borderRadius: 16,
              border: step.isHighlight ? '3px solid #E11D48' : '2.5px solid #0F172A',
              padding: '6px 20px 6px 8px',
              gap: 14,
              boxShadow: '0 8px 24px rgba(0, 0, 0, 0.08)',
              transform: `scale(${stepSpring})`,
              zIndex: 10,
            }}
          >
            {/* Number Square Badge */}
            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: 10,
                backgroundColor: step.isHighlight ? '#E11D48' : '#0F172A',
                color: '#FFFFFF',
                fontSize: 26,
                fontWeight: 900,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {step.num}
            </div>

            {/* Label */}
            <span
              style={{
                fontSize: 24,
                fontWeight: 900,
                color: '#0F172A',
                letterSpacing: '0.02em',
              }}
            >
              {step.label}
            </span>
          </div>
        );
      })}

      {/* --- CENTER TILTED 3D SMARTPHONE MOCKUP (From Reference Video 2) --- */}
      <div
        style={{
          position: 'absolute',
          top: 140,
          left: 360,
          width: 250,
          height: 380,
          backgroundColor: '#0F172A',
          borderRadius: 36,
          border: '5px solid #334155',
          boxShadow: '0 25px 50px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(255, 255, 255, 0.1)',
          transform: `scale(${phoneSpring}) rotate(${phoneTilt}deg)`,
          transformOrigin: 'center center',
          zIndex: 25,
          padding: 14,
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
        }}
      >
        {/* Phone Dynamic Island / Notch */}
        <div
          style={{
            width: 70,
            height: 12,
            backgroundColor: '#000000',
            borderRadius: 8,
            alignSelf: 'center',
            marginBottom: 6,
          }}
        />

        {/* Camera REC Overlay */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <div
            style={{
              width: 8,
              height: 8,
              borderRadius: '50%',
              backgroundColor: '#EF4444',
              boxShadow: '0 0 8px #EF4444',
            }}
          />
          <span style={{ color: '#FFFFFF', fontSize: 11, fontWeight: 700, letterSpacing: '0.08em' }}>
            REC 00:00
          </span>
        </div>

        {/* Center Target Box with Green ₹500 Note */}
        <div
          style={{
            position: 'relative',
            alignSelf: 'center',
            width: 170,
            height: 110,
            border: '1.5px dashed rgba(255, 255, 255, 0.3)',
            borderRadius: 12,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {/* Green Rupee Note */}
          <div
            style={{
              width: 140,
              height: 70,
              backgroundColor: '#D1FAE5',
              borderRadius: 8,
              border: '2px solid #059669',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '0 12px',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
            }}
          >
            <span style={{ color: '#065F46', fontSize: 18, fontWeight: 900 }}>₹500</span>
            <div style={{ width: 24, height: 24, borderRadius: '50%', border: '2px solid #059669' }} />
          </div>
        </div>

        {/* Home Indicator Bar */}
        <div
          style={{
            width: 80,
            height: 4,
            backgroundColor: 'rgba(255, 255, 255, 0.5)',
            borderRadius: 2,
            alignSelf: 'center',
          }}
        />
      </div>
    </div>
  );
};
