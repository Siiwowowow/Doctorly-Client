"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Download, Loader2 } from "lucide-react";
import { toast } from "sonner";


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
    if (disabled || loading || !paymentId) return;
    setLoading(true);
    try {
      const response = await fetch(`/api/payments/invoice/${encodeURIComponent(paymentId)}`, {
        method: "GET",
        credentials: "same-origin",
        cache: "no-store",
        headers: {
          "Accept": "application/pdf",
        },
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.message || `Failed to download invoice (HTTP ${response.status})`);
      }

      if (!response.headers.get("content-type")?.includes("application/pdf")) {
        throw new Error("The server did not return a PDF invoice. Please try again.");
      }
      const blob = await response.blob();
      if (!blob.size || await blob.slice(0, 5).text() !== "%PDF-") {
        throw new Error("The invoice PDF is invalid. Please try again.");
      }
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = `Doctorly-Invoice-${paymentId.slice(0, 8)}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setTimeout(() => window.URL.revokeObjectURL(blobUrl), 60_000);

      toast.success("Invoice downloaded successfully!");
    } catch (error: unknown) {
      toast.error(error instanceof Error ? error.message : "Failed to download invoice");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      variant={variant}
      size={size}
      onClick={handleDownload}
      disabled={disabled || loading || !paymentId}
      aria-busy={loading}
      aria-label={loading ? "Downloading invoice" : "Download invoice"}
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
