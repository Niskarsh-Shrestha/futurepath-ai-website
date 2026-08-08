import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";
import { Container } from "@/components/common/container";

export function ResultsSkeleton() {
  return (
    <Container className="max-w-4xl space-y-6 pb-12">
      <Card className="rounded-2xl border border-border bg-white p-7 shadow-sm">
        <div className="flex flex-col items-start gap-6 sm:flex-row sm:justify-between">
          <div className="flex-1 space-y-3">
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>
          <Skeleton className="h-28 w-28 rounded-full" />
        </div>
        <div className="mt-6 grid grid-cols-1 gap-4 border-t border-border pt-6 sm:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-24 w-full rounded-xl" />
          ))}
        </div>
      </Card>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Skeleton className="h-40 w-full rounded-2xl" />
        <Skeleton className="h-40 w-full rounded-2xl" />
      </div>

      <div className="space-y-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-24 w-full rounded-2xl" />
        ))}
      </div>
    </Container>
  );
}