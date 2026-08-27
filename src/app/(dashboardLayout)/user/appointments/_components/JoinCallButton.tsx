"use client"

import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import { Video } from "lucide-react"
import { useRouter } from "next/navigation"
import { initiateCall } from "@/services/call.services"
import { toast } from "sonner"
import { Appointment } from "@/types/api.types"

export function JoinCallButton({ appointment }: { appointment: Appointment }) {
  const router = useRouter()
  const [isCalling, setIsCalling] = useState(false)

  const handleStartCall = async () => {
    if (!appointment.doctorId) return;
    setIsCalling(true);
    try {
      const res = await initiateCall({
        receiverId: appointment.doctorId,
        appointmentId: appointment.id,
        isVideoCall: true
      });
      if (res.data?.id) {
        router.push(`/video-call/${res.data.id}`);
      }
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : "Could not start video call.";
      toast.error(msg);
    } finally {
      setIsCalling(false);
    }
  }

  return (
    <Button 
       size="sm" 
       className="bg-blue-600 hover:bg-blue-700 text-white shadow-sm" 
       onClick={handleStartCall}
       disabled={isCalling}
    >
      <Video className="mr-2 size-4" />
      {isCalling ? "Calling..." : "Call Doctor"}
    </Button>
  )
}
