# Skill: Remotion Programmatic Animation & Video Engineering

## Overview
This skill defines the technical specifications, mathematical foundations, and programmatic rules for producing viral, high-retention 9:16 vertical motion graphic videos (1080x1920 @ 60fps) inside Remotion.

---

## 1. Composition Settings & Aspect Ratio
All vertical explainer compositions conform strictly to the following parameters:
- **Width:** 1080px
- **Height:** 1920px (9:16 vertical aspect ratio for Instagram Reels, YouTube Shorts, TikTok)
- **FPS:** 60 fps (ultra-smooth motion physics and responsive lip-sync)
- **DurationInFrames:** Dynamically calculated based on the total audio track length (`Math.ceil(audioDurationSeconds * fps)`).

```tsx
<Composition
  id="FacelessExplainer"
  component={MainExplainer}
  durationInFrames={totalFrames}
  fps={60}
  width={1080}
  height={1920}
  defaultProps={defaultProps}
/>
```

---

## 2. Spring Physics & Interpolation Rules
Never use linear transitions for high-retention content. Every pop-in, scale, and movement must use damped spring physics.

### Spring Configurations:
- **Snappy Pop-in (Cards, Badges):**
  ```ts
  const scale = spring({
    frame,
    fps,
    config: { damping: 12, mass: 0.6, stiffness: 180 },
  });
  ```
- **Bouncy Elastic (Arrows, Attention Circles):**
  ```ts
  const bounce = spring({
    frame,
    fps,
    config: { damping: 8, mass: 0.5, stiffness: 220 },
  });
  ```
- **Smooth Cinematic Pan/Tilt (Detective Board, 3D Camera):**
  ```ts
  const pan = interpolate(frame, [0, totalFrames], [0, -120], {
    extrapolateRight: 'clamp',
    easing: Easing.bezier(0.25, 0.1, 0.25, 1),
  });
  ```

---

## 3. Trim-Path SVG Vector Animations (Arrows, Outlines, Circles)
To emulate hand-drawn detective diagrams, arrows, and highlight circles:
- Calculate path length using standard SVG stroke techniques.
- Control `strokeDasharray` and `strokeDashoffset`:

```tsx
export const TrimArrow: React.FC<{ progress: number; path: string }> = ({ progress, path }) => {
  const pathLength = 300;
  const strokeDashoffset = pathLength * (1 - Math.min(1, Math.max(0, progress)));

  return (
    <svg className="overflow-visible" width="300" height="150" viewBox="0 0 300 150">
      <path
        d={path}
        fill="none"
        stroke="#E50914"
        strokeWidth="6"
        strokeLinecap="round"
        strokeDasharray={pathLength}
        strokeDashoffset={strokeDashoffset}
      />
    </svg>
  );
};
```

---

## 4. Smooth Number Counters & Math Breakdowns
Numbers must rapidly roll up with easing to convey data growth, money metrics, or equation splits:

```tsx
export const AnimatedCounter: React.FC<{ from: number; to: number; prefix?: string; suffix?: string; frame: number; fps: number }> = ({
  from, to, prefix = '', suffix = '', frame, fps
}) => {
  const progress = spring({ frame, fps, config: { damping: 15, mass: 0.8, stiffness: 100 } });
  const currentValue = Math.floor(interpolate(progress, [0, 1], [from, to]));
  return <span>{prefix}{currentValue.toLocaleString()}{suffix}</span>;
};
```

---

## 5. Detective Board & Graph Backgrounds
To replicate the investigative journalist aesthetic:
- Layer 1: Dark grid pattern (`linear-gradient` with 40px grid spacing).
- Layer 2: Subtle vintage vignette and paper grain texture overlay.
- Layer 3: Pinned Polaroid-style cards, sticky notes, and connecting red strings (`stroke="#FF2A3A"`).
- Layer 4: Parallax camera movement using continuous slow translate and subtle scale drift (`1.0 -> 1.05`).

---

## 6. Programmatic 3D Scenes via `@remotion/three`
- Embed 3D models/primitives using `<ThreeCanvas width={1080} height={1920}>`.
- **CRITICAL REMOTION 3D RULE:** Never use `useFrame()` from React Three Fiber. All 3D rotations, camera angles, and positions must be computed purely from `useCurrentFrame()`.

```tsx
import { ThreeCanvas } from '@remotion/three';
import { useCurrentFrame } from 'remotion';

const SceneMesh = () => {
  const frame = useCurrentFrame();
  const rotationY = frame * 0.03;
  const scale = 1 + Math.sin(frame * 0.05) * 0.05;

  return (
    <mesh rotation={[0.4, rotationY, 0]} scale={scale}>
      <boxGeometry args={[2.5, 2.5, 2.5]} />
      <meshStandardMaterial color="#E50914" roughness={0.3} metalness={0.7} />
    </mesh>
  );
};
```

---

## 7. Sound Design & Audio Sync
Every visual trigger must align with an audio sting:
- Card pop: `pop.mp3`
- Arrow draw: `whoosh.mp3`
- Text highlight: `marker_scribble.mp3`
- Stamp / Decision: `thud.mp3`
Audio stings are placed using `<Audio src={staticFile("sfx/pop.mp3")} startFrom={0} volume={0.6} />` inside sequences matching `sfx_trigger`.
