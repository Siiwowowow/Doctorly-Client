/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useEffect, useRef, use, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/providers/AuthProvider";
import { useSocket } from "@/providers/SocketProvider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  ArrowLeft,
  Mic,
  MicOff,
  Video,
  VideoOff,
  PhoneOff,
  PhoneCall,
  MessageSquare,
  X,
  Send,
  SwitchCamera,
  Maximize2,
  Minimize2,
  Volume2,
  VolumeX,
  ShieldCheck,
  User,
  Clock,
  Radio,
  RefreshCw,
  AlertTriangle,
  Stethoscope,
  PhoneIncoming,
} from "lucide-react";
import { toast } from "sonner";
import { endCall, getCallById, acceptCall, rejectCall } from "@/services/call.services";
import { getIceServersConfig } from "@/lib/webrtc.config";
import { format } from "date-fns";

type CallConnectionStatus =
  | "INITIALIZING"
  | "RINGING"
  | "CONNECTING"
  | "CONNECTED"
  | "RECONNECTING"
  | "FAILED"
  | "ENDED"
  | "REJECTED"
  | "MISSED";

interface InCallMessage {
  id: string;
  senderId: string;
  senderName: string;
  content: string;
  timestamp: string;
}

export default function VideoCallPage(props: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useAuth();
  const { socket, isConnected } = useSocket();
  const params = use(props.params);
  const callId = params.id;

  // Query param hint (e.g. ?type=AUDIO)
  const initialTypeHint = searchParams.get("type") || "VIDEO";

  // Call & Session State
  const [callDetails, setCallDetails] = useState<any>(null);
  const [connectionStatus, setConnectionStatus] = useState<CallConnectionStatus>("INITIALIZING");
  const [isMicOn, setIsMicOn] = useState(true);
  const [isVideoOn, setIsVideoOn] = useState(initialTypeHint !== "AUDIO");
  const [isAudioOnly, setIsAudioOnly] = useState(initialTypeHint === "AUDIO");
  const [showLeaveConfirm, setShowLeaveConfirm] = useState(false);
  const [isEnding, setIsEnding] = useState(false);
  const [isAcceptingInPage, setIsAcceptingInPage] = useState(false);
  const [facingMode, setFacingMode] = useState<"user" | "environment">("user");
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [callDuration, setCallDuration] = useState(0);
  const [audioBlocked, setAudioBlocked] = useState(false);
  const [permissionError, setPermissionError] = useState<string | null>(null);

  // Chat State
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [messages, setMessages] = useState<InCallMessage[]>([]);
  const [msgInput, setMsgInput] = useState("");
  const [unreadCount, setUnreadCount] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // WebRTC & Media Refs
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const remoteAudioRef = useRef<HTMLAudioElement>(null);
  const peerConnectionRef = useRef<RTCPeerConnection | null>(null);
  const localStreamRef = useRef<MediaStream | null>(null);
  const remoteStreamRef = useRef<MediaStream | null>(null);
  const pendingCandidatesQueue = useRef<RTCIceCandidateInit[]>([]);
  const isInitiatorRef = useRef<boolean>(false);
  const isMakingOfferRef = useRef<boolean>(false);
  const isAcquiringMediaRef = useRef<Promise<MediaStream | null> | null>(null);
  const connectionTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isPeerReadyRef = useRef<boolean>(false);

  // Structured WebRTC Debug Logger
  const logCall = useCallback((tag: string, event: string, details?: any) => {
    const formattedTag = `[CALL][${tag}]`;
    if (details !== undefined) {
      console.log(`${formattedTag} ${event}:`, details);
    } else {
      console.log(`${formattedTag} ${event}`);
    }
  }, []);

  // 1. Duration Counter
  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;
    if (connectionStatus === "CONNECTED") {
      timer = setInterval(() => {
        setCallDuration((prev) => prev + 1);
      }, 1000);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [connectionStatus]);

  // 2. Chat Auto-scroll
  useEffect(() => {
    if (isChatOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
      setUnreadCount(0);
    }
  }, [messages, isChatOpen]);

  // 3. Local Media Acquisition
  const initLocalStream = useCallback(
    async (targetFacingMode = facingMode, targetAudioOnly = isAudioOnly): Promise<MediaStream | null> => {
      if (isAcquiringMediaRef.current) {
        return isAcquiringMediaRef.current;
      }

      const mediaPromise = (async () => {
        try {
          logCall("MEDIA", "getUserMedia", { audio: true, video: !targetAudioOnly, facingMode: targetFacingMode });

          if (localStreamRef.current) {
            localStreamRef.current.getTracks().forEach((track) => track.stop());
            localStreamRef.current = null;
          }

          let stream: MediaStream;

          if (targetAudioOnly) {
            // Audio-only calls NEVER request camera permissions
            stream = await navigator.mediaDevices.getUserMedia({
              audio: {
                echoCancellation: true,
                noiseSuppression: true,
                autoGainControl: true,
              },
              video: false,
            });
          } else {
            try {
              stream = await navigator.mediaDevices.getUserMedia({
                video: {
                  facingMode: targetFacingMode,
                  width: { ideal: 1280, max: 1920 },
                  height: { ideal: 720, max: 1080 },
                },
                audio: {
                  echoCancellation: true,
                  noiseSuppression: true,
                  autoGainControl: true,
                },
              });
            } catch (videoErr) {
              console.warn("[CALL][MEDIA] High-res video constraints failed, trying basic video:", videoErr);
              try {
                stream = await navigator.mediaDevices.getUserMedia({
                  video: true,
                  audio: true,
                });
              } catch (cameraErr) {
                console.warn("[CALL][MEDIA] Camera unavailable, falling back to audio stream:", cameraErr);
                toast.info("Camera not detected. Connecting audio only.");
                setIsAudioOnly(true);
                setIsVideoOn(false);
                stream = await navigator.mediaDevices.getUserMedia({
                  audio: true,
                  video: false,
                });
              }
            }
          }

          localStreamRef.current = stream;
          setPermissionError(null);

          const audioTracksCount = stream.getAudioTracks().length;
          const videoTracksCount = stream.getVideoTracks().length;
          logCall("MEDIA", "local-stream-acquired", { audioTracks: audioTracksCount, videoTracks: videoTracksCount });

          if (localVideoRef.current && !targetAudioOnly) {
            localVideoRef.current.srcObject = stream;
          }

          // Attach or replace tracks on existing RTCPeerConnection
          if (peerConnectionRef.current && peerConnectionRef.current.signalingState !== "closed") {
            const pc = peerConnectionRef.current;
            const senders = pc.getSenders();
            stream.getTracks().forEach((track) => {
              const sender = senders.find((s) => s.track?.kind === track.kind);
              if (sender) {
                sender.replaceTrack(track).catch((e) => console.warn("[CALL][MEDIA] replaceTrack error:", e));
              } else {
                pc.addTrack(track, stream);
              }
            });
          }

          setIsMicOn(true);
          if (!targetAudioOnly) setIsVideoOn(true);
          return stream;
        } catch (err: any) {
          logCall("MEDIA", "permission-denied", err?.name || err?.message);
          let errorMsg = "Microphone/Camera access was blocked. Please check browser settings.";
          if (err?.name === "NotAllowedError" || err?.name === "PermissionDeniedError") {
            errorMsg = "Permission denied. Please allow microphone and camera access in your browser settings.";
          } else if (err?.name === "NotFoundError" || err?.name === "DevicesNotFoundError") {
            errorMsg = "No audio/video recording devices found on your system.";
          } else if (err?.name === "NotReadableError" || err?.name === "TrackStartError") {
            errorMsg = "Camera/microphone is in use by another application.";
          }
          setPermissionError(errorMsg);
          toast.error(errorMsg);
          return null;
        } finally {
          isAcquiringMediaRef.current = null;
        }
      })();

      isAcquiringMediaRef.current = mediaPromise;
      return mediaPromise;
    },
    [facingMode, isAudioOnly, logCall]
  );

  // 4. Safe Teardown & Local Cleanup
  const handleEndCallLocally = useCallback(
    (reason = "Consultation ended") => {
      logCall("PC", "cleanup", { reason });

      if (localStreamRef.current) {
        localStreamRef.current.getTracks().forEach((track) => track.stop());
        localStreamRef.current = null;
      }
      if (remoteStreamRef.current) {
        remoteStreamRef.current.getTracks().forEach((track) => track.stop());
        remoteStreamRef.current = null;
      }
      if (peerConnectionRef.current) {
        logCall("PC", "close", { callId });
        peerConnectionRef.current.close();
        peerConnectionRef.current = null;
      }
      if (connectionTimeoutRef.current) {
        clearTimeout(connectionTimeoutRef.current);
        connectionTimeoutRef.current = null;
      }
      pendingCandidatesQueue.current = [];
      isPeerReadyRef.current = false;

      if (socket && isConnected) {
        (socket as any).emit("call:leave", { callId });
      }

      setConnectionStatus("ENDED");
    },
    [callId, isConnected, logCall, socket]
  );

  // 5. Create RTCPeerConnection (Single Instance Guarantee)
  const getOrCreatePeerConnection = useCallback(() => {
    if (peerConnectionRef.current && peerConnectionRef.current.signalingState !== "closed") {
      logCall("PC", "reuse", { callId });
      return peerConnectionRef.current;
    }

    const config = getIceServersConfig();
    const hasTurn = config.iceServers?.some((s) => {
      const urls = Array.isArray(s.urls) ? s.urls : [s.urls];
      return urls.some((u) => u.startsWith("turn:") || u.startsWith("turns:"));
    });

    logCall("PC", "create", {
      callId,
      iceServersCount: config.iceServers?.length,
      turnConfigured: !!hasTurn,
    });

    const pc = new RTCPeerConnection(config);

    // Remote track arrival
    pc.ontrack = (event) => {
      logCall("MEDIA", "remote-track", { kind: event.track.kind, id: event.track.id });

      let stream: MediaStream;
      if (event.streams && event.streams[0]) {
        stream = event.streams[0];
      } else {
        if (!remoteStreamRef.current) {
          remoteStreamRef.current = new MediaStream();
        }
        remoteStreamRef.current.addTrack(event.track);
        stream = remoteStreamRef.current;
      }
      remoteStreamRef.current = stream;

      const audioCount = stream.getAudioTracks().length;
      const videoCount = stream.getVideoTracks().length;
      logCall("MEDIA", "remote-stream-attached", { audioCount, videoCount });

      if (remoteVideoRef.current) {
        remoteVideoRef.current.srcObject = stream;
        remoteVideoRef.current.play().catch((err) => {
          console.warn("[CALL][AUTOPLAY] Remote video autoplay blocked:", err);
          setAudioBlocked(true);
        });
      }

      if (remoteAudioRef.current) {
        remoteAudioRef.current.srcObject = stream;
        remoteAudioRef.current.play().catch((err) => {
          console.warn("[CALL][AUTOPLAY] Remote audio autoplay blocked:", err);
          setAudioBlocked(true);
        });
      }

      setConnectionStatus("CONNECTED");
      if (connectionTimeoutRef.current) {
        clearTimeout(connectionTimeoutRef.current);
        connectionTimeoutRef.current = null;
      }
    };

    // ICE Candidate Generation
    pc.onicecandidate = (event) => {
      if (event.candidate) {
        logCall("ICE", "generated", {
          type: event.candidate.type,
          protocol: event.candidate.protocol,
          address: event.candidate.address,
        });

        if (socket && isConnected) {
          (socket as any).emit("call:ice-candidate", {
            callId,
            candidate: {
              candidate: event.candidate.candidate,
              sdpMid: event.candidate.sdpMid,
              sdpMLineIndex: event.candidate.sdpMLineIndex,
              usernameFragment: event.candidate.usernameFragment,
            },
          });
        }
      } else {
        logCall("ICE", "gathering-complete");
      }
    };

    pc.onsignalingstatechange = () => {
      logCall("STATE", "signalingState", pc.signalingState);
    };

    pc.onicegatheringstatechange = () => {
      logCall("STATE", "iceGatheringState", pc.iceGatheringState);
    };

    pc.oniceconnectionstatechange = () => {
      const state = pc.iceConnectionState;
      logCall("STATE", "iceConnectionState", state);

      if (state === "connected" || state === "completed") {
        setConnectionStatus("CONNECTED");
        if (connectionTimeoutRef.current) {
          clearTimeout(connectionTimeoutRef.current);
          connectionTimeoutRef.current = null;
        }
      } else if (state === "disconnected") {
        setConnectionStatus("RECONNECTING");
      } else if (state === "failed") {
        logCall("STATE", "ice-connection-failed");
        if (pc.restartIce) {
          pc.restartIce();
        }
      }
    };

    pc.onconnectionstatechange = () => {
      const state = pc.connectionState;
      logCall("STATE", "connectionState", state);

      if (state === "connected") {
        setConnectionStatus("CONNECTED");
        logCall("STATE", "connected");
        if (connectionTimeoutRef.current) {
          clearTimeout(connectionTimeoutRef.current);
          connectionTimeoutRef.current = null;
        }
      } else if (state === "connecting") {
        setConnectionStatus("CONNECTING");
      } else if (state === "disconnected") {
        setConnectionStatus("RECONNECTING");
      } else if (state === "failed") {
        setConnectionStatus("FAILED");
        logCall("STATE", "failed");
      } else if (state === "closed") {
        setConnectionStatus("ENDED");
      }
    };

    // Attach local tracks if available
    if (localStreamRef.current && localStreamRef.current.getTracks().length > 0) {
      localStreamRef.current.getTracks().forEach((track) => {
        logCall("MEDIA", "adding-local-track-to-pc", track.kind);
        pc.addTrack(track, localStreamRef.current!);
      });
    }

    peerConnectionRef.current = pc;
    return pc;
  }, [callId, isConnected, logCall, socket]);

  // 6. Flush Queued ICE Candidates
  const flushPendingIceCandidates = useCallback(
    async (pc: RTCPeerConnection) => {
      if (!pc.remoteDescription || !pc.remoteDescription.type) return;
      const count = pendingCandidatesQueue.current.length;
      logCall("ICE", "flush-start", { queueLength: count });

      while (pendingCandidatesQueue.current.length > 0) {
        const candidateInit = pendingCandidatesQueue.current.shift();
        if (candidateInit && candidateInit.candidate) {
          try {
            await pc.addIceCandidate(new RTCIceCandidate(candidateInit));
            logCall("ICE", "applied", { type: (candidateInit as any).type || "candidate" });
          } catch (e: any) {
            console.warn("[CALL][ICE] Error applying queued candidate:", e?.message);
          }
        }
      }
      logCall("ICE", "flush-complete", { flushedCount: count });
    },
    [logCall]
  );

  // 7. Create Offer (DOCTOR / CALLER ONLY — Triggered after call:ready handshake)
  const createOffer = useCallback(async () => {
    if (isMakingOfferRef.current) return;
    try {
      isMakingOfferRef.current = true;
      setConnectionStatus("CONNECTING");
      logCall("SIGNAL", "offer-create-start");

      let localStream = localStreamRef.current;
      if (!localStream) {
        localStream = await initLocalStream();
      }

      const pc = getOrCreatePeerConnection();

      if (localStream) {
        const senders = pc.getSenders();
        localStream.getTracks().forEach((track) => {
          if (!senders.some((s) => s.track?.id === track.id || s.track?.kind === track.kind)) {
            pc.addTrack(track, localStream!);
          }
        });
      }

      const offer = await pc.createOffer({
        offerToReceiveAudio: true,
        offerToReceiveVideo: !isAudioOnly,
      });

      await pc.setLocalDescription(offer);
      logCall("SIGNAL", "offer-sent", { type: offer.type });

      if (socket && isConnected) {
        (socket as any).emit("call:offer", {
          callId,
          offer: {
            type: offer.type,
            sdp: offer.sdp,
          },
        });
      }

      // 30s connection timeout
      if (!connectionTimeoutRef.current) {
        connectionTimeoutRef.current = setTimeout(() => {
          if (peerConnectionRef.current?.connectionState !== "connected") {
            logCall("STATE", "timeout-after-30s");
            setConnectionStatus("FAILED");
          }
        }, 30000);
      }
    } catch (err: any) {
      console.error("[CALL][SIGNAL] Error creating offer:", err);
      setConnectionStatus("FAILED");
    } finally {
      isMakingOfferRef.current = false;
    }
  }, [callId, getOrCreatePeerConnection, initLocalStream, isAudioOnly, isConnected, logCall, socket]);

  // 8. Handle Received Offer (PATIENT / CALLEE ONLY)
  const handleReceiveOffer = useCallback(
    async (offer: RTCSessionDescriptionInit) => {
      try {
        logCall("SIGNAL", "offer-received", { sdpType: offer.type });
        setConnectionStatus("CONNECTING");

        let localStream = localStreamRef.current;
        if (!localStream) {
          localStream = await initLocalStream();
        }

        const pc = getOrCreatePeerConnection();

        if (localStream) {
          const senders = pc.getSenders();
          localStream.getTracks().forEach((track) => {
            if (!senders.some((s) => s.track?.id === track.id || s.track?.kind === track.kind)) {
              pc.addTrack(track, localStream!);
            }
          });
        }

        await pc.setRemoteDescription(new RTCSessionDescription(offer));
        logCall("SIGNAL", "remote-description-set(Offer)");

        await flushPendingIceCandidates(pc);

        const answer = await pc.createAnswer();
        await pc.setLocalDescription(answer);
        logCall("SIGNAL", "answer-sent", { type: answer.type });

        if (socket && isConnected) {
          (socket as any).emit("call:answer", {
            callId,
            answer: {
              type: answer.type,
              sdp: answer.sdp,
            },
          });
        }
      } catch (err: any) {
        console.error("[CALL][SIGNAL] Error handling offer:", err);
      }
    },
    [callId, flushPendingIceCandidates, getOrCreatePeerConnection, initLocalStream, isConnected, logCall, socket]
  );

  // 9. Handle Received Answer (DOCTOR / CALLER ONLY)
  const handleReceiveAnswer = useCallback(
    async (answer: RTCSessionDescriptionInit) => {
      try {
        logCall("SIGNAL", "answer-received", { sdpType: answer.type });
        const pc = getOrCreatePeerConnection();

        if (pc.signalingState === "have-local-offer") {
          await pc.setRemoteDescription(new RTCSessionDescription(answer));
          logCall("SIGNAL", "remote-description-set(Answer)");
          await flushPendingIceCandidates(pc);
        }
      } catch (err: any) {
        console.error("[CALL][SIGNAL] Error handling answer:", err);
      }
    },
    [flushPendingIceCandidates, getOrCreatePeerConnection, logCall]
  );

  // 10. Handle Received Remote ICE Candidate
  const handleReceiveIceCandidate = useCallback(
    async (candidateData: RTCIceCandidateInit) => {
      if (!candidateData || !candidateData.candidate) return;
      try {
        const pc = getOrCreatePeerConnection();
        if (!pc.remoteDescription || !pc.remoteDescription.type) {
          pendingCandidatesQueue.current.push(candidateData);
          logCall("ICE", "queued");
        } else {
          await pc.addIceCandidate(new RTCIceCandidate(candidateData));
          logCall("ICE", "applied-immediately");
        }
      } catch (err: any) {
        console.warn("[CALL][ICE] Error applying ICE candidate:", err?.message);
      }
    },
    [getOrCreatePeerConnection, logCall]
  );

  // 11. Initial Call Fetch & Lifecycle Validation
  useEffect(() => {
    let isMounted = true;
    getCallById(callId)
      .then((res) => {
        if (!isMounted || !res?.data) return;
        const call = res.data;
        logCall("SESSION", "loaded", { callId: call.id, status: call.status, type: call.type });
        setCallDetails(call);

        const isAudio = call.type === "AUDIO";
        setIsAudioOnly(isAudio);
        if (isAudio) setIsVideoOn(false);

        const isCaller = user?.id && call.callerId === user.id;
        isInitiatorRef.current = !!isCaller;

        // Check if call has already concluded
        const terminalStatuses = ["ENDED", "REJECTED", "MISSED", "CANCELED", "FAILED"];
        if (terminalStatuses.includes(call.status)) {
          setConnectionStatus("ENDED");
          return;
        }

        if (isCaller) {
          // Doctor / Caller flow: Start preview, wait for call:ready
          setConnectionStatus("RINGING");
          initLocalStream();
        } else {
          // Patient / Callee flow: If accepted or joining, acquire media and emit call:ready
          if (call.status === "RINGING") {
            setConnectionStatus("RINGING");
          } else {
            setConnectionStatus("CONNECTING");
            initLocalStream().then(() => {
              if (socket && isConnected) {
                logCall("SIGNAL", "emit:call:ready", { callId, role: user?.role });
                (socket as any).emit("call:ready", { callId, userId: user?.id, role: user?.role });
              }
            });
          }
        }
      })
      .catch((err) => {
        console.warn("[CALL][SESSION] Fetch failed:", err);
        setConnectionStatus("FAILED");
      });

    return () => {
      isMounted = false;
    };
  }, [callId, user?.id, user?.role, socket, isConnected, logCall, initLocalStream]);

  // 12. Socket Listeners Setup & call:ready Handshake
  useEffect(() => {
    if (!socket || !isConnected) return;

    // Join the call room
    (socket as any).emit("call:join", { callId }, (res: any) => {
      logCall("SOCKET", "call:join-ack", res);
      if (!res?.success) {
        toast.error(res?.error || "Unable to join consultation room");
      } else {
        // If Callee is already in or joined, emit call:ready to announce readiness to Caller
        if (!isInitiatorRef.current && (callDetails?.status === "ACCEPTED" || callDetails?.status === "IN_PROGRESS")) {
          logCall("SIGNAL", "emit:call:ready(on-join)", { callId });
          (socket as any).emit("call:ready", { callId, userId: user?.id, role: user?.role });
        }
      }
    });

    // Caller receives call:ready from Callee -> Trigger deterministic Offer creation
    const handleCallReadyEvent = (payload: any) => {
      if (payload.callId !== callId) return;
      logCall("SIGNAL", "recv:call:ready", payload);
      isPeerReadyRef.current = true;
      if (isInitiatorRef.current) {
        logCall("SIGNAL", "initiating-offer-on-ready");
        createOffer();
      }
    };

    // Caller receives call:accepted -> Callee accepted call
    const handleCallAcceptedEvent = () => {
      logCall("SIGNAL", "recv:call:accepted");
      toast.success("Recipient accepted call");
      if (isInitiatorRef.current && isPeerReadyRef.current) {
        createOffer();
      }
    };

    // Callee or Caller joins room
    const handleUserJoinedEvent = (payload: any) => {
      if (payload.callId !== callId || payload.userId === user?.id) return;
      logCall("SIGNAL", "recv:call:user-joined", payload.userId);

      // If Callee sees Caller joined -> Callee announces call:ready
      if (!isInitiatorRef.current) {
        logCall("SIGNAL", "emit:call:ready(peer-joined)");
        (socket as any).emit("call:ready", { callId, userId: user?.id, role: user?.role });
      } else {
        // Caller sees Callee joined -> Trigger offer
        createOffer();
      }
    };

    const handleCallOfferEvent = async (payload: any) => {
      if (payload.callId !== callId || payload.senderId === user?.id) return;
      logCall("SIGNAL", "recv:call:offer");
      await handleReceiveOffer(payload.offer);
    };

    const handleCallAnswerEvent = async (payload: any) => {
      if (payload.callId !== callId || payload.senderId === user?.id) return;
      logCall("SIGNAL", "recv:call:answer");
      await handleReceiveAnswer(payload.answer);
    };

    const handleIceCandidateEvent = async (payload: any) => {
      if (payload.callId !== callId || payload.senderId === user?.id) return;
      await handleReceiveIceCandidate(payload.candidate);
    };

    const handleCallEndedEvent = (payload: any) => {
      if (payload.callId !== callId) return;
      logCall("SIGNAL", "recv:call:ended");
      toast.info("Consultation call ended");
      handleEndCallLocally("Call ended by participant");
    };

    (socket as any).on("call:ready", handleCallReadyEvent);
    (socket as any).on("call:accepted", handleCallAcceptedEvent);
    (socket as any).on("call:user-joined", handleUserJoinedEvent);
    (socket as any).on("call:offer", handleCallOfferEvent);
    (socket as any).on("call:answer", handleCallAnswerEvent);
    (socket as any).on("call:ice-candidate", handleIceCandidateEvent);
    (socket as any).on("call:ended", handleCallEndedEvent);
    (socket as any).on("call:canceled", handleCallEndedEvent);
    (socket as any).on("call:rejected", handleCallEndedEvent);

    return () => {
      (socket as any).off("call:ready", handleCallReadyEvent);
      (socket as any).off("call:accepted", handleCallAcceptedEvent);
      (socket as any).off("call:user-joined", handleUserJoinedEvent);
      (socket as any).off("call:offer", handleCallOfferEvent);
      (socket as any).off("call:answer", handleCallAnswerEvent);
      (socket as any).off("call:ice-candidate", handleIceCandidateEvent);
      (socket as any).off("call:ended", handleCallEndedEvent);
      (socket as any).off("call:canceled", handleCallEndedEvent);
      (socket as any).off("call:rejected", handleCallEndedEvent);

      // Clean unmount teardown
      if (localStreamRef.current) {
        localStreamRef.current.getTracks().forEach((track) => track.stop());
        localStreamRef.current = null;
      }
      if (remoteStreamRef.current) {
        remoteStreamRef.current.getTracks().forEach((track) => track.stop());
        remoteStreamRef.current = null;
      }
      if (peerConnectionRef.current) {
        peerConnectionRef.current.close();
        peerConnectionRef.current = null;
      }
      if (connectionTimeoutRef.current) {
        clearTimeout(connectionTimeoutRef.current);
        connectionTimeoutRef.current = null;
      }
    };
  }, [
    socket,
    isConnected,
    callId,
    user?.id,
    user?.role,
    callDetails?.status,
    createOffer,
    handleReceiveOffer,
    handleReceiveAnswer,
    handleReceiveIceCandidate,
    handleEndCallLocally,
    logCall,
  ]);

  // 13. Callee In-Page Accept
  const handleInPageAccept = async () => {
    setIsAcceptingInPage(true);
    try {
      await acceptCall(callId);
      setConnectionStatus("CONNECTING");
      await initLocalStream();
      if (socket && isConnected) {
        (socket as any).emit("call:join", { callId });
        (socket as any).emit("call:ready", { callId, userId: user?.id, role: user?.role });
      }
    } catch (err: any) {
      toast.error(err?.message || "Failed to accept consultation");
    } finally {
      setIsAcceptingInPage(false);
    }
  };

  // 14. Callee In-Page Decline
  const handleInPageDecline = async () => {
    try {
      await rejectCall(callId, "Declined by patient");
      if (socket && isConnected) {
        (socket as any).emit("call:reject", { callId, reason: "Declined" });
      }
    } catch (err) {
      console.warn("[CALL][SESSION] Reject error:", err);
    } finally {
      handleEndCallLocally("Call declined");
      const exitUrl = user?.role === "DOCTOR" ? "/doctor/appointments" : "/user/appointments";
      router.push(exitUrl);
    }
  };

  // 15. End Call Action
  const handleEndCall = async () => {
    setIsEnding(true);
    try {
      await endCall(callId, "Consultation completed");
      if (socket && isConnected) {
        (socket as any).emit("call:end", { callId });
      }
    } catch (error) {
      console.error("[CALL][SESSION] End call request error:", error);
    } finally {
      handleEndCallLocally("Ended by user");
      const exitUrl = user?.role === "DOCTOR" ? "/doctor/appointments" : "/user/appointments";
      router.push(exitUrl);
    }
  };

  // 16. Media Controls
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
    if (isAudioOnly) {
      toast.info("This is an audio-only consultation.");
      return;
    }
    if (localStreamRef.current) {
      const videoTrack = localStreamRef.current.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled;
        setIsVideoOn(videoTrack.enabled);
      }
    }
  };

  const toggleCameraFlip = async () => {
    if (isAudioOnly) return;
    const nextMode = facingMode === "user" ? "environment" : "user";
    setFacingMode(nextMode);
    await initLocalStream(nextMode, false);
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  const handleUnblockAudio = () => {
    if (remoteVideoRef.current) remoteVideoRef.current.play().catch(() => {});
    if (remoteAudioRef.current) remoteAudioRef.current.play().catch(() => {});
    setAudioBlocked(false);
  };

  const handleRetryConnection = () => {
    setConnectionStatus("CONNECTING");
    initLocalStream().then(() => {
      if (socket && isConnected) {
        (socket as any).emit("call:ready", { callId, userId: user?.id, role: user?.role });
      }
    });
  };

  // 17. In-Call Chat Message
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!msgInput.trim() || !socket || !isConnected) return;

    const tempId = Date.now().toString();
    const content = msgInput.trim();
    const myName = user?.email?.split("@")[0] || "Me";

    const newMsg: InCallMessage = {
      id: tempId,
      senderId: user?.id || "me",
      senderName: myName,
      content,
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, newMsg]);
    setMsgInput("");

    (socket as any).emit("call:message", {
      callId,
      content,
      tempId,
    });
  };

  // Participant formatting
  const isDoctor = user?.role === "DOCTOR";
  const otherParty = isDoctor ? callDetails?.receiver : callDetails?.caller;
  const otherPartyName = isDoctor
    ? (otherParty?.patient?.name || otherParty?.name || "Patient")
    : (otherParty?.doctor?.name ? `Dr. ${otherParty.doctor.name}` : otherParty?.name || "Doctor");
  const otherPartyPhoto = otherParty?.doctor?.profilePhoto || otherParty?.patient?.profilePhoto || otherParty?.image;

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remainingSecs = secs % 60;
    return `${mins.toString().padStart(2, "0")}:${remainingSecs.toString().padStart(2, "0")}`;
  };

  // 18. Terminal / Ended Screen
  if (connectionStatus === "ENDED" || connectionStatus === "REJECTED" || connectionStatus === "MISSED") {
    return (
      <div className="w-full h-screen bg-slate-950 text-white flex flex-col items-center justify-center p-6 text-center">
        <div className="w-20 h-20 rounded-full bg-slate-800 border-2 border-slate-700 flex items-center justify-center mb-4 text-slate-400">
          <PhoneOff className="h-10 w-10 text-rose-500" />
        </div>
        <h1 className="text-2xl font-bold mb-2">
          {connectionStatus === "REJECTED" ? "Consultation Declined" : "Consultation Ended"}
        </h1>
        <p className="text-sm text-slate-400 max-w-sm mb-6">
          {callDuration > 0
            ? `Consultation concluded. Total call duration: ${formatTime(callDuration)}.`
            : "This consultation session is no longer active."}
        </p>
        <Button
          className="bg-primary hover:bg-primary/90 text-white rounded-full px-6 py-2 text-xs font-semibold"
          onClick={() => {
            const exitUrl = user?.role === "DOCTOR" ? "/doctor/appointments" : "/user/appointments";
            router.push(exitUrl);
          }}
        >
          Back to Appointments
        </Button>
      </div>
    );
  }

  // 19. Callee Incoming Ringing Screen (Direct URL fallback)
  const isCalleeRinging = !isInitiatorRef.current && connectionStatus === "RINGING";

  if (isCalleeRinging) {
    return (
      <div className="w-full h-screen bg-slate-950 text-white flex flex-col items-center justify-center p-6 text-center">
        <div className="relative mb-6">
          <div className="w-28 h-28 rounded-full border-4 border-emerald-500/80 overflow-hidden shadow-2xl flex items-center justify-center bg-slate-800 animate-pulse">
            <Avatar className="w-full h-full">
              <AvatarImage src={otherPartyPhoto} alt={otherPartyName} className="object-cover" />
              <AvatarFallback className="text-2xl font-bold bg-primary/20 text-white">
                <Stethoscope className="h-10 w-10" />
              </AvatarFallback>
            </Avatar>
          </div>
          <span className="absolute -bottom-1 -right-1 flex h-6 w-6">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-6 w-6 bg-emerald-500 items-center justify-center">
              <PhoneIncoming className="h-3.5 w-3.5 text-white" />
            </span>
          </span>
        </div>

        <h2 className="text-2xl font-bold mb-1">Incoming Consultation Call</h2>
        <p className="text-sm text-slate-300 mb-2">{otherPartyName} is calling you...</p>
        <p className="text-xs text-slate-500 mb-8 max-w-sm">
          {isAudioOnly ? "Secure Encrypted Audio Consultation" : "Secure High-Definition Video Consultation"}
        </p>

        <div className="flex items-center gap-4">
          <Button
            variant="destructive"
            className="rounded-full px-6 py-2.5 text-xs font-semibold bg-rose-600 hover:bg-rose-700 text-white shadow-lg"
            onClick={handleInPageDecline}
          >
            <PhoneOff className="mr-2 h-4 w-4" />
            Decline
          </Button>

          <Button
            className="rounded-full px-7 py-2.5 text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg animate-bounce"
            onClick={handleInPageAccept}
            disabled={isAcceptingInPage}
          >
            <PhoneCall className="mr-2 h-4 w-4" />
            {isAcceptingInPage ? "Accepting..." : "Accept Call"}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-screen bg-slate-950 text-white flex flex-col select-none overflow-hidden font-sans">
      <audio ref={remoteAudioRef} autoPlay playsInline />

      {/* Top Header Bar */}
      <header className="absolute top-0 inset-x-0 z-30 flex items-center justify-between px-4 sm:px-6 py-3 bg-gradient-to-b from-slate-950/90 via-slate-950/50 to-transparent backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setShowLeaveConfirm(true)}
            className="size-8.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all shrink-0"
            title="Exit Consultation"
          >
            <ArrowLeft className="size-4" />
          </Button>
          <div className="flex items-center gap-2 bg-slate-900/80 border border-white/10 px-3 py-1.5 rounded-full shadow-lg backdrop-blur-md">
            <span
              className={`h-2.5 w-2.5 rounded-full ${
                connectionStatus === "CONNECTED"
                  ? "bg-emerald-400 animate-pulse shadow-[0_0_8px_#34d399]"
                  : connectionStatus === "CONNECTING" || connectionStatus === "INITIALIZING" || connectionStatus === "RINGING"
                  ? "bg-amber-400 animate-ping"
                  : "bg-red-500"
              }`}
            />
            <span className="text-xs font-semibold tracking-wide text-slate-200 uppercase">
              {connectionStatus === "CONNECTED"
                ? "Live Consultation"
                : connectionStatus === "RINGING"
                ? isInitiatorRef.current ? "Ringing Patient..." : "Incoming..."
                : connectionStatus === "CONNECTING" || connectionStatus === "INITIALIZING"
                ? "Connecting..."
                : connectionStatus === "RECONNECTING"
                ? "Reconnecting..."
                : connectionStatus === "FAILED"
                ? "Connection Failed"
                : "Disconnected"}
            </span>
          </div>

          {/* Call Duration */}
          {connectionStatus === "CONNECTED" && (
            <div className="flex items-center gap-1.5 bg-white/5 border border-white/10 px-3 py-1.5 rounded-full text-xs font-medium text-slate-300">
              <Clock className="h-3.5 w-3.5 text-primary" />
              <span>{formatTime(callDuration)}</span>
            </div>
          )}
        </div>

        {/* Identity & Badges */}
        <div className="flex items-center gap-2 sm:gap-4">
          <div className="hidden sm:flex items-center gap-2 bg-slate-900/80 border border-white/10 px-3 py-1.5 rounded-full">
            <Avatar className="h-5 w-5">
              <AvatarImage src={otherPartyPhoto} alt={otherPartyName} />
              <AvatarFallback className="text-[10px] bg-primary/30">
                {isDoctor ? <User className="h-3 w-3" /> : <Stethoscope className="h-3 w-3" />}
              </AvatarFallback>
            </Avatar>
            <span className="text-xs font-medium text-slate-200">{otherPartyName}</span>
          </div>

          <div className="hidden md:flex items-center gap-1 text-[11px] text-emerald-400/90 bg-emerald-950/40 border border-emerald-500/20 px-2.5 py-1 rounded-full">
            <ShieldCheck className="h-3.5 w-3.5" />
            <span>HIPAA Encrypted</span>
          </div>

          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9 text-slate-300 hover:text-white rounded-full bg-white/5 hover:bg-white/10"
            onClick={toggleFullscreen}
            title={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
          >
            {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
          </Button>
        </div>
      </header>

      {/* Main Viewport */}
      <main className="relative flex-1 w-full h-full flex items-center justify-center bg-slate-950 overflow-hidden">
        {permissionError && (
          <div className="absolute top-16 z-40 max-w-md mx-4 bg-amber-500/90 text-slate-950 px-4 py-2.5 rounded-2xl shadow-xl flex items-center gap-3 backdrop-blur-md">
            <AlertTriangle className="h-5 w-5 shrink-0" />
            <p className="text-xs font-medium">{permissionError}</p>
          </div>
        )}

        {audioBlocked && (
          <div className="absolute top-20 z-40 bg-primary/95 text-white px-4 py-2.5 rounded-2xl shadow-xl flex items-center gap-3 backdrop-blur-md">
            <VolumeX className="h-5 w-5 shrink-0" />
            <span className="text-xs font-medium">Browser blocked audio autoplay.</span>
            <Button
              size="sm"
              variant="secondary"
              className="h-7 text-xs font-bold bg-white text-slate-900 hover:bg-white/90 rounded-lg px-3"
              onClick={handleUnblockAudio}
            >
              Unmute Audio
            </Button>
          </div>
        )}

        {!isAudioOnly ? (
          <div className="relative w-full h-full flex items-center justify-center">
            {/* Remote Video Stream */}
            <video
              ref={remoteVideoRef}
              autoPlay
              playsInline
              className="w-full h-full object-cover sm:object-contain bg-slate-950"
            />

            {/* Connecting Overlay */}
            {connectionStatus !== "CONNECTED" && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-900/90 backdrop-blur-md z-10 p-6 text-center">
                <div className="relative mb-6">
                  <div className="w-28 h-28 rounded-full border-4 border-slate-700 overflow-hidden shadow-2xl flex items-center justify-center bg-slate-800">
                    <Avatar className="w-full h-full">
                      <AvatarImage src={otherPartyPhoto} alt={otherPartyName} className="object-cover" />
                      <AvatarFallback className="text-2xl font-bold bg-primary/20 text-white">
                        {isDoctor ? <User className="h-10 w-10" /> : <Stethoscope className="h-10 w-10" />}
                      </AvatarFallback>
                    </Avatar>
                  </div>
                  {connectionStatus === "CONNECTING" || connectionStatus === "INITIALIZING" || connectionStatus === "RINGING" ? (
                    <span className="absolute -bottom-1 -right-1 flex h-6 w-6">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-6 w-6 bg-primary items-center justify-center text-[10px]">
                        <Radio className="h-3.5 w-3.5 text-white" />
                      </span>
                    </span>
                  ) : null}
                </div>

                <h2 className="text-xl sm:text-2xl font-bold text-white mb-1">{otherPartyName}</h2>
                <p className="text-xs sm:text-sm text-slate-400 mb-6 max-w-sm">
                  {connectionStatus === "FAILED"
                    ? "Unable to establish WebRTC media channel. Please check network or retry."
                    : connectionStatus === "RINGING"
                    ? isInitiatorRef.current ? "Ringing recipient's device..." : "Incoming consultation call..."
                    : connectionStatus === "RECONNECTING"
                    ? "Reconnecting WebRTC media channel..."
                    : "Connecting secure peer-to-peer audio and video channel..."}
                </p>

                {connectionStatus === "FAILED" && (
                  <div className="flex items-center gap-3">
                    <Button
                      onClick={handleRetryConnection}
                      className="bg-primary hover:bg-primary/90 text-white rounded-full px-6 py-2 text-xs font-semibold shadow-lg inline-flex items-center gap-2"
                    >
                      <RefreshCw className="h-3.5 w-3.5" />
                      Retry Connection
                    </Button>
                    <Button
                      variant="outline"
                      onClick={handleEndCall}
                      className="rounded-full px-6 py-2 text-xs font-semibold border-white/20 hover:bg-white/10 text-white"
                    >
                      End Call
                    </Button>
                  </div>
                )}
              </div>
            )}

            {/* Local Video Preview */}
            <div className="absolute bottom-24 right-4 sm:right-6 z-20 w-28 h-36 sm:w-44 sm:h-56 rounded-2xl overflow-hidden shadow-2xl border-2 border-white/20 bg-slate-900 transition-all duration-300 hover:scale-105">
              <video
                ref={localVideoRef}
                autoPlay
                playsInline
                muted
                className={`w-full h-full object-cover ${facingMode === "user" ? "-scale-x-100" : ""}`}
              />
              {!isVideoOn && (
                <div className="absolute inset-0 bg-slate-900 flex flex-col items-center justify-center text-slate-400 p-2 text-center">
                  <VideoOff className="h-6 w-6 mb-1 text-slate-500" />
                  <span className="text-[10px]">Camera Off</span>
                </div>
              )}
              <div className="absolute top-2 left-2 px-2 py-0.5 bg-black/60 backdrop-blur-sm rounded-md text-[10px] font-medium text-white/90">
                You
              </div>
            </div>
          </div>
        ) : (
          /* Audio-Only View */
          <div className="relative w-full h-full flex flex-col items-center justify-center p-6 text-center bg-gradient-to-b from-slate-900 via-slate-950 to-slate-900">
            <div className="absolute w-72 h-72 sm:w-96 sm:h-96 bg-primary/15 rounded-full blur-3xl pointer-events-none" />

            <div className="relative mb-6">
              {connectionStatus === "CONNECTED" && (
                <>
                  <div className="absolute -inset-6 rounded-full border border-emerald-500/30 animate-ping opacity-30" />
                  <div className="absolute -inset-12 rounded-full border border-primary/20 animate-pulse opacity-40" />
                </>
              )}

              <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-full border-4 border-slate-700/80 shadow-2xl overflow-hidden relative z-10 bg-slate-800">
                <Avatar className="w-full h-full">
                  <AvatarImage src={otherPartyPhoto} alt={otherPartyName} className="object-cover" />
                  <AvatarFallback className="text-3xl font-bold bg-primary/20 text-white">
                    {isDoctor ? <User className="h-16 w-16" /> : <Stethoscope className="h-16 w-16" />}
                  </AvatarFallback>
                </Avatar>
              </div>

              <div className="absolute bottom-1 right-2 z-20 bg-slate-900 border border-white/20 p-2 rounded-full shadow-lg">
                {connectionStatus === "CONNECTED" ? (
                  <Volume2 className="h-4 w-4 text-emerald-400 animate-pulse" />
                ) : (
                  <Radio className="h-4 w-4 text-amber-400 animate-spin" />
                )}
              </div>
            </div>

            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-1">{otherPartyName}</h2>
            <p className="text-xs sm:text-sm text-slate-400 mb-4 max-w-sm">
              {connectionStatus === "CONNECTED"
                ? "Secure Audio Consultation Active"
                : connectionStatus === "RINGING"
                ? isInitiatorRef.current ? "Ringing recipient's device..." : "Incoming audio consultation..."
                : connectionStatus === "FAILED"
                ? "Audio channel connection failed."
                : connectionStatus === "RECONNECTING"
                ? "Reconnecting audio channel..."
                : "Establishing encrypted audio channel..."}
            </p>

            {connectionStatus === "FAILED" && (
              <div className="flex items-center gap-3 mb-4">
                <Button
                  onClick={handleRetryConnection}
                  className="bg-primary hover:bg-primary/90 text-white rounded-full px-6 py-2 text-xs font-semibold shadow-lg inline-flex items-center gap-2"
                >
                  <RefreshCw className="h-3.5 w-3.5" />
                  Retry Audio Call
                </Button>
                <Button
                  variant="outline"
                  onClick={handleEndCall}
                  className="rounded-full px-6 py-2 text-xs font-semibold border-white/20 hover:bg-white/10 text-white"
                >
                  End Call
                </Button>
              </div>
            )}

            {connectionStatus === "CONNECTED" && (
              <div className="flex items-center gap-1.5 h-8 my-2">
                {[40, 75, 55, 90, 65, 80, 45, 95, 60, 85, 50, 70].map((height, idx) => (
                  <div
                    key={idx}
                    className="w-1 bg-emerald-400/80 rounded-full animate-pulse"
                    style={{
                      height: `${height}%`,
                      animationDelay: `${(idx * 0.1).toFixed(1)}s`,
                      animationDuration: "0.8s",
                    }}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* Floating Controls */}
        <footer className="absolute bottom-6 inset-x-0 z-30 flex items-center justify-center px-4">
          <div className="flex items-center gap-2 sm:gap-4 bg-slate-900/90 border border-white/15 px-3 sm:px-6 py-2.5 sm:py-3 rounded-full shadow-[0_10px_40px_rgba(0,0,0,0.6)] backdrop-blur-xl max-w-[96vw] overflow-x-auto">
            <Button
              variant={isMicOn ? "secondary" : "destructive"}
              size="icon"
              className={`rounded-full h-11 w-11 sm:h-12 sm:w-12 ${
                isMicOn
                  ? "bg-white/10 hover:bg-white/20 text-white border border-white/10"
                  : "bg-red-500 hover:bg-red-600 text-white"
              }`}
              onClick={toggleMic}
              title={isMicOn ? "Mute Microphone" : "Unmute Microphone"}
            >
              {isMicOn ? <Mic className="h-5 w-5" /> : <MicOff className="h-5 w-5" />}
            </Button>

            {!isAudioOnly && (
              <>
                <Button
                  variant={isVideoOn ? "secondary" : "destructive"}
                  size="icon"
                  className={`rounded-full h-11 w-11 sm:h-12 sm:w-12 ${
                    isVideoOn
                      ? "bg-white/10 hover:bg-white/20 text-white border border-white/10"
                      : "bg-red-500 hover:bg-red-600 text-white"
                  }`}
                  onClick={toggleVideo}
                  title={isVideoOn ? "Turn Camera Off" : "Turn Camera On"}
                >
                  {isVideoOn ? <Video className="h-5 w-5" /> : <VideoOff className="h-5 w-5" />}
                </Button>

                <Button
                  variant="secondary"
                  size="icon"
                  className="rounded-full h-11 w-11 sm:h-12 sm:w-12 bg-white/10 hover:bg-white/20 text-white border border-white/10 sm:hidden"
                  onClick={toggleCameraFlip}
                  title="Switch Camera"
                >
                  <SwitchCamera className="h-5 w-5" />
                </Button>
              </>
            )}

            <div className="relative">
              <Button
                variant="secondary"
                size="icon"
                className={`rounded-full h-11 w-11 sm:h-12 sm:w-12 ${
                  isChatOpen
                    ? "bg-primary text-white shadow-[0_0_20px_rgba(var(--primary),0.4)]"
                    : "bg-white/10 hover:bg-white/20 text-white border border-white/10"
                }`}
                onClick={() => setIsChatOpen(!isChatOpen)}
                title="Live Consultation Chat"
              >
                <MessageSquare className="h-5 w-5" />
              </Button>
              {!isChatOpen && unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold rounded-full h-5 w-5 flex items-center justify-center border-2 border-slate-900 animate-pulse">
                  {unreadCount}
                </span>
              )}
            </div>

            <div className="w-px h-8 bg-white/15 mx-1" />

            <Button
              variant="destructive"
              size="icon"
              className="rounded-full h-12 w-12 sm:h-14 sm:w-14 bg-red-600 hover:bg-red-700 text-white shadow-[0_0_30px_rgba(239,68,68,0.6)] hover:scale-105 transition-all"
              onClick={handleEndCall}
              disabled={isEnding}
              title="End Consultation"
            >
              <PhoneOff className="h-6 w-6" />
            </Button>
          </div>
        </footer>

        {/* In-Call Live Chat Drawer */}
        <aside
          className={`fixed inset-y-0 right-0 z-50 w-full sm:w-80 md:w-96 bg-slate-900/95 backdrop-blur-2xl border-l border-white/10 flex flex-col transition-transform duration-300 ease-in-out ${
            isChatOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <div className="flex items-center justify-between p-4 border-b border-white/10">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-primary/20 text-primary">
                <MessageSquare className="h-4 w-4" />
              </div>
              <h3 className="text-sm font-bold text-white tracking-wide">In-Call Consultation Chat</h3>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-slate-400 hover:text-white rounded-lg hover:bg-white/10"
              onClick={() => setIsChatOpen(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-400">
                <div className="h-12 w-12 rounded-full bg-white/5 flex items-center justify-center mb-3">
                  <MessageSquare className="h-6 w-6 text-slate-500" />
                </div>
                <p className="text-xs font-medium">No messages yet.</p>
                <p className="text-[11px] text-slate-500 mt-1">
                  Exchange notes or prescription details during your call.
                </p>
              </div>
            ) : (
              messages.map((m) => {
                const isMe = m.senderId === user?.id || m.senderId === "me";
                return (
                  <div key={m.id} className={`flex flex-col ${isMe ? "items-end" : "items-start"}`}>
                    <span className="text-[10px] text-slate-400 mb-1 px-1 font-medium">
                      {isMe ? "You" : m.senderName}
                    </span>
                    <div
                      className={`px-3.5 py-2.5 rounded-2xl max-w-[85%] text-xs sm:text-sm break-words shadow-sm ${
                        isMe
                          ? "bg-primary text-white rounded-br-none"
                          : "bg-slate-800 text-slate-100 rounded-bl-none border border-white/10"
                      }`}
                    >
                      {m.content}
                    </div>
                    <span className="text-[9px] text-slate-500 mt-1 px-1">
                      {format(new Date(m.timestamp), "h:mm a")}
                    </span>
                  </div>
                );
              })
            )}
            <div ref={messagesEndRef} />
          </div>

          <form
            onSubmit={handleSendMessage}
            className="p-3 border-t border-white/10 flex items-center gap-2 bg-slate-950/50"
          >
            <Input
              value={msgInput}
              onChange={(e) => setMsgInput(e.target.value)}
              placeholder="Type message..."
              className="bg-slate-800/80 border-white/10 text-white placeholder:text-slate-500 text-xs sm:text-sm rounded-xl focus-visible:ring-primary h-10"
            />
            <Button
              type="submit"
              size="icon"
              disabled={!msgInput.trim()}
              className="h-10 w-10 shrink-0 rounded-xl bg-primary hover:bg-primary/90 text-white"
            >
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </aside>
      </main>

      {/* Leave Confirmation Modal */}
      {showLeaveConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-md p-4 animate-in fade-in duration-200">
          <div role="alertdialog" aria-modal="true" className="bg-slate-900 border border-slate-700/80 rounded-2xl p-6 max-w-sm w-full text-center shadow-2xl animate-in zoom-in-95 duration-200 text-white">
            <div className="size-12 rounded-full bg-rose-500/10 text-rose-500 flex items-center justify-center mx-auto mb-4 border border-rose-500/20">
              <PhoneOff className="size-6" />
            </div>
            <h3 className="text-lg font-bold mb-1.5">Leave Consultation?</h3>
            <p className="text-xs text-slate-400 mb-6 leading-relaxed">
              Are you sure you want to exit? Your audio and video connection will be disconnected.
            </p>
            <div className="flex items-center justify-center gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowLeaveConfirm(false)}
                className="flex-1 rounded-xl text-xs font-semibold border-slate-700 hover:bg-slate-800 text-slate-200"
              >
                Stay
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => {
                  setShowLeaveConfirm(false);
                  handleEndCall();
                }}
                className="flex-1 rounded-xl text-xs font-semibold bg-rose-600 hover:bg-rose-700 shadow-md shadow-rose-600/30"
              >
                Leave
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
