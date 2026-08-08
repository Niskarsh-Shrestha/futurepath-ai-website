"use client";

import { useState } from "react";
import { Controller, useForm, useWatch } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { FcGoogle } from "react-icons/fc";

import {
  registerSchema,
  type RegisterInput,
} from "@/lib/validations/auth";

import { registerUser } from "@/actions/auth/register";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Typography } from "@/components/ui/typography";
import { PasswordStrength } from "@/components/auth/password-strength";

type RegisterFormInput = z.input<typeof registerSchema>;

export function RegisterForm() {
  const router = useRouter();

  const [serverError, setServerError] = useState<string | null>(null);
  const [googleLoading, setGoogleLoading] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormInput, unknown, RegisterInput>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
      acceptTerms: false,
    },
  });

  const passwordValue = useWatch({
    control,
    name: "password",
  }) || "";

  async function onSubmit(data: RegisterInput) {
    setServerError(null);

    const result = await registerUser(data);

    if (!result.success) {
      setServerError(
        result.error ?? "Something went wrong. Please try again."
      );
      return;
    }

    router.push("/verify-email");
  }

  function handleGoogleSignIn() {
    setGoogleLoading(true);

    signIn("google", {
      callbackUrl: "/dashboard",
    });
  }

  return (
    <div className="space-y-6">
      {serverError && (
        <div
          role="alert"
          className="rounded-xl border border-destructive/20 bg-destructive/5 px-4 py-3"
        >
          <Typography
            variant="bodySmall"
            className="text-destructive"
          >
            {serverError}
          </Typography>
        </div>
      )}

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-5"
      >
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Input
            label="First name"
            required
            errorText={errors.firstName?.message}
            {...register("firstName")}
          />

          <Input
            label="Last name"
            required
            errorText={errors.lastName?.message}
            {...register("lastName")}
          />
        </div>

        <Input
          label="Email"
          type="email"
          required
          errorText={errors.email?.message}
          {...register("email")}
        />

        <div>
          <Input
            label="Password"
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
          label="Confirm password"
          type="password"
          required
          errorText={errors.confirmPassword?.message}
          {...register("confirmPassword")}
        />

        <div className="space-y-1">
          <div className="flex items-start gap-2.5">
            <Controller
              name="acceptTerms"
              control={control}
              render={({ field }) => (
                <Checkbox
                  id="acceptTerms"
                  checked={field.value === true}
                  onCheckedChange={(checked) => {
                    field.onChange(checked === true);
                  }}
                />
              )}
            />

            <label
              htmlFor="acceptTerms"
              className="text-sm leading-relaxed text-muted-foreground"
            >
              I agree to{" "}
              <Link
                href="/terms"
                className="text-primary hover:underline"
              >
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link
                href="/privacy"
                className="text-primary hover:underline"
              >
                Privacy Policy
              </Link>
            </label>
          </div>

          {errors.acceptTerms && (
            <p className="text-xs text-destructive">
              {errors.acceptTerms.message}
            </p>
          )}
        </div>

        <Button
          type="submit"
          variant="primary"
          size="lg"
          className="w-full"
          loading={isSubmitting}
        >
          Create Account
        </Button>
      </form>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-border" />
        </div>

        <div className="relative flex justify-center text-xs">
          <span className="bg-white px-3 text-muted-foreground">
            or
          </span>
        </div>
      </div>

      <Button
        type="button"
        variant="outline"
        size="lg"
        className="w-full"
        leftIcon={<FcGoogle className="h-4 w-4" />}
        loading={googleLoading}
        onClick={handleGoogleSignIn}
      >
        Continue with Google
      </Button>

      <Typography
        variant="bodySmall"
        className="text-center text-muted-foreground"
      >
        Already have an account?{" "}
        <Link
          href="/login"
          className="font-medium text-primary hover:underline"
        >
          Login
        </Link>
      </Typography>
    </div>
  );
}