import { notFound, redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { ASSESSMENT_SECTIONS } from "@/lib/assessment/sections";
import { ReviewCard } from "@/components/assessment/review-card";
import { SubmitAssessmentButton } from "@/components/assessment/submit-assessment-button";
import { Typography } from "@/components/ui/typography";
import { Badge } from "@/components/ui/badge";
import type { AnswerValue } from "@/components/assessment/question-card";

interface ReviewPageProps {
  params: Promise<{ id: string }>;
}

export default async function AssessmentReviewPage({ params }: ReviewPageProps) {
  const { id } = await params;
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const assessment = await db.assessment.findUnique({
    where: { id },
    include: { child: true, answers: true },
  });

  if (!assessment || assessment.child.userId !== session.user.id) {
    notFound();
  }

  const answers: Record<string, AnswerValue> = {};
  for (const a of assessment.answers) {
    answers[a.questionId] = a.answer as AnswerValue;
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6 pb-12">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <Typography variant="h3" as="h1" className="font-bold text-foreground">
            Review Assessment
          </Typography>
          <Typography variant="bodySmall" className="mt-1 text-muted-foreground">
            {assessment.child.firstName}&apos;s assessment — review before submitting.
          </Typography>
        </div>
        {assessment.status === "SUBMITTED" && (
          <Badge variant="success" size="md">
            Submitted
          </Badge>
        )}
      </div>

      {ASSESSMENT_SECTIONS.map((section) => (
        <ReviewCard key={section.id} sectionId={section.id} assessmentId={assessment.id} answers={answers} />
      ))}

      {assessment.status !== "SUBMITTED" && (
        <SubmitAssessmentButton assessmentId={assessment.id} childName={assessment.child.firstName} />
      )}
    </div>
  );
}