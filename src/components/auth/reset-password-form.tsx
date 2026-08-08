"use client";

import { useEffect, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import { resetPasswordSchema, type ResetPasswordInput } from "@/lib/validations/auth";
import { resetPassword } from "@/actions/auth/reset-password";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Typography } from "@/components/ui/typography";
import { PasswordStrength } from "@/components/auth/password-strength";

interface ResetPasswordFormProps {
  token: string;
}

export function ResetPasswordForm({ token }: ResetPasswordFormProps) {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordInput>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { token },
  });

  const passwordValue = useWatch({
  control,
  name: "password",
}) || "";

  // The redirect-after-success delay is a genuine side effect tied to
  // `success` becoming true — it belongs in an effect (with proper
  // cleanup) rather than a bare setTimeout fired from the submit
  // handler, which has no way to cancel itself if the component
  // unmounts before the timer fires.
  useEffect(() => {
    if (!success) return;
    const timer = setTimeout(() => {
      router.push("/login");
    }, 2000);
    return () => clearTimeout(timer);
  }, [success, router]);

  async function onSubmit(data: ResetPasswordInput) {
    setServerError(null);
    const result = await resetPassword(data);
    if (!result.success) {
      setServerError(result.error ?? "Something went wrong. Please try again.");
      return;
    }
    setSuccess(true);
  }

  if (success) {
    return (
      <div className="flex flex-col items-center text-center">
        <span className="flex h-14 w-14 items-center justify-center rounded-full bg-success/10">
          <CheckCircle2 className="h-6 w-6 text-success" aria-hidden="true" />
        </span>
        <Typography variant="title" as="h2" className="mt-4 font-semibold text-foreground">
          Password updated
        </Typography>
        <Typography variant="bodySmall" className="mt-2 text-muted-foreground">
          Redirecting you to login...
        </Typography>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
      {serverError && (
        <div className="rounded-lg border border-destructive/30 bg-destructive/5 px-4 py-3">
          <Typography variant="bodySmall" className="text-destructive">
            {serverError}
          </Typography>
        </div>
      )}

      <input type="hidden" {...register("token")} />

      <div>
        <Input
          label="New password"
          type="password"
          required
          errorText={errors.password?.message}
          {...register("password")}
        />
        <div className="mt-3">
          <PasswordStrength password={passwordValue} />
        </div>
      </div>

      <Input
        label="Confirm new password"
        type="password"
        required
        errorText={errors.confirmPassword?.message}
        {...register("confirmPassword")}
      />

      <Button type="submit" variant="primary" size="lg" className="w-full" loading={isSubmitting}>
        Update Password
      </Button>

      <Typography variant="bodySmall" className="text-center text-muted-foreground">
        <Link href="/login" className="font-medium text-primary hover:underline">
          Back to login
        </Link>
      </Typography>
    </form>
  );
}