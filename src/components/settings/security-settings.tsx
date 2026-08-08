"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { changePasswordSchema, type ChangePasswordInput } from "@/lib/validations/settings";
import { changePassword } from "@/actions/settings/change-password";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Typography } from "@/components/ui/typography";
import { useToast } from "@/components/ui/toast";
import { SectionHeader } from "@/components/settings/section-header";
import { SettingsCard } from "@/components/settings/settings-card";

interface SecuritySettingsProps {
  hasPassword: boolean;
}

export function SecuritySettings({ hasPassword }: SecuritySettingsProps) {
  const { showToast } = useToast();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ChangePasswordInput>({ resolver: zodResolver(changePasswordSchema) });

  async function onSubmit(data: ChangePasswordInput) {
    const result = await changePassword(data);
    if (!result.success) {
      showToast(result.error ?? "Failed to change password", "error");
      return;
    }
    showToast("Password updated successfully");
    reset();
  }

  return (
    <div className="space-y-4">
      <SectionHeader title="Security" description="Manage your password and account access." />
      <SettingsCard>
        {!hasPassword ? (
          <Typography variant="bodySmall" className="text-muted-foreground">
            You signed in with Google, so there&apos;s no password to manage here.
          </Typography>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
            <Input
              label="Current password"
              type="password"
              required
              errorText={errors.currentPassword?.message}
              {...register("currentPassword")}
            />
            <Input
              label="New password"
              type="password"
              required
              errorText={errors.newPassword?.message}
              {...register("newPassword")}
            />
            <Input
              label="Confirm new password"
              type="password"
              required
              errorText={errors.confirmPassword?.message}
              {...register("confirmPassword")}
            />
            <Button type="submit" variant="primary" size="md" loading={isSubmitting}>
              Update Password
            </Button>
          </form>
        )}
      </SettingsCard>
    </div>
  );
}