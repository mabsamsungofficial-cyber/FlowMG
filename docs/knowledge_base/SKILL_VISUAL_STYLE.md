# Skill: Faceless High-Retention Visual Style & Character Animation

## Overview
This skill defines the signature visual aesthetic and UI/UX animation language inspired by top-performing faceless business explainers (e.g., *tapri.economist*, *Magnates Media*, *Vox Explains*). The visual design captures attention within the first 1.5 seconds and maintains retention through continuous subtle micro-animations.

---

## 1. Color Palette & Typography Guidelines
The visual theme relies on high-contrast, aggressive contrast ratios that stand out on mobile screens:

| Element | Color Hex | Role / Usage |
| :--- | :--- | :--- |
| **Canvas Background** | `#0D1117` / `#080A0F` | Deep dark slate, eliminates eye fatigue |
| **Grid Lines & Board** | `rgba(255, 255, 255, 0.08)` | Technical blueprint & detective grid |
| **Primary Accent** | `#E50914` (Netflix Red) / `#FF2A3A` | Callouts, highlight words, red string pins |
| **Secondary Accent** | `#00F0FF` (Cyan) / `#F59E0B` (Amber) | Supporting metrics, branch tags |
| **Card Fill** | `#161B22` | Frosted dark card surfaces with 1px border |
| **Primary Text** | `#FFFFFF` | Crisp white header & body text |
| **Muted Text** | `#8B949E` | Secondary captions, timestamps, inactive words |

### Typography:
- **Font Family:** `Montserrat`, `Inter`, or `Impact/Outfit` (Ultra-Bold 900 for keywords).
- **Text Transform:** Uppercase for hooks, numbers, and punchlines.

---

## 2. Top-Left Dynamic Highlighted Captions
Captions are placed at the **top-left** (below Instagram/YouTube top status bar, safe area $Y \approx 140\text{px}$) to keep the center clear for visual cards and the bottom-right clear for the talking character.

### Animation Rules:
- Render 3-5 words at a time (chunked).
- The active word being spoken scales up to `1.18x` with an ease-out spring.
- The active word changes color to `#FF2A3A` with a subtle red glow `text-shadow: 0 0 12px rgba(255, 42, 58, 0.6)`.
- If a word is tagged as `isHighlight`, it renders in slanted Italic with an animated yellow/red underline or highlighter pill background.

---

## 3. Center Visual Cards & Motion Templates
The center zone ($Y: 350\text{px}$ to $1350\text{px}$) hosts dynamic templates tailored to the scene script:

### A. Flowchart Cards
- Nodes represent steps in an economic or strategic loop (e.g., `Raw Material -> Factory -> Retailer -> Customer`).
- Nodes enter sequentially using `spring({ delay: index * 10 })`.
- Trim-path SVG arrows connect node A to node B with animated stroke-dashoffset.

### B. Math Breakdown Cards (`20 = 5 + 5 + 10`)
- Visualizes financial margins, budget breakdowns, or unit economics.
- Starts with the total amount (e.g., `₹100 Retail Price`), which fractures into 3 sub-cards (Cost of Goods `₹40`, Marketing `₹30`, Net Profit `₹30`).
- Animated red brackets and mathematical operators (`+`, `=`, `×`) pop with bouncy springs.

### C. Detective Board
- Corkboard or dark blueprint with pinned documents, crime scene tags, and newspaper clippings.
- Dynamic red thread (`<line stroke="#FF2A3A" strokeWidth="4" />`) connects pins.
- Subtle continuous camera zoom ($1.0 \to 1.06$) to create suspense.

### D. Programmatic 3D Scene
- Floating 3D metallic gold coins, stock charts, or crypto tokens rotating smoothly via Three.js.
- Specular lighting highlights and soft drop shadows on the 2D plane.

---

## 4. Bottom-Right 2D Audio-Reactive Talking Character
The 2D avatar represents the narrator, placed at the bottom-right ($X: 680\text{px}, Y: 1380\text{px}, \text{width}: 380\text{px}$).

### Components of the Character:
1. **Head & Hair:** Minimalist vector illustrated character (economist with glasses, modern hair).
2. **Eyes:**
   - Normal open eyes.
   - Blinking state: Triggers automatically every 180 frames (3 seconds) for 6 frames.
3. **Mouth (Audio-Reactive Lip Sync):**
   - Driven by `@remotion/media-utils` `visualizeAudio()` or RMS amplitude:
     - `amplitude < 0.04`: Closed mouth (`mouth_closed.svg` or flat smile line).
     - `0.04 <= amplitude < 0.18`: Half open (`mouth_half.svg` / rounded oval).
     - `amplitude >= 0.18`: Wide open (`mouth_open.svg` / vowel shape).
4. **Hands & Gesture Poses:**
   Switches based on `scene.character_pose`:
   - `explaining`: Hand open, palm up, gentle floating bob.
   - `pointing`: Index finger pointing up-left directly at the center card.
   - `thinking`: Hand touching chin, head tilted $4^\circ$.
   - `surprised`: Both hands slightly raised, eyes widened.
5. **Idle Animation:** Continuous subtle breathing cycle (Y-axis oscillation of 3-5px via `Math.sin(frame * 0.08)`).
