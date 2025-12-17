'use client';

import { motion } from 'framer-motion';
import { usePrefersReducedMotion } from '@/src/components/motion/motion';

export type TickerItem = {
  name: string;
};

function Item({ name }: { name: string }) {
  return (
    <div className="flex items-center gap-2 text-muted hover:text-fg transition-colors">
      <span className="text-lg font-semibold tracking-tight">{name}</span>
    </div>
  );
}

export function Ticker({
  items,
  label = 'Trusted by teams who care about polish',
}: {
  items: TickerItem[];
  label?: string;
}) {
  const prefersReducedMotion = usePrefersReducedMotion();
  const all = [...items, ...items, ...items];

  return (
    <section aria-label="Trusted ecosystem" className="bg-canvas border-y border-border/40 py-12">
      <div className="container-page">
        <div className="text-center mb-8">
          <p className="text-sm font-semibold tracking-wider text-subtle uppercase">{label}</p>
        </div>

        <div className="relative overflow-hidden">
          <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-canvas to-transparent" />
          <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-canvas to-transparent" />

          {prefersReducedMotion ? (
            <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-8">
              {items.map((item) => (
                <Item key={item.name} name={item.name} />
              ))}
            </div>
          ) : (
            <motion.div
              className="flex w-max items-center gap-x-16"
              initial={{ x: 0 }}
              animate={{ x: '-33.33%' }}
              transition={{ duration: 28, ease: 'linear', repeat: Infinity }}
            >
              {all.map((item, idx) => (
                <Item key={`${item.name}-${idx}`} name={item.name} />
              ))}
            </motion.div>
          )}
        </div>
      </div>
    </section>
  );
}
