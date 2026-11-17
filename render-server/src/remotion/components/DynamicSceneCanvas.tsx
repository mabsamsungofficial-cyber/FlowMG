import React from 'react';
import { useVideoConfig, spring } from 'remotion';
import { DynamicVisualComposition, BackgroundStyle } from '../../ai/types';

// Concrete Renderers
import { FiveStepPlanCard } from './FiveStepPlanCard';
import { AudienceMatrixCard } from './AudienceMatrixCard';
import { KineticPunchCard } from './KineticPunchCard';
import { HisaabStallCard } from './HisaabStallCard';
import { FlowchartCard } from './FlowchartCard';
import { MathBreakdownCard } from './MathBreakdownCard';
import { ComparisonCard } from './ComparisonCard';

interface DynamicSceneCanvasProps {
  composition: DynamicVisualComposition;
  accentColor?: string;
  backgroundStyle?: BackgroundStyle;
  sceneFrame: number;
}

export const DynamicSceneCanvas: React.FC<DynamicSceneCanvasProps> = ({
  composition,
  accentColor = '#E11D48',
  backgroundStyle = 'grid_technical',
  sceneFrame,
}) => {
  const { fps } = useVideoConfig();

  const containerSpring = spring({
    frame: sceneFrame,
    fps,
    config: { damping: 14, stiffness: 120 },
  });

  const { visual_type, headline, sectionTag } = composition;

  return (
    <div
      style={{
        width: 960,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        transform: `scale(${containerSpring})`,
      }}
    >
      {/* 1. Step Loop / Flywheel Strategy */}
      {visual_type === 'step_loop' && (
        <FiveStepPlanCard
          title={headline?.primary ? `${headline.primary} ${headline.highlight || ''}` : '5 STEP PLAN'}
          sceneFrame={sceneFrame}
        />
      )}

      {/* 2. Unit Economics / Equation Split */}
      {visual_type === 'equation_split' && (
        <MathBreakdownCard
          title={headline?.primary ? `${headline.primary} ${headline.highlight || ''}` : 'Unit Economics Split'}
          subtitle={headline?.subtitle || 'Where does every Rupee go?'}
          mathEquation={{
            total: composition.equationSplit?.totalValue || '₹100 Order Value',
            parts: composition.equationSplit?.parts || [
              { label: 'COGS', value: '₹40' },
              { label: 'Marketing', value: '₹35' },
              { label: 'Net Profit', value: '₹25', isResult: true },
            ],
          }}
          sceneFrame={sceneFrame}
        />
      )}

      {/* 3. Audience / Reach Conversion Matrix */}
      {visual_type === 'matrix_grid' && (
        <AudienceMatrixCard
          title={headline?.primary ? `${headline.primary} ${headline.highlight || ''}` : 'VIDEO चली = VIEWS'}
          sceneFrame={sceneFrame}
        />
      )}

      {/* 4. Kinetic Punch Headline */}
      {visual_type === 'kinetic_text' && (
        <KineticPunchCard
          primaryText={headline?.primary || 'मस्त'}
          highlightText={headline?.highlight || 'PROMOTION'}
          subtitle={headline?.subtitle}
          sceneFrame={sceneFrame}
        />
      )}

      {/* 5. Physical Story Prop (e.g. Stall Counter, Donation Box) */}
      {visual_type === 'story_prop' && (
        <HisaabStallCard
          neededAmount={composition.floatingBadges?.[0]?.value || 'Rs 3,000'}
          availableAmount={composition.floatingBadges?.[1]?.value || 'Rs 2,000'}
          sceneFrame={sceneFrame}
        />
      )}

      {/* 6. Comparison / Disruption Clash */}
      {visual_type === 'comparison' && (
        <ComparisonCard
          title={headline?.primary ? `${headline.primary} ${headline.highlight || ''}` : 'Direct Comparison'}
          subtitle={headline?.subtitle || 'Old Way vs New Disruption'}
          comparison={{
            sideA: {
              title: composition.comparison?.left.title || 'Old Model',
              points: composition.comparison?.left.items || ['High Costs', 'Slow Scale'],
            },
            sideB: {
              title: composition.comparison?.right.title || 'Disruptor Model',
              points: composition.comparison?.right.items || ['10x Reach', 'High Margins'],
              highlight: true,
            },
          }}
          sceneFrame={sceneFrame}
        />
      )}

      {/* 7. Flowchart / Value Chain Diagram */}
      {visual_type === 'diagram' && (
        <FlowchartCard
          title={headline?.primary ? `${headline.primary} ${headline.highlight || ''}` : 'System Diagram'}
          subtitle={headline?.subtitle}
          nodes={composition.stepItems?.map((s) => ({
            id: s.id,
            label: s.title,
            subtext: s.subtitle,
          }))}
          sceneFrame={sceneFrame}
        />
      )}

      {/* Fallback to Kinetic Punch if type not matched */}
      {!['step_loop', 'equation_split', 'matrix_grid', 'kinetic_text', 'story_prop', 'comparison', 'diagram'].includes(visual_type) && (
        <KineticPunchCard
          primaryText={headline?.primary || 'KEY'}
          highlightText={headline?.highlight || 'INSIGHT'}
          subtitle={headline?.subtitle}
          sceneFrame={sceneFrame}
        />
      )}
    </div>
  );
};
