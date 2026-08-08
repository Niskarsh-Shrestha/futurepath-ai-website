import { CheckCircle2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Typography } from "@/components/ui/typography";

interface CareerPathStep {
  id: string;
  step: number;
  title: string;
  description: string;
}

interface CareerPathCardProps {
  steps: CareerPathStep[];
}

export function CareerPathCard({ steps }: CareerPathCardProps) {
  const sorted = [...steps].sort((a, b) => a.step - b.step);

  return (
    <Card className="rounded-2xl border border-border bg-white p-6 shadow-sm">
      <Typography variant="title" as="h3" className="font-semibold text-foreground">
        Career Path
      </Typography>
      <Typography variant="bodySmall" className="mt-1 text-muted-foreground">
        A typical route into this career
      </Typography>

      <ol className="mt-5 space-y-0">
        {sorted.map((step, index) => (
          <li key={step.id} className="relative flex gap-4 pb-7 last:pb-0">
            {index < sorted.length - 1 && (
              <span
                className="absolute left-[15px] top-8 h-full w-px bg-border"
                aria-hidden="true"
              />
            )}
            <span className="relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10">
              <CheckCircle2 className="h-4 w-4 text-primary" aria-hidden="true" />
            </span>
            <div className="pt-0.5">
              <Typography variant="bodySmall" className="font-semibold text-foreground">
                {step.title}
              </Typography>
              <Typography variant="bodySmall" className="mt-0.5 leading-relaxed text-muted-foreground">
                {step.description}
              </Typography>
            </div>
          </li>
        ))}
      </ol>
    </Card>
  );
}