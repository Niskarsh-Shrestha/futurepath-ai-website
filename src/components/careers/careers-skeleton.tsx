import { Container } from "@/components/common/container";
import { Skeleton } from "@/components/ui/skeleton";

export function CareersSkeleton() {
  return (
    <Container className="max-w-5xl space-y-6 py-10">
      <div>
        <Skeleton className="h-7 w-64 rounded-md" />
        <Skeleton className="mt-2 h-4 w-96 rounded-md" />
      </div>
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="rounded-2xl border border-border bg-white p-6 shadow-sm">
            <div className="flex items-start justify-between gap-3">
              <Skeleton className="h-10 w-10 rounded-full" />
              <Skeleton className="h-[60px] w-[60px] rounded-full" />
            </div>
            <Skeleton className="mt-4 h-5 w-3/4 rounded-md" />
            <Skeleton className="mt-2 h-4 w-full rounded-md" />
            <Skeleton className="mt-1 h-4 w-2/3 rounded-md" />
            <Skeleton className="mt-4 h-8 w-full rounded-md" />
          </div>
        ))}
      </div>
    </Container>
  );
}