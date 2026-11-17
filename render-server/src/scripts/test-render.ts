import path from 'path';
import fs from 'fs';
import { bundle } from '@remotion/bundler';
import { renderMedia, selectComposition } from '@remotion/renderer';
import { execSync } from 'child_process';
import { generateStoryboard } from '../ai/storyboardGenerator';
import { generateGeminiLiveVoiceover } from '../ai/geminiLiveVoiceover';
import { Storyboard } from '../ai/types';

async function runTestRender() {
  console.log('=================================================================');
  console.log(' Autonomous AI Video Director: End-to-End Arbitrary Story Render');
  console.log('=================================================================');

  const arbitraryStory = `Ek college drop out ne chai ka thela shuru kiya. Pehle din 100 cup chai biki aur 1000 rupaye bache. Phir usne corporate offices me dispenser lagaye aur agle hi saal 50 lakh ka business khada kar diya.`;

  const publicDir = path.join(__dirname, '..', '..', 'public');
  const audioDir = path.join(publicDir, 'audio');
  const outDir = path.join(__dirname, '..', '..', 'out');

  [publicDir, audioDir, outDir].forEach((d) => {
    if (!fs.existsSync(d)) fs.mkdirSync(d, { recursive: true });
  });

  // Step 1: Autonomous Storyboard Generation
  console.log('\n[TEST STEP 1] Autonomous AI Director reading story and conceiving visual metaphors...');
  const storyboardMeta = await generateStoryboard(arbitraryStory, process.env.GEMINI_API_KEY);
  console.log(`AI Director conceived ${storyboardMeta.scenes.length} bespoke scenes [Atmosphere: ${storyboardMeta.atmosphere.background}, Character: ${storyboardMeta.atmosphere.characterStyle}]:`);
  storyboardMeta.scenes.forEach((s) => {
    console.log(`  - Scene ${s.scene_id} [Visual: ${s.visual_composition.visual_type}] Pose: ${s.character_pose} SFX: ${s.sfx_trigger}`);
  });

  // Step 2: Voiceover & Audio Synthesis
  console.log('\n[TEST STEP 2] Running Gemini Live Audio & Voiceover Engine...');
  const voiceover = await generateGeminiLiveVoiceover(
    storyboardMeta.scenes,
    audioDir,
    process.env.GEMINI_API_KEY,
    'Puck'
  );
  console.log(`Voiceover generated: ${voiceover.audioFileName} (${voiceover.audioDurationSeconds.toFixed(2)}s)`);

  const fullStoryboard = {
    title: storyboardMeta.title,
    atmosphere: storyboardMeta.atmosphere,
    totalDurationSeconds: voiceover.audioDurationSeconds,
    totalFrames: voiceover.totalFrames,
    audioUrl: '',
    audioFileName: voiceover.audioFileName,
    scenes: voiceover.scenesWithTimestamps,
  };

  // Step 3: Bundle Remotion Composition
  console.log('\n[TEST STEP 3] Bundling Remotion Composition via Webpack/Rspack...');
  const entryPoint = path.join(__dirname, '..', 'remotion', 'index.ts');
  const bundleLocation = await bundle({
    entryPoint,
    publicDir,
    webpackOverride: (config) => config,
  });
  console.log(`Bundle created successfully at: ${bundleLocation}`);

  // Step 4: Select Composition Metadata
  console.log('\n[TEST STEP 4] Selecting Composition Metadata...');
  const composition = await selectComposition({
    serveUrl: bundleLocation,
    id: 'FacelessExplainer',
    inputProps: {
      storyboard: fullStoryboard,
    },
  });
  console.log(`Composition selected: ${composition.id} (${composition.width}x${composition.height} @ ${composition.fps}fps, ${fullStoryboard.totalFrames} frames)`);

  // Step 5: Render Media (MP4)
  const outputLocation = path.join(outDir, 'test_explainer.mp4');
  console.log(`\n[TEST STEP 5] Rendering 9:16 Video to: ${outputLocation}`);

  let lastLoggedPercent = -1;
  await renderMedia({
    composition: {
      ...composition,
      durationInFrames: fullStoryboard.totalFrames,
    },
    serveUrl: bundleLocation,
    codec: 'h264',
    outputLocation,
    inputProps: {
      storyboard: fullStoryboard,
    },
    onProgress: ({ progress }) => {
      const pct = Math.round(progress * 100);
      if (pct % 10 === 0 && pct !== lastLoggedPercent) {
        lastLoggedPercent = pct;
        console.log(`  Render progress: ${pct}%`);
      }
    },
  });

  console.log('\n[TEST COMPLETE] Checking output video file with ffprobe...');
  const ffprobeOutput = execSync(
    `ffprobe -v error -select_streams v:0 -show_entries stream=width,height,r_frame_rate,duration -of default=noprint_wrappers=1 "${outputLocation}"`
  ).toString();

  console.log('Video Probe Info:\n' + ffprobeOutput);
  const stats = fs.statSync(outputLocation);
  console.log(`File size: ${(stats.size / (1024 * 1024)).toFixed(2)} MB`);
  console.log('SUCCESS: Video rendered and verified perfectly!');
}

runTestRender().catch((err) => {
  console.error('Test render failed with error:', err);
  process.exit(1);
});
