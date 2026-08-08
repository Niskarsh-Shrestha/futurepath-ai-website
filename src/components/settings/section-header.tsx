import { Typography } from "@/components/ui/typography";

interface SectionHeaderProps {
  title: string;
  description?: string;
}

export function SectionHeader({ title, description }: SectionHeaderProps) {
  return (
    <div>
      <Typography variant="title" as="h2" className="font-semibold text-foreground">
        {title}
      </Typography>
      {description && (
        <Typography variant="bodySmall" className="mt-1 text-muted-foreground">
          {description}
        </Typography>
      )}
    </div>
  );
}