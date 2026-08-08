"use client";

import { ChevronLeft, ChevronRight, Save, LogOut, ClipboardCheck } from "lucide-react";
import { Button } from "@/components/ui/button";

interface NavigationFooterProps {
  onPrevious?: () => void;
  onNext?: () => void;
  onSaveDraft: () => void;
  onExit: () => void;
  onReview?: () => void;
  isFirstSection: boolean;
  isLastSection: boolean;
  isSaving?: boolean;
}

export function NavigationFooter({
  onPrevious,
  onNext,
  onSaveDraft,
  onExit,
  onReview,
  isFirstSection,
  isLastSection,
  isSaving,
}: NavigationFooterProps) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <div className="flex gap-2">
        <Button variant="ghost" size="sm" leftIcon={<LogOut className="h-4 w-4" />} onClick={onExit}>
          Exit
        </Button>
        <Button
          variant="outline"
          size="sm"
          leftIcon={<Save className="h-4 w-4" />}
          onClick={onSaveDraft}
          loading={isSaving}
        >
          Save Draft
        </Button>
      </div>

      <div className="flex gap-2">
        {!isFirstSection && (
          <Button variant="outline" size="md" leftIcon={<ChevronLeft className="h-4 w-4" />} onClick={onPrevious}>
            Previous
          </Button>
        )}
        {isLastSection ? (
          <Button variant="primary" size="md" leftIcon={<ClipboardCheck className="h-4 w-4" />} onClick={onReview}>
            Review Answers
          </Button>
        ) : (
          <Button variant="primary" size="md" rightIcon={<ChevronRight className="h-4 w-4" />} onClick={onNext}>
            Next
          </Button>
        )}
      </div>
    </div>
  );
}