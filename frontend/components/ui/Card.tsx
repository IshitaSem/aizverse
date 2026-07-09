import type { HTMLAttributes } from "react";
import clsx from "clsx";

export function Card({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={clsx("rounded-xl border border-stadium-line bg-stadium-panel/80 backdrop-blur-sm", className)}
      {...props}
    />
  );
}
