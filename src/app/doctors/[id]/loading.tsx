import { Skeleton } from "@/components/ui/skeleton";

export default function DoctorDetailLoading() {
  return (
    <main className="min-h-screen bg-muted/20 pb-20 pt-8 animate-pulse">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Profile Card Header Skeleton */}
        <div className="rounded-3xl border border-border/60 bg-card p-6 sm:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
            <Skeleton className="size-28 sm:size-32 rounded-3xl shrink-0" />
            <div className="space-y-3 flex-1 text-center sm:text-left w-full">
              <Skeleton className="h-8 w-64 mx-auto sm:mx-0 rounded-lg" />
              <Skeleton className="h-4 w-44 mx-auto sm:mx-0 rounded-md" />
              <div className="flex flex-wrap justify-center sm:justify-start gap-2 pt-2">
                <Skeleton className="h-6 w-24 rounded-full" />
                <Skeleton className="h-6 w-28 rounded-full" />
              </div>
            </div>
            <div className="flex flex-col gap-3 w-full sm:w-auto shrink-0">
              <Skeleton className="h-11 w-full sm:w-40 rounded-xl" />
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 border-t pt-6">
            <Skeleton className="h-14 w-full rounded-xl" />
            <Skeleton className="h-14 w-full rounded-xl" />
            <Skeleton className="h-14 w-full rounded-xl" />
            <Skeleton className="h-14 w-full rounded-xl" />
          </div>
        </div>

        {/* Content Tabs Skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="rounded-2xl border border-border/60 bg-card p-6 space-y-4">
              <Skeleton className="h-6 w-36 rounded-md" />
              <Skeleton className="h-4 w-full rounded-md" />
              <Skeleton className="h-4 w-5/6 rounded-md" />
              <Skeleton className="h-4 w-4/6 rounded-md" />
            </div>
            <div className="rounded-2xl border border-border/60 bg-card p-6 space-y-4">
              <Skeleton className="h-6 w-44 rounded-md" />
              <div className="space-y-3">
                <Skeleton className="h-12 w-full rounded-xl" />
                <Skeleton className="h-12 w-full rounded-xl" />
              </div>
            </div>
          </div>

          {/* Booking sidebar skeleton */}
          <div className="space-y-6">
            <div className="rounded-2xl border border-border/60 bg-card p-6 space-y-4">
              <Skeleton className="h-6 w-32 rounded-md" />
              <Skeleton className="h-32 w-full rounded-xl" />
              <Skeleton className="h-11 w-full rounded-xl" />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
