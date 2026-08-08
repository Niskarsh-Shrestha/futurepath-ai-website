"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2 } from "lucide-react";
import { submitAssessment } from "@/actions/assessment/submit-assessment";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";

interface SubmitAssessmentButtonProps {
  assessmentId: string;
  childName: string;
}

export function SubmitAssessmentButton({ assessmentId, childName }: SubmitAssessmentButtonProps) {
  const router = useRouter();
  const { showToast } = useToast();
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  function handleSubmit() {
    startTransition(async () => {
      const result = await submitAssessment(assessmentId);
      if (!result.success) {
        showToast(result.error ?? "Failed to submit assessment", "error");
        setOpen(false);
        return;
      }
      setOpen(false);
      showToast("Assessment submitted successfully");
      router.push(`/dashboard/results/${assessmentId}`);
    });
  }

  return (
    <div className="flex justify-end border-t border-border pt-6">
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant="primary" size="lg" leftIcon={<CheckCircle2 className="h-4 w-4" />}>
            Submit Assessment
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Submit {childName}&apos;s assessment?</DialogTitle>
            <DialogDescription>
              Once submitted, this assessment is locked and can no longer be edited. Make sure
              you&apos;ve reviewed all answers above before continuing.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline" size="md">
                Cancel
              </Button>
            </DialogClose>
            <Button variant="primary" size="md" loading={isPending} onClick={handleSubmit}>
              Confirm Submit
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}