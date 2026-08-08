"use server";

import { db } from "@/lib/db";
import { hashPassword } from "@/lib/auth/password";
import { resetPasswordSchema } from "@/lib/validations/auth";

interface ResetPasswordResult {
  success: boolean;
  error?: string;
}

export async function resetPassword(formData: unknown): Promise<ResetPasswordResult> {
  const parsed = resetPasswordSchema.safeParse(formData);

  if (!parsed.success) {
    return { success: false, error: "Invalid form data" };
  }

  const { token, password } = parsed.data;

  const resetToken = await db.passwordResetToken.findUnique({
    where: { token },
    include: { user: true },
  });

  if (!resetToken) {
    return { success: false, error: "This reset link is invalid" };
  }

  if (resetToken.expiresAt < new Date()) {
    await db.passwordResetToken.delete({ where: { id: resetToken.id } });
    return { success: false, error: "This reset link has expired. Please request a new one." };
  }

  const passwordHash = await hashPassword(password);

  await db.$transaction([
    db.user.update({
      where: { id: resetToken.userId },
      data: { passwordHash },
    }),
    // Invalidate this token immediately so the link can't be reused,
    // and clear any other outstanding reset tokens for this user.
    db.passwordResetToken.deleteMany({
      where: { userId: resetToken.userId },
    }),
  ]);

  return { success: true };
}

export async function validateResetToken(token: string): Promise<boolean> {
  const resetToken = await db.passwordResetToken.findUnique({ where: { token } });
  if (!resetToken) return false;
  if (resetToken.expiresAt < new Date()) {
    await db.passwordResetToken.delete({ where: { id: resetToken.id } });
    return false;
  }
  return true;
}