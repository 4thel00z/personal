'use client';

import { motion, useReducedMotion, type Variants } from 'framer-motion';
import type React from 'react';

export function usePrefersReducedMotion() {
  return useReducedMotion();
}

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0 },
};

export function stagger(delayChildren = 0.06, staggerChildren = 0.06): Variants {
  return {
    hidden: {},
    show: {
      transition: {
        delayChildren,
        staggerChildren,
      },
    },
  };
}

export function Reveal({
  children,
  className,
  variants = fadeUp,
  delayChildren,
  staggerChildren,
}: {
  children: React.ReactNode;
  className?: string;
  variants?: Variants;
  delayChildren?: number;
  staggerChildren?: number;
}) {
  const prefersReducedMotion = usePrefersReducedMotion();

  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.2 }}
      variants={stagger(delayChildren ?? 0, staggerChildren ?? 0.06)}
      transition={prefersReducedMotion ? { duration: 0 } : undefined}
    >
      <motion.div
        variants={variants}
        transition={prefersReducedMotion ? { duration: 0 } : undefined}
      >
        {children}
      </motion.div>
    </motion.div>
  );
}
