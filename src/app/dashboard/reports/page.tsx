import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { FileText, ArrowRight, ClipboardList } from "lucide-react";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { getLatestRecommendations } from "@/lib/careers/get-latest-recommendations";
import { EmptyState } from "@/components/ui/empty-state";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Container } from "@/components/common/container";
import { Typography } from "@/components/ui/typography";

interface ReportsIndexPageProps {
  searchParams: Promise<{ childId?: string }>;
}

export default async function ReportsIndexPage({ searchParams }: ReportsIndexPageProps) {
  const { childId } = await searchParams;
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  if (!childId) {
    const firstChild = await db.child.findFirst({
      where: { userId: session.user.id },
      orderBy: { createdAt: "asc" },
    });
    if (!firstChild) redirect("/dashboard");
    redirect(`/dashboard/reports?childId=${firstChild.id}`);
  }

  const child = await db.child.findUnique({ where: { id: childId } });
  if (!child || child.userId !== session.user.id) {
    notFound();
  }

  const { analysis } = await getLatestRecommendations(child.id);

  if (!analysis || analysis.recommendations.length === 0) {
    return (
      <Container className="max-w-2xl py-16">
        <EmptyState
          icon={ClipboardList}
          title="No career recommendations yet"
          description={`Generate career recommendations for ${child.firstName} before creating a report.`}
        />
        <div className="mt-4 text-center">
          <Button variant="outline" size="sm" asChild>
            <Link href={`/dashboard/careers?childId=${child.id}`}>Go to Careers</Link>
          </Button>
        </div>
      </Container>
    );
  }

  const recommendationIds = analysis.recommendations.map((r) => r.id);
  const reports = await db.careerReport.findMany({
    where: { recommendationId: { in: recommendationIds } },
  });
  const reportByRecommendationId = new Map(reports.map((r) => [r.recommendationId, r]));

  const sortedRecommendations = [...analysis.recommendations].sort((a, b) => b.matchScore - a.matchScore);

  return (
    <Container className="max-w-4xl space-y-6 py-10">
      <div>
        <Typography variant="h3" as="h1" className="font-bold text-foreground">
          Career Reports
        </Typography>
        <Typography variant="bodySmall" className="mt-1 text-muted-foreground">
          Downloadable reports for {child.firstName}&apos;s recommended career paths
        </Typography>
      </div>

      <div className="space-y-3">
        {sortedRecommendations.map((rec) => {
          const report = reportByRecommendationId.get(rec.id);
          return (
            <Card
              key={rec.id}
              className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-border bg-white p-5 shadow-sm"
            >
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10">
                  <FileText className="h-4.5 w-4.5 text-primary" aria-hidden="true" />
                </span>
                <div>
                  <Typography variant="bodySmall" className="font-semibold text-foreground">
                    {rec.careerTitle}
                  </Typography>
                  <div className="mt-1 flex items-center gap-2">
                    <Badge variant="subtle" size="sm">{rec.matchScore}% match</Badge>
                    {report ? (
                      <Badge variant="success" size="sm">Report ready</Badge>
                    ) : (
                      <Badge variant="outline" size="sm">Not generated</Badge>
                    )}
                  </div>
                </div>
              </div>
              <Button variant={report ? "outline" : "primary"} size="sm" rightIcon={<ArrowRight className="h-3.5 w-3.5" />} asChild>
                <Link href={`/dashboard/reports/${rec.id}`}>{report ? "View Report" : "Generate Report"}</Link>
              </Button>
            </Card>
          );
        })}
      </div>
    </Container>
  );
}