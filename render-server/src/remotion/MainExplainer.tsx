import React from 'react';
import { useCurrentFrame, Sequence, Audio, staticFile } from 'remotion';
import { DynamicStoryboard, DynamicScene } from '../ai/types';

// Backgrounds
import { GridBackground } from './components/GridBackground';
import { OffWhiteGridBackground } from './components/OffWhiteGridBackground';
import { WarmPaperBackground } from './components/WarmPaperBackground';

// Captions
import { TopLeftCaptions } from './components/TopLeftCaptions';
import { VerbatimRailCaptions } from './components/VerbatimRailCaptions';

// Canvas
import { DynamicSceneCanvas } from './components/DynamicSceneCanvas';

// Characters
import { TalkingCharacter } from './components/TalkingCharacter';
import { CasualCreatorCharacter } from './components/CasualCreatorCharacter';

export interface MainExplainerProps {
  storyboard: DynamicStoryboard;
}

export const MainExplainer: React.FC<MainExplainerProps> = ({ storyboard }) => {
  const frame = useCurrentFrame();
  const {
    scenes = [],
    audioUrl,
    audioFileName,
    atmosphere = {
      background: 'grid_technical',
      accentColor: '#E11D48',
      characterStyle: 'casual_creator',
    },
  } = storyboard;

  // Resolve audio source
  let resolvedAudioSrc = '';
  if (audioFileName) {
    try {
      resolvedAudioSrc = staticFile(`audio/${audioFileName}`);
    } catch (e) {
      resolvedAudioSrc = audioUrl || '';
    }
  } else if (audioUrl) {
    resolvedAudioSrc = audioUrl;
  }

  // Find currently active scene
  const activeScene = scenes.find(
    (s) => frame >= s.startFrame && frame < s.startFrame + s.durationInFrames
  ) || scenes[scenes.length - 1];

  const currentPose = activeScene ? activeScene.character_pose : 'pointing';
  const sceneFrame = activeScene ? frame - activeScene.startFrame : frame;

  const isWarmPaper = atmosphere.background === 'paper_warm';
  const isGridTechnical = atmosphere.background === 'grid_technical';

  return (
    <div
      style={{
        position: 'relative',
        width: 1080,
        height: 1920,
        backgroundColor: isWarmPaper ? '#FAF7F0' : isGridTechnical ? '#F8FAFC' : '#07090E',
        overflow: 'hidden',
        fontFamily: 'Montserrat, Inter, system-ui, sans-serif',
      }}
    >
      {/* 1. Dynamic Atmosphere Background */}
      {isWarmPaper ? (
        <WarmPaperBackground
          channelName={atmosphere.channelWatermark || 'AI Explainer'}
        />
      ) : isGridTechnical ? (
        <OffWhiteGridBackground
          sectionTag={activeScene?.visual_composition?.sectionTag || `// 0${activeScene?.scene_id || 1} · Concept`}
        />
      ) : (
        <GridBackground />
      )}

      {/* 2. Global Synchronized Audio Track */}
      {resolvedAudioSrc && <Audio src={resolvedAudioSrc} />}

      {/* 3. Scene Sequence Loop */}
      {scenes.map((scene) => {
        return (
          <Sequence
            key={`scene-${scene.scene_id}`}
            from={scene.startFrame}
            durationInFrames={scene.durationInFrames}
          >
            <div style={{ position: 'absolute', width: 1080, height: 1920, top: 0, left: 0 }}>
              <div
                style={{
                  position: 'absolute',
                  top: 340,
                  left: 60,
                  width: 960,
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  zIndex: 20,
                }}
              >
                <DynamicSceneCanvas
                  composition={scene.visual_composition}
                  accentColor={atmosphere.accentColor}
                  backgroundStyle={atmosphere.background}
                  sceneFrame={frame - scene.startFrame}
                />
              </div>
            </div>
          </Sequence>
        );
      })}

      {/* 4. Subtitle Layer (Rail vs Top-Left depending on atmosphere) */}
      {activeScene && (
        isWarmPaper ? (
          <VerbatimRailCaptions words={activeScene.words} />
        ) : (
          <TopLeftCaptions words={activeScene.words} />
        )
      )}

      {/* 5. Autonomous Character Rig with Voice Lip-Sync */}
      {atmosphere.characterStyle === 'casual_creator' ? (
        <CasualCreatorCharacter
          pose={currentPose}
          audioSrc={resolvedAudioSrc}
          sceneFrame={sceneFrame}
        />
      ) : (
        <TalkingCharacter
          pose={currentPose}
          audioSrc={resolvedAudioSrc}
          sceneFrame={sceneFrame}
        />
      )}
    </div>
  );
};
