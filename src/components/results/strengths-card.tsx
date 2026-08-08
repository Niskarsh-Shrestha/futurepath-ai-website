import { TrendingUp } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Typography } from "@/components/ui/typography";

interface StrengthsCardProps {
  strengths: string[];
}

export function StrengthsCard({ strengths }: StrengthsCardProps) {
  return (
    <Card className="rounded-2xl border border-success/20 bg-white p-6 shadow-sm">
      <div className="flex items-center gap-2">
        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-success/10">
          <TrendingUp className="h-4.5 w-4.5 text-success" aria-hidden="true" />
        </span>
        <Typography variant="title" as="h3" className="font-semibold text-foreground">
          Strengths
        </Typography>
      </div>
      <ul className="mt-4 space-y-2.5">
        {strengths.map((strength) => (
          <li key={strength} className="flex items-start gap-2.5">
            <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-success" aria-hidden="true" />
            <Typography variant="bodySmall" className="text-foreground">
              {strength}
            </Typography>
          </li>
        ))}
      </ul>
    </Card>
  );
}