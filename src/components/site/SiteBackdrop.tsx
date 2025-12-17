export function SiteBackdrop() {
  return (
    <div className="pointer-events-none fixed inset-0 flex justify-center sm:px-8">
      <div className="flex w-full max-w-7xl lg:px-8">
        <div className="w-full bg-canvas ring-1 ring-border/40" />
      </div>
    </div>
  );
}
