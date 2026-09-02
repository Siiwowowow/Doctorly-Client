"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Video, Phone, PhoneCall } from "lucide-react";
import { useRouter } from "next/navigation";
import { initiateCall } from "@/services/call.services";
import { toast } from "sonner";
import { Appointment, AppointmentStatus } from "@/types/api.types";
import { useCall } from "@/providers/CallProvider";

export function JoinCallButton({ appointment }: { appointment: Appointment }) {
  const router = useRouter();
  const [isCalling, setIsCalling] = useState(false);
  const { incomingCall, isAppointmentRinging, acceptCall } = useCall();

  const isRingingForThisAppt = isAppointmentRinging(appointment.id);

  // When doctor is actively calling for this appointment
  if (isRingingForThisAppt && incomingCall) {
    return (
      <div className="flex items-center gap-2 animate-in fade-in zoom-in-95 duration-300">
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/30 animate-pulse">
          <span className="size-2 rounded-full bg-rose-500 animate-ping" />
          Doctor is calling
        </span>
        <Button
          size="sm"
          className="bg-emerald-600 hover:bg-emerald-700 text-white shadow-md animate-bounce h-8 px-3 text-xs font-bold rounded-lg"
          onClick={() => acceptCall(incomingCall.callId)}
        >
          <PhoneCall className="mr-1.5 h-3.5 w-3.5" />
          Join Video Call
        </Button>
      </div>
    );
  }

  // Only allow starting call if appointment is in progress or scheduled
  const canStartCall =
    appointment.status === AppointmentStatus.SCHEDULED ||
    appointment.status === AppointmentStatus.INPROGRESS;

  if (!canStartCall) {
    return null;
  }

  const handleStartCall = async (type: "VIDEO" | "AUDIO" = "VIDEO") => {
    if (!appointment.doctorId) return;
    console.log("[CALL][PATIENT] initiate", { appointmentId: appointment.id, doctorId: appointment.doctorId, type });
    setIsCalling(true);
    try {
      const res = await initiateCall({
        receiverId: appointment.doctorId,
        appointmentId: appointment.id,
        isVideoCall: type === "VIDEO",
        type,
      });
      if (res.data?.id) {
        console.log("[CALL][PATIENT] session-created", { callId: res.data.id, type });
        console.log("[CALL][PATIENT] incoming-sent", { callId: res.data.id, receiverId: appointment.doctorId });
        console.log(`[CALL][ROOM] appointmentId=${appointment.id} callId=${res.data.id} roomId=call:${res.data.id}`);
        const typeParam = type === "AUDIO" ? "?type=AUDIO" : "";
        router.push(`/video-call/${res.data.id}${typeParam}`);
      }
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : "Could not start consultation call.";
      toast.error(msg);
    } finally {
      setIsCalling(false);
    }
  };

  return (
    <div className="inline-flex items-center gap-1.5">
      <Button
        size="sm"
        className="bg-blue-600 hover:bg-blue-700 text-white shadow-sm h-8 px-3 text-xs font-semibold rounded-lg"
        onClick={() => handleStartCall("VIDEO")}
        disabled={isCalling}
        title="Start Video Consultation"
      >
        <Video className="mr-1.5 h-3.5 w-3.5" />
        {isCalling ? "Calling..." : "Video Call"}
      </Button>

      <Button
        size="sm"
        variant="outline"
        className="border-emerald-500/30 text-emerald-600 dark:text-emerald-400 bg-emerald-50/50 hover:bg-emerald-100 dark:bg-emerald-950/30 h-8 px-2.5 text-xs font-medium rounded-lg"
        onClick={() => handleStartCall("AUDIO")}
        disabled={isCalling}
        title="Start Audio Consultation"
      >
        <Phone className="h-3.5 w-3.5" />
      </Button>
    </div>
  );
}
