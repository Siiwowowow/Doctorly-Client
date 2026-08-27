"use client";

import { usePathname } from "next/navigation";
import React from "react";

export default function HeaderWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isDashboard = pathname.startsWith("/admin") || pathname.startsWith("/doctor") || pathname.startsWith("/user") || pathname.startsWith("/chat");

  if (isDashboard) {
    return null;
  }

  return <>{children}</>;
}
