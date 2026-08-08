import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full font-semibold transition-colors",
  {
    variants: {
      variant: {
        default: "bg-secondary text-foreground",
        primary: "bg-primary text-primary-foreground",
        subtle: "bg-primary/10 text-primary",
        success: "bg-success/10 text-success",
        warning: "bg-warning/10 text-warning",
        destructive: "bg-destructive/10 text-destructive",
        outline: "border border-border bg-white text-foreground",
      },
      size: {
        sm: "px-2 py-0.5 text-[11px]",
        md: "px-3 py-1 text-xs",
      },
    },
    defaultVariants: { variant: "default", size: "md" },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, size, ...props }: BadgeProps) {
  return <span className={cn(badgeVariants({ variant, size }), className)} {...props} />;
}

export { Badge, badgeVariants };