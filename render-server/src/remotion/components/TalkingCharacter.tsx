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

interface TalkingCharacterProps {
  pose: CharacterPose;
  audioSrc?: string;
  sceneFrame: number;
}

export const TalkingCharacter: React.FC<TalkingCharacterProps> = ({
  pose = 'explaining',
  audioSrc,
  sceneFrame,
}) => {
  const fallback = <CharacterBase pose={pose} audioAmplitude={0} sceneFrame={sceneFrame} />;
  if (audioSrc && audioSrc.trim().length > 0) {
    return (
      <AudioErrorBoundary fallback={fallback}>
        <CharacterWithAudio pose={pose} audioSrc={audioSrc} sceneFrame={sceneFrame} />
      </AudioErrorBoundary>
    );
  }
  return fallback;
};

const CharacterWithAudio: React.FC<{ pose: CharacterPose; audioSrc: string; sceneFrame: number }> = ({
  pose,
  audioSrc,
  sceneFrame,
}) => {
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
  } catch (e) {
    // Graceful fallback to procedural cadence
  }

  // Fallback to rhythmic modulation if amplitude is 0 or audioData is loading
  if (audioAmplitude === 0) {
    const wave = Math.sin(frame * 0.45) * Math.cos(frame * 0.2);
    audioAmplitude = Math.max(0, wave > 0.1 ? wave : 0);
  }

  return <CharacterBase pose={pose} audioAmplitude={audioAmplitude} sceneFrame={sceneFrame} />;
};

const CharacterBase: React.FC<{ pose: CharacterPose; audioAmplitude: number; sceneFrame: number }> = ({
  pose,
  audioAmplitude,
  sceneFrame,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // If amplitude is 0, use procedural syllable wave
  let effectiveAmplitude = audioAmplitude;
  if (effectiveAmplitude === 0) {
    const wave = Math.sin(frame * 0.45) * Math.cos(frame * 0.2);
    effectiveAmplitude = Math.max(0, wave > 0.1 ? wave : 0);
  }

  const isMouthOpen = effectiveAmplitude > 0.16;
  const isMouthHalf = effectiveAmplitude > 0.05 && effectiveAmplitude <= 0.16;

  // Eye Blinking (Every 180 frames / 3 seconds for 6 frames)
  const isBlinking = frame % 180 >= 174;

  // Breathing oscillation
  const breathingY = Math.sin(frame * 0.08) * 4;
  const headTilt = pose === 'thinking' ? 4 : Math.sin(frame * 0.04) * 1.5;

  // Pose transition spring
  const poseSpring = spring({
    frame: sceneFrame,
    fps,
    config: { damping: 12, stiffness: 150 },
  });

  return (
    <div
      style={{
        position: 'absolute',
        right: 40,
        bottom: 0,
        width: 380,
        height: 520,
        zIndex: 40,
        transform: `translateY(${breathingY}px)`,
        pointerEvents: 'none',
      }}
    >
      <svg width="380" height="520" viewBox="0 0 380 520" fill="none">
        <defs>
          <radialGradient id="faceGrad" cx="50%" cy="40%" r="60%">
            <stop offset="0%" stopColor="#FBD7B6" />
            <stop offset="100%" stopColor="#F1BF98" />
          </radialGradient>
          <linearGradient id="suitGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#1E293B" />
            <stop offset="100%" stopColor="#0F172A" />
          </linearGradient>
          <linearGradient id="tieGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#FF2A3A" />
            <stop offset="100%" stopColor="#B91C1C" />
          </linearGradient>
        </defs>

        {/* SUIT BODY */}
        <g id="suit">
          <path
            d="M 60 400 Q 190 350 320 400 L 350 520 L 30 520 Z"
            fill="url(#suitGrad)"
            stroke="#334155"
            strokeWidth="3"
          />
          <path d="M 150 365 L 190 415 L 230 365 L 205 365 L 190 385 L 175 365 Z" fill="#FFFFFF" />
          <path
            d="M 183 385 L 197 385 L 202 470 L 190 495 L 178 470 Z"
            fill="url(#tieGrad)"
            stroke="#7F1D1D"
            strokeWidth="1.5"
          />
        </g>

        {/* HEAD */}
        <g id="head" transform={`rotate(${headTilt} 190 260)`}>
          <rect x="172" y="320" width="36" height="55" rx="6" fill="#F1BF98" />
          <ellipse cx="190" cy="240" rx="72" ry="85" fill="url(#faceGrad)" />
          <path
            d="M 115 230 C 110 160 150 140 190 140 C 240 140 270 165 265 230 C 255 190 230 180 190 180 C 150 180 125 200 115 230 Z"
            fill="#0F172A"
          />
          <rect x="135" y="220" width="45" height="30" rx="6" fill="none" stroke="#0F172A" strokeWidth="5" />
          <rect x="200" y="220" width="45" height="30" rx="6" fill="none" stroke="#0F172A" strokeWidth="5" />
          <line x1="180" y1="235" x2="200" y2="235" stroke="#0F172A" strokeWidth="5" />

          {/* Eyes */}
          {isBlinking ? (
            <g id="eyesClosed">
              <line x1="145" y1="235" x2="170" y2="235" stroke="#0F172A" strokeWidth="4" strokeLinecap="round" />
              <line x1="210" y1="235" x2="235" y2="235" stroke="#0F172A" strokeWidth="4" strokeLinecap="round" />
            </g>
          ) : (
            <g id="eyesOpen">
              <circle cx="158" cy="235" r="7" fill="#0F172A" />
              <circle cx="222" cy="235" r="7" fill="#0F172A" />
              <circle cx="156" cy="233" r="2.5" fill="#FFFFFF" />
              <circle cx="220" cy="233" r="2.5" fill="#FFFFFF" />
            </g>
          )}

          <path d="M 188 245 L 194 260 L 186 262" stroke="#D99B70" strokeWidth="3" strokeLinecap="round" fill="none" />

          {/* Mouth */}
          {isMouthOpen ? (
            <g id="mouthOpen">
              <ellipse cx="190" cy="285" rx="16" ry="12" fill="#7F1D1D" stroke="#0F172A" strokeWidth="3" />
              <path d="M 178 280 Q 190 284 202 280 Z" fill="#FFFFFF" />
              <path d="M 182 292 Q 190 288 198 292 Z" fill="#FF2A3A" />
            </g>
          ) : isMouthHalf ? (
            <g id="mouthHalf">
              <path d="M 180 282 Q 190 294 200 282 Z" fill="#7F1D1D" stroke="#0F172A" strokeWidth="3" />
              <line x1="183" y1="282" x2="197" y2="282" stroke="#FFFFFF" strokeWidth="2" />
            </g>
          ) : (
            <path
              d="M 180 285 Q 190 290 200 285"
              stroke="#0F172A"
              strokeWidth="4"
              strokeLinecap="round"
              fill="none"
            />
          )}
        </g>

        {/* HAND POSES */}
        {pose === 'pointing' && (
          <g id="posePointing" transform={`scale(${poseSpring})`} style={{ transformOrigin: '80px 380px' }}>
            <path d="M 100 420 L 40 330" stroke="#1E293B" strokeWidth="28" strokeLinecap="round" />
            <circle cx="32" cy="318" r="14" fill="#F1BF98" />
            <path d="M 32 318 L 8 280" stroke="#F1BF98" strokeWidth="10" strokeLinecap="round" />
            <circle cx="8" cy="280" r="8" fill="#FF2A3A" opacity="0.8" />
          </g>
        )}

        {pose === 'thinking' && (
          <g id="poseThinking" transform={`scale(${poseSpring})`} style={{ transformOrigin: '150px 320px' }}>
            <path d="M 120 440 L 160 330" stroke="#1E293B" strokeWidth="26" strokeLinecap="round" />
            <circle cx="165" cy="315" r="16" fill="#F1BF98" />
            <ellipse cx="178" cy="305" rx="6" ry="12" fill="#F1BF98" transform="rotate(-30 178 305)" />
          </g>
        )}

        {pose === 'surprised' && (
          <g id="poseSurprised" transform={`scale(${poseSpring})`}>
            <path d="M 80 430 L 40 350" stroke="#1E293B" strokeWidth="24" strokeLinecap="round" />
            <circle cx="35" cy="340" r="16" fill="#F1BF98" />
            <path d="M 300 430 L 340 350" stroke="#1E293B" strokeWidth="24" strokeLinecap="round" />
            <circle cx="345" cy="340" r="16" fill="#F1BF98" />
          </g>
        )}

        {pose === 'explaining' && (
          <g id="poseExplaining" transform={`scale(${poseSpring})`}>
            <path d="M 90 430 L 50 380" stroke="#1E293B" strokeWidth="26" strokeLinecap="round" />
            <ellipse cx="40" cy="370" rx="18" ry="14" fill="#F1BF98" transform="rotate(-15 40 370)" />
            <line x1="30" y1="360" x2="20" y2="348" stroke="#F1BF98" strokeWidth="6" strokeLinecap="round" />
            <line x1="38" y1="358" x2="32" y2="344" stroke="#F1BF98" strokeWidth="6" strokeLinecap="round" />
          </g>
        )}
      </svg>
    </div>
  );
};
