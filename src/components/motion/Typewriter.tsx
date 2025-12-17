'use client';

import { animate, motion, useMotionValue, useTransform } from 'framer-motion';
import { useEffect } from 'react';
import { usePrefersReducedMotion } from '@/src/components/motion/motion';

export interface TypewriterProps {
  text: string;
  className?: string;
  speed?: number;
  delay?: number;
}

export function Typewriter({ text, className, speed = 0.05, delay = 0 }: TypewriterProps) {
  const prefersReducedMotion = usePrefersReducedMotion();
  const count = useMotionValue(0);
  const rounded = useTransform(count, (latest) => Math.round(latest));
  const displayText = useTransform(rounded, (latest) => text.slice(0, latest));

  useEffect(() => {
    if (prefersReducedMotion) {
      count.set(text.length);
      return;
    }

    const controls = animate(count, text.length, {
      type: 'tween',
      duration: text.length * speed,
      ease: 'linear',
      delay: delay,
    });
    return controls.stop;
  }, [count, delay, prefersReducedMotion, speed, text.length]);

  return (
    <span className={className}>
      <motion.span>{displayText}</motion.span>
      {!prefersReducedMotion && (
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{
            duration: 0.5,
            repeat: Infinity,
            repeatType: 'reverse',
            ease: 'linear',
          }}
          className="ml-[1px] mb-[0.1em] inline-block h-[1em] w-[0.15em] bg-accent align-middle"
        />
      )}
    </span>
  );
}
