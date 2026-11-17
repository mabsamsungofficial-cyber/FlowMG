# FlowMG: Script-to-Animated-Video Android App & Render Engine (v1.0.0)

Autonomous, programmatic AI video creation engine and Android mobile app designed for high-retention faceless explainers, stick-figure cinematic reels, and motion graphics.

---

## What is FlowMG?
FlowMG turns any raw story or script into an animated 9:16 vertical video reel without using image-diffusion models or static video templates. Every frame is drawn deterministically by code (HTML5 Canvas 2D + Three.js WebGL) and rendered frame-by-frame with synchronized narration, procedural soundtrack, and sound effects.

### Key Capabilities:
- **Autonomous AI Director:** Breaks down scripts into contiguous shots, assigns camera drift (push, pan, orbit), and conceives visual metaphors.
- **Pure Vector & Stickman Rigging:** 27 expressive poses, inverse kinematics, directional rim-lighting, breathing life, and emotional close-ups (`bigFace`).
- **Data & Blueprint Explainers:** Procedural counting numbers, blueprint diagrams, comparison bars, leader-line callouts, and kinetic captions.
- **Procedural Sound Design:** Automated synthesizer soundtrack beds, 36 procedural sound effects (`whoosh`, `impact`, `pop`, `ding`), and −14 LUFS loudness mastering.
- **Android Studio Client:** Clean mobile app with story input, real-time AI thought progress, in-app video player, and one-tap save to phone gallery.

---

## Workspace Structure

```
├── .agent/skills/                     # Agent Knowledge Base & Rules
│   ├── SKILL_GROWKAZ_STICKMAN_ENGINE.md # 2D/3D Vector code engine reference
│   ├── SKILL_AI_VIDEO_DIRECTOR.md     # Story-to-code planning doctrines
│   └── SKILL_REMOTION_ANIMATION.md   # Spring animations & 9:16 layout
├── GrowKaz_Stickman/                  # Autonomous Code-Drawn Vector Studio
│   └── skills/make-2d-video/kit/
│       ├── engine/                    # rig2d, fx2d, ui2d, three-kit, core, styles
│       ├── audio/                     # dsp, sfx, music, mix
│       ├── render.mjs                 # Headless Chromium parallel renderer
│       └── player.html                # Universal Canvas/WebGL player
├── render-server/                     # Node.js + Express API Server
│   ├── src/
│   │   ├── ai/
│   │   │   ├── growkazGenerator.ts    # Autonomous GrowKaz pipeline generator
│   │   │   ├── storyboardGenerator.ts # Script analyzer
│   │   │   └── geminiLiveVoiceover.ts # Voiceover & timestamp mapper
│   │   └── server.ts                  # REST API (POST /api/generate-video)
│   └── public/
└── android-app/                       # React Native / Expo Android Client
    ├── App.tsx                        # Clean dark-mode UI with player & downloader
    └── android/                       # Native Android project (prebuild)
```

---

## Quickstart

### 1. Start the Render Server
```bash
cd render-server
npm install
npx tsx src/server.ts
```
Server listens at `http://localhost:3001` (Health check: `http://localhost:3001/api/health`).

### 2. Run the Android App
```bash
cd android-app
npx expo start
```
Or install the pre-built release APK: `FlowMG-Video-Studio.apk`.

---

## License
MIT
