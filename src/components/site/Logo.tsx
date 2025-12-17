'use client';

import { motion } from 'framer-motion';
import { usePrefersReducedMotion } from '@/src/components/motion/motion';

type LogoProps = {
  className?: string;
  label?: string;
  title?: string;
  size?: LogoSize;
  animated?: boolean;
};

export type LogoSize =
  | 'xs'
  | 'sm'
  | 'md'
  | 'lg'
  | 'xl'
  | '2xl'
  | '3xl'
  | '4xl'
  | '5xl'
  | '6xl'
  | '7xl'
  | '8xl'
  | '9xl'
  | '10xl';

const sizeToClassName: Record<LogoSize, string> = {
  xs: 'h-4',
  sm: 'h-5',
  md: 'h-6',
  lg: 'h-8',
  xl: 'h-10',
  '2xl': 'h-12',
  '3xl': 'h-14',
  '4xl': 'h-16',
  '5xl': 'h-20',
  '6xl': 'h-24',
  '7xl': 'h-28',
  '8xl': 'h-32',
  '9xl': 'h-36',
  '10xl': 'h-40',
};

export function Logo({ className, label, title, size = 'md', animated = false }: LogoProps) {
  const prefersReducedMotion = usePrefersReducedMotion();
  const alt = typeof label === 'string' && label.trim() ? label.trim() : '';
  const isDecorative = !alt;
  const baseClassName = `${sizeToClassName[size]} w-auto shrink-0 ${className ?? ''}`.trim();

  const shouldAnimate = Boolean(animated && !prefersReducedMotion);
  const hover = { scale: 1.15, opacity: 0.92 };
  const tap = { scale: 0.98 };
  const transition = { duration: 0.18, ease: 'easeOut' as const };

  if (shouldAnimate) {
    return (
      <>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <motion.img
          src="/logo-inverted.svg"
          alt={alt}
          aria-hidden={isDecorative}
          title={title}
          className={`logo-for-dark ${baseClassName}`}
          whileHover={hover}
          whileTap={tap}
          transition={transition}
        />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <motion.img
          src="/logo.svg"
          alt={alt}
          aria-hidden={isDecorative}
          title={title}
          className={`logo-for-light ${baseClassName}`}
          whileHover={hover}
          whileTap={tap}
          transition={transition}
        />
      </>
    );
  }

  return (
    <>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/logo-inverted.svg"
        alt={alt}
        aria-hidden={isDecorative}
        title={title}
        className={`logo-for-dark ${baseClassName}`}
      />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/logo.svg"
        alt={alt}
        aria-hidden={isDecorative}
        title={title}
        className={`logo-for-light ${baseClassName}`}
      />
    </>
  );
}
