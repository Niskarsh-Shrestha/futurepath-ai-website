import Link from "next/link";
import { Users, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Typography } from "@/components/ui/typography";

export function EmptyChildren() {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-white px-6 py-16 text-center">
      <span className="flex h-14 w-14 items-center justify-center rounded-full bg-secondary">
        <Users className="h-6 w-6 text-muted-foreground" aria-hidden="true" />
      </span>
      <Typography variant="title" as="h3" className="mt-4 font-semibold text-foreground">
        No children added yet
      </Typography>
      <Typography variant="bodySmall" className="mt-1.5 max-w-xs leading-relaxed text-muted-foreground">
        Add your first child to start building their profile and getting personalised
        recommendations.
      </Typography>
      <Button variant="primary" size="md" className="mt-6" leftIcon={<Plus className="h-4 w-4" />} asChild>
        <Link href="/dashboard/children/new">Add Child</Link>
      </Button>
    </div>
  );
}