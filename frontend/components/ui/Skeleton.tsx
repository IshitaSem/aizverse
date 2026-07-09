import clsx from "clsx";

/** Loading placeholder. Respects prefers-reduced-motion via the `motion-safe` variant. */
export function Skeleton({ className }: { className?: string }) {
  return (
    <div
      role="status"
      aria-label="Loading"
      className={clsx("motion-safe:animate-pulse rounded-md bg-stadium-line/60", className)}
    />
  );
}
