import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { Card } from "@/components/ui/card";
import { Typography } from "@/components/ui/typography";
import { ChildForm } from "@/components/children/child-form";
import type { ChildInput } from "@/lib/validations/child";

interface EditChildPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditChildPage({ params }: EditChildPageProps) {
  const { id } = await params;
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const child = await db.child.findUnique({ where: { id } });
  if (!child || child.userId !== session.user.id) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-2xl">
      <Link
        href={`/dashboard/children/${child.id}`}
        className="inline-flex items-center gap-1 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
      >
        <ChevronLeft className="h-4 w-4" aria-hidden="true" />
        Back to {child.firstName}
      </Link>

      <Typography variant="h3" as="h1" className="mt-4 font-bold text-foreground">
        Edit {child.firstName}&apos;s Profile
      </Typography>
      <Card className="mt-6 rounded-2xl border border-border bg-white p-7 shadow-sm">
        <ChildForm
          childId={child.id}
          defaultValues={{
            firstName: child.firstName,
            lastName: child.lastName,
            dateOfBirth: child.dateOfBirth.toISOString().split("T")[0],
            gender: (child.gender as ChildInput["gender"]) ?? undefined,
            school: child.school ?? "",
            grade: child.grade ?? "",
            country: child.country ?? "",
            learningStyle: (child.learningStyle as ChildInput["learningStyle"]) ?? undefined,
            interests: child.interests,
            strengths: child.strengths,
          }}
        />
      </Card>
    </div>
  );
}