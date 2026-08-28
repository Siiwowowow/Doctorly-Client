"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { CreditCard, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { createCheckoutSession } from "@/services/payment.services";

export function PayNowButton({ appointmentId }: { appointmentId: string }) {
  const [loading, setLoading] = useState(false);

  const handlePay = async () => {
    setLoading(true);
    try {
      const res = await createCheckoutSession(appointmentId);
      if (res.data?.paymentUrl) {
        window.location.href = res.data.paymentUrl;
      } else {
        toast.error("Could not generate payment link. Please try again.");
      }
    } catch (error: unknown) {
      toast.error(error instanceof Error ? error.message : "Failed to initiate payment");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      size="sm"
      onClick={handlePay}
      disabled={loading}
      className="bg-doctorly-primary hover:bg-doctorly-primary/90 text-white shadow-sm"
    >
      {loading ? (
        <Loader2 className="mr-2 size-4 animate-spin" />
      ) : (
        <CreditCard className="mr-2 size-4" />
      )}
      Pay Now
    </Button>
  );
}
