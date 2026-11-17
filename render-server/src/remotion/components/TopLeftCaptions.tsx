import React from 'react';
import { useCurrentFrame, spring, useVideoConfig } from 'remotion';
import { WordTimestamp } from '../../ai/types';

interface TopLeftCaptionsProps {
  words: WordTimestamp[];
}

export const TopLeftCaptions: React.FC<TopLeftCaptionsProps> = ({ words = [] }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Find index of currently active word
  const activeWordIdx = words.findIndex((w) => frame >= w.startFrame && frame <= w.endFrame);

  // If before first word or after last word, find nearest
  const currentIdx = activeWordIdx !== -1 
    ? activeWordIdx 
    : words.findIndex((w) => frame < w.startFrame);

  // Display a window of 6 to 8 words centered around the active word
  const windowSize = 7;
  const targetIdx = currentIdx === -1 ? Math.max(0, words.length - 1) : currentIdx;
  const startIndex = Math.max(0, Math.min(targetIdx - 2, words.length - windowSize));
  const visibleWords = words.slice(startIndex, startIndex + windowSize);

  return (
    <div
      style={{
        position: 'absolute',
        top: 150,
        left: 60,
        width: 780,
        minHeight: 140,
        zIndex: 50,
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        gap: '12px 16px',
        padding: '16px 24px',
        backgroundColor: 'rgba(8, 10, 15, 0.75)',
        backdropFilter: 'blur(12px)',
        borderRadius: 20,
        border: '1px solid rgba(255, 255, 255, 0.1)',
        boxShadow: '0 8px 30px rgba(0, 0, 0, 0.5)',
      }}
    >
      {visibleWords.map((wordObj, i) => {
        const actualIndex = startIndex + i;
        const isActive = actualIndex === activeWordIdx;
        const isPast = actualIndex < activeWordIdx;

        // Snappy scale on active word
        const wordSpring = spring({
          frame: Math.max(0, frame - wordObj.startFrame),
          fps,
          config: { damping: 10, stiffness: 200 },
        });

        const scale = isActive ? 1.0 + wordSpring * 0.15 : 1.0;
        const color = isActive
          ? '#FF2A3A'
          : wordObj.isHighlight
          ? '#FFA500'
          : isPast
          ? '#E2E8F0'
          : '#64748B';

        const fontWeight = isActive || wordObj.isHighlight ? 900 : 700;
        const fontStyle = wordObj.isHighlight ? 'italic' : 'normal';

        return (
          <span
            key={`caption-${wordObj.word}-${actualIndex}`}
            style={{
              display: 'inline-block',
              fontSize: 34,
              fontFamily: 'Montserrat, Inter, system-ui, sans-serif',
              fontWeight,
              fontStyle,
              color,
              textTransform: 'uppercase',
              letterSpacing: '0.02em',
              transform: `scale(${scale})`,
              transformOrigin: 'left center',
              transition: 'color 0.1s ease',
              textShadow: isActive
                ? '0 0 18px rgba(255, 42, 58, 0.9), 0 0 30px rgba(255, 42, 58, 0.5)'
                : wordObj.isHighlight
                ? '0 0 12px rgba(255, 165, 0, 0.5)'
                : 'none',
              backgroundColor: isActive && wordObj.isHighlight
                ? 'rgba(255, 42, 58, 0.2)'
                : 'transparent',
              padding: '2px 8px',
              borderRadius: 8,
              border: isActive && wordObj.isHighlight ? '1px solid #FF2A3A' : 'none',
            }}
          >
            {wordObj.word}
          </span>
        );
      })}
    </div>
  );
};
