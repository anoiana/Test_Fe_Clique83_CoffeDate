import React, { useMemo } from 'react';
import { motion } from 'framer-motion';

interface GoldenParticlesBackgroundProps {
  /** Number of floating particles */
  particleCount?: number;
  /** Size of the central glow in px */
  glowSize?: number;
  /** Opacity of central glow (0-1 scale, mapped to primary/X) */
  glowIntensity?: 'soft' | 'medium' | 'strong';
}

/**
 * GoldenParticlesBackground
 * Shared premium atmospheric background with a warm central glow
 * and golden particles floating upwards. Used across Begin, Congrats, etc.
 */
export const GoldenParticlesBackground = ({
  particleCount = 20,
  glowSize = 500,
  glowIntensity = 'medium',
}: GoldenParticlesBackgroundProps) => {
  const particles = useMemo(() =>
    [...Array(particleCount)].map((_, i) => ({
      id: i,
      startX: Math.random() * 100,
      duration: Math.random() * 3 + 4,
      delay: Math.random() * 5,
      scale: Math.random() * 0.5 + 1,
    })),
    [particleCount]
  );

  const glowOpacityClass =
    glowIntensity === 'soft' ? 'bg-primary/5' :
    glowIntensity === 'strong' ? 'bg-primary/15' :
    'bg-primary/10';

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {/* Central warm glow */}
      <div
        className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full blur-[120px] ${glowOpacityClass}`}
        style={{ width: glowSize, height: glowSize }}
      />

      {/* Floating golden particles */}
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute w-1 h-1 bg-primary/40 rounded-full"
          style={{ left: `${p.startX}%`, bottom: -10 }}
          animate={{
            y: [0, -(typeof window !== 'undefined' ? window.innerHeight + 100 : 900)],
            opacity: [0, 1, 0],
            scale: [1, p.scale, 1],
          }}
          transition={{
            duration: p.duration,
            repeat: Infinity,
            delay: p.delay,
            ease: 'linear',
          }}
        />
      ))}
    </div>
  );
};
