import { Card } from "@/components/ui/card";
import { Typography } from "@/components/ui/typography";
import { cn } from "@/lib/utils";

interface SummaryCardProps {
  label: string;
  value: string;
  icon: React.ComponentType<{ className?: string }>;
  tone?: "default" | "success" | "warning";
}

const TONE_STYLES: Record<NonNullable<SummaryCardProps["tone"]>, string> = {
  default: "bg-primary/10 text-primary",
  success: "bg-success/10 text-success",
  warning: "bg-warning/10 text-warning",
};

export function SummaryCard({ label, value, icon: Icon, tone = "default" }: SummaryCardProps) {
  return (
    <Card className="rounded-2xl border border-border bg-white p-5 shadow-sm">
      <div className="flex items-center gap-2">
        <span className={cn("flex h-9 w-9 items-center justify-center rounded-full", TONE_STYLES[tone])}>
          <Icon className="h-4.5 w-4.5" aria-hidden="true" />
        </span>
        <Typography variant="caption" className="font-semibold uppercase tracking-wider text-muted-foreground">
          {label}
        </Typography>
      </div>
      <Typography variant="title" as="p" className="mt-2 font-bold text-foreground">
        {value}
      </Typography>
    </Card>
  );
}