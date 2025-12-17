import type React from 'react';
import { cn } from '@/src/lib/cn';

export function Container({
  className,
  children,
  size = 'wide',
  ...props
}: React.ComponentPropsWithoutRef<'div'> & {
  size?: 'wide' | 'content' | 'narrow';
}) {
  const inner = size === 'narrow' ? 'max-w-3xl' : size === 'content' ? 'max-w-5xl' : 'max-w-7xl';

  return (
    <div className={cn('container-page', className)} {...props}>
      <div className={cn('mx-auto w-full', inner)}>{children}</div>
    </div>
  );
}
