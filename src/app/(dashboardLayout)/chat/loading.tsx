import { Skeleton } from "@/components/ui/skeleton";

export default function ChatLoading() {
  return (
    <div className="flex h-full max-h-[calc(100vh-6rem)] w-full max-w-full min-w-0 overflow-hidden rounded-2xl border border-border/70 bg-card shadow-xl animate-pulse">
      {/* Left conversation sidebar skeleton */}
      <div className="w-full lg:w-72 xl:w-80 2xl:w-96 flex flex-col border-r border-border/60 bg-muted/20 p-4 space-y-4">
        <div className="flex items-center justify-between pb-2 border-b">
          <div className="space-y-1">
            <Skeleton className="h-6 w-32 rounded-md" />
            <Skeleton className="h-3 w-40 rounded-md" />
          </div>
          <Skeleton className="h-8 w-14 rounded-lg" />
        </div>
        <Skeleton className="h-9 w-full rounded-xl" />
        <div className="space-y-3 pt-2">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex items-center gap-3 p-2.5 rounded-xl border border-border/30 bg-muted/30">
              <Skeleton className="size-11 rounded-full shrink-0" />
              <div className="space-y-2 flex-1">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-1/2" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Right chat workspace skeleton */}
      <div className="hidden lg:flex flex-1 flex-col bg-background h-full justify-between">
        <div className="p-4 border-b border-border/60 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Skeleton className="size-10 rounded-full" />
            <div className="space-y-1.5">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-3 w-20" />
            </div>
          </div>
          <div className="flex gap-2">
            <Skeleton className="h-8 w-24 rounded-lg" />
            <Skeleton className="h-8 w-24 rounded-lg" />
          </div>
        </div>
        <div className="p-6 space-y-4 flex-1">
          <div className="flex justify-start">
            <Skeleton className="h-14 w-64 rounded-2xl" />
          </div>
          <div className="flex justify-end">
            <Skeleton className="h-12 w-52 rounded-2xl" />
          </div>
          <div className="flex justify-start">
            <Skeleton className="h-16 w-72 rounded-2xl" />
          </div>
        </div>
        <div className="p-4 border-t border-border/60">
          <Skeleton className="h-10 w-full rounded-full" />
        </div>
      </div>
    </div>
  );
}
