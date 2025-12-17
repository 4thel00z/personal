'use client';

import { useEffect, useMemo, useState } from 'react';

function clamp01(value: number): number {
  return Math.max(0, Math.min(1, value));
}

export function ReadingProgressBar({
  targetId,
  topOffsetPx = 0,
}: {
  targetId: string;
  topOffsetPx?: number;
}) {
  const [progress, setProgress] = useState(0);

  const style = useMemo(() => ({ transform: `scaleX(${progress})` }), [progress]);

  useEffect(() => {
    let raf = 0;

    const compute = () => {
      const el = document.getElementById(targetId);
      if (!el) {
        setProgress(0);
        return;
      }

      const top = el.offsetTop - topOffsetPx;
      const height = el.offsetHeight;
      const viewport = window.innerHeight;

      const maxScroll = Math.max(1, height - viewport);
      const y = window.scrollY - top;
      setProgress(clamp01(y / maxScroll));
    };

    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(compute);
    };

    compute();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, [targetId, topOffsetPx]);

  return (
    <div className="fixed inset-x-0 top-0 z-[60] h-1 bg-canvas/40">
      <div
        className="h-full origin-left bg-accent"
        style={style}
        role="progressbar"
        aria-label="Reading progress"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(progress * 100)}
      />
    </div>
  );
}
