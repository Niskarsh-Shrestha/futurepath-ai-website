"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { RefreshCw } from "lucide-react";
import { regenerateAnalysis } from "@/actions/ai/regenerate-analysis";
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

interface RegenerateAnalysisButtonProps {
  assessmentId: string;
}

export function RegenerateAnalysisButton({ assessmentId }: RegenerateAnalysisButtonProps) {
  const router = useRouter();
  const { showToast } = useToast();
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  function handleRegenerate() {
    startTransition(async () => {
      const result = await regenerateAnalysis(assessmentId);
      setOpen(false);
      if (!result.success) {
        showToast(result.error ?? "Failed to regenerate analysis", "error");
        return;
      }
      showToast("Analysis regenerated");
      router.refresh();
    });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="md" leftIcon={<RefreshCw className="h-4 w-4" />}>
          Regenerate Analysis
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Regenerate this analysis?</DialogTitle>
          <DialogDescription>
            This will replace the current analysis and career matches with a new AI-generated
            version based on the same assessment answers. This cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline" size="md">
              Cancel
            </Button>
          </DialogClose>
          <Button variant="primary" size="md" loading={isPending} onClick={handleRegenerate}>
            Regenerate
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}