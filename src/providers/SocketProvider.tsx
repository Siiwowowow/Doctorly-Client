"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import { useAuth } from "./AuthProvider";
import { GlobalListeners } from "./GlobalListeners";
import { CallProvider } from "./CallProvider";

import { getSocketAuthTokens } from "@/services/auth.services";

interface SocketContextType {
  socket: Socket | null;
  isConnected: boolean;
}

const SocketContext = createContext<SocketContextType>({
  socket: null,
  isConnected: false,
});

export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({ children }: { children: React.ReactNode }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const { user, isAuthenticated } = useAuth();

  useEffect(() => {
    let isCancelled = false;
    let socketInstance: Socket | null = null;

    if (!isAuthenticated || !user) {
      if (socket) {
        socket.disconnect();
        setSocket(null);
        setIsConnected(false);
      }
      return;
    }

    const initSocket = async () => {
      try {
        const { token, sessionToken } = await getSocketAuthTokens();
        if (isCancelled) return;

        const socketUrl = process.env.NEXT_PUBLIC_API_BASE_URL?.replace("/api/v1", "") || "http://localhost:5000";

        socketInstance = io(socketUrl, {
          withCredentials: true,
          transports: ["websocket", "polling"],
          reconnection: true,
          reconnectionAttempts: 30,
          reconnectionDelay: 1000,
          reconnectionDelayMax: 5000,
          timeout: 20000,
          auth: {
            token: token || "",
            sessionToken: sessionToken || "",
          },
          query: {
            userId: user.id,
          },
        });

        socketInstance.on("connect", () => {
          if (!isCancelled) {
            setIsConnected(true);
          }
        });

        socketInstance.on("disconnect", () => {
          if (!isCancelled) {
            setIsConnected(false);
          }
        });

        socketInstance.on("connect_error", (err) => {
          console.warn("[SocketProvider] Connection error:", err.message);
        });

        if (!isCancelled) {
          setSocket(socketInstance);
        }
      } catch (err) {
        console.error("[SocketProvider] Initialization error:", err);
      }
    };

    initSocket();

    return () => {
      isCancelled = true;
      if (socketInstance) {
        socketInstance.disconnect();
      }
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated, user?.id]);

  const value = React.useMemo(
    () => ({ socket, isConnected }),
    [socket, isConnected]
  );

  return (
    <SocketContext.Provider value={value}>
      <CallProvider>
        {children}
        <GlobalListeners />
      </CallProvider>
    </SocketContext.Provider>
  );
};
