import { Container } from "@/components/common/container";

interface AssessmentLayoutProps {
  sidebar: React.ReactNode;
  progress: React.ReactNode;
  children: React.ReactNode;
  footer: React.ReactNode;
}

export function AssessmentLayout({ sidebar, progress, children, footer }: AssessmentLayoutProps) {
  return (
    <div className="pb-24">
      <Container className="max-w-5xl">
        <div className="sticky top-16 z-10 -mx-4 border-b border-border bg-secondary/30 px-4 py-4 backdrop-blur-lg sm:mx-0 sm:rounded-2xl sm:border sm:bg-white/80 sm:px-6">
          {progress}
        </div>

        <div className="mt-6 flex gap-8">
          {sidebar}
          <div className="min-w-0 flex-1 space-y-4">{children}</div>
        </div>
      </Container>

      <div className="fixed bottom-0 left-0 right-0 z-20 border-t border-border bg-white/95 backdrop-blur-lg">
        <Container className="max-w-5xl py-4">{footer}</Container>
      </div>
    </div>
  );
}