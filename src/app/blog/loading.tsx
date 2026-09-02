import { Skeleton } from "@/components/ui/skeleton";

export default function BlogLoading() {
  return (
    <div className="min-h-screen bg-slate-50/50 pb-20 animate-pulse">
      {/* Header Banner Skeleton */}
      <div className="bg-gradient-to-b from-teal-900 via-doctorly-primary to-teal-950 py-16 sm:py-20 text-white">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 space-y-4">
          <Skeleton className="h-4 w-28 bg-white/20 rounded-md" />
          <Skeleton className="h-10 w-96 bg-white/20 rounded-xl" />
          <Skeleton className="h-4 w-3/4 max-w-xl bg-white/15 rounded-md" />
          <Skeleton className="h-12 w-full max-w-xl bg-white/25 rounded-2xl mt-4" />
        </div>
      </div>

      {/* Grid Skeleton */}
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 mt-10">
        <div className="flex gap-2 overflow-hidden mb-8">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-8 w-24 rounded-full shrink-0" />
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="rounded-3xl border border-slate-200/80 bg-white p-4 space-y-4">
              <Skeleton className="h-48 w-full rounded-2xl" />
              <Skeleton className="h-6 w-5/6 rounded-md" />
              <Skeleton className="h-4 w-full rounded-md" />
              <div className="flex items-center justify-between pt-3 border-t">
                <div className="flex items-center gap-2">
                  <Skeleton className="size-7 rounded-full" />
                  <Skeleton className="h-3 w-24 rounded-md" />
                </div>
                <Skeleton className="h-4 w-12 rounded-md" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
