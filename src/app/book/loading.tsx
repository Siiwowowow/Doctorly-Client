import { Skeleton } from "@/components/ui/skeleton";

export default function BookLoading() {
  return (
    <main className="min-h-screen bg-muted/20 pb-20 pt-8 animate-pulse">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center max-w-lg mx-auto space-y-2">
          <Skeleton className="h-8 w-56 mx-auto rounded-xl" />
          <Skeleton className="h-4 w-80 mx-auto rounded-md" />
        </div>

        <div className="rounded-3xl border border-border/60 bg-card p-6 sm:p-8 space-y-6">
          <div className="flex items-center gap-4">
            <Skeleton className="size-16 rounded-2xl shrink-0" />
            <div className="space-y-2 flex-1">
              <Skeleton className="h-5 w-44 rounded-md" />
              <Skeleton className="h-3 w-32 rounded-md" />
            </div>
          </div>

          <div className="space-y-3 pt-4 border-t">
            <Skeleton className="h-4 w-36 rounded-md" />
            <div className="grid grid-cols-3 sm:grid-cols-7 gap-2">
              {Array.from({ length: 7 }).map((_, i) => (
                <Skeleton key={i} className="h-16 w-full rounded-xl" />
              ))}
            </div>
          </div>

          <div className="space-y-3 pt-4 border-t">
            <Skeleton className="h-4 w-36 rounded-md" />
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {Array.from({ length: 8 }).map((_, i) => (
                <Skeleton key={i} className="h-12 w-full rounded-xl" />
              ))}
            </div>
          </div>

          <Skeleton className="h-12 w-full rounded-xl mt-6" />
        </div>
      </div>
    </main>
  );
}
