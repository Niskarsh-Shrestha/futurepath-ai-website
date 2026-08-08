"use server";

import crypto from "crypto";
import { db } from "@/lib/db";
import { forgotPasswordSchema } from "@/lib/validations/auth";
import { sendPasswordResetEmail } from "@/lib/email/send";

interface ForgotPasswordResult {
  success: boolean;
}

const TOKEN_TTL_MINUTES = 30;

export async function requestPasswordReset(formData: unknown): Promise<ForgotPasswordResult> {
  const parsed = forgotPasswordSchema.safeParse(formData);

  if (!parsed.success) {
    return { success: true };
  }

  const user = await db.user.findUnique({ where: { email: parsed.data.email } });

  if (user) {
    const token = crypto.randomBytes(32).toString("hex");
    const expiresAt = new Date(Date.now() + TOKEN_TTL_MINUTES * 60 * 1000);

    await db.passwordResetToken.create({
      data: { token, userId: user.id, expiresAt },
    });

    const resetUrl = `${process.env.NEXTAUTH_URL}/reset-password?token=${token}`;

    const emailResult = await sendPasswordResetEmail(user.email, user.firstName, resetUrl);
    if (!emailResult.success) {
      console.error(`Password reset email failed to send to ${user.email}: ${emailResult.error}`);
    }
  }

  // Always return success regardless of email delivery outcome —
  // preserves the email-enumeration protection from the original implementation.
  return { success: true };
}