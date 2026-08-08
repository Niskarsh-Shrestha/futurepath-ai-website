import { Briefcase } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Typography } from "@/components/ui/typography";

interface CareerMatchCardProps {
  career: string;
  score: number;
  reason: string;
  rank: number;
}

export function CareerMatchCard({ career, score, reason, rank }: CareerMatchCardProps) {
  return (
    <Card className="flex items-start gap-4 rounded-2xl border border-border bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
        {rank}
      </span>
      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-2">
          <Typography variant="title" as="h4" className="font-semibold text-foreground">
            {career}
          </Typography>
          <span className="flex shrink-0 items-center gap-1 text-sm font-bold text-primary">
            <Briefcase className="h-3.5 w-3.5" aria-hidden="true" />
            {score}%
          </span>
        </div>
        <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-secondary">
          <div className="h-full rounded-full bg-primary" style={{ width: `${score}%` }} />
        </div>
        <Typography variant="bodySmall" className="mt-2 leading-relaxed text-muted-foreground">
          {reason}
        </Typography>
      </div>
    </Card>
  );
}