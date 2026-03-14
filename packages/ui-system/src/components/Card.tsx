import * as React from "react";
import { cn } from "../lib/utils";

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "rounded-2xl border border-gray-200 bg-surface text-surface-foreground shadow-sm p-6",
        className
      )}
      {...props}
    />
  )
);
Card.displayName = "Card";

export { Card };
