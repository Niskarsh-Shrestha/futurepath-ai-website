import { Card } from "@/components/ui/card";
import { Typography } from "@/components/ui/typography";
import { ChildForm } from "@/components/children/child-form";

export default function NewChildPage() {
  return (
    <div className="mx-auto max-w-2xl">
      <Typography variant="h3" as="h1" className="font-bold text-foreground">
        Add Child
      </Typography>
      <Card className="mt-6 rounded-2xl border border-border bg-white p-7 shadow-sm">
        <ChildForm />
      </Card>
    </div>
  );
}