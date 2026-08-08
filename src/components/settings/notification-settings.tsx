"use client";

import { useState } from "react";
import { updateNotificationSettings } from "@/actions/settings/update-notifications";
import { Switch } from "@/components/ui/switch";
import { Typography } from "@/components/ui/typography";
import { useToast } from "@/components/ui/toast";
import { SectionHeader } from "@/components/settings/section-header";
import { SettingsCard } from "@/components/settings/settings-card";
import type { NotificationSettingsInput } from "@/lib/validations/settings";

interface NotificationSettingsProps {
  initial: NotificationSettingsInput;
}

const TOGGLES: { key: keyof NotificationSettingsInput; label: string; description: string }[] = [
  { key: "emailNotifications", label: "Email Notifications", description: "General account and activity emails." },
  { key: "assessmentReminders", label: "Assessment Reminders", description: "Reminders to complete or resume an assessment." },
  { key: "roadmapUpdates", label: "Roadmap Updates", description: "Updates when a learning roadmap changes." },
  { key: "marketingEmails", label: "Marketing Emails", description: "News, tips, and product updates." },
];

export function NotificationSettings({ initial }: NotificationSettingsProps) {
  const { showToast } = useToast();
  const [values, setValues] = useState(initial);
  const [savingKeys, setSavingKeys] = useState<Set<keyof NotificationSettingsInput>>(new Set());

  async function handleToggle(key: keyof NotificationSettingsInput, checked: boolean) {
    const previousValue = values[key];

    // Functional update — always reads the freshest state, so a
    // concurrent toggle's change is never clobbered by this one.
    setValues((prev) => ({ ...prev, [key]: checked }));
    setSavingKeys((prev) => new Set(prev).add(key));

    const result = await updateNotificationSettings({ ...values, [key]: checked });

    setSavingKeys((prev) => {
      const next = new Set(prev);
      next.delete(key);
      return next;
    });

    if (!result.success) {
      // Roll back only this specific key, using the functional form —
      // never overwrites the whole object with a stale snapshot, so a
      // different toggle's already-successful change (made while this
      // request was in flight) is preserved.
      setValues((prev) => ({ ...prev, [key]: previousValue }));
      showToast(result.error ?? "Failed to update", "error");
      return;
    }
    showToast("Preferences updated");
  }

  return (
    <div className="space-y-4">
      <SectionHeader title="Notifications" description="Choose what you'd like to be notified about." />
      <SettingsCard className="divide-y divide-border p-0">
        {TOGGLES.map((toggle) => (
          <div key={toggle.key} className="flex items-center justify-between gap-4 p-5">
            <div>
              <Typography variant="bodySmall" className="font-medium text-foreground">
                {toggle.label}
              </Typography>
              <Typography variant="caption" className="text-muted-foreground">
                {toggle.description}
              </Typography>
            </div>
            <Switch
              checked={values[toggle.key]}
              onCheckedChange={(checked) => handleToggle(toggle.key, checked)}
              disabled={savingKeys.has(toggle.key)}
              aria-label={toggle.label}
            />
          </div>
        ))}
      </SettingsCard>
    </div>
  );
}