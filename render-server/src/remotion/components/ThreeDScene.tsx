import React from 'react';
import { useVideoConfig, spring, interpolate } from 'remotion';
import { ThreeCanvas } from '@remotion/three';
import { ThreeDSceneConfig } from '../../ai/types';

interface ThreeDSceneProps {
  title?: string;
  config?: ThreeDSceneConfig;
  sceneFrame: number;
}

const MeshObject: React.FC<{ objectType?: string; color?: string; sceneFrame: number }> = ({
  objectType = 'coin',
  color = '#E50914',
  sceneFrame,
}) => {
  // Deterministic 3D animation derived purely from sceneFrame
  const rotationY = sceneFrame * 0.04;
  const rotationX = 0.35 + Math.sin(sceneFrame * 0.02) * 0.15;
  const floatY = Math.sin(sceneFrame * 0.05) * 0.2;

  if (objectType === 'cube') {
    return (
      <mesh position={[0, floatY, 0]} rotation={[rotationX, rotationY, 0]}>
        <boxGeometry args={[2.2, 2.2, 2.2]} />
        <meshStandardMaterial color={color} roughness={0.2} metalness={0.8} />
      </mesh>
    );
  }

  // Coin / Cylinder default
  return (
    <mesh position={[0, floatY, 0]} rotation={[rotationX, rotationY, 0]}>
      <cylinderGeometry args={[2.0, 2.0, 0.4, 32]} />
      <meshStandardMaterial color={color} roughness={0.15} metalness={0.9} />
    </mesh>
  );
};

export const ThreeDScene: React.FC<ThreeDSceneProps> = ({
  title = '3D Valuation Growth',
  config = { objectType: 'coin', color: '#E50914', label: '10x Return' },
  sceneFrame,
}) => {
  const { fps } = useVideoConfig();

  const containerSpring = spring({
    frame: sceneFrame,
    fps,
    config: { damping: 14, stiffness: 120 },
  });

  return (
    <div
      style={{
        width: 960,
        backgroundColor: '#0F131C',
        borderRadius: 28,
        border: '2px solid rgba(255, 42, 58, 0.4)',
        boxShadow: '0 25px 60px rgba(0, 0, 0, 0.85)',
        padding: '36px 40px',
        transform: `scale(${containerSpring})`,
        display: 'flex',
        flexDirection: 'column',
        gap: 20,
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Title */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
          <div style={{ width: 8, height: 24, backgroundColor: '#FF2A3A', borderRadius: 4 }} />
          <h2
            style={{
              fontSize: 32,
              fontWeight: 900,
              color: '#FFFFFF',
              letterSpacing: '0.02em',
              textTransform: 'uppercase',
              margin: 0,
            }}
          >
            {title}
          </h2>
        </div>
      </div>

      {/* 3D Canvas Container */}
      <div
        style={{
          width: '100%',
          height: 480,
          backgroundColor: '#06080D',
          borderRadius: 20,
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <ThreeCanvas width={880} height={480} camera={{ position: [0, 0, 5], fov: 50 }}>
          <ambientLight intensity={0.7} />
          <pointLight position={[10, 10, 10]} intensity={1.5} color="#FFFFFF" />
          <pointLight position={[-10, -5, -5]} intensity={1.0} color="#FF2A3A" />
          <MeshObject objectType={config.objectType} color={config.color} sceneFrame={sceneFrame} />
        </ThreeCanvas>

        {/* Floating Stat Pill Overlay */}
        <div
          style={{
            position: 'absolute',
            bottom: 24,
            left: '50%',
            transform: 'translateX(-50%)',
            backgroundColor: 'rgba(8, 10, 15, 0.85)',
            border: '2px solid #FF2A3A',
            padding: '10px 28px',
            borderRadius: 30,
            boxShadow: '0 0 25px rgba(255, 42, 58, 0.4)',
            backdropFilter: 'blur(8px)',
          }}
        >
          <span style={{ color: '#FFFFFF', fontSize: 22, fontWeight: 900, letterSpacing: '0.05em' }}>
            {config.label || 'EXPONENTIAL GROWTH'}
          </span>
        </div>
      </div>
    </div>
  );
};
