import express from 'express';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import dotenv from 'dotenv';
import { bundle } from '@remotion/bundler';
import { renderMedia, selectComposition } from '@remotion/renderer';
import { generateStoryboard } from './ai/storyboardGenerator';
import { generateGeminiLiveVoiceover } from './ai/geminiLiveVoiceover';
import { generateGrowKazVideo } from './ai/growkazGenerator';
import { RenderJobStatus, Storyboard } from './ai/types';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Directories
const PUBLIC_DIR = path.join(__dirname, '..', 'public');
const AUDIO_DIR = path.join(PUBLIC_DIR, 'audio');
const VIDEO_DIR = path.join(PUBLIC_DIR, 'videos');

[PUBLIC_DIR, AUDIO_DIR, VIDEO_DIR].forEach((dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

// Serve static assets (audio, videos)
app.use(express.static(PUBLIC_DIR));
app.use('/public', express.static(PUBLIC_DIR));

// In-memory Job Tracker
const jobs = new Map<string, RenderJobStatus>();

// Cache Remotion Webpack bundle
let cachedBundleLocation: string | null = null;
let isBundling = false;

async function getOrCreateBundle(): Promise<string> {
  if (cachedBundleLocation && fs.existsSync(cachedBundleLocation)) {
    return cachedBundleLocation;
  }
  if (isBundling) {
    while (isBundling) {
      await new Promise((r) => setTimeout(r, 500));
    }
    if (cachedBundleLocation) return cachedBundleLocation;
  }

  isBundling = true;
  console.log('[Remotion Engine] Bundling composition entry point...');
  const entryPoint = path.join(__dirname, 'remotion', 'index.ts');
  const bundleLocation = await bundle({
    entryPoint,
    publicDir: PUBLIC_DIR,
    webpackOverride: (config) => config,
  });

  cachedBundleLocation = bundleLocation;
  isBundling = false;
  console.log('[Remotion Engine] Bundle created at:', bundleLocation);
  return bundleLocation;
}

// Health Check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'FlowMG Render Server & Gemini Live Engine',
    timestamp: new Date().toISOString(),
    jobsCount: jobs.size,
  });
});

// Get Job Status
app.get('/api/job-status/:jobId', (req, res) => {
  const { jobId } = req.params;
  const job = jobs.get(jobId);
  if (!job) {
    return res.status(404).json({ error: 'Job not found' });
  }
  res.json(job);
});

// List Recent Jobs
app.get('/api/jobs', (req, res) => {
  const jobList = Array.from(jobs.values()).reverse();
  res.json(jobList);
});

// Generate Video Endpoint
app.post('/api/generate-video', async (req, res) => {
  const { script, apiKey, creativeDirection, voiceName = 'Puck' } = req.body;

  if (!script || typeof script !== 'string' || script.trim().length === 0) {
    return res.status(400).json({ error: 'Script text is required.' });
  }

  const jobId = `job_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  const initialJob: RenderJobStatus = {
    jobId,
    status: 'analyzing',
    progress: 5,
    stepMessage: '1. Autonomous AI Director analyzing story and visual metaphors...',
  };
  jobs.set(jobId, initialJob);

  // Send immediate 202 Accepted response with jobId
  res.status(202).json({
    success: true,
    message: 'AI Video generation pipeline initiated',
    jobId,
    statusUrl: `/api/job-status/${jobId}`,
  });

  // Execute processing pipeline asynchronously
  processVideoJob(jobId, script, apiKey, creativeDirection, voiceName).catch((err) => {
    console.error(`[Job ${jobId}] Failed unexpectedly:`, err);
    jobs.set(jobId, {
      jobId,
      status: 'failed',
      progress: 0,
      stepMessage: 'Video generation failed',
      error: err?.message || 'Unknown error during render',
    });
  });
});

async function processVideoJob(
  jobId: string,
  script: string,
  apiKey?: string,
  creativeDirection?: string,
  voiceName: string = 'Puck'
) {
  try {
    console.log(`[Job ${jobId}] Starting Autonomous GrowKaz Vector Video Engine...`);

    const result = await generateGrowKazVideo({
      title: 'AI Vector Explainer',
      script,
      aspect: '9:16',
      resolution: '720p',
      fps: 24,
      style: 'emerald',
      apiKey,
      onProgress: (progress, stepMessage) => {
        jobs.set(jobId, {
          jobId,
          status: progress >= 100 ? 'completed' : 'rendering',
          progress,
          stepMessage,
        });
      },
    });

    const videoUrl = `http://localhost:${PORT}${result.videoUrl}`;
    console.log(`[Job ${jobId}] Finished! Video available at: ${videoUrl}`);

    jobs.set(jobId, {
      jobId,
      status: 'completed',
      progress: 100,
      stepMessage: 'Video Render Completed Successfully!',
      videoUrl,
    });
  } catch (err: any) {
    console.error(`[Job ${jobId}] Error:`, err);
    jobs.set(jobId, {
      jobId,
      status: 'failed',
      progress: 0,
      stepMessage: 'Render process encountered an error',
      error: err?.message || 'Internal rendering error',
    });
  }
}

// Start Server
app.listen(PORT, () => {
  console.log(`=======================================================`);
  console.log(` FlowMG Programmatic Video Render Server`);
  console.log(` Listening on: http://localhost:${PORT}`);
  console.log(` Health check: http://localhost:${PORT}/api/health`);
  console.log(`=======================================================`);
});

export default app;
