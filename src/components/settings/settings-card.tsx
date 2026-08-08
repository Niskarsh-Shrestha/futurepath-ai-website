import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface SettingsCardProps {
  children: React.ReactNode;
  className?: string;
}

export function SettingsCard({ children, className }: SettingsCardProps) {
  return (
    <Card className={cn("rounded-2xl border border-border bg-white p-6 shadow-sm", className)}>
      {children}
    </Card>
  );
}