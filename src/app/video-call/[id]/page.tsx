/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useEffect, useRef, use } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/providers/AuthProvider";
import { useSocket } from "@/providers/SocketProvider";
import { Button } from "@/components/ui/button";
import { Mic, MicOff, Video, VideoOff, PhoneOff } from "lucide-react";
import { toast } from "sonner";
import { endCall } from "@/services/call.services";

export default function VideoCallPage(props: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { user } = useAuth();
  const { socket, isConnected } = useSocket();
  const params = use(props.params);
  
  const callId = params.id;

  const [isMicOn, setIsMicOn] = useState(true);
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [isCallConnected, setIsCallConnected] = useState(false);
  const [isEnding, setIsEnding] = useState(false);

  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const peerConnectionRef = useRef<RTCPeerConnection | null>(null);
  const localStreamRef = useRef<MediaStream | null>(null);

  // Initialize WebRTC and Local Stream
  useEffect(() => {
    if (!socket || !isConnected) return;

    const initMedia = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        localStreamRef.current = stream;
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream;
        }

        // Join the call room
        (socket as any).emit("call:join", { callId }, (res: any) => {
          if (!res?.success) {
             toast.error(res?.error || "Failed to join call");
             handleEndCallLocally();
          }
        });

      } catch {
        toast.error("Camera/Microphone permission denied");
      }
    };

    initMedia();

    return () => {
       cleanupCall();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [socket, isConnected, callId]);

  // Handle Socket Events
  useEffect(() => {
    if (!socket || !isConnected) return;

    const handleCallAccepted = async (payload: any) => {
      if (payload.callId !== callId) return;
      setIsCallConnected(true);
      
      // The caller creates the offer
      if (user?.id !== payload.calleeId) {
         createOffer();
      }
    };

    const handleCallOffer = async (payload: any) => {
      if (payload.callId !== callId || payload.senderId === user?.id) return;
      setIsCallConnected(true);
      await handleReceiveOffer(payload.offer);
    };

    const handleCallAnswer = async (payload: any) => {
      if (payload.callId !== callId || payload.senderId === user?.id) return;
      await handleReceiveAnswer(payload.answer);
    };

    const handleIceCandidate = async (payload: any) => {
      if (payload.callId !== callId || payload.senderId === user?.id) return;
      await handleReceiveIceCandidate(payload.candidate);
    };

    const handleCallEnded = (payload: any) => {
      if (payload.callId !== callId) return;
      toast.info("Call ended by participant");
      handleEndCallLocally();
    };

    (socket as any).on("call:accepted", handleCallAccepted);
    (socket as any).on("call:offer", handleCallOffer);
    (socket as any).on("call:answer", handleCallAnswer);
    (socket as any).on("call:ice-candidate", handleIceCandidate);
    (socket as any).on("call:ended", handleCallEnded);
    (socket as any).on("call:canceled", handleCallEnded);
    (socket as any).on("call:rejected", handleCallEnded);

    return () => {
      (socket as any).off("call:accepted", handleCallAccepted);
      (socket as any).off("call:offer", handleCallOffer);
      (socket as any).off("call:answer", handleCallAnswer);
      (socket as any).off("call:ice-candidate", handleIceCandidate);
      (socket as any).off("call:ended", handleCallEnded);
      (socket as any).off("call:canceled", handleCallEnded);
      (socket as any).off("call:rejected", handleCallEnded);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [socket, isConnected, callId, user?.id]);

  const getPeerConnection = () => {
    if (peerConnectionRef.current) return peerConnectionRef.current;

    const pc = new RTCPeerConnection({
      iceServers: [
        { urls: "stun:stun.l.google.com:19302" },
        { urls: "stun:stun1.l.google.com:19302" }
      ]
    });

    pc.onicecandidate = (event) => {
      if (event.candidate) {
        (socket as any)?.emit("call:ice-candidate", {
          callId,
          candidate: {
            candidate: event.candidate.candidate,
            sdpMid: event.candidate.sdpMid,
            sdpMLineIndex: event.candidate.sdpMLineIndex
          }
        });
      }
    };

    pc.ontrack = (event) => {
      if (remoteVideoRef.current) {
        remoteVideoRef.current.srcObject = event.streams[0];
      }
    };

    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach(track => {
        pc.addTrack(track, localStreamRef.current!);
      });
    }

    peerConnectionRef.current = pc;
    return pc;
  };

  const createOffer = async () => {
    const pc = getPeerConnection();
    const offer = await pc.createOffer();
    await pc.setLocalDescription(offer);
    (socket as any)?.emit("call:offer", {
      callId,
      offer: {
        type: offer.type,
        sdp: offer.sdp
      }
    });
  };

  const handleReceiveOffer = async (offer: RTCSessionDescriptionInit) => {
    const pc = getPeerConnection();
    await pc.setRemoteDescription(new RTCSessionDescription(offer));
    const answer = await pc.createAnswer();
    await pc.setLocalDescription(answer);
    
    (socket as any)?.emit("call:answer", {
      callId,
      answer: {
        type: answer.type,
        sdp: answer.sdp
      }
    });
  };

  const handleReceiveAnswer = async (answer: RTCSessionDescriptionInit) => {
    const pc = getPeerConnection();
    await pc.setRemoteDescription(new RTCSessionDescription(answer));
  };

  const handleReceiveIceCandidate = async (candidateData: any) => {
    const pc = getPeerConnection();
    const candidate = new RTCIceCandidate(candidateData);
    await pc.addIceCandidate(candidate);
  };

  const cleanupCall = () => {
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach(track => track.stop());
    }
    if (peerConnectionRef.current) {
      peerConnectionRef.current.close();
      peerConnectionRef.current = null;
    }
    if (socket && isConnected) {
       (socket as any).emit("call:leave", { callId });
    }
  };

  const handleEndCallLocally = () => {
    cleanupCall();
    if (user?.role === "DOCTOR") {
      router.push("/doctor/appointments");
    } else {
      router.push("/user/appointments");
    }
  };

  const handleEndCall = async () => {
    setIsEnding(true);
    try {
      await endCall(callId);
      (socket as any)?.emit("call:end", { callId });
    } catch (error) {
      console.error("Failed to end call:", error);
    } finally {
      handleEndCallLocally();
    }
  };

  const toggleMic = () => {
    if (localStreamRef.current) {
      const audioTrack = localStreamRef.current.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        setIsMicOn(audioTrack.enabled);
      }
    }
  };

  const toggleVideo = () => {
    if (localStreamRef.current) {
      const videoTrack = localStreamRef.current.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled;
        setIsVideoOn(videoTrack.enabled);
      }
    }
  };

  return (
    <div className="flex flex-col h-screen bg-[#0A0F1C] text-white overflow-hidden relative font-outfit">
      
      {/* Decorative background gradients */}
      <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-primary/10 to-transparent pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-full h-1/2 bg-gradient-to-t from-primary/5 to-transparent pointer-events-none" />

      {/* Floating Header */}
      <header className="absolute top-6 left-0 right-0 z-30 flex justify-center w-full px-6 pointer-events-none">
        <div className="flex items-center justify-between w-full max-w-5xl bg-black/20 backdrop-blur-xl border border-white/10 px-6 py-4 rounded-2xl shadow-lg pointer-events-auto transition-all duration-500 hover:bg-black/30">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary/20 rounded-xl flex items-center justify-center border border-primary/30 shadow-[0_0_15px_rgba(var(--primary),0.2)]">
              <Video className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h1 className="text-lg font-bold tracking-wide text-white">Doctorly Consult</h1>
              <p className="text-xs text-slate-300 flex items-center gap-2 mt-0.5 font-medium tracking-wide">
                <span className="relative flex h-2.5 w-2.5">
                  <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${isCallConnected ? 'bg-green-400' : 'bg-yellow-400'}`}></span>
                  <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${isCallConnected ? 'bg-green-500' : 'bg-yellow-500'}`}></span>
                </span>
                {isCallConnected ? "Secure End-to-End Encryption" : "Waiting for participant..."}
              </p>
            </div>
          </div>
          {isCallConnected && (
            <div className="px-4 py-1.5 bg-green-500/10 border border-green-500/20 rounded-full text-green-400 text-sm font-semibold tracking-wide">
              LIVE
            </div>
          )}
        </div>
      </header>

      {/* Main Video Area */}
      <main className="flex-1 relative flex items-center justify-center">
        
        {/* Remote Video Container */}
        <div className="absolute inset-0 bg-[#0A0F1C] flex items-center justify-center overflow-hidden">
          <video 
            ref={remoteVideoRef} 
            autoPlay 
            playsInline 
            className={`w-full h-full object-cover transition-opacity duration-700 ${isCallConnected ? 'opacity-100' : 'opacity-0 scale-105'}`} 
          />
          {!isCallConnected && (
            <div className="flex flex-col items-center z-10 animate-in fade-in zoom-in duration-700 delay-300">
              <div className="relative mb-6">
                <div className="absolute inset-0 bg-primary/20 rounded-full blur-xl animate-pulse" />
                <div className="h-20 w-20 bg-primary/10 rounded-full border border-primary/30 flex items-center justify-center relative shadow-[0_0_30px_rgba(0,0,0,0.5)]">
                  <Video className="h-8 w-8 text-primary animate-pulse" />
                </div>
              </div>
              <h3 className="text-2xl font-bold tracking-tight text-white mb-2">Connecting...</h3>
              <p className="text-slate-400 font-medium">Please wait while we establish a secure connection.</p>
            </div>
          )}
        </div>

        {/* Local Video (Floating) */}
        <div className="absolute bottom-32 right-6 sm:bottom-8 sm:right-8 w-36 sm:w-60 aspect-[3/4] sm:aspect-video bg-[#111827] rounded-2xl overflow-hidden shadow-[0_10px_40px_rgba(0,0,0,0.6)] border border-white/10 z-20 transition-all duration-300 hover:scale-105 hover:border-primary/50 group">
          <div className="w-full h-full relative bg-gradient-to-br from-slate-900 to-black">
             <video 
                ref={localVideoRef} 
                autoPlay 
                playsInline 
                muted 
                className={`w-full h-full object-cover transition-opacity duration-300 ${!isVideoOn ? 'opacity-0' : 'opacity-100'}`}
             />
             {!isVideoOn && (
               <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-900/90 backdrop-blur-sm">
                 <div className="h-14 w-14 rounded-full bg-gradient-to-br from-slate-700 to-slate-800 flex items-center justify-center mb-2 shadow-inner border border-white/5">
                   <span className="text-lg font-bold text-slate-300 tracking-wider">{user?.name?.slice(0, 2).toUpperCase() || 'ME'}</span>
                 </div>
                 <span className="text-xs font-medium text-slate-400 bg-black/40 px-3 py-1 rounded-full">Camera Off</span>
               </div>
             )}
             {!isMicOn && (
               <div className="absolute top-3 right-3 bg-red-500/90 backdrop-blur-md p-1.5 rounded-full shadow-lg border border-red-400/20">
                 <MicOff className="h-4 w-4 text-white" />
               </div>
             )}
             <div className="absolute bottom-3 left-3 bg-black/50 backdrop-blur-md px-3 py-1 rounded-full border border-white/10 opacity-0 group-hover:opacity-100 transition-opacity">
               <span className="text-xs font-semibold text-white">You</span>
             </div>
          </div>
        </div>
      </main>

      {/* Controls Footer */}
      <footer className="absolute bottom-8 left-0 right-0 z-30 flex justify-center w-full px-4 pointer-events-none">
        <div className="flex items-center gap-4 sm:gap-6 bg-black/40 backdrop-blur-2xl border border-white/10 px-8 py-4 rounded-[2rem] shadow-2xl pointer-events-auto transition-transform duration-300 hover:-translate-y-1">
          
          <div className="flex flex-col items-center gap-2">
            <Button 
              variant={isMicOn ? "secondary" : "destructive"} 
              size="icon" 
              className={`rounded-full h-14 w-14 transition-all duration-300 ${isMicOn ? 'bg-white/10 hover:bg-white/20 text-white border border-white/10' : 'shadow-[0_0_20px_rgba(239,68,68,0.4)]'}`}
              onClick={toggleMic}
            >
              {isMicOn ? <Mic className="h-6 w-6" /> : <MicOff className="h-6 w-6" />}
            </Button>
          </div>

          <div className="flex flex-col items-center gap-2">
            <Button 
              variant={isVideoOn ? "secondary" : "destructive"} 
              size="icon" 
              className={`rounded-full h-14 w-14 transition-all duration-300 ${isVideoOn ? 'bg-white/10 hover:bg-white/20 text-white border border-white/10' : 'shadow-[0_0_20px_rgba(239,68,68,0.4)]'}`}
              onClick={toggleVideo}
            >
              {isVideoOn ? <Video className="h-6 w-6" /> : <VideoOff className="h-6 w-6" />}
            </Button>
          </div>

          <div className="w-px h-10 bg-white/10 mx-2"></div>

          <div className="flex flex-col items-center gap-2">
            <Button 
              variant="destructive" 
              size="icon" 
              className="rounded-full h-16 w-16 shadow-[0_0_30px_rgba(239,68,68,0.3)] hover:shadow-[0_0_40px_rgba(239,68,68,0.5)] transition-all duration-300 hover:scale-105 hover:bg-red-600 bg-red-500"
              onClick={handleEndCall}
              disabled={isEnding}
            >
              <PhoneOff className="h-7 w-7 text-white" />
            </Button>
          </div>

        </div>
      </footer>

    </div>
  );
}
