export type CharacterPose = 
  | 'explaining' 
  | 'pointing' 
  | 'thinking' 
  | 'surprised';

export type CharacterStyle =
  | 'casual_creator'  // Bearded creator with glasses, curly hair, t-shirt
  | 'business_analyst' // Suit, glasses, red tie
  | 'storyteller';     // Friendly narrator in casual attire

export type BackgroundStyle =
  | 'grid_technical'  // Clean technical blueprint grid with monospace tags
  | 'paper_warm'       // Warm cream paper canvas with category tabs
  | 'dark_blueprint';  // Deep slate dark canvas with radial spotlight

export type SfxTrigger = 
  | 'pop' 
  | 'whoosh' 
  | 'scribble' 
  | 'thud' 
  | 'cash';

export type VisualNodeType =
  | 'step_loop'        // Sequential loop of numbered step cards with connecting lines
  | 'equation_split'   // Total value breaking down into component parts
  | 'comparison'       // Side-by-side contrast (Old vs New, Traditional vs Disruptor)
  | 'matrix_grid'      // Icon/people matrix showing volume, audience, or conversion
  | 'device_mockup'    // 3D/tilted smartphone or hardware screen with live preview
  | 'kinetic_text'     // Massive typography with animated underline & accents
  | 'story_prop'       // Real-world illustrated prop (stall, donation box, coins, cards)
  | 'diagram';         // Flowchart diagram nodes

export interface StepItem {
  id: string;
  stepNumber: string;
  title: string;
  subtitle?: string;
  isHighlight?: boolean;
}

export interface SplitItem {
  label: string;
  value: string;
  isResult?: boolean;
}

export interface ComparisonColumn {
  title: string;
  items: string[];
  isWinner?: boolean;
}

export interface PropMockupConfig {
  type: 'smartphone' | 'donation_box' | 'stall_counter' | 'coin' | 'document';
  screenText?: string;
  badgeText?: string;
  amountText?: string;
}

export interface DynamicVisualComposition {
  visual_type: VisualNodeType;
  headline?: {
    primary: string;
    highlight?: string;
    subtitle?: string;
  };
  sectionTag?: string;
  stepItems?: StepItem[];
  equationSplit?: {
    totalLabel: string;
    totalValue: string;
    parts: SplitItem[];
  };
  comparison?: {
    left: ComparisonColumn;
    right: ComparisonColumn;
  };
  matrixGrid?: {
    totalCount: number;
    highlightCount: number;
    iconType?: 'person' | 'coin' | 'box';
    headline: string;
  };
  propMockup?: PropMockupConfig;
  floatingBadges?: Array<{
    label: string;
    value: string;
    color?: string;
  }>;
}

export interface WordTimestamp {
  word: string;
  startFrame: number;
  endFrame: number;
  isHighlight: boolean;
}

export interface DynamicScene {
  scene_id: number;
  spoken_text: string;
  highlighted_keywords: string[];
  visual_composition: DynamicVisualComposition;
  character_pose: CharacterPose;
  sfx_trigger: SfxTrigger;
  startFrame: number;
  durationInFrames: number;
  words: WordTimestamp[];
}

export interface DynamicStoryboard {
  title: string;
  atmosphere: {
    background: BackgroundStyle;
    accentColor: string;
    characterStyle: CharacterStyle;
    channelWatermark?: string;
  };
  totalDurationSeconds: number;
  totalFrames: number;
  audioUrl: string;
  audioFileName?: string;
  scenes: DynamicScene[];
}

export interface RenderJobStatus {
  jobId: string;
  status: 'idle' | 'analyzing' | 'generating_audio' | 'coding_scenes' | 'rendering' | 'completed' | 'failed';
  progress: number;
  stepMessage: string;
  videoUrl?: string;
  storyboard?: DynamicStoryboard;
  error?: string;
}
