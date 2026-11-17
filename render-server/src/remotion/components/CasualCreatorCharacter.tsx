import React from 'react';
import { useCurrentFrame, useVideoConfig, spring } from 'remotion';
import { useAudioData, visualizeAudio } from '@remotion/media-utils';
import { CharacterPose } from '../../ai/types';

class AudioErrorBoundary extends React.Component<
  { fallback: React.ReactNode; children: React.ReactNode },
  { hasError: boolean }
> {
  state = { hasError: false };
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  componentDidCatch() {}
  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }
    return this.props.children;
  }
}

interface CasualCreatorCharacterProps {
  pose?: CharacterPose;
  audioSrc?: string;
  sceneFrame: number;
}

const AudioSyncedAvatar: React.FC<{
  pose: CharacterPose;
  audioSrc: string;
  sceneFrame: number;
}> = ({ pose, audioSrc, sceneFrame }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  let audioAmplitude = 0;
  try {
    const audioData = useAudioData(audioSrc);
    if (audioData) {
      const frequencies = visualizeAudio({
        fps,
        frame,
        audioData,
        numberOfSamples: 16,
        smoothing: true,
      });
      audioAmplitude = frequencies.reduce((a, b) => a + b, 0) / frequencies.length;
    }
  } catch {}

  if (audioAmplitude === 0) {
    const wave = Math.sin(frame * 0.45) * Math.cos(frame * 0.2);
    audioAmplitude = Math.max(0, wave > 0.1 ? wave : 0);
  }

  return (
    <CasualCreatorAvatar
      pose={pose}
      audioAmplitude={audioAmplitude}
      sceneFrame={sceneFrame}
      frame={frame}
    />
  );
};

export const CasualCreatorCharacter: React.FC<CasualCreatorCharacterProps> = ({
  pose = 'pointing',
  audioSrc,
  sceneFrame,
}) => {
  const frame = useCurrentFrame();

  const wave = Math.sin(frame * 0.45) * Math.cos(frame * 0.2);
  const fallbackAmp = Math.max(0, wave > 0.1 ? wave : 0);
  const fallbackNode = (
    <CasualCreatorAvatar
      pose={pose}
      audioAmplitude={fallbackAmp}
      sceneFrame={sceneFrame}
      frame={frame}
    />
  );

  if (audioSrc && audioSrc.trim().length > 0) {
    return (
      <AudioErrorBoundary fallback={fallbackNode}>
        <AudioSyncedAvatar pose={pose} audioSrc={audioSrc} sceneFrame={sceneFrame} />
      </AudioErrorBoundary>
    );
  }

  return fallbackNode;
};

const CasualCreatorAvatar: React.FC<{
  pose: CharacterPose;
  audioAmplitude: number;
  sceneFrame: number;
  frame: number;
}> = ({ pose, audioAmplitude, sceneFrame, frame }) => {
  const { fps } = useVideoConfig();

  const isMouthOpen = audioAmplitude > 0.16;
  const isMouthHalf = audioAmplitude > 0.05 && audioAmplitude <= 0.16;

  // Blinking eyes (every 3 seconds / 180 frames for 6 frames)
  const isBlinking = frame % 180 >= 174;

  // Subtle breathing oscillation
  const breathingY = Math.sin(frame * 0.08) * 3;

  // Hand gesture spring
  const handSpring = spring({
    frame: sceneFrame,
    fps,
    config: { damping: 11, stiffness: 160 },
  });

  return (
    <div
      style={{
        position: 'absolute',
        right: 80,
        bottom: -20,
        width: 440,
        height: 520,
        zIndex: 50,
        transform: `translateY(${breathingY}px)`,
        pointerEvents: 'none',
      }}
    >
      <svg width="440" height="520" viewBox="0 0 440 520" fill="none">
        <defs>
          <radialGradient id="casualFace" cx="50%" cy="40%" r="60%">
            <stop offset="0%" stopColor="#F9D2B5" />
            <stop offset="100%" stopColor="#E9B693" />
          </radialGradient>
          <linearGradient id="shirtGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#1E3A8A" />
            <stop offset="100%" stopColor="#0F172A" />
          </linearGradient>
        </defs>

        {/* --- BLUE T-SHIRT TORSO --- */}
        <g id="torso">
          <path
            d="M 100 440 Q 220 380 340 440 L 370 540 L 70 540 Z"
            fill="url(#shirtGrad)"
            stroke="#0B132B"
            strokeWidth="4"
          />
          {/* Round crew neck */}
          <path
            d="M 180 405 Q 220 435 260 405"
            stroke="#0B132B"
            strokeWidth="5"
            fill="none"
          />
        </g>

        {/* --- NECK --- */}
        <rect x="202" y="360" width="36" height="55" rx="4" fill="#E9B693" />

        {/* --- HEAD GROUP --- */}
        <g id="head">
          {/* Base Face */}
          <ellipse cx="220" cy="275" rx="72" ry="85" fill="url(#casualFace)" />

          {/* Big Curly Dark Hair (Signature Silhouette) */}
          <path
            d="M 130 250 
               C 115 170 140 130 180 120 
               C 210 110 240 110 270 125 
               C 310 145 325 180 315 250 
               C 305 200 280 185 220 185 
               C 165 185 140 210 130 250 Z"
            fill="#18181B"
          />
          {/* Hair curls / texture lumps */}
          <circle cx="150" cy="165" r="24" fill="#18181B" />
          <circle cx="190" cy="135" r="28" fill="#18181B" />
          <circle cx="240" cy="130" r="30" fill="#18181B" />
          <circle cx="285" cy="155" r="26" fill="#18181B" />
          <circle cx="310" cy="200" r="22" fill="#18181B" />

          {/* Ears */}
          <ellipse cx="148" cy="280" rx="10" ry="18" fill="#E9B693" />
          <ellipse cx="292" cy="280" rx="10" ry="18" fill="#E9B693" />

          {/* Full Trimmed Black Beard */}
          <path
            d="M 148 265 
               C 145 350 170 385 220 385 
               C 270 385 295 350 292 265 
               C 285 295 265 315 220 315 
               C 175 315 155 295 148 265 Z"
            fill="#18181B"
          />
          {/* Mustache */}
          <path
            d="M 185 305 Q 220 300 255 305 Q 220 318 185 305 Z"
            fill="#18181B"
          />

          {/* Distinctive Glasses (Rounded rectangular transparent lenses with black rims) */}
          <rect x="165" y="248" width="48" height="34" rx="8" fill="rgba(255,255,255,0.4)" stroke="#18181B" strokeWidth="4" />
          <rect x="227" y="248" width="48" height="34" rx="8" fill="rgba(255,255,255,0.4)" stroke="#18181B" strokeWidth="4" />
          <line x1="213" y1="262" x2="227" y2="262" stroke="#18181B" strokeWidth="4" />

          {/* Eyes behind glasses */}
          {isBlinking ? (
            <g id="blinking">
              <line x1="175" y1="265" x2="202" y2="265" stroke="#18181B" strokeWidth="4" strokeLinecap="round" />
              <line x1="238" y1="265" x2="265" y2="265" stroke="#18181B" strokeWidth="4" strokeLinecap="round" />
            </g>
          ) : (
            <g id="eyesOpen">
              <circle cx="189" cy="265" r="7" fill="#18181B" />
              <circle cx="251" cy="265" r="7" fill="#18181B" />
              <circle cx="187" cy="263" r="2.5" fill="#FFFFFF" />
              <circle cx="249" cy="263" r="2.5" fill="#FFFFFF" />
            </g>
          )}

          {/* Nose */}
          <path d="M 218 270 L 223 285 L 216 288" stroke="#0B132B" strokeWidth="3" strokeLinecap="round" fill="none" />

          {/* Dynamic Mouth / Lip Sync */}
          {isMouthOpen ? (
            /* Open round vowel mouth as in reference video */
            <g id="mouthOpen">
              <ellipse cx="220" cy="335" rx="14" ry="12" fill="#581C87" stroke="#18181B" strokeWidth="3" />
              <path d="M 212 328 Q 220 332 228 328 Z" fill="#FFFFFF" />
              <circle cx="220" cy="342" r="5" fill="#E11D48" />
            </g>
          ) : isMouthHalf ? (
            <g id="mouthHalf">
              <ellipse cx="220" cy="333" rx="12" ry="7" fill="#581C87" stroke="#18181B" strokeWidth="2.5" />
              <line x1="212" y1="331" x2="228" y2="331" stroke="#FFFFFF" strokeWidth="2" />
            </g>
          ) : (
            <path
              d="M 210 334 Q 220 337 230 334"
              stroke="#0B132B"
              strokeWidth="3.5"
              strokeLinecap="round"
              fill="none"
            />
          )}
        </g>

        {/* --- GESTURING HAND WITH UPWARD POINTING FINGER (From Video 2) --- */}
        <g
          id="handGesture"
          transform={`scale(${handSpring})`}
          style={{ transformOrigin: '320px 450px' }}
        >
          {/* Hand Palm */}
          <circle cx="340" cy="430" r="18" fill="#E9B693" stroke="#0B132B" strokeWidth="3.5" />
          {/* Index Finger pointing up */}
          <path
            d="M 334 430 L 334 385 C 334 378 344 378 344 385 L 344 430 Z"
            fill="#E9B693"
            stroke="#0B132B"
            strokeWidth="3.5"
          />
          {/* Curled other fingers */}
          <ellipse cx="352" cy="425" rx="7" ry="10" fill="#E9B693" stroke="#0B132B" strokeWidth="2.5" />
          <ellipse cx="356" cy="435" rx="6" ry="8" fill="#E9B693" stroke="#0B132B" strokeWidth="2.5" />
        </g>
      </svg>
    </div>
  );
};
