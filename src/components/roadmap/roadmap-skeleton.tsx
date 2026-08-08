import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";
import { Container } from "@/components/common/container";

export function RoadmapSkeleton() {
  return (
    <Container className="max-w-4xl space-y-6 pb-12">
      <Card className="rounded-2xl border border-border bg-white p-7 shadow-sm">
        <div className="flex flex-col items-start gap-6 sm:flex-row sm:justify-between">
          <div className="flex items-center gap-4">
            <Skeleton className="h-14 w-14 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-6 w-56" />
            </div>
          </div>
          <Skeleton className="h-24 w-24 rounded-full" />
        </div>
        <Skeleton className="mt-5 h-4 w-full" />
        <Skeleton className="mt-2 h-4 w-3/4" />
        <div className="mt-6 grid grid-cols-1 gap-4 border-t border-border pt-6 sm:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-12 w-full rounded-xl" />
          ))}
        </div>
      </Card>

      <Skeleton className="h-52 w-full rounded-2xl" />

      <div className="space-y-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-28 w-full rounded-2xl" />
        ))}
      </div>
    </Container>
  );
}