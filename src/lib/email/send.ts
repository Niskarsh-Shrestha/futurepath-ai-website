import { getResendClient } from "@/lib/email/resend";
import { VerifyEmailTemplate } from "@/lib/email/templates/verify-email";
import { ResetPasswordTemplate } from "@/lib/email/templates/reset-password";

interface SendResult {
  success: boolean;
  error?: string;
}

export async function sendVerificationEmail(
  to: string,
  firstName: string,
  verifyUrl: string
): Promise<SendResult> {
  try {
    const { error } = await getResendClient().emails.send({
      from: process.env.EMAIL_FROM as string,
      to,
      subject: "Verify your FuturePath AI email",
      react: VerifyEmailTemplate({ firstName, verifyUrl }),
    });

    if (error) {
      console.error("[Resend] Verification email failed:", error);
      return { success: false, error: error.message };
    }
    return { success: true };
  } catch (err) {
    console.error("[Resend] Verification email threw:", err);
    return { success: false, error: "Failed to send verification email" };
  }
}

export async function sendPasswordResetEmail(
  to: string,
  firstName: string,
  resetUrl: string
): Promise<SendResult> {
  try {
    const { error } = await getResendClient().emails.send({
      from: process.env.EMAIL_FROM as string,
      to,
      subject: "Reset your FuturePath AI password",
      react: ResetPasswordTemplate({ firstName, resetUrl }),
    });

    if (error) {
      console.error("[Resend] Password reset email failed:", error);
      return { success: false, error: error.message };
    }
    return { success: true };
  } catch (err) {
    console.error("[Resend] Password reset email threw:", err);
    return { success: false, error: "Failed to send password reset email" };
  }
}