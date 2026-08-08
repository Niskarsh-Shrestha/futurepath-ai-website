import { notFound, redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { AssessmentRunner } from "@/components/assessment/assessment-runner";
import { ASSESSMENT_SECTIONS } from "@/lib/assessment/sections";
import type { AnswerValue } from "@/components/assessment/question-card";

interface AssessmentPageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ section?: string }>;
}

export default async function AssessmentQuestionPage({ params, searchParams }: AssessmentPageProps) {
  const { id } = await params;
  const { section } = await searchParams;
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const assessment = await db.assessment.findUnique({
    where: { id },
    include: { child: true, answers: true },
  });

  if (!assessment || assessment.child.userId !== session.user.id) {
    notFound();
  }

  if (assessment.status === "SUBMITTED") {
    redirect(`/dashboard/assessment/${id}/review`);
  }

  const initialAnswers: Record<string, AnswerValue> = {};
  for (const a of assessment.answers) {
    initialAnswers[a.questionId] = a.answer as AnswerValue;
  }

  const isValidSection = section && ASSESSMENT_SECTIONS.some((s) => s.id === section);

  return (
    <AssessmentRunner
      assessmentId={assessment.id}
      childName={`${assessment.child.firstName} ${assessment.child.lastName}`}
      initialAnswers={initialAnswers}
      initialSectionId={isValidSection ? section : "personal-info"}
    />
  );
}