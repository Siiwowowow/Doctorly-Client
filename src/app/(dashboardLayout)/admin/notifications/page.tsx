"use client";

import React from "react";
import { NotificationCenter } from "@/components/notifications/NotificationCenter";

export default function AdminNotificationsPage() {
  return (
    <NotificationCenter
      title="Admin Notifications"
      subtitle="System alerts, new registrations, transactions, and administrative notifications."
    />
  );
}
