import { Html, Head, Body, Container, Heading, Text, Button, Preview } from "@react-email/components";

interface VerifyEmailTemplateProps {
  firstName: string;
  verifyUrl: string;
}

export function VerifyEmailTemplate({ firstName, verifyUrl }: VerifyEmailTemplateProps) {
  return (
    <Html>
      <Head />
      <Preview>Verify your email to activate your FuturePath AI account</Preview>
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
          <Heading style={{ fontSize: "20px", color: "#111827" }}>Verify your email</Heading>
          <Text style={{ fontSize: "14px", color: "#6B7280", lineHeight: "22px" }}>
            Hi {firstName}, thanks for creating a FuturePath AI account. Click the button below
            to verify your email address. This link expires in 24 hours.
          </Text>
          <Button
            href={verifyUrl}
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
            Verify Email
          </Button>
          <Text style={{ fontSize: "12px", color: "#6B7280", marginTop: "24px" }}>
            If you didn&apos;t create this account, you can safely ignore this email.
          </Text>
        </Container>
      </Body>
    </Html>
  );
}