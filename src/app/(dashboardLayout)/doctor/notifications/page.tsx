"use client";

import React from "react";
import { NotificationCenter } from "@/components/notifications/NotificationCenter";

export default function DoctorNotificationsPage() {
  return (
    <NotificationCenter
      title="Doctor Notifications"
      subtitle="Stay updated on your upcoming consultations, patient bookings, and platform activity."
    />
  );
}
