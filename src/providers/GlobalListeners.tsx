/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect } from "react";
import { useSocket } from "./SocketProvider";
import { useAuth } from "./AuthProvider";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export function GlobalListeners() {
  const { socket, isConnected } = useSocket();
  const { user } = useAuth();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!socket || !isConnected) return;

    // Appointment & Schedule Real-time Event Handlers
    const handleAppointmentCreated = (payload: any) => {
      queryClient.invalidateQueries({ queryKey: ["user-appointments"] });
      queryClient.invalidateQueries({ queryKey: ["doctor-appointments"] });
      queryClient.invalidateQueries({ queryKey: ["doctor-dashboard"] });
      queryClient.invalidateQueries({ queryKey: ["doctor-schedules"] });
      queryClient.invalidateQueries({ queryKey: ["available-schedules"] });
      queryClient.invalidateQueries({ queryKey: ["doctor-available-schedules"] });

      const isDoctor = user?.role === "DOCTOR";
      if (isDoctor) {
        const patientName = payload?.patient?.name || "A patient";
        toast.success("New Appointment Booked", {
          description: `${patientName} has booked an appointment.`,
        });
      }
    };

    const handleAppointmentUpdated = () => {
      queryClient.invalidateQueries({ queryKey: ["user-appointments"] });
      queryClient.invalidateQueries({ queryKey: ["doctor-appointments"] });
      queryClient.invalidateQueries({ queryKey: ["doctor-dashboard"] });
      queryClient.invalidateQueries({ queryKey: ["doctor-schedules"] });
    };

    const handleAppointmentCanceled = (payload: any) => {
      queryClient.invalidateQueries({ queryKey: ["user-appointments"] });
      queryClient.invalidateQueries({ queryKey: ["doctor-appointments"] });
      queryClient.invalidateQueries({ queryKey: ["doctor-dashboard"] });
      queryClient.invalidateQueries({ queryKey: ["doctor-schedules"] });
      queryClient.invalidateQueries({ queryKey: ["available-schedules"] });
      queryClient.invalidateQueries({ queryKey: ["doctor-available-schedules"] });

      toast.info("Appointment Canceled", {
        description: payload?.id ? "An appointment was canceled." : undefined,
      });
    };

    const handleScheduleUpdated = () => {
      queryClient.invalidateQueries({ queryKey: ["doctor-schedules"] });
      queryClient.invalidateQueries({ queryKey: ["available-schedules"] });
      queryClient.invalidateQueries({ queryKey: ["doctor-available-schedules"] });
    };

    (socket as any).on("appointment:created", handleAppointmentCreated);
    (socket as any).on("appointment:updated", handleAppointmentUpdated);
    (socket as any).on("appointment:canceled", handleAppointmentCanceled);
    (socket as any).on("schedule:updated", handleScheduleUpdated);

    return () => {
      (socket as any).off("appointment:created", handleAppointmentCreated);
      (socket as any).off("appointment:updated", handleAppointmentUpdated);
      (socket as any).off("appointment:canceled", handleAppointmentCanceled);
      (socket as any).off("schedule:updated", handleScheduleUpdated);
    };
  }, [socket, isConnected, user, queryClient]);

  return null;
}
