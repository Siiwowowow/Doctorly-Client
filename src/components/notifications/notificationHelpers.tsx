import React from "react";
import {
  CalendarDays,
  CreditCard,
  FileText,
  Pill,
  MessageSquare,
  Phone,
  Bell,
  ShieldCheck,
} from "lucide-react";
import { formatDistanceToNow, isValid, parseISO } from "date-fns";
import { Notification, NotificationType } from "@/types/api.types";

export interface NotificationMeta {
  icon: React.ReactNode;
  badgeLabel: string;
  badgeClass: string;
  iconBgClass: string;
  borderColor: string;
}

export function getNotificationMeta(type?: string): NotificationMeta {
  const t = (type || "").toUpperCase();

  if (t.includes("APPOINTMENT")) {
    return {
      icon: <CalendarDays className="size-4 text-blue-500" />,
      badgeLabel: "Appointment",
      badgeClass: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-800",
      iconBgClass: "bg-blue-500/10 text-blue-600",
      borderColor: "border-l-blue-500",
    };
  }

  if (t.includes("PAYMENT")) {
    return {
      icon: <CreditCard className="size-4 text-emerald-500" />,
      badgeLabel: "Payment",
      badgeClass: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800",
      iconBgClass: "bg-emerald-500/10 text-emerald-600",
      borderColor: "border-l-emerald-500",
    };
  }

  if (t.includes("PRESCRIPTION")) {
    return {
      icon: <Pill className="size-4 text-purple-500" />,
      badgeLabel: "Prescription",
      badgeClass: "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-200 dark:border-purple-800",
      iconBgClass: "bg-purple-500/10 text-purple-600",
      borderColor: "border-l-purple-500",
    };
  }

  if (t.includes("MEDICAL_RECORD") || t.includes("REPORT")) {
    return {
      icon: <FileText className="size-4 text-teal-500" />,
      badgeLabel: "Medical Record",
      badgeClass: "bg-teal-500/10 text-teal-600 dark:text-teal-400 border-teal-200 dark:border-teal-800",
      iconBgClass: "bg-teal-500/10 text-teal-600",
      borderColor: "border-l-teal-500",
    };
  }

  if (t.includes("CALL")) {
    return {
      icon: <Phone className="size-4 text-amber-500" />,
      badgeLabel: "Video Call",
      badgeClass: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-800",
      iconBgClass: "bg-amber-500/10 text-amber-600",
      borderColor: "border-l-amber-500",
    };
  }

  if (t.includes("CHAT") || t.includes("MESSAGE")) {
    return {
      icon: <MessageSquare className="size-4 text-indigo-500" />,
      badgeLabel: "Message",
      badgeClass: "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-200 dark:border-indigo-800",
      iconBgClass: "bg-indigo-500/10 text-indigo-600",
      borderColor: "border-l-indigo-500",
    };
  }

  if (t.includes("SECURITY") || t.includes("AUTH")) {
    return {
      icon: <ShieldCheck className="size-4 text-rose-500" />,
      badgeLabel: "Security",
      badgeClass: "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-200 dark:border-rose-800",
      iconBgClass: "bg-rose-500/10 text-rose-600",
      borderColor: "border-l-rose-500",
    };
  }

  return {
    icon: <Bell className="size-4 text-doctorly-primary" />,
    badgeLabel: "System",
    badgeClass: "bg-doctorly-primary/10 text-doctorly-primary border-doctorly-primary/20",
    iconBgClass: "bg-doctorly-primary/10 text-doctorly-primary",
    borderColor: "border-l-doctorly-primary",
  };
}

/**
 * Ensures strict medical privacy: never leaks clinical messages or diagnosis in notifications
 */
export function getSafeNotificationContent(
  notification: Partial<Notification>,
  userRole?: string
): { title: string; message: string } {
  const typeStr = (notification.type || "").toUpperCase();
  const rawTitle = notification.title || "Notification";
  const rawMessage = notification.message || "";

  // 1. Chat Messages -> Strictly mask chat body text
  if (typeStr.includes("CHAT") || typeStr.includes("MESSAGE")) {
    let safeTitle = rawTitle;
    if (!safeTitle || safeTitle.toLowerCase().includes("chat") || safeTitle === "Notification") {
      safeTitle = "New Message";
    }
    return {
      title: safeTitle,
      message: "Sent you a message",
    };
  }

  // 2. Prescriptions -> Safe summary
  if (typeStr.includes("PRESCRIPTION")) {
    return {
      title: rawTitle.includes("Prescription") ? rawTitle : "Digital Prescription",
      message: userRole === "DOCTOR"
        ? "Prescription created or updated for your consultation."
        : "Your doctor has added an updated digital prescription.",
    };
  }

  // 3. Medical Records -> Safe summary
  if (typeStr.includes("MEDICAL_RECORD") || typeStr.includes("REPORT")) {
    return {
      title: "Medical Record Available",
      message: "A medical record or clinical document is available in your profile.",
    };
  }

  // 4. Video Calls
  if (typeStr.includes("CALL")) {
    return {
      title: rawTitle || "Telehealth Consultation",
      message: rawMessage || "Doctorly video consultation event.",
    };
  }

  // 5. Default
  return {
    title: rawTitle,
    message: rawMessage,
  };
}

/**
 * Returns the contextual deep-link route for a notification
 */
export function getNotificationHref(
  notification: Partial<Notification>,
  userRole?: string
): string {
  const typeStr = (notification.type || "").toUpperCase();
  const data = (notification.data as Record<string, any>) || {};

  // Chat message -> /chat?conversationId=...
  if (typeStr.includes("CHAT") || typeStr.includes("MESSAGE")) {
    const conversationId = data.conversationId;
    return conversationId ? `/chat?conversationId=${conversationId}` : "/chat";
  }

  // Video call -> /video-call/[id]
  if (typeStr.includes("CALL")) {
    const callId = data.callId || data.appointmentId;
    return callId ? `/video-call/${callId}` : "/chat";
  }

  // Appointment -> role-specific appointment page
  if (typeStr.includes("APPOINTMENT")) {
    const appointmentId = data.appointmentId;
    if (userRole === "DOCTOR") {
      return appointmentId ? `/doctor/appointments/${appointmentId}` : "/doctor/appointments";
    }
    if (userRole === "ADMIN" || userRole === "SUPER_ADMIN") {
      return appointmentId ? `/admin/appointments/${appointmentId}` : "/admin/appointments";
    }
    return appointmentId ? `/user/appointments/${appointmentId}` : "/user/appointments";
  }

  // Prescription -> role-specific prescription page
  if (typeStr.includes("PRESCRIPTION")) {
    const prescriptionId = data.prescriptionId;
    if (userRole === "DOCTOR") {
      return prescriptionId ? `/doctor/prescriptions/${prescriptionId}` : "/doctor/prescriptions";
    }
    return "/user/prescriptions";
  }

  // Medical Record -> role-specific medical records page
  if (typeStr.includes("MEDICAL_RECORD") || typeStr.includes("REPORT")) {
    if (userRole === "DOCTOR") {
      return "/doctor/medical-records";
    }
    if (userRole === "ADMIN" || userRole === "SUPER_ADMIN") {
      return "/admin/medical-records";
    }
    return "/user/medical-records";
  }

  // Payment -> role-specific payments page
  if (typeStr.includes("PAYMENT")) {
    if (userRole === "DOCTOR") {
      return "/doctor/payments";
    }
    if (userRole === "ADMIN" || userRole === "SUPER_ADMIN") {
      return "/admin/payments";
    }
    return "/user/payments";
  }

  // Default fallback to notifications page
  if (userRole === "DOCTOR") return "/doctor/notifications";
  if (userRole === "ADMIN" || userRole === "SUPER_ADMIN") return "/admin/notifications";
  return "/user/notifications";
}

export function formatNotificationTime(dateStr?: string): string {
  if (!dateStr) return "Just now";
  try {
    const parsed = typeof dateStr === "string" ? parseISO(dateStr) : new Date(dateStr);
    if (!isValid(parsed)) return "Recently";
    return formatDistanceToNow(parsed, { addSuffix: true });
  } catch {
    return "Recently";
  }
}

