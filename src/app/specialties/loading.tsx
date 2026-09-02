import { Skeleton } from "@/components/ui/skeleton";

export default function SpecialtiesLoading() {
  return (
    <main className="min-h-screen bg-muted/20 pb-16 pt-8 animate-pulse">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Header Skeleton */}
        <div className="text-center max-w-xl mx-auto space-y-3">
          <Skeleton className="h-9 w-64 mx-auto rounded-xl" />
          <Skeleton className="h-4 w-96 mx-auto rounded-md" />
        </div>

        {/* Specialties Grid Skeleton */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="flex flex-col items-center justify-center p-6 rounded-2xl border border-border/60 bg-card space-y-4 text-center min-h-[180px]"
            >
              <Skeleton className="size-16 rounded-2xl" />
              <div className="space-y-2 w-full flex flex-col items-center">
                <Skeleton className="h-5 w-32 rounded-md" />
                <Skeleton className="h-3 w-44 rounded-md" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
