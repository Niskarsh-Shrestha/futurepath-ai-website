import { Bot, Loader2 } from "lucide-react";
import { Typography } from "@/components/ui/typography";

interface AssistantResponseProps {
  answer: string | null;
  isLoading: boolean;
}

export function AssistantResponse({ answer, isLoading }: AssistantResponseProps) {
  if (!isLoading && !answer) return null;

  return (
    <div className="mt-5 rounded-xl border border-border bg-secondary/40 p-5">
      <div className="flex items-center gap-2">
        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/10">
          <Bot className="h-3.5 w-3.5 text-primary" aria-hidden="true" />
        </span>
        <Typography variant="caption" className="font-semibold uppercase tracking-wider text-muted-foreground">
          Answer
        </Typography>
      </div>

      {isLoading ? (
        <div className="mt-3 flex items-center gap-2 text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
          <Typography variant="bodySmall">Thinking...</Typography>
        </div>
      ) : (
        <Typography variant="bodySmall" className="mt-3 leading-relaxed text-foreground">
          {answer}
        </Typography>
      )}
    </div>
  );
}