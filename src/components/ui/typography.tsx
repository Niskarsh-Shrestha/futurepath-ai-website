import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const typographyVariants = cva("text-foreground", {
  variants: {
    variant: {
      display: "text-6xl font-bold tracking-tight",
      h1: "text-4xl font-bold tracking-tight",
      h2: "text-3xl font-semibold tracking-tight",
      h3: "text-2xl font-semibold tracking-tight",
      h4: "text-xl font-semibold tracking-tight",
      title: "text-lg font-medium",
      subtitle: "text-base font-medium text-muted-foreground",
      body: "text-base leading-7",
      bodySmall: "text-sm leading-6",
      caption: "text-xs text-muted-foreground",
      overline: "text-xs font-semibold uppercase tracking-wider text-muted-foreground",
      muted: "text-sm text-muted-foreground",
      code: "font-mono text-sm bg-muted px-1.5 py-0.5 rounded",
      link: "text-primary underline-offset-4 hover:underline",
    },
  },
  defaultVariants: {
    variant: "body",
  },
});

const defaultElementMap: Record<string, React.ElementType> = {
  display: "h1",
  h1: "h1",
  h2: "h2",
  h3: "h3",
  h4: "h4",
  title: "p",
  subtitle: "p",
  body: "p",
  bodySmall: "p",
  caption: "span",
  overline: "span",
  muted: "span",
  code: "code",
  link: "a",
};

export interface TypographyProps
  extends React.HTMLAttributes<HTMLElement>,
    VariantProps<typeof typographyVariants> {
  as?: React.ElementType;
}

export function Typography({ className, variant, as, ...props }: TypographyProps) {
  const Component = as ?? defaultElementMap[variant ?? "body"] ?? "p";
  return (
    <Component className={cn(typographyVariants({ variant }), className)} {...props} />
  );
}

export { typographyVariants };