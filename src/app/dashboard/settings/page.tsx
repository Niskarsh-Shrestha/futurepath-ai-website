import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { Typography } from "@/components/ui/typography";
import { AccountSettings } from "@/components/settings/account-settings";
import { NotificationSettings } from "@/components/settings/notification-settings";
import { SecuritySettings } from "@/components/settings/security-settings";
import { DangerZone } from "@/components/settings/danger-zone";
import { SectionHeader } from "@/components/settings/section-header";
import { SettingsCard } from "@/components/settings/settings-card";

export default async function SettingsPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const user = await db.user.findUnique({
    where: { id: session.user.id },
    select: {
      firstName: true,
      lastName: true,
      email: true,
      role: true,
      passwordHash: true,
      emailNotifications: true,
      assessmentReminders: true,
      roadmapUpdates: true,
      marketingEmails: true,
    },
  });

  if (!user) redirect("/login");

  return (
    <div className="mx-auto max-w-2xl space-y-8">
      <Typography variant="h3" as="h1" className="font-bold text-foreground">
        Settings
      </Typography>

      <AccountSettings user={user} />

      <NotificationSettings
        initial={{
          emailNotifications: user.emailNotifications,
          assessmentReminders: user.assessmentReminders,
          roadmapUpdates: user.roadmapUpdates,
          marketingEmails: user.marketingEmails,
        }}
      />

      <div className="space-y-4">
        <SectionHeader title="Privacy" description="How your child's data is handled." />
        <SettingsCard>
          <Typography variant="bodySmall" className="leading-relaxed text-muted-foreground">
            Your children&apos;s profile data is only visible to your account and is never sold or
            shared with third parties for advertising. You can request full data export or
            deletion at any time by contacting support.
          </Typography>
        </SettingsCard>
      </div>

      <SecuritySettings hasPassword={Boolean(user.passwordHash)} />

      <DangerZone />
    </div>
  );
}