/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useEffect, useState } from "react";
import { useSocket } from "./SocketProvider";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Phone, PhoneOff } from "lucide-react";
import { acceptCall, rejectCall } from "@/services/call.services";

export function GlobalListeners() {
  const { socket, isConnected } = useSocket();
  const router = useRouter();
  const [incomingCall, setIncomingCall] = useState<any>(null);

  useEffect(() => {
    if (!socket || !isConnected) return;

    const handleCallIncoming = (payload: any) => {
      // payload: { callId, callerId, caller, type, appointmentId }
      setIncomingCall(payload);
      
      // Auto-dismiss if not answered in 45s (handled by backend call:missed)
    };

    const handleCallCanceled = (payload: any) => {
      if (incomingCall && incomingCall.callId === payload.callId) {
        setIncomingCall(null);
        toast.info("Call canceled by caller");
      }
    };

    const handleCallMissed = (payload: any) => {
      if (incomingCall && incomingCall.callId === payload.callId) {
        setIncomingCall(null);
        toast.info("Missed call");
      }
    };

    (socket as any).on("call:incoming", handleCallIncoming);
    (socket as any).on("call:canceled", handleCallCanceled);
    (socket as any).on("call:missed", handleCallMissed);

    return () => {
      (socket as any).off("call:incoming", handleCallIncoming);
      (socket as any).off("call:canceled", handleCallCanceled);
      (socket as any).off("call:missed", handleCallMissed);
    };
  }, [socket, isConnected, incomingCall]);

  const handleAcceptCall = async () => {
    if (!incomingCall) return;
    try {
      await acceptCall(incomingCall.callId);
      router.push(`/video-call/${incomingCall.callId}`);
      setIncomingCall(null);
    } catch (error: any) {
      toast.error(error.message || "Failed to accept call");
    }
  };

  const handleRejectCall = async () => {
    if (!incomingCall) return;
    try {
      await rejectCall(incomingCall.callId);
      setIncomingCall(null);
    } catch {
      setIncomingCall(null);
    }
  };

  if (!incomingCall) return null;

  const callerName = incomingCall.caller?.name || "Someone";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl rounded-2xl p-6 max-w-sm w-full mx-4 text-center transform scale-100 animate-in zoom-in-95 duration-300">
        <div className="mx-auto w-20 h-20 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mb-4 relative">
          <Phone className="h-8 w-8 text-blue-600 dark:text-blue-400 animate-pulse" />
          <span className="absolute inset-0 rounded-full border-4 border-blue-500 opacity-20 animate-ping"></span>
        </div>
        
        <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-1">Incoming Call</h3>
        <p className="text-slate-500 dark:text-slate-400 mb-8">{callerName} is calling you...</p>
        
        <div className="flex items-center justify-center gap-4">
          <Button 
            variant="destructive" 
            size="lg" 
            className="rounded-full w-14 h-14 p-0 shadow-lg hover:shadow-xl transition-all hover:scale-105"
            onClick={handleRejectCall}
          >
            <PhoneOff className="h-6 w-6" />
          </Button>
          <Button 
            variant="default" 
            size="lg" 
            className="rounded-full w-14 h-14 p-0 bg-green-500 hover:bg-green-600 shadow-lg hover:shadow-xl transition-all hover:scale-105"
            onClick={handleAcceptCall}
          >
            <Phone className="h-6 w-6" />
          </Button>
        </div>
      </div>
    </div>
  );
}
