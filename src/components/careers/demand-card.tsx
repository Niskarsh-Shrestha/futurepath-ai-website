import { TrendingUp } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Typography } from "@/components/ui/typography";
import { DEMAND_DESCRIPTIONS, getDemandBadgeVariant, type FutureDemand } from "@/lib/careers/demand-data";

interface DemandCardProps {
  futureDemand: FutureDemand;
}

export function DemandCard({ futureDemand }: DemandCardProps) {
  return (
    <Card className="rounded-2xl border border-border bg-white p-5 shadow-sm">
      <div className="flex items-center gap-2">
        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10">
          <TrendingUp className="h-4.5 w-4.5 text-primary" aria-hidden="true" />
        </span>
        <Typography variant="caption" className="font-semibold uppercase tracking-wider text-muted-foreground">
          Future Demand
        </Typography>
      </div>
      <div className="mt-2">
        <Badge variant={getDemandBadgeVariant(futureDemand)} size="md">
          {futureDemand}
        </Badge>
      </div>
      <Typography variant="bodySmall" className="mt-2 leading-relaxed text-muted-foreground">
        {DEMAND_DESCRIPTIONS[futureDemand]}
      </Typography>
    </Card>
  );
}