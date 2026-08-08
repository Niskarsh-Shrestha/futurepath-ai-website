import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { ChevronLeft, Pencil, School, GraduationCap, Globe, Brain } from "lucide-react";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { Card } from "@/components/ui/card";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Typography } from "@/components/ui/typography";
import { DeleteChildDialog } from "@/components/children/delete-child-dialog";
import { calculateAge } from "@/lib/utils/age";

interface ChildDetailsPageProps {
  params: Promise<{ id: string }>;
}

export default async function ChildDetailsPage({ params }: ChildDetailsPageProps) {
  const { id } = await params;
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const child = await db.child.findUnique({ where: { id } });

  if (!child || child.userId !== session.user.id) {
    notFound();
  }

  const fullName = `${child.firstName} ${child.lastName}`;
  const initials = `${child.firstName[0] ?? ""}${child.lastName[0] ?? ""}`.toUpperCase();

  return (
    <div className="mx-auto max-w-2xl">
      <Link
        href="/dashboard/children"
        className="inline-flex items-center gap-1 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
      >
        <ChevronLeft className="h-4 w-4" aria-hidden="true" />
        Back to Children
      </Link>

      <Card className="mt-4 rounded-2xl border border-border bg-white p-7 shadow-sm">
        <div className="flex flex-col items-start gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <Avatar alt={fullName} fallback={initials} src={child.profileImage ?? undefined} size="xl" />
            <div>
              <Typography variant="h4" as="h1" className="font-bold text-foreground">
                {fullName}
              </Typography>
              <Typography variant="bodySmall" className="text-muted-foreground">
                {calculateAge(child.dateOfBirth)} years old
              </Typography>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" leftIcon={<Pencil className="h-4 w-4" />} asChild>
              <Link href={`/dashboard/children/${child.id}/edit`}>Edit</Link>
            </Button>
            <DeleteChildDialog
              childId={child.id}
              childName={fullName}
              redirectTo="/dashboard/children"
              variant="full"
            />
          </div>
        </div>

        <div className="mt-7 grid grid-cols-1 gap-4 border-t border-border pt-6 sm:grid-cols-2">
          <InfoRow icon={School} label="School" value={child.school || "Not provided"} />
          <InfoRow icon={GraduationCap} label="Grade" value={child.grade || "Not provided"} />
          <InfoRow icon={Globe} label="Country" value={child.country || "Not provided"} />
          <InfoRow icon={Brain} label="Learning Style" value={child.learningStyle || "Not provided"} />
        </div>

        <div className="mt-6 border-t border-border pt-6">
          <Typography variant="caption" className="font-semibold uppercase tracking-wider text-muted-foreground">
            Interests
          </Typography>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {child.interests.length > 0 ? (
              child.interests.map((interest) => (
                <Badge key={interest} variant="subtle" size="sm">
                  {interest}
                </Badge>
              ))
            ) : (
              <Typography variant="bodySmall" className="text-muted-foreground">
                None added yet
              </Typography>
            )}
          </div>
        </div>

        <div className="mt-6 border-t border-border pt-6">
          <Typography variant="caption" className="font-semibold uppercase tracking-wider text-muted-foreground">
            Strengths
          </Typography>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {child.strengths.length > 0 ? (
              child.strengths.map((strength) => (
                <Badge key={strength} variant="success" size="sm">
                  {strength}
                </Badge>
              ))
            ) : (
              <Typography variant="bodySmall" className="text-muted-foreground">
                None added yet
              </Typography>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
}

function InfoRow({ icon: Icon, label, value }: { icon: typeof School; label: string; value: string }) {
  return (
    <div className="flex items-center gap-3">
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-secondary">
        <Icon className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
      </span>
      <div className="min-w-0">
        <Typography variant="caption" className="text-muted-foreground">
          {label}
        </Typography>
        <Typography variant="bodySmall" className="font-medium text-foreground">
          {value}
        </Typography>
      </div>
    </div>
  );
}