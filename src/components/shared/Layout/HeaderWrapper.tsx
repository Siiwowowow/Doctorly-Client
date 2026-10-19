"use client";

import { usePathname } from "next/navigation";
import React from "react";

export default function HeaderWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isDashboard = /^\/(admin|doctor|user|chat|video-call)(\/|$)/.test(pathname);

  if (isDashboard || /^\/payment\/invoice(\/|$)/.test(pathname)) {
    return null;
  }

  return <>{children}</>;
}
