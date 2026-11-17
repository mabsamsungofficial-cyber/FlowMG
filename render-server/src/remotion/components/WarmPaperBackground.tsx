import React from 'react';
import { useCurrentFrame } from 'remotion';

interface WarmPaperBackgroundProps {
  activeTab?: string;
  channelName?: string;
}

export const WarmPaperBackground: React.FC<WarmPaperBackgroundProps> = ({
  activeTab = 'Equity',
  channelName = 'HisaabKitaab101',
}) => {
  const tabs = ['Assets', 'Liabilities', 'Equity', 'Income', 'Expenses'];

  return (
    <div
      style={{
        position: 'absolute',
        width: 1080,
        height: 1920,
        backgroundColor: '#FAF7F0',
        overflow: 'hidden',
        zIndex: 0,
      }}
    >
      {/* Subtle Warm Vignette */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: 'radial-gradient(ellipse at 50% 30%, rgba(255,255,255,0.7) 0%, rgba(240,235,224,0.6) 100%)',
          pointerEvents: 'none',
        }}
      />

      {/* Top Channel Name */}
      <div
        style={{
          position: 'absolute',
          top: 50,
          left: 50,
          fontSize: 22,
          fontWeight: 900,
          fontFamily: 'Montserrat, sans-serif',
          color: '#1E293B',
          letterSpacing: '0.04em',
        }}
      >
        {channelName}
      </div>

      {/* Top Accounting Navigation Pills (From Reference Video 1) */}
      <div
        style={{
          position: 'absolute',
          top: 110,
          left: 0,
          right: 0,
          display: 'flex',
          justifyContent: 'center',
          gap: 12,
          padding: '0 40px',
        }}
      >
        {tabs.map((tab) => {
          const isActive = tab.toLowerCase() === activeTab.toLowerCase();
          const isLiabilities = tab === 'Liabilities' && isActive;

          return (
            <div
              key={tab}
              style={{
                padding: '8px 22px',
                borderRadius: 24,
                backgroundColor: isActive
                  ? isLiabilities
                    ? '#E11D48'
                    : '#D97706'
                  : '#FFFFFF',
                border: isActive
                  ? 'none'
                  : '1.5px solid rgba(15, 23, 42, 0.12)',
                color: isActive ? '#FFFFFF' : '#64748B',
                fontSize: 16,
                fontWeight: 800,
                boxShadow: isActive
                  ? '0 4px 14px rgba(217, 119, 6, 0.3)'
                  : '0 2px 6px rgba(0, 0, 0, 0.04)',
                transition: 'all 0.2s ease',
              }}
            >
              {tab}
            </div>
          );
        })}
      </div>
    </div>
  );
};
