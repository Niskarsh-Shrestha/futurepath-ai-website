import { cn } from "@/lib/utils";

function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("animate-pulse rounded-lg bg-secondary", className)}
      aria-hidden="true"
      {...props}
    />
  );
}

function SkeletonCard() {
  return (
    <div className="rounded-2xl border border-border bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <Skeleton className="h-11 w-11 rounded-full" />
        <Skeleton className="h-4 w-10" />
      </div>
      <Skeleton className="mt-4 h-7 w-20" />
      <Skeleton className="mt-2 h-4 w-28" />
    </div>
  );
}

function SkeletonTable({ rows = 5 }: { rows?: number }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-white">
      <div className="flex items-center gap-4 border-b border-border p-4">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-4 w-32" />
        <Skeleton className="ml-auto h-4 w-16" />
      </div>
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex items-center gap-4 border-b border-border p-4 last:border-b-0">
          <Skeleton className="h-9 w-9 rounded-full" />
          <Skeleton className="h-4 flex-1 max-w-[160px]" />
          <Skeleton className="ml-auto h-4 w-14" />
        </div>
      ))}
    </div>
  );
}

function SkeletonSidebar() {
  return (
    <div className="flex h-screen w-64 flex-col border-r border-border bg-white p-4">
      <div className="flex items-center gap-2.5 pb-4">
        <Skeleton className="h-9 w-9 rounded-full" />
        <Skeleton className="h-4 w-28" />
      </div>
      <div className="mt-4 space-y-2">
        {Array.from({ length: 8 }).map((_, i) => (
          <Skeleton key={i} className="h-9 w-full rounded-xl" />
        ))}
      </div>
    </div>
  );
}

export { Skeleton, SkeletonCard, SkeletonTable, SkeletonSidebar };