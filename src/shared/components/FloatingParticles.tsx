import React, { useMemo } from 'react';
import { motion } from 'framer-motion';

/**
 * Shared Component: Premium Floating Particles
 * Runs continuously in the background for atmospheric depth.
 * Reusable across any page needing cinematic ambiance.
 *
 * @param {Object} props
 * @param {import('framer-motion').MotionValue} props.opacity - Motion value controlling visibility
 * @param {number} [props.count=60] - Number of particles to render
 */
const FloatingParticles = ({ opacity, count = 60 }) => {
  const particles = useMemo(() => [...Array(count)], [count]);
  return (
    <motion.div
      style={{ opacity }}
      className="fixed inset-0 pointer-events-none overflow-hidden z-20"
    >
      {particles.map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 bg-primary rounded-full transform-gpu"
          style={{
            left: Math.random() * 100 + "%",
            top: Math.random() * 100 + "%",
            willChange: "transform, opacity",
          }}
          animate={{
            y: [0, -20, 0],
            opacity: [0, 0.4, 0],
          }}
          transition={{
            duration: Math.random() * 5 + 5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: Math.random() * 5,
          }}
        />
      ))}
    </motion.div>
  );
};

FloatingParticles.displayName = 'FloatingParticles';

export default FloatingParticles;
