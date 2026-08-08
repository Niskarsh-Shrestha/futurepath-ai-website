import { Container } from "@/components/common/container";
import { Skeleton } from "@/components/ui/skeleton";

export function ReportSkeleton() {
  return (
    <Container className="max-w-4xl space-y-6 py-10">
      <div className="rounded-2xl border border-border bg-white p-7 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Skeleton className="h-14 w-14 rounded-full" />
            <div>
              <Skeleton className="h-4 w-40 rounded-md" />
              <Skeleton className="mt-2 h-6 w-56 rounded-md" />
            </div>
          </div>
          <Skeleton className="h-[88px] w-[88px] rounded-full" />
        </div>
      </div>
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="rounded-2xl border border-border bg-white p-6 shadow-sm">
          <Skeleton className="h-5 w-48 rounded-md" />
          <Skeleton className="mt-4 h-4 w-full rounded-md" />
          <Skeleton className="mt-2 h-4 w-3/4 rounded-md" />
        </div>
      ))}
    </Container>
  );
}