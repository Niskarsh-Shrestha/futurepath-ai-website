import type { LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Typography } from "@/components/ui/typography";
import { cn } from "@/lib/utils";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  actionLabel,
  onAction,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-white px-6 py-12 text-center",
        className
      )}
    >
      <span className="flex h-14 w-14 items-center justify-center rounded-full bg-secondary">
        <Icon className="h-6 w-6 text-muted-foreground" aria-hidden="true" />
      </span>
      <Typography variant="title" as="h3" className="mt-4 font-semibold text-foreground">
        {title}
      </Typography>
      <Typography variant="bodySmall" className="mt-1.5 max-w-xs leading-relaxed text-muted-foreground">
        {description}
      </Typography>
      {actionLabel && onAction && (
        <Button variant="primary" size="md" className="mt-6" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
}