"use client";

import { useState, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { saveAnswer } from "@/actions/assessment/save-answer";
import { AssessmentLayout } from "@/components/assessment/assessment-layout";
import { AssessmentSidebar } from "@/components/assessment/assessment-sidebar";
import { AssessmentProgress, type SaveStatus } from "@/components/assessment/assessment-progress";
import { QuestionCard, type AnswerValue } from "@/components/assessment/question-card";
import { NavigationFooter } from "@/components/assessment/navigation-footer";
import { useToast } from "@/components/ui/toast";
import { Typography } from "@/components/ui/typography";
import {
  ASSESSMENT_SECTIONS,
} from "@/lib/assessment/sections";
import {
  getQuestionsBySection,
  getNextSectionId,
  getPreviousSectionId,
  isLastSection,
  calculateProgress,
  getSectionProgress,
  isSectionComplete,
} from "@/lib/assessment/assessment-engine";
import { validateAnswerForType } from "@/lib/validations/assessment";

interface AssessmentRunnerProps {
  assessmentId: string;
  childName: string;
  initialAnswers: Record<string, AnswerValue>;
  initialSectionId: string;
}

export function AssessmentRunner({
  assessmentId,
  childName,
  initialAnswers,
  initialSectionId,
}: AssessmentRunnerProps) {
  const router = useRouter();
  const { showToast } = useToast();

  const [activeSectionId, setActiveSectionId] = useState(initialSectionId);
  const [answers, setAnswers] = useState<Record<string, AnswerValue>>(initialAnswers);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saveStatus, setSaveStatus] = useState<SaveStatus>("saved");
  const saveTimers = useRef<Record<string, ReturnType<typeof setTimeout>>>({});

  const answeredIds = new Set(
    Object.entries(answers)
      .filter(([, v]) => v !== null && v !== "" && !(Array.isArray(v) && v.length === 0))
      .map(([k]) => k)
  );
  const overallProgress = calculateProgress(answeredIds);

  const sectionCompletion: Record<string, { answered: number; total: number; complete: boolean }> = {};
  for (const section of ASSESSMENT_SECTIONS) {
    const p = getSectionProgress(section.id, answeredIds);
    sectionCompletion[section.id] = { ...p, complete: isSectionComplete(section.id, answeredIds) };
  }

  const persistAnswer = useCallback(
    async (questionId: string, value: AnswerValue) => {
      setSaveStatus("saving");
      const result = await saveAnswer({ assessmentId, questionId, answer: value });
      if (!result.success) {
        setSaveStatus("unsaved");
        showToast(result.error ?? "Failed to save answer", "error");
        return;
      }
      setSaveStatus("saved");
    },
    [assessmentId, showToast]
  );

  function handleAnswerChange(questionId: string, value: AnswerValue) {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
    setErrors((prev) => {
      const next = { ...prev };
      delete next[questionId];
      return next;
    });
    setSaveStatus("unsaved");

    if (saveTimers.current[questionId]) clearTimeout(saveTimers.current[questionId]);
    saveTimers.current[questionId] = setTimeout(() => {
      persistAnswer(questionId, value);
    }, 700);
  }

  function flushPendingSaves() {
    Object.values(saveTimers.current).forEach((timer) => clearTimeout(timer));
    saveTimers.current = {};
  }

  async function persistAllAnswers() {
  // Cancel pending debounce timers because we're saving everything now.
  flushPendingSaves();

  await Promise.all(
    Object.entries(answers).map(([questionId, value]) =>
      saveAnswer({
        assessmentId,
        questionId,
        answer: value,
      })
    )
  );
}

  function validateCurrentSection(): boolean {
    const questions = getQuestionsBySection(activeSectionId);
    const newErrors: Record<string, string> = {};

    for (const q of questions) {
      const error = validateAnswerForType(q.type, answers[q.id] ?? null, q.required);
      if (error) newErrors[q.id] = error;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  function handleNext() {
    if (!validateCurrentSection()) {
      showToast("Please answer all required questions before continuing", "error");
      return;
    }
    const next = getNextSectionId(activeSectionId);
    if (next) {
      setActiveSectionId(next);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }

  function handlePrevious() {
    const prev = getPreviousSectionId(activeSectionId);
    if (prev) {
      setActiveSectionId(prev);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }

async function handleReview() {
  if (!validateCurrentSection()) {
    showToast("Please answer all required questions before continuing", "error");
    return;
  }

  await persistAllAnswers();

  router.push(`/dashboard/assessment/${assessmentId}/review`);
}
async function handleSaveDraft() {
  setSaveStatus("saving");

  await persistAllAnswers();

  setSaveStatus("saved");
  showToast("Draft saved");

  router.push("/dashboard/assessment");
}

async function handleExit() {
  await persistAllAnswers();

  router.push("/dashboard/assessment");
}

  const questions = getQuestionsBySection(activeSectionId);
  const activeSection = ASSESSMENT_SECTIONS.find((s) => s.id === activeSectionId);

  return (
    <AssessmentLayout
      sidebar={
        <AssessmentSidebar
          activeSectionId={activeSectionId}
          sectionCompletion={sectionCompletion}
          onSelectSection={(id) => {
            setActiveSectionId(id);
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
        />
      }
      progress={
        <div>
          <Typography variant="caption" className="mb-1.5 block text-muted-foreground">
            Assessment for {childName}
          </Typography>
          <AssessmentProgress percent={overallProgress} saveStatus={saveStatus} />
        </div>
      }
      footer={
        <NavigationFooter
          onPrevious={handlePrevious}
          onNext={handleNext}
          onSaveDraft={handleSaveDraft}
          onExit={handleExit}
          onReview={handleReview}
          isFirstSection={activeSection?.order === 1}
          isLastSection={isLastSection(activeSectionId)}
        />
      }
    >
      <Typography variant="h4" as="h2" className="font-bold text-foreground">
        {activeSection?.title}
      </Typography>
      <Typography variant="bodySmall" className="mb-2 text-muted-foreground">
        {activeSection?.description}
      </Typography>

      {questions.map((question, index) => (
        <QuestionCard
          key={question.id}
          question={question}
          index={index}
          value={answers[question.id] ?? null}
          onChange={(value) => handleAnswerChange(question.id, value)}
          error={errors[question.id]}
        />
      ))}
    </AssessmentLayout>
  );
}