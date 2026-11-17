# SKILL: GrowKaz Programmatic Vector & Stickman Motion Engine

## Overview
GrowKaz Stickman is an autonomous, programmatic 2D/3D video creation architecture where **every single frame is drawn by JavaScript code** (HTML5 Canvas 2D + Three.js WebGL) and rendered deterministically frame-by-frame. No image generation or diffusion models are used: visuals are invented fresh by code for every script while the cinematic, high-retention aesthetic remains consistent.

---

## 1. Core Architecture & Folder Layout
```
growkaz-stickman-studio/
  render.mjs             # Headless Chromium frame-by-frame capturer + FFmpeg muxer
  player.html            # Universal HTML5 / WebGL canvas player (runs in WebView & browsers)
  package.json
  engine/
    core.js              # Logical coordinate system (1080x1920 for 9:16), easing, styles, camera layers
    rig2d.js             # Stick-figure rig (27 poses, rim light, facial expressions, IK, breathing)
    fx2d.js              # Vector procedural environment (dust, rain, lens streaks, god rays, lamp posts)
    ui2d.js              # Blueprint diagrams, data cards, animated counters, leader-line callouts, captions
    three-kit.js         # Low-poly 3D stages, orbit cameras, stadium crowd grids, building fly-throughs
    styles.js            # 5 cinematic color grades (Emerald, Ember, Arctic, Sakura, Retro)
  projects/<slug>/
    config.json          # Aspect (9:16 or 16:9), resolution (1080p), fps (24 or 60), captions, style
    story/
      bible.md           # Visual logline, cast table (signature colors), locations & key lights
      shots.json         # Strict timeline of contiguous shots, lines, SFX triggers, music moods
    scenes/
      cast.js            # Outfits & signature props
      sets/*.js          # Reusable vector environments (lab, cafe, street, boardroom, shop)
      shots/*.js         # The actual JavaScript code registering each shot: registerShot('s001', { draw() })
```

---

## 2. The Golden Rules of Code-Drawn Motion Graphics

1. **Every Shot is Code, Never a Preset:**
   The AI writes executable JavaScript using `registerShot(id, { draw(g, t, info) { ... } })`. No static PNG cards, no hardcoded templates.
2. **Deterministic Time (`t`):**
   Every function receives `t` (seconds into the current shot) and `info` (`dur`, `globalT`, `line`, `p = t / dur`).
   Never use `Math.random()` or `Date.now()`. Use deterministic noise (`noise(x, seed)`) or `rng(seed)` so every frame is 100% reproducible.
3. **Camera Movement in Every Shot:**
   No shot is ever completely static. Always apply subtle camera drift:
   - Push-in: `cam = { z: 1 + 0.06 * ease.inOut(t / dur), x: -20 }`
   - Parallax layers: `layer(g, cam, depth, (g) => { ... })` where depth ranges from `0.2` (sky) to `1.0` (characters) to `1.6` (blurred foreground).
4. **Rim Light on Every Character:**
   Pure black stick figures (`S().ink`) become cinematic and readable through directional rim lighting:
   `rim: { color: M.rim, dir: [dx, dy], w: 4 }`. Backlit by window = `[0, -1]`. Light from left = `[-1, -0.3]`.
5. **Word-Syllable Synchronization:**
   - On-screen numbers/measurements appear when spoken using `wordTime(word, afterGlobalT)`.
   - Character talking animation uses `talkAmount(globalT, lineStart, lineEnd)` driving mouth shapes and faint expanding sound rings.
   - Narrator lines do NOT lip-sync; only quoted character dialogue lip-syncs.

---

## 3. Rig & Animation API Reference

### 27 Built-In Poses (`POSES` in `rig2d.js`)
`stand, relaxed, talk, explain, point, pointUp, wave, cheer, handsOnHead, crossArms, think, shrug, holdFront, phone, reach, sad, facepalm, ready, crouch, sit, sitBack, kneel, lie, dive, kick, jump, fall`

### Key Animation Helpers
```js
// Hold and smoothly blend between poses over `blend` seconds:
posesAt(t, [[0, 'stand'], [0.4, 'point'], [2.0, 'explain']], 0.35)

// Add lifelike idle breathing and subtle sway (never frozen):
breathe(pose, t, 1, seed)

// Big face emotional close-up (covers frame with glowing rim crescent):
bigFace(g, cx, cy, r, { outfit, expr: 'determined', look: [dx, dy], rimColor, rimSide })

// Walk & run cycles:
walkPose(phase, { run: false })
```

### Facial Expressions (`expr`)
`neutral, smile, happy, joy, surprised, shocked, scared, worried, nervous, angry, determined, sad, cry, smirk, sleepy, thinking, confused, awe`

---

## 4. UI & Explainer Vector Primitives (`ui2d.js`)
- `dataCard(g, x, y, { title, value, counter, unit, progress })`: Animated rolling number counter + graph curve.
- `blueprint(g, x, y, w, h, fn)`: Deep navy grid paper with light-blue vector linework and golden measurements.
- `compareBars(g, x, y, { leftVal, rightVal, leftLabel, rightLabel })`: Side-by-side metric comparison.
- `dimension(g, x1, y1, x2, y2, label)`: Architectural measurement arrows ("500 Units", "₹10,000").
- `callout(g, targetX, targetY, text)`: Highlighting leader-line with dot and annotation tag.
- `captions(g, words, globalT, opts)`: Kinetic verbatim subtitle rail with glowing active word.

---

## 5. Atmosphere & Procedural FX (`fx2d.js`)
- `dust(g, t, { count, color, a })`: Floating interior dust motes reacting to key light.
- `rain(g, t)` & `snow(g, t)`: Environmental weather streaks with ground ripples.
- `godRays(g, x, y, angle, length, color)`: Volumetric light shafts streaming through windows.
- `lensStreak(g, x, y, width, color)`: Anamorphic horizontal lens flare across bright light sources.
- `lightCone(g, lampX, lampY, groundY, radius)`: Street lamp and ceiling spotlight pools.

---

## 6. Audio Architecture (`audio/`)
- `music.py`: Generates ambient cinematic synth beds based on scene mood (`mystery, tension, action, wonder, hopeful, sad, triumph, playful, calm, dark, epic`).
- `sfx.py`: 36 procedural sound effects (`whoosh, impact, riser, slowmo, freeze, tick, counter, ding, shimmer, pop, blip`).
- `mix.py`: Ducks music by −9 dB under narration, balances SFX at −14 LUFS standard.

---

## 7. How The AI Generates a Video from Raw Story:
1. **Analyze Story:** Extract plot beats, characters, locations, and numbers.
2. **Generate Voiceover:** Stream text via Gemini Live / TTS API to get audio + exact syllable timestamps.
3. **Plan Timeline:** Write `story/shots.json` (contiguous cuts every 2–4s).
4. **Code The Scenes:** Write JavaScript shot modules registering `draw(g, t, info)` functions for each shot.
5. **Render:** Execute through `player.html` / `render.mjs` directly into MP4.
