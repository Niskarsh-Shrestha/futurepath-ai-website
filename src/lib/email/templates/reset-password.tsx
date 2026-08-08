import { Html, Head, Body, Container, Heading, Text, Button, Preview } from "@react-email/components";

interface ResetPasswordTemplateProps {
  firstName: string;
  resetUrl: string;
}

export function ResetPasswordTemplate({ firstName, resetUrl }: ResetPasswordTemplateProps) {
  return (
    <Html>
      <Head />
      <Preview>Reset your FuturePath AI password</Preview>
      <Body style={{ backgroundColor: "#F8FAFC", fontFamily: "Arial, sans-serif" }}>
        <Container
          style={{
            backgroundColor: "#FFFFFF",
            padding: "32px",
            borderRadius: "16px",
            border: "1px solid #E5E7EB",
            maxWidth: "480px",
            margin: "40px auto",
          }}
        >
          <Heading style={{ fontSize: "20px", color: "#111827" }}>Reset your password</Heading>
          <Text style={{ fontSize: "14px", color: "#6B7280", lineHeight: "22px" }}>
            Hi {firstName}, we received a request to reset your password. Click the button below
            to choose a new one. This link expires in 30 minutes.
          </Text>
          <Button
            href={resetUrl}
            style={{
              backgroundColor: "#2563EB",
              color: "#FFFFFF",
              padding: "12px 24px",
              borderRadius: "12px",
              fontSize: "14px",
              fontWeight: "bold",
              textDecoration: "none",
              display: "inline-block",
              marginTop: "16px",
            }}
          >
            Reset Password
          </Button>
          <Text style={{ fontSize: "12px", color: "#6B7280", marginTop: "24px" }}>
            If you didn&apos;t request this, you can safely ignore this email — your password
            won&apos;t be changed.
          </Text>
        </Container>
      </Body>
    </Html>
  );
}