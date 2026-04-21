import React from 'react';
import { motion } from 'framer-motion';

/**
 * ScrollReveal Component
 * Standardizes cinematic reveal animations cross-project.
 */
interface ScrollRevealProps {
    children: React.ReactNode;
    delay?: number;
    margin?: string;
    className?: string;
}

export const ScrollReveal = ({ 
    children, 
    delay = 0, 
    margin = "-10%",
    className = "w-full"
}: ScrollRevealProps) => (
  <motion.div
    initial={{ opacity: 0, y: 30, filter: 'blur(16px)' }}
    whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
    viewport={{ once: true, margin }}
    transition={{ duration: 1.8, delay, ease: [0.22, 1, 0.36, 1] }}
    className={className}
  >
    {children}
  </motion.div>
);
