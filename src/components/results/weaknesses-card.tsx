import { TrendingDown } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Typography } from "@/components/ui/typography";

interface WeaknessesCardProps {
  weaknesses: string[];
}

export function WeaknessesCard({ weaknesses }: WeaknessesCardProps) {
  return (
    <Card className="rounded-2xl border border-warning/20 bg-white p-6 shadow-sm">
      <div className="flex items-center gap-2">
        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-warning/10">
          <TrendingDown className="h-4.5 w-4.5 text-warning" aria-hidden="true" />
        </span>
        <Typography variant="title" as="h3" className="font-semibold text-foreground">
          Growth Areas
        </Typography>
      </div>
      <ul className="mt-4 space-y-2.5">
        {weaknesses.map((weakness) => (
          <li key={weakness} className="flex items-start gap-2.5">
            <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-warning" aria-hidden="true" />
            <Typography variant="bodySmall" className="text-foreground">
              {weakness}
            </Typography>
          </li>
        ))}
      </ul>
    </Card>
  );
}