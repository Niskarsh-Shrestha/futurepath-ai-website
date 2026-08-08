import { Container } from "@/components/common/container";

interface ResultsLayoutProps {
  header: React.ReactNode;
  children: React.ReactNode;
}

export function ResultsLayout({ header, children }: ResultsLayoutProps) {
  return (
    <Container className="max-w-4xl space-y-6 pb-12">
      {header}
      {children}
    </Container>
  );
}