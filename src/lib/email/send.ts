import { getResendClient } from "@/lib/email/resend";
import { render } from "@react-email/render";
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
    const emailHtml = await render(
      VerifyEmailTemplate({
        firstName,
        verifyUrl,
      })
    );

    const { error } = await getResendClient().emails.send({
      from: process.env.EMAIL_FROM as string,
      to,
      subject: "Verify your FuturePath AI email",
      html: emailHtml,
    });

    if (error) {
      console.error("[Resend] Verification email failed:", error);

      return {
        success: false,
        error: error.message,
      };
    }

    console.log("[Resend] Verification email sent successfully to:", to);

    return {
      success: true,
    };
  } catch (err) {
    console.error("[Resend] Verification email threw:", err);

    return {
      success: false,
      error: err instanceof Error ? err.message : "Failed to send verification email",
    };
  }
}

export async function sendPasswordResetEmail(
  to: string,
  firstName: string,
  resetUrl: string
): Promise<SendResult> {
  try {
    const emailHtml = await render(
      ResetPasswordTemplate({
        firstName,
        resetUrl,
      })
    );

    const { error } = await getResendClient().emails.send({
      from: process.env.EMAIL_FROM as string,
      to,
      subject: "Reset your FuturePath AI password",
      html: emailHtml,
    });

    if (error) {
      console.error("[Resend] Password reset email failed:", error);

      return {
        success: false,
        error: error.message,
      };
    }

    console.log("[Resend] Password reset email sent successfully to:", to);

    return {
      success: true,
    };
  } catch (err) {
    console.error("[Resend] Password reset email threw:", err);

    return {
      success: false,
      error: err instanceof Error ? err.message : "Failed to send password reset email",
    };
  }
}