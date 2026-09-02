"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useTranslations } from "next-intl";

interface BackButtonProps {
  fallbackUrl?: string;
  label?: string;
  className?: string;
}

export function BackButton({ fallbackUrl, label, className }: BackButtonProps) {
  const router = useRouter();
  const t = useTranslations("common");

  const handleBack = () => {
    if (typeof window !== "undefined" && window.history.length > 1) {
      router.back();
    } else if (fallbackUrl) {
      router.push(fallbackUrl);
    } else {
      router.push("/");
    }
  };

  const displayText = label || t("back") || "Back";

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleBack}
      className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground hover:bg-muted/60 rounded-xl transition-all shadow-xs ${className || ""}`}
      aria-label={displayText}
    >
      <ArrowLeft className="size-4" />
      <span>{displayText}</span>
    </Button>
  );
}
