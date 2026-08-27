"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/providers/AuthProvider";
import { Button } from "@/components/ui/button";
import { Mic, MicOff, Video, VideoOff, PhoneOff, MessageSquare, Maximize } from "lucide-react";
import { toast } from "sonner";
import { endCall, acceptCall } from "@/services/call.services";

export default function VideoCallPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { user } = useAuth();
  const callId = params.id;

  const [isMicOn, setIsMicOn] = useState(true);
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [isConnected, setIsConnected] = useState(false);
  const [isEnding, setIsEnding] = useState(false);

  // Simulated connection delay
  useEffect(() => {
    const connectTimer = setTimeout(() => {
      // Typically we would also call acceptCall(callId) here if we are the receiver
      acceptCall(callId).catch(() => console.log("Call might already be accepted"));
      setIsConnected(true);
      toast.success("Connected to consultation room");
    }, 2000);
    
    return () => clearTimeout(connectTimer);
  }, [callId]);

  const handleEndCall = async () => {
    setIsEnding(true);
    try {
      await endCall(callId);
      toast.info("Call ended");
    } catch (error) {
      console.log(error);
    } finally {
      if (user?.role === "DOCTOR") {
        router.push("/doctor/appointments");
      } else {
        router.push("/user/appointments");
      }
    }
  };

  return (
    <div className="flex flex-col h-screen bg-slate-950 text-white overflow-hidden">
      
      {/* Header */}
      <header className="absolute top-0 left-0 right-0 z-10 flex items-center justify-between p-6 bg-gradient-to-b from-black/60 to-transparent">
        <div>
          <h1 className="text-xl font-bold tracking-tight">Doctorly Telemedicine</h1>
          <p className="text-sm text-slate-300 flex items-center gap-2">
            <span className={`h-2 w-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-yellow-500 animate-pulse'}`}></span>
            {isConnected ? "Secured Encrypted Call" : "Connecting to peer..."}
          </p>
        </div>
        <div className="text-sm font-mono bg-black/40 px-3 py-1 rounded-md">
          {isConnected ? "00:00" : "--:--"}
        </div>
      </header>

      {/* Main Video Area */}
      <main className="flex-1 relative flex items-center justify-center p-4">
        
        {/* Remote Video (Full Screen Placeholder) */}
        <div className="absolute inset-0 bg-slate-900 flex items-center justify-center overflow-hidden">
          {isConnected ? (
            <div className="relative w-full h-full">
              <div className="absolute inset-0 flex items-center justify-center">
                 <div className="text-center">
                   <div className="h-24 w-24 rounded-full bg-slate-800 mx-auto flex items-center justify-center mb-4">
                     <span className="text-3xl font-bold text-slate-400">P2</span>
                   </div>
                   <p className="text-xl font-medium">Participant is connected</p>
                   <p className="text-slate-400 mt-2 text-sm">(WebRTC Stream would render here)</p>
                 </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mb-4"></div>
              <p className="text-slate-400 font-medium">Establishing secure connection...</p>
            </div>
          )}
        </div>

        {/* Local Video (Picture in Picture Placeholder) */}
        <div className="absolute bottom-24 right-6 w-32 sm:w-48 aspect-video bg-slate-800 rounded-lg overflow-hidden shadow-2xl border-2 border-slate-700/50 z-20 transition-all hover:scale-105 cursor-pointer">
          <div className="w-full h-full flex items-center justify-center relative">
             {isVideoOn ? (
               <div className="text-center">
                 <p className="text-xs text-slate-400">Local Camera</p>
               </div>
             ) : (
               <div className="flex flex-col items-center">
                 <div className="h-10 w-10 rounded-full bg-slate-700 flex items-center justify-center mb-1">
                   <span className="text-sm font-bold text-slate-300">{user?.name?.slice(0, 2).toUpperCase() || 'ME'}</span>
                 </div>
               </div>
             )}
             {!isMicOn && (
               <div className="absolute bottom-1 right-1 bg-red-500/80 p-1 rounded-md">
                 <MicOff className="h-3 w-3 text-white" />
               </div>
             )}
          </div>
        </div>
      </main>

      {/* Controls Footer */}
      <footer className="absolute bottom-0 left-0 right-0 z-10 p-6 bg-gradient-to-t from-black/80 to-transparent flex justify-center items-center gap-4 sm:gap-6">
        
        <Button 
          variant={isMicOn ? "secondary" : "destructive"} 
          size="icon" 
          className="rounded-full h-12 w-12 sm:h-14 sm:w-14 shadow-lg hover:scale-105 transition-transform"
          onClick={() => setIsMicOn(!isMicOn)}
        >
          {isMicOn ? <Mic className="h-5 w-5 sm:h-6 sm:w-6" /> : <MicOff className="h-5 w-5 sm:h-6 sm:w-6" />}
        </Button>

        <Button 
          variant={isVideoOn ? "secondary" : "destructive"} 
          size="icon" 
          className="rounded-full h-12 w-12 sm:h-14 sm:w-14 shadow-lg hover:scale-105 transition-transform"
          onClick={() => setIsVideoOn(!isVideoOn)}
        >
          {isVideoOn ? <Video className="h-5 w-5 sm:h-6 sm:w-6" /> : <VideoOff className="h-5 w-5 sm:h-6 sm:w-6" />}
        </Button>

        <Button 
          variant="destructive" 
          size="icon" 
          className="rounded-full h-14 w-14 sm:h-16 sm:w-16 shadow-lg shadow-red-500/20 hover:scale-110 transition-transform hover:bg-red-600 ml-4 mr-4"
          onClick={handleEndCall}
          disabled={isEnding}
        >
          <PhoneOff className="h-6 w-6 sm:h-7 sm:w-7" />
        </Button>

        <Button 
          variant="secondary" 
          size="icon" 
          className="rounded-full h-12 w-12 sm:h-14 sm:w-14 shadow-lg hover:scale-105 transition-transform"
          onClick={() => toast.info("Chat integration would open sidebar here")}
        >
          <MessageSquare className="h-5 w-5 sm:h-6 sm:w-6" />
        </Button>

        <Button 
          variant="secondary" 
          size="icon" 
          className="rounded-full h-12 w-12 sm:h-14 sm:w-14 shadow-lg hover:scale-105 transition-transform hidden sm:flex"
        >
          <Maximize className="h-5 w-5 sm:h-6 sm:w-6" />
        </Button>

      </footer>

    </div>
  );
}
