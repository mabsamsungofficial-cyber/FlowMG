import React from 'react';
import { useCurrentFrame, spring, useVideoConfig } from 'remotion';
import { WordTimestamp } from '../../ai/types';

interface VerbatimRailCaptionsProps {
  words: WordTimestamp[];
}

export const VerbatimRailCaptions: React.FC<VerbatimRailCaptionsProps> = ({ words = [] }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Find index of currently active word
  const activeWordIdx = words.findIndex((w) => frame >= w.startFrame && frame <= w.endFrame);

  // If before first word or after last word, find nearest
  const currentIdx = activeWordIdx !== -1 
    ? activeWordIdx 
    : words.findIndex((w) => frame < w.startFrame);

  const windowSize = 6;
  const targetIdx = currentIdx === -1 ? Math.max(0, words.length - 1) : currentIdx;
  const startIndex = Math.max(0, Math.min(targetIdx - 2, words.length - windowSize));
  const visibleWords = words.slice(startIndex, startIndex + windowSize);

  return (
    <div
      style={{
        position: 'absolute',
        bottom: 180,
        left: 0,
        right: 0,
        display: 'flex',
        justifyContent: 'center',
        zIndex: 60,
      }}
    >
      <div
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 12,
          padding: '16px 36px',
          backgroundColor: 'rgba(15, 34, 42, 0.94)',
          borderRadius: 28,
          border: '1.5px solid rgba(255, 255, 255, 0.15)',
          boxShadow: '0 12px 35px rgba(0, 0, 0, 0.4)',
          maxWidth: 900,
          flexWrap: 'wrap',
          justifyContent: 'center',
        }}
      >
        {visibleWords.map((wordObj, i) => {
          const actualIndex = startIndex + i;
          const isActive = actualIndex === activeWordIdx;

          const wordSpring = spring({
            frame: Math.max(0, frame - wordObj.startFrame),
            fps,
            config: { damping: 10, stiffness: 200 },
          });

          const scale = isActive ? 1.0 + wordSpring * 0.12 : 1.0;
          const color = isActive
            ? '#FBBF24' // Warm gold
            : wordObj.isHighlight
            ? '#F43F5E' // Coral red
            : '#FFFFFF';

          return (
            <span
              key={`rail-word-${wordObj.word}-${actualIndex}`}
              style={{
                display: 'inline-block',
                fontSize: 34,
                fontFamily: 'Montserrat, sans-serif',
                fontWeight: isActive || wordObj.isHighlight ? 900 : 700,
                color,
                transform: `scale(${scale})`,
                transformOrigin: 'center center',
              }}
            >
              {wordObj.word}
            </span>
          );
        })}
      </div>
    </div>
  );
};
