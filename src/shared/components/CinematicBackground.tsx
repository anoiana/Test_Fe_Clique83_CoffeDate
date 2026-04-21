import React, { memo } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

interface CinematicBackgroundProps {
  imageUrl?: string;
  blurRange?: [string, string, string]; // [start, mid, end]
  scaleRange?: [number, number];
  opacityRange?: [number, number];
  parallaxOffset?: number;
}

const CinematicBackgroundComponent: React.FC<CinematicBackgroundProps> = ({
  imageUrl,
  blurRange = ["blur(80px)", "blur(40px)", "blur(0px)"], // Blurry at top, clear at bottom
  scaleRange = [1.2, 1],
  opacityRange = [0.4, 1],
  parallaxOffset = 200
}) => {
  const { scrollYProgress } = useScroll();

  // Dynamic values based on scroll
  const blurFilter = useTransform(scrollYProgress, [0, 0.5, 1], blurRange);
  const scale = useTransform(scrollYProgress, [0, 1], scaleRange);
  const opacity = useTransform(scrollYProgress, [0, 1], opacityRange);

  // Parallax for blobs
  const y1 = useTransform(scrollYProgress, [0, 1], [0, -parallaxOffset]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, -parallaxOffset * 2]);

  return (
    <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none bg-background-paper">
      {/* The main cinematic image */}
      {imageUrl && (
        <motion.div
          style={{
            backgroundImage: `url("${imageUrl}")`,
            filter: blurFilter,
            scale,
            opacity
          }}
          className="absolute inset-0 bg-cover bg-center transform-gpu will-change-[filter,transform,opacity]"
        />
      )}

      {/* Decorative Parallax Blobs to add "spirit" to the background */}
      <motion.div 
        style={{ y: y1 }}
        className="absolute top-[-5%] left-[-5%] w-[50%] h-[50%] bg-primary/10 rounded-full blur-[100px]"
      />
      <motion.div 
        style={{ y: y2 }}
        className="absolute bottom-[-10%] right-[-5%] w-[60%] h-[60%] bg-primary/5 rounded-full blur-[120px]"
      />

      {/* Dark gradient overlay to ensure text readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-background-dark/80 via-transparent to-background-dark/90" />
      
      {/* Noise Texture for Cinematic Feel */}
      <div 
        className="absolute inset-0 opacity-[0.03] contrast-150 brightness-150 pointer-events-none mix-blend-overlay"
        style={{ backgroundImage: 'url("https://grainy-gradients.vercel.app/noise.svg")' }} 
      />
    </div>
  );
};

export const CinematicBackground = memo(CinematicBackgroundComponent);
