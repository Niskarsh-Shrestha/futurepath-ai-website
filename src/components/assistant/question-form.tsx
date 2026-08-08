"use client";

import { useState, useTransition } from "react";
import { Send } from "lucide-react";
import { askAssistant } from "@/actions/ai/ask-assistant";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast";
import { SuggestedQuestions } from "@/components/assistant/suggested-questions";
import { AssistantResponse } from "@/components/assistant/assistant-response";

export function QuestionForm() {
  const { showToast } = useToast();
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleAsk() {
    if (!question.trim()) {
      showToast("Please enter a question", "error");
      return;
    }

    startTransition(async () => {
      const result = await askAssistant(question);
      if (!result.success) {
        showToast(result.error ?? "Something went wrong", "error");
        return;
      }
      setAnswer(result.answer ?? null);
    });
  }

  return (
    <Card className="rounded-2xl border border-border bg-white p-6 shadow-sm">
      <SuggestedQuestions onSelect={setQuestion} />

      <div className="mt-5">
        <Textarea
          label="Your question"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Ask anything about your child's assessment, analysis, career recommendations, or learning roadmap..."
          rows={4}
        />
      </div>

      <Button
        variant="primary"
        size="md"
        className="mt-4"
        rightIcon={<Send className="h-4 w-4" />}
        loading={isPending}
        onClick={handleAsk}
      >
        Ask
      </Button>

      <AssistantResponse answer={answer} isLoading={isPending} />
    </Card>
  );
}