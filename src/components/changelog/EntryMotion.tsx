'use client';

import { motion } from 'framer-motion';
import type React from 'react';

import { fadeUp, usePrefersReducedMotion } from '@/src/components/motion/motion';

export function EntryMotion({ children, index }: { children: React.ReactNode; index: number }) {
  const prefersReducedMotion = usePrefersReducedMotion();

  return (
    <motion.div
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.2 }}
      variants={fadeUp}
      transition={
        prefersReducedMotion
          ? { duration: 0 }
          : { duration: 0.45, ease: 'easeOut', delay: index * 0.06 }
      }
    >
      {children}
    </motion.div>
  );
}
