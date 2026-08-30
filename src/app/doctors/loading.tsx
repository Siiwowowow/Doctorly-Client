import { Skeleton } from "@/components/ui/skeleton";

export default function DoctorsLoading() {
  return (
    <main className="min-h-screen bg-muted/20 pb-20 pt-8 animate-pulse">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Title Header Skeleton */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <Skeleton className="h-9 w-72 mx-auto rounded-xl" />
          <Skeleton className="h-4 w-96 mx-auto rounded-md" />
        </div>

        {/* Filter Card Skeleton */}
        <div className="p-6 rounded-2xl border border-border/60 bg-card/80 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Skeleton className="h-10 w-full rounded-xl" />
            <Skeleton className="h-10 w-full rounded-xl" />
            <Skeleton className="h-10 w-full rounded-xl" />
          </div>
        </div>

        {/* Doctors Grid Skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <div key={i} className="p-5 rounded-2xl border border-border/60 bg-card space-y-4">
              <div className="flex items-center gap-3">
                <Skeleton className="size-14 rounded-full" />
                <div className="space-y-2 flex-1">
                  <Skeleton className="h-4 w-32 rounded-md" />
                  <Skeleton className="h-3 w-24 rounded-md" />
                </div>
              </div>
              <div className="space-y-2 border-t pt-3">
                <Skeleton className="h-3 w-full rounded-md" />
                <Skeleton className="h-3 w-3/4 rounded-md" />
              </div>
              <div className="flex items-center justify-between pt-2">
                <Skeleton className="h-5 w-16 rounded-md" />
                <Skeleton className="h-9 w-24 rounded-xl" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
