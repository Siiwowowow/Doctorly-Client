/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Download, Loader2 } from "lucide-react";
import { toast } from "sonner";

const BASE_API_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000/api/v1";

interface InvoiceDownloadButtonProps {
  paymentId: string;
  className?: string;
  variant?: "outline" | "default" | "ghost" | "secondary";
  size?: "default" | "sm" | "lg" | "icon";
  children?: React.ReactNode;
  disabled?: boolean;
}

export function InvoiceDownloadButton({
  paymentId,
  className = "",
  variant = "outline",
  size = "icon",
  children,
  disabled = false,
}: InvoiceDownloadButtonProps) {
  const [loading, setLoading] = useState(false);

  const handleDownload = async () => {
    if (disabled || !paymentId) return;
    setLoading(true);
    try {
      const response = await fetch(`${BASE_API_URL}/payments/invoice/${paymentId}?format=pdf&download=true`, {
        method: "GET",
        credentials: "include",
        headers: {
          "Accept": "application/pdf",
        },
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.message || `Failed to download invoice (HTTP ${response.status})`);
      }

      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = `Doctorly-Invoice-${paymentId.slice(0, 8)}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);

      toast.success("Invoice downloaded successfully!");
    } catch (error: any) {
      toast.error(error.message || "Failed to download invoice");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      variant={variant}
      size={size}
      onClick={handleDownload}
      disabled={disabled || loading}
      className={className}
      title="Download Official Invoice"
    >
      {loading ? (
        <Loader2 className="size-4 animate-spin" />
      ) : children ? (
        children
      ) : (
        <Download className="size-4 text-doctorly-primary" />
      )}
    </Button>
  );
}
