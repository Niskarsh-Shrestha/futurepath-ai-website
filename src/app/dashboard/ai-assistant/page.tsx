import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { QuestionForm } from "@/components/assistant/question-form";
import { Container } from "@/components/common/container";
import { Typography } from "@/components/ui/typography";

export default async function AiAssistantPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  return (
    <Container className="max-w-2xl py-10">
      <Typography variant="h3" as="h1" className="font-bold text-foreground">
        AI Assistant
      </Typography>
      <Typography variant="bodySmall" className="mt-1.5 text-muted-foreground">
        Ask questions about your child&apos;s assessment and career recommendations.
      </Typography>

      <div className="mt-6">
        <QuestionForm />
      </div>
    </Container>
  );
}