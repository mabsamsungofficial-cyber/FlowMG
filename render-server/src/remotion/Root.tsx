import React from 'react';
import { Composition } from 'remotion';
import { MainExplainer } from './MainExplainer';
import { DynamicStoryboard } from '../ai/types';

export const defaultStoryboard: DynamicStoryboard = {
  title: 'AI Business Explainer',
  atmosphere: {
    background: 'grid_technical',
    accentColor: '#E11D48',
    characterStyle: 'casual_creator',
    channelWatermark: 'FlowMG Studio',
  },
  totalDurationSeconds: 15,
  totalFrames: 900,
  audioUrl: '',
  scenes: [
    {
      scene_id: 1,
      spoken_text: 'MrBeast ka secret 5-step model samajhte hain.',
      highlighted_keywords: ['MrBeast', '5-step'],
      character_pose: 'pointing',
      sfx_trigger: 'whoosh',
      startFrame: 0,
      durationInFrames: 300,
      visual_composition: {
        visual_type: 'step_loop',
        headline: { primary: '5', highlight: 'STEP PLAN' },
        sectionTag: '// 01 · Formula',
        stepItems: [
          { id: '1', stepNumber: '1', title: '₹500 Seed', isHighlight: true },
          { id: '2', stepNumber: '2', title: 'Viral Video' },
          { id: '3', stepNumber: '3', title: 'Brand Deal' },
          { id: '4', stepNumber: '4', title: 'Sponsor' },
          { id: '5', stepNumber: '5', title: 'Massive Views' },
        ],
        propMockup: {
          type: 'smartphone',
          screenText: 'REC 00:00',
          amountText: '₹500',
        },
      },
      words: [
        { word: 'MrBeast', startFrame: 0, endFrame: 60, isHighlight: true },
        { word: 'ka', startFrame: 60, endFrame: 100, isHighlight: false },
        { word: 'secret', startFrame: 100, endFrame: 160, isHighlight: false },
        { word: '5-step', startFrame: 160, endFrame: 220, isHighlight: true },
        { word: 'model.', startFrame: 220, endFrame: 300, isHighlight: false },
      ],
    },
    {
      scene_id: 2,
      spoken_text: 'Agar kisi ki 500 rupaye madad karke video banayein, toh brand mast promotion karta hai.',
      highlighted_keywords: ['500 rupaye', 'promotion'],
      character_pose: 'explaining',
      sfx_trigger: 'pop',
      startFrame: 300,
      durationInFrames: 300,
      visual_composition: {
        visual_type: 'kinetic_text',
        headline: { primary: 'मस्त', highlight: 'PROMOTION', subtitle: 'ब्रांड का असली खेल' },
        sectionTag: '// 02 · Brand Deals',
      },
      words: [
        { word: 'Agar', startFrame: 300, endFrame: 350, isHighlight: false },
        { word: '500', startFrame: 350, endFrame: 420, isHighlight: true },
        { word: 'rupaye', startFrame: 420, endFrame: 480, isHighlight: true },
        { word: 'mast', startFrame: 480, endFrame: 540, isHighlight: false },
        { word: 'promotion.', startFrame: 540, endFrame: 600, isHighlight: true },
      ],
    },
    {
      scene_id: 3,
      spoken_text: 'Video chali toh views aate hain aur agla sponsor double budget deta hai.',
      highlighted_keywords: ['views', 'double budget'],
      character_pose: 'surprised',
      sfx_trigger: 'cash',
      startFrame: 600,
      durationInFrames: 300,
      visual_composition: {
        visual_type: 'matrix_grid',
        headline: { primary: 'VIDEO CHALI', highlight: '= VIEWS' },
        sectionTag: '// 03 · Viral Growth',
        matrixGrid: {
          totalCount: 80,
          highlightCount: 15,
          iconType: 'person',
          headline: 'Exponential Reach',
        },
      },
      words: [
        { word: 'Video', startFrame: 600, endFrame: 660, isHighlight: false },
        { word: 'chali', startFrame: 660, endFrame: 720, isHighlight: false },
        { word: 'views', startFrame: 720, endFrame: 800, isHighlight: true },
        { word: 'aate', startFrame: 800, endFrame: 850, isHighlight: false },
        { word: 'hain.', startFrame: 850, endFrame: 900, isHighlight: false },
      ],
    },
  ],
};

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="FacelessExplainer"
        component={MainExplainer}
        durationInFrames={900}
        fps={60}
        width={1080}
        height={1920}
        defaultProps={{
          storyboard: defaultStoryboard,
        }}
        calculateMetadata={({ props }) => {
          const storyboard = props?.storyboard || defaultStoryboard;
          return {
            durationInFrames: storyboard.totalFrames || 900,
            fps: 60,
            width: 1080,
            height: 1920,
            props,
          };
        }}
      />
    </>
  );
};
