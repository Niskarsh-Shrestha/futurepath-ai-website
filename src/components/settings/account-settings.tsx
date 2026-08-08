import Link from "next/link";
import { Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Typography } from "@/components/ui/typography";
import { SectionHeader } from "@/components/settings/section-header";
import { SettingsCard } from "@/components/settings/settings-card";

interface AccountSettingsProps {
  user: { firstName: string; lastName: string; email: string; role: string };
}

export function AccountSettings({ user }: AccountSettingsProps) {
  return (
    <div className="space-y-4">
      <SectionHeader title="Account" description="Your basic account information." />
      <SettingsCard>
        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <Typography variant="bodySmall" className="font-medium text-foreground">
              {user.firstName} {user.lastName}
            </Typography>
            <Typography variant="caption" className="text-muted-foreground">
              {user.email} · {user.role === "ADMIN" ? "Admin" : "Parent"}
            </Typography>
          </div>
          <Button variant="outline" size="sm" leftIcon={<Pencil className="h-3.5 w-3.5" />} asChild>
            <Link href="/dashboard/profile/edit">Edit Profile</Link>
          </Button>
        </div>
      </SettingsCard>
    </div>
  );
}