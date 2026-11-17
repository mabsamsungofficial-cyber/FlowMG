import React from 'react';

interface OffWhiteGridBackgroundProps {
  sectionTag?: string;
}

export const OffWhiteGridBackground: React.FC<OffWhiteGridBackgroundProps> = ({
  sectionTag = '// 01 · Breakdown',
}) => {
  return (
    <div
      style={{
        position: 'absolute',
        width: 1080,
        height: 1920,
        backgroundColor: '#F8FAFC',
        overflow: 'hidden',
        zIndex: 0,
      }}
    >
      {/* Blueprint Technical Grid (From Reference Video 2) */}
      <svg width="1080" height="1920" style={{ position: 'absolute', top: 0, left: 0, opacity: 0.7 }}>
        <defs>
          <pattern id="lightGrid" width="60" height="60" patternUnits="userSpaceOnUse">
            <path d="M 60 0 L 0 0 0 60" fill="none" stroke="rgba(15, 23, 42, 0.05)" strokeWidth="1.5" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#lightGrid)" />
      </svg>

      {/* Monospace Scene Header (From Reference Video 2) */}
      <div
        style={{
          position: 'absolute',
          top: 70,
          left: 60,
          fontSize: 20,
          fontFamily: 'Courier New, monospace',
          fontWeight: 700,
          color: '#64748B',
          letterSpacing: '0.08em',
        }}
      >
        {sectionTag}
      </div>
    </div>
  );
};
