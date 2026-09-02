/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { createContext, useContext, useEffect, useState, useRef, useCallback } from "react";
import { useSocket } from "./SocketProvider";
import { useAuth } from "./AuthProvider";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Phone, PhoneOff, Video, Mic, ShieldCheck, Stethoscope, User, PhoneCall } from "lucide-react";
import { acceptCall as acceptCallService, rejectCall as rejectCallService } from "@/services/call.services";
import { ringtonePlayer } from "@/lib/ringtone";

export interface IncomingCallPayload {
  callId: string;
  callerId: string;
  caller?: {
    id?: string;
    name?: string;
    email?: string;
    image?: string;
    role?: string;
    doctor?: {
      id?: string;
      name?: string;
      profilePhoto?: string;
      designation?: string;
      qualification?: string;
    };
    patient?: {
      id?: string;
      name?: string;
      profilePhoto?: string;
      contactNumber?: string;
    };
  };
  appointmentId?: string | null;
  type?: "VIDEO" | "AUDIO" | string;
  createdAt?: string;
}

interface CallContextType {
  incomingCall: IncomingCallPayload | null;
  activeCallId: string | null;
  isAppointmentRinging: (appointmentId?: string | null) => boolean;
  acceptCall: (callId?: string) => Promise<void>;
  rejectCall: (callId?: string, reason?: string) => Promise<void>;
}

const CallContext = createContext<CallContextType>({
  incomingCall: null,
  activeCallId: null,
  isAppointmentRinging: () => false,
  acceptCall: async () => {},
  rejectCall: async () => {},
});

export const useCall = () => useContext(CallContext);

export function CallProvider({ children }: { children: React.ReactNode }) {
  const { socket, isConnected } = useSocket();
  const { user } = useAuth();
  const router = useRouter();
  const [incomingCall, setIncomingCall] = useState<IncomingCallPayload | null>(null);
  const [isAnswering, setIsAnswering] = useState(false);
  const activeCallIdRef = useRef<string | null>(null);

  const stopRingtone = useCallback(() => {
    try {
      ringtonePlayer.stop();
    } catch {
      // Ignore ringtone cleanup error
    }
  }, []);

  const dismissIncomingCall = useCallback(() => {
    stopRingtone();
    activeCallIdRef.current = null;
    setIncomingCall(null);
    setIsAnswering(false);
  }, [stopRingtone]);

  // Request browser notification permission once on mount
  useEffect(() => {
    if (typeof window !== "undefined" && "Notification" in window) {
      if (Notification.permission === "default") {
        Notification.requestPermission().catch(() => {});
      }
    }
  }, []);

  useEffect(() => {
    if (!socket || !isConnected) return;

    const handleCallIncoming = (payload: IncomingCallPayload) => {
      if (!payload || !payload.callId) return;

      console.log("[CALL][PATIENT] incoming-received", {
        callId: payload.callId,
        callerId: payload.callerId,
        type: payload.type,
      });
      console.log(`[CALL][ROOM] userId=${user?.id} callId=${payload.callId} roomId=call:${payload.callId}`);

      activeCallIdRef.current = payload.callId;
      setIncomingCall(payload);

      // 1. Play ringing audio
      ringtonePlayer.start();

      // 2. Trigger device vibration where supported
      if (typeof window !== "undefined" && "navigator" in window && navigator.vibrate) {
        try {
          navigator.vibrate([200, 100, 200, 100, 400]);
        } catch {
          // Ignore vibration error
        }
      }

      // 3. Native browser notification
      if (typeof window !== "undefined" && "Notification" in window && Notification.permission === "granted") {
        try {
          const isDoc = payload.caller?.role === "DOCTOR";
          const callerName =
            (isDoc && payload.caller?.doctor?.name ? `Dr. ${payload.caller.doctor.name}` : null) ||
            payload.caller?.patient?.name ||
            payload.caller?.name ||
            "Doctorly Consultation";

          const callTypeLabel = payload.type === "AUDIO" ? "audio" : "video";

          const notif = new Notification(`Incoming ${callTypeLabel} consultation`, {
            body: `${callerName} is calling you.`,
            icon: payload.caller?.doctor?.profilePhoto || payload.caller?.patient?.profilePhoto || payload.caller?.image || "/favicon.ico",
            tag: payload.callId,
            requireInteraction: true,
          });

          notif.onclick = () => {
            window.focus();
            notif.close();
          };
        } catch {
          // Notification fallback
        }
      }
    };

    const handleCallCanceled = (payload: { callId: string; reason?: string }) => {
      if (activeCallIdRef.current === payload?.callId || !payload?.callId) {
        dismissIncomingCall();
        toast.info("Call canceled by caller");
      }
    };

    const handleCallMissed = (payload: { callId: string }) => {
      if (activeCallIdRef.current === payload?.callId || !payload?.callId) {
        dismissIncomingCall();
        toast.info("Missed consultation call");
      }
    };

    const handleCallEnded = (payload: { callId: string }) => {
      if (activeCallIdRef.current === payload?.callId || !payload?.callId) {
        dismissIncomingCall();
      }
    };

    (socket as any).on("call:incoming", handleCallIncoming);
    (socket as any).on("call:canceled", handleCallCanceled);
    (socket as any).on("call:missed", handleCallMissed);
    (socket as any).on("call:ended", handleCallEnded);

    return () => {
      (socket as any).off("call:incoming", handleCallIncoming);
      (socket as any).off("call:canceled", handleCallCanceled);
      (socket as any).off("call:missed", handleCallMissed);
      (socket as any).off("call:ended", handleCallEnded);
      stopRingtone();
    };
  }, [socket, isConnected, dismissIncomingCall, stopRingtone, user?.id]);

  const handleAccept = async (targetCallId?: string) => {
    const callIdToAccept = targetCallId || incomingCall?.callId;
    if (!callIdToAccept || isAnswering) return;

    console.log("[CALL][PATIENT] accept", { callId: callIdToAccept });
    setIsAnswering(true);
    stopRingtone();

    try {
      await acceptCallService(callIdToAccept);
      const callTypeParam = incomingCall?.type === "AUDIO" ? "?type=AUDIO" : "";
      router.push(`/video-call/${callIdToAccept}${callTypeParam}`);
      dismissIncomingCall();
    } catch (error: any) {
      toast.error(error?.message || "Failed to accept consultation call");
      dismissIncomingCall();
    }
  };

  const handleReject = async (targetCallId?: string, reason?: string) => {
    const callIdToReject = targetCallId || incomingCall?.callId;
    if (!callIdToReject) return;

    console.log("[CALL][PATIENT] reject", { callId: callIdToReject, reason });
    dismissIncomingCall();

    try {
      await rejectCallService(callIdToReject, reason || "Declined by recipient");
      (socket as any)?.emit("call:reject", { callId: callIdToReject, reason: reason || "Declined" });
    } catch {
      // Ignore network errors on reject
    }
  };

  const isAppointmentRinging = useCallback(
    (appointmentId?: string | null) => {
      if (!appointmentId || !incomingCall) return false;
      return incomingCall.appointmentId === appointmentId;
    },
    [incomingCall]
  );

  const isDoctorCaller = incomingCall?.caller?.role === "DOCTOR";
  const callerName =
    (isDoctorCaller && incomingCall?.caller?.doctor?.name ? `Dr. ${incomingCall.caller.doctor.name}` : null) ||
    incomingCall?.caller?.patient?.name ||
    incomingCall?.caller?.name ||
    (isDoctorCaller ? "Doctor Consultation" : "Patient Consultation");

  const callerSubtext =
    (isDoctorCaller && incomingCall?.caller?.doctor?.designation) ||
    (isDoctorCaller && incomingCall?.caller?.doctor?.qualification) ||
    incomingCall?.caller?.email ||
    "Doctorly Telemedicine Consultation";

  const callerPhoto =
    incomingCall?.caller?.doctor?.profilePhoto ||
    incomingCall?.caller?.patient?.profilePhoto ||
    incomingCall?.caller?.image;

  const isAudioCall = incomingCall?.type === "AUDIO";

  const value = {
    incomingCall,
    activeCallId: incomingCall?.callId || null,
    isAppointmentRinging,
    acceptCall: handleAccept,
    rejectCall: handleReject,
  };

  return (
    <CallContext.Provider value={value}>
      {children}

      {/* Global In-App Incoming Call Ringing Modal */}
      {incomingCall && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 backdrop-blur-md animate-in fade-in duration-300 p-4">
          <div role="alertdialog" aria-modal="true" aria-labelledby="incoming-call-title" aria-describedby="incoming-call-desc" className="relative bg-slate-900 border border-slate-700/80 shadow-2xl rounded-3xl p-5 sm:p-8 max-w-[92vw] sm:max-w-md w-full mx-auto text-center text-white max-h-[92dvh] overflow-y-auto animate-in zoom-in-95 duration-300 focus:outline-none">
            
            {/* Ambient Background Glow */}
            <div className="absolute -top-24 -left-24 w-48 h-48 bg-primary/20 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none" />

            {/* Consultation Type Badge */}
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-slate-800 border border-slate-700 text-xs font-semibold text-slate-300 mb-6">
              {isAudioCall ? (
                <>
                  <Mic className="h-3.5 w-3.5 text-emerald-400" />
                  <span>Incoming Audio Call</span>
                </>
              ) : (
                <>
                  <Video className="h-3.5 w-3.5 text-blue-400" />
                  <span>Incoming Video Consultation</span>
                </>
              )}
            </div>

            {/* Caller Avatar with Pulsing Rings */}
            <div className="relative mx-auto w-24 h-24 sm:w-28 sm:h-28 mb-5 flex items-center justify-center">
              <div className="absolute inset-0 rounded-full bg-primary/30 animate-ping opacity-50" />
              <div className="absolute -inset-2 rounded-full border-2 border-primary/40 animate-pulse" />
              <Avatar className="w-full h-full border-4 border-slate-800 shadow-xl relative z-10">
                <AvatarImage src={callerPhoto} alt={callerName} className="object-cover" />
                <AvatarFallback className="bg-primary/30 text-white font-bold text-xl sm:text-2xl flex items-center justify-center">
                  {isDoctorCaller ? <Stethoscope className="h-8 w-8" /> : <User className="h-8 w-8" />}
                </AvatarFallback>
              </Avatar>
            </div>

            {/* Caller Details */}
            <h3 id="incoming-call-title" className="text-lg sm:text-2xl font-bold tracking-tight text-white mb-1 break-words">
              {callerName}
            </h3>
            <p id="incoming-call-desc" className="text-xs sm:text-sm text-slate-400 line-clamp-2 mb-2 break-words">
              {callerSubtext}
            </p>

            <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-400 mb-8 font-medium">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
              <span>Encrypted HIPAA Telemedicine Call</span>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-center gap-8 sm:gap-12">
              {/* Decline Button */}
              <div className="flex flex-col items-center gap-2">
                <Button
                  variant="destructive"
                  size="lg"
                  className="rounded-full w-14 h-14 sm:w-16 sm:h-16 p-0 bg-rose-600 hover:bg-rose-700 shadow-[0_0_25px_rgba(244,63,94,0.5)] transition-all hover:scale-110 active:scale-95"
                  onClick={() => handleReject()}
                  disabled={isAnswering}
                  title="Decline Call"
                >
                  <PhoneOff className="h-6 w-6 sm:h-7 sm:w-7 text-white" />
                </Button>
                <span className="text-[11px] font-medium text-slate-400">Decline</span>
              </div>

              {/* Accept Button */}
              <div className="flex flex-col items-center gap-2">
                <Button
                  variant="default"
                  size="lg"
                  className="rounded-full w-14 h-14 sm:w-16 sm:h-16 p-0 bg-emerald-500 hover:bg-emerald-600 shadow-[0_0_30px_rgba(16,185,129,0.6)] transition-all hover:scale-110 active:scale-95 animate-bounce"
                  onClick={() => handleAccept()}
                  disabled={isAnswering}
                  title="Join Video Call"
                >
                  <PhoneCall className="h-6 w-6 sm:h-7 sm:w-7 text-white" />
                </Button>
                <span className="text-[11px] font-medium text-emerald-400 font-semibold">
                  {isAnswering ? "Connecting..." : "Join Call"}
                </span>
              </div>
            </div>

          </div>
        </div>
      )}
    </CallContext.Provider>
  );
}
