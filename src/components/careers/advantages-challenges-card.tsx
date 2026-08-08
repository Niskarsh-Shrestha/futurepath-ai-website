import { ThumbsUp, AlertCircle } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Typography } from "@/components/ui/typography";

interface AdvantagesChallengesCardProps {
  advantages: string[];
  challenges: string[];
}

export function AdvantagesChallengesCard({ advantages, challenges }: AdvantagesChallengesCardProps) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      <Card className="rounded-2xl border border-success/20 bg-success/5 p-6 shadow-sm">
        <div className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-success/15">
            <ThumbsUp className="h-4 w-4 text-success" aria-hidden="true" />
          </span>
          <Typography variant="title" as="h3" className="font-semibold text-foreground">
            Advantages
          </Typography>
        </div>
        <ul className="mt-4 space-y-2.5">
          {advantages.map((item, i) => (
            <li key={i} className="flex gap-2">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-success" aria-hidden="true" />
              <Typography variant="bodySmall" className="leading-relaxed text-muted-foreground">
                {item}
              </Typography>
            </li>
          ))}
        </ul>
      </Card>

      <Card className="rounded-2xl border border-warning/20 bg-warning/5 p-6 shadow-sm">
        <div className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-warning/15">
            <AlertCircle className="h-4 w-4 text-warning" aria-hidden="true" />
          </span>
          <Typography variant="title" as="h3" className="font-semibold text-foreground">
            Challenges
          </Typography>
        </div>
        <ul className="mt-4 space-y-2.5">
          {challenges.map((item, i) => (
            <li key={i} className="flex gap-2">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-warning" aria-hidden="true" />
              <Typography variant="bodySmall" className="leading-relaxed text-muted-foreground">
                {item}
              </Typography>
            </li>
          ))}
        </ul>
      </Card>
    </div>
  );
}