import { GoogleGenerativeAI } from '@google/generative-ai';
import {
  DynamicScene,
  DynamicStoryboard,
  DynamicVisualComposition,
  BackgroundStyle,
  CharacterStyle,
  CharacterPose,
  SfxTrigger,
} from './types';

const AI_DIRECTOR_SYSTEM_PROMPT = `
You are an elite Autonomous AI Video Director & Programmatic Motion Graphics Architect.
Your task is to analyze ANY raw story or script provided by the user (in Hindi, Hinglish, or English) and autonomously design a complete visual storyboard for a viral, high-retention 9:16 vertical video reel (1080x1920 @ 60fps).

DO NOT output rigid templates. Instead, think like a human motion graphics director:
1. ATMOSPHERE SELECTION:
   - "background": choose based on the story tone:
     * "grid_technical" (for modern creator, startup, growth, tech, MrBeast-style explainers)
     * "paper_warm" (for accounting, street shop, everyday money stories, relatable case studies)
     * "dark_blueprint" (for investigative journalism, corporate secrets, deep finance)
   - "accentColor": hex color (e.g. "#E11D48" crimson red, "#D97706" gold/amber, "#0284C7" electric blue)
   - "characterStyle": "casual_creator" (bearded glasses creator), "business_analyst" (suit & tie), or "storyteller"

2. LINE-BY-LINE VISUAL METAPHOR CONCEPTION:
   Break the script into 3 to 6 punchy scenes. For each scene, ask: "What visual prop, card, or diagram makes this line click instantly?"
   - "visual_type": one of:
     * "step_loop": numbered step pills with dashed arrows and optional central device mockup (great for strategies, workflows, cycles).
     * "equation_split": total value splitting into component costs/margins (great for unit economics, pricing, profit).
     * "comparison": side-by-side contrasting cards (old vs new, traditional vs disruptor).
     * "matrix_grid": visual icon grid (people, coins) showing volume, audience, or viral views.
     * "kinetic_text": oversized bold headline with animated accent underline (for punchlines and shocking reveals).
     * "story_prop": illustrated physical object or mockup (shop stall, donation box, cash stack).
     * "device_mockup": smartphone camera recording screen or tablet dashboard.

3. KINETIC HIGHLIGHT WORDS & CHARACTER EMOTION:
   - "highlighted_keywords": 1 to 3 words that must pop on the screen.
   - "character_pose": "pointing" (finger up at center visual), "explaining" (open gesture), "thinking" (hand on chin), "surprised" (wide eyes, hands raised).
   - "sfx_trigger": "whoosh", "pop", "cash", "thud", "scribble".

Return STRICT valid JSON conforming to this schema:
{
  "title": string,
  "atmosphere": {
    "background": "grid_technical" | "paper_warm" | "dark_blueprint",
    "accentColor": string,
    "characterStyle": "casual_creator" | "business_analyst" | "storyteller"
  },
  "scenes": [
    {
      "scene_id": number,
      "spoken_text": string,
      "highlighted_keywords": [string],
      "character_pose": "pointing" | "explaining" | "thinking" | "surprised",
      "sfx_trigger": "whoosh" | "pop" | "cash" | "thud" | "scribble",
      "visual_composition": {
        "visual_type": "step_loop" | "equation_split" | "comparison" | "matrix_grid" | "kinetic_text" | "story_prop" | "device_mockup",
        "headline": { "primary": string, "highlight": string, "subtitle": string },
        "sectionTag": string,
        "stepItems": [{ "id": "1", "stepNumber": "1", "title": string, "subtitle": string, "isHighlight": boolean }],
        "equationSplit": { "totalLabel": string, "totalValue": string, "parts": [{ "label": string, "value": string, "isResult": boolean }] },
        "comparison": { "left": { "title": string, "items": [string] }, "right": { "title": string, "items": [string], "isWinner": boolean } },
        "matrixGrid": { "totalCount": 80, "highlightCount": number, "headline": string },
        "propMockup": { "type": "smartphone" | "donation_box" | "stall_counter" | "coin", "screenText": string, "amountText": string }
      }
    }
  ]
}
`;

export async function generateStoryboard(
  scriptText: string,
  apiKey?: string,
  creativeDirection?: string
): Promise<{
  title: string;
  atmosphere: DynamicStoryboard['atmosphere'];
  scenes: Omit<DynamicScene, 'startFrame' | 'durationInFrames' | 'words'>[];
}> {
  const geminiKey = apiKey || process.env.GEMINI_API_KEY;

  if (geminiKey) {
    try {
      console.log('[AI Director] Analyzing script and autonomously generating visual scene graph...');
      const genAI = new GoogleGenerativeAI(geminiKey);
      const model = genAI.getGenerativeModel({
        model: 'gemini-2.5-flash',
        generationConfig: {
          responseMimeType: 'application/json',
          temperature: 0.4,
        },
      });

      const prompt = `${AI_DIRECTOR_SYSTEM_PROMPT}\n\nUSER SCRIPT:\n${scriptText}\n\nOPTIONAL CREATIVE DIRECTION:\n${creativeDirection || 'Make it high-retention, engaging and visually clear'}`;
      const result = await model.generateContent(prompt);
      const responseText = result.response.text();
      const parsed = JSON.parse(responseText);

      if (parsed.scenes && Array.isArray(parsed.scenes) && parsed.scenes.length > 0) {
        console.log(`[AI Director] Successfully synthesized ${parsed.scenes.length} bespoke scenes via AI.`);
        return {
          title: parsed.title || 'AI Animated Explainer',
          atmosphere: parsed.atmosphere || {
            background: 'grid_technical',
            accentColor: '#E11D48',
            characterStyle: 'casual_creator',
          },
          scenes: parsed.scenes,
        };
      }
    } catch (err: any) {
      console.warn('[AI Director] Gemini API call warning:', err?.message || err);
      console.log('[AI Director] Falling back to heuristic visual scene synthesizer.');
    }
  }

  return generateAutonomousHeuristicStoryboard(scriptText, creativeDirection);
}

/**
 * Autonomous Heuristic Storyboard Synthesizer:
 * Parses any arbitrary script, detects keywords, numbers, actions, and entities,
 * and dynamically compiles a multi-scene visual storyboard.
 */
function generateAutonomousHeuristicStoryboard(
  scriptText: string,
  creativeDirection?: string
): {
  title: string;
  atmosphere: DynamicStoryboard['atmosphere'];
  scenes: Omit<DynamicScene, 'startFrame' | 'durationInFrames' | 'words'>[];
} {
  const lines = scriptText
    .split(/\n+|\. |\? |! /)
    .map((l) => l.trim())
    .filter((l) => l.length > 8);

  const cleanLines = lines.length >= 3 ? lines : [
    scriptText.slice(0, Math.floor(scriptText.length / 3)).trim() || 'Zaid ne apna thela lagane ka socha.',
    scriptText.slice(Math.floor(scriptText.length / 3), Math.floor((2 * scriptText.length) / 3)).trim() || 'Thele ke liye teen hazaar chahiye the lekin uske paas do hazaar the.',
    scriptText.slice(Math.floor((2 * scriptText.length) / 3)).trim() || 'Shaam ko Zaid ne galla gina aur pure munafey ka hisaab samjha.',
  ];

  // Detect script theme autonomously based on words
  const isAccountingOrStory = /hisaab|thela|zaid|dukaan|dost|nimbu|udhaar|bima|kharcha/i.test(scriptText);
  const isDarkCorporate = /fraud|shell|scam|crime|police|secret|underground|black/i.test(scriptText);

  let background: BackgroundStyle = 'grid_technical';
  let accentColor = '#E11D48';
  let characterStyle: CharacterStyle = 'casual_creator';

  if (isAccountingOrStory) {
    background = 'paper_warm';
    accentColor = '#D97706';
    characterStyle = 'storyteller';
  } else if (isDarkCorporate) {
    background = 'dark_blueprint';
    accentColor = '#FF2A3A';
    characterStyle = 'business_analyst';
  }

  const scenes: Omit<DynamicScene, 'startFrame' | 'durationInFrames' | 'words'>[] = cleanLines.slice(0, 5).map((line, idx) => {
    // Extract numbers, currency, and power words
    const words = line.split(/\s+/);
    const numbers = line.match(/(₹|\$|Rs\.?|Rs)?\s*\d+([,\.]\d+)?\s*(hazaar|lakh|crore|percent|%|k|cr)?/gi) || [];
    const keywords: string[] = [];

    for (const w of words) {
      const clean = w.replace(/[^a-zA-Z0-9₹%]/g, '');
      if (clean.length > 2 && (/\d/.test(clean) || clean.includes('₹') || clean.includes('%') || /^[A-Z]/.test(clean))) {
        if (!keywords.includes(clean)) keywords.push(clean);
      }
    }
    if (keywords.length === 0 && words.length > 0) {
      keywords.push(words[Math.min(1, words.length - 1)].replace(/[^a-zA-Z0-9]/g, ''));
    }

    let composition: DynamicVisualComposition;
    let pose: CharacterPose = 'pointing';
    let sfx: SfxTrigger = 'whoosh';

    // Autonomously decide visual metaphor based on line context
    if (idx === 0) {
      // Opening hook: Step loop or physical stall
      if (isAccountingOrStory) {
        composition = {
          visual_type: 'story_prop',
          headline: { primary: 'THELE KA HISAB', highlight: 'SHURU' },
          propMockup: {
            type: 'stall_counter',
            amountText: numbers[0] || 'Rs 20',
          },
          floatingBadges: [
            { label: 'Thele ke liye', value: numbers[0] || 'Rs 3,000' },
            { label: 'Paas me the', value: numbers[1] || 'Rs 2,000', color: '#D97706' },
          ],
        };
        pose = 'explaining';
        sfx = 'pop';
      } else {
        composition = {
          visual_type: 'step_loop',
          headline: { primary: '5', highlight: 'STEP PLAN', subtitle: 'The Core Flywheel' },
          sectionTag: '// 01 · Formula',
          stepItems: [
            { id: '1', stepNumber: '1', title: numbers[0] || '₹500 Seed', isHighlight: true },
            { id: '2', stepNumber: '2', title: 'Viral Video' },
            { id: '3', stepNumber: '3', title: 'Brand Deal' },
            { id: '4', stepNumber: '4', title: 'Sponsor' },
            { id: '5', stepNumber: '5', title: 'Massive Views' },
          ],
          propMockup: {
            type: 'smartphone',
            screenText: 'REC 00:00',
            amountText: numbers[0] || '₹500',
          },
        };
        pose = 'pointing';
        sfx = 'whoosh';
      }
    } else if (idx === 1) {
      // Math breakdown or Kinetic punch
      if (numbers.length >= 2 || /commission|cost|profit|rupaye|hazaar|kharcha/i.test(line)) {
        composition = {
          visual_type: 'equation_split',
          headline: { primary: 'UNIT', highlight: 'ECONOMICS', subtitle: 'Where money flows' },
          sectionTag: '// 02 · The Split',
          equationSplit: {
            totalLabel: 'Total Turnover',
            totalValue: numbers[0] || '₹100 Order',
            parts: [
              { label: 'Cost / Kharcha', value: numbers[1] || '₹50' },
              { label: 'Platform / Delivery', value: numbers[2] || '₹35' },
              { label: 'Net Surplus', value: '₹15', isResult: true },
            ],
          },
        };
        pose = 'thinking';
        sfx = 'scribble';
      } else {
        composition = {
          visual_type: 'kinetic_text',
          headline: { primary: words[0] || 'ASLI', highlight: keywords[0] || 'PROMOTION' },
          sectionTag: '// 02 · Core Beat',
        };
        pose = 'explaining';
        sfx = 'pop';
      }
    } else if (idx === 2) {
      // Views / Audience scale or comparison
      if (/view|audience|log|customer|user|subscriber/i.test(line)) {
        composition = {
          visual_type: 'matrix_grid',
          headline: { primary: 'VIDEO CHALI', highlight: '= VIEWS' },
          sectionTag: '// 03 · Scale',
          matrixGrid: {
            totalCount: 80,
            highlightCount: 15,
            iconType: 'person',
            headline: 'Exponential Reach',
          },
        };
        pose = 'surprised';
        sfx = 'cash';
      } else {
        composition = {
          visual_type: 'comparison',
          headline: { primary: 'STRATEGY', highlight: 'CLASH' },
          sectionTag: '// 03 · Versus',
          comparison: {
            left: {
              title: 'Old Way',
              items: ['Heavy Losses', 'Slow Expansion'],
            },
            right: {
              title: 'New Disruption',
              items: ['10x Reach', 'Negative Working Capital'],
              isWinner: true,
            },
          },
        };
        pose = 'pointing';
        sfx = 'thud';
      }
    } else {
      // Climax or resolution
      composition = {
        visual_type: 'kinetic_text',
        headline: { primary: 'FINAL', highlight: keywords[0] || 'RESULT' },
        sectionTag: '// 04 · Takeaway',
      };
      pose = 'explaining';
      sfx = 'pop';
    }

    return {
      scene_id: idx + 1,
      spoken_text: line,
      highlighted_keywords: keywords.slice(0, 3),
      visual_composition: composition,
      character_pose: pose,
      sfx_trigger: sfx,
    };
  });

  return {
    title: 'Autonomous Explainer',
    atmosphere: {
      background,
      accentColor,
      characterStyle,
    },
    scenes,
  };
}
