"use client";

import { useState } from "react";
import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Typography } from "@/components/ui/typography";
import { SectionHeader } from "@/components/settings/section-header";
import { SettingsCard } from "@/components/settings/settings-card";
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

export function DangerZone() {
  const [open, setOpen] = useState(false);

  return (
    <div className="space-y-4">
      <SectionHeader title="Danger Zone" description="Irreversible account actions." />
      <SettingsCard className="border-destructive/30">
        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <Typography variant="bodySmall" className="font-medium text-foreground">
              Delete account
            </Typography>
            <Typography variant="caption" className="text-muted-foreground">
              Permanently delete your account and all associated data.
            </Typography>
          </div>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button variant="destructive" size="sm" leftIcon={<AlertTriangle className="h-4 w-4" />}>
                Delete Account
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Delete your account?</DialogTitle>
                <DialogDescription>
                  This feature is not yet available. Account deletion will permanently remove all
                  your data, including children&apos;s profiles, and cannot be undone once enabled.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <DialogClose asChild>
                  <Button variant="outline" size="md">
                    Close
                  </Button>
                </DialogClose>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </SettingsCard>
    </div>
  );
}