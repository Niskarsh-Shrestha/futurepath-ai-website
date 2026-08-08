"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";
import { deleteChild } from "@/actions/children/delete-child";
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

interface DeleteChildDialogProps {
  childId: string;
  childName: string;
  /** Where to redirect after a successful delete — omit to stay on the current page and just refresh (e.g. when deleting from a list). */
  redirectTo?: string;
  /** Render as a full-width labeled button instead of the compact icon-only trigger (used on the Details page). */
  variant?: "icon" | "full";
}

export function DeleteChildDialog({
  childId,
  childName,
  redirectTo,
  variant = "icon",
}: DeleteChildDialogProps) {
  const router = useRouter();
  const { showToast } = useToast();
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  function handleDelete() {
    startTransition(async () => {
      const result = await deleteChild(childId);
      if (!result.success) {
        showToast(result.error ?? "Failed to delete child", "error");
        return;
      }
      setOpen(false);
      showToast(`${childName} was removed`);
      if (redirectTo) {
        router.push(redirectTo);
      }
      router.refresh();
    });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {variant === "icon" ? (
          <Button
            variant="outline"
            size="sm"
            className="text-destructive hover:bg-destructive/5"
            aria-label={`Delete ${childName}`}
          >
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
        ) : (
          <Button variant="outline" size="sm" className="text-destructive hover:bg-destructive/5" leftIcon={<Trash2 className="h-4 w-4" />}>
            Delete
          </Button>
        )}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete {childName}?</DialogTitle>
          <DialogDescription>
            This will permanently remove {childName}&apos;s profile, including their interests,
            strengths, and any progress data. This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline" size="md">
              Cancel
            </Button>
          </DialogClose>
          <Button variant="destructive" size="md" loading={isPending} onClick={handleDelete}>
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}