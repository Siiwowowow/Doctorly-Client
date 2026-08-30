import React from "react";
import { NotificationCenter } from "@/components/notifications/NotificationCenter";

export const metadata = {
  title: "Notifications | Doctorly",
};

export default function UserNotificationsPage() {
  return (
    <NotificationCenter
      title="My Notifications"
      subtitle="Stay updated with your doctor appointments, digital prescriptions, and medical records."
    />
  );
}
