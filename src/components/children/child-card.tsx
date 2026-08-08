import Link from "next/link";
import { GraduationCap, School, Eye, Pencil } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Typography } from "@/components/ui/typography";
import { DeleteChildDialog } from "@/components/children/delete-child-dialog";
import { calculateAge } from "@/lib/utils/age";

export interface ChildCardData {
  id: string;
  firstName: string;
  lastName: string;
  dateOfBirth: Date;
  school: string | null;
  grade: string | null;
  interests: string[];
  profileImage: string | null;
}

interface ChildCardProps {
  child: ChildCardData;
}

export function ChildCard({ child }: ChildCardProps) {
  const fullName = `${child.firstName} ${child.lastName}`;
  const initials = `${child.firstName[0] ?? ""}${child.lastName[0] ?? ""}`.toUpperCase();
  const age = calculateAge(child.dateOfBirth);
  const primaryInterests = child.interests.slice(0, 3);

  return (
    <Card className="group flex h-full flex-col rounded-2xl border border-border bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
      <div className="flex items-center gap-3">
        <Avatar alt={fullName} fallback={initials} src={child.profileImage ?? undefined} size="lg" />
        <div className="min-w-0">
          <Typography variant="title" as="h3" className="truncate font-semibold text-foreground">
            {fullName}
          </Typography>
          <Typography variant="caption" className="text-muted-foreground">
            {age} years old
          </Typography>
        </div>
      </div>

      <div className="mt-4 space-y-2">
        {child.school && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <School className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
            <span className="truncate">{child.school}</span>
          </div>
        )}
        {child.grade && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <GraduationCap className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
            <span>{child.grade}</span>
          </div>
        )}
      </div>

      {primaryInterests.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-1.5">
          {primaryInterests.map((interest) => (
            <Badge key={interest} variant="subtle" size="sm">
              {interest}
            </Badge>
          ))}
        </div>
      )}

      <div className="mt-auto flex gap-2 border-t border-border pt-4">
        <Button variant="outline" size="sm" className="flex-1" leftIcon={<Eye className="h-3.5 w-3.5" />} asChild>
          <Link href={`/dashboard/children/${child.id}`}>View</Link>
        </Button>
        <Button variant="outline" size="sm" className="flex-1" leftIcon={<Pencil className="h-3.5 w-3.5" />} asChild>
          <Link href={`/dashboard/children/${child.id}/edit`}>Edit</Link>
        </Button>
        <DeleteChildDialog childId={child.id} childName={fullName} variant="icon" />
      </div>
    </Card>
  );
}