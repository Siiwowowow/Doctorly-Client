import { Activity } from "lucide-react";

export default function DoctorLoading() {
  return (
    <div className="flex min-h-[60vh] w-full flex-col items-center justify-center gap-4 p-6">
      <div className="relative flex items-center justify-center">
        <div className="size-14 rounded-full border-4 border-doctorly-primary/20 border-t-doctorly-primary animate-spin" />
        <Activity className="absolute size-6 text-doctorly-primary animate-pulse" />
      </div>
      <div className="text-center space-y-1">
        <p className="text-base font-semibold text-foreground">Loading Doctor Workspace...</p>
        <p className="text-xs text-muted-foreground">Please wait while we load your schedules and patient list</p>
      </div>
    </div>
  );
}
