import { useId } from 'react';

export function Section({ title, children }: { title: string; children: React.ReactNode }) {
  const id = useId();

  return (
    <section aria-labelledby={id} className="md:border-l md:border-border/50 md:pl-6">
      <div className="grid max-w-5xl grid-cols-1 items-baseline gap-y-8 md:grid-cols-4">
        <h2 id={id} className="text-sm/6 font-semibold text-fg">
          {title}
        </h2>
        <div className="md:col-span-3">{children}</div>
      </div>
    </section>
  );
}
