import Link from "next/link";
import { redirect } from "next/navigation";
import { Users } from "lucide-react";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { SectionCard, type ChildAssessmentSummary } from "@/components/assessment/section-card";
import { EmptyState } from "@/components/ui/empty-state";
import { Button } from "@/components/ui/button";
import { Typography } from "@/components/ui/typography";

export default async function AssessmentLandingPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const children = await db.child.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "asc" },
    include: {
      assessments: {
        orderBy: { createdAt: "desc" },
        take: 1,
      },
    },
  });

  if (children.length === 0) {
    return (
      <div className="mx-auto max-w-lg">
        <EmptyState
          icon={Users}
          title="No children added yet"
          description="Add a child profile first so you can complete a career assessment for them."
        />
        <div className="mt-4 text-center">
          <Button variant="outline" size="sm" asChild>
            <Link href="/dashboard/children/new">Add Child</Link>
          </Button>
        </div>
      </div>
    );
  }

  const summaries: ChildAssessmentSummary[] = children.map((child) => {
    const latest = child.assessments[0];
    return {
      childId: child.id,
      childName: `${child.firstName} ${child.lastName}`,
      childImage: child.profileImage,
      assessmentId: latest?.id ?? null,
      status: latest?.status ?? null,
      progress: latest?.progress ?? 0,
    };
  });

  return (
    <div className="space-y-6">
      <div>
        <Typography variant="h3" as="h1" className="font-bold text-foreground">
          Career Assessment
        </Typography>
        <Typography variant="bodySmall" className="mt-1 text-muted-foreground">
          Complete an assessment for each child to help build their profile.
        </Typography>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {summaries.map((summary) => (
          <SectionCard key={summary.childId} summary={summary} />
        ))}
      </div>
    </div>
  );
}