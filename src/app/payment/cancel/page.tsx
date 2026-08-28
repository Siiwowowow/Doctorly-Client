/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import Link from "next/link";
import { XCircle, RefreshCw, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { createCheckoutSession } from "@/services/payment.services";
import { toast } from "sonner";

function PaymentCancelContent() {
  const searchParams = useSearchParams();
  const appointmentId = searchParams.get("appointmentId");
  const [retrying, setRetrying] = useState(false);

  const handleRetryPayment = async () => {
    if (!appointmentId) return;
    setRetrying(true);
    try {
      const res = await createCheckoutSession(appointmentId);
      if (res.data?.paymentUrl) {
        window.location.href = res.data.paymentUrl;
      } else {
        toast.error("Could not create new checkout session. Please try again.");
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to retry payment");
    } finally {
      setRetrying(false);
    }
  };

  return (
    <div className="max-w-md w-full bg-white dark:bg-slate-900 rounded-3xl shadow-xl shadow-red-500/5 border p-10 text-center animate-in fade-in zoom-in duration-500 slide-in-from-bottom-4">
      <div className="mx-auto w-24 h-24 bg-red-50 dark:bg-red-950/40 text-red-500 rounded-full flex items-center justify-center mb-8 relative">
        <div className="absolute inset-0 bg-red-100 dark:bg-red-900/30 rounded-full animate-ping opacity-20" style={{ animationDuration: '3s' }}></div>
        <XCircle size={48} className="relative z-10" strokeWidth={2.5} />
      </div>
      
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-3 tracking-tight">Payment Cancelled</h1>
      <p className="text-muted-foreground mb-8 leading-relaxed text-sm">
        Your payment process was interrupted or cancelled. Don&apos;t worry, no charges were made to your account.
      </p>

      {appointmentId && (
        <div className="bg-muted/40 rounded-2xl p-4 mb-6 border text-left">
          <span className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">Appointment Ref</span>
          <code className="text-doctorly-primary font-mono font-semibold text-sm">{appointmentId}</code>
        </div>
      )}

      <div className="flex flex-col gap-3">
        {appointmentId && (
          <Button
            onClick={handleRetryPayment}
            disabled={retrying}
            size="lg"
            className="w-full rounded-xl h-12 text-base font-semibold bg-doctorly-primary hover:bg-doctorly-primary/90 text-white shadow-md hover:shadow-lg transition-all"
          >
            {retrying ? (
              <RefreshCw className="mr-2 size-4 animate-spin" />
            ) : (
              <RefreshCw className="mr-2 size-4" />
            )}
            Retry Payment Now
          </Button>
        )}
        <Button asChild variant="outline" size="lg" className="w-full rounded-xl h-12 text-base font-medium">
          <Link href="/user/appointments">
            <ArrowLeft className="mr-2 size-4" /> View My Appointments
          </Link>
        </Button>
        <Button asChild variant="ghost" size="lg" className="w-full rounded-xl h-11 text-sm font-medium">
          <Link href="/user/dashboard">Return to Dashboard</Link>
        </Button>
      </div>
    </div>
  );
}

export default function PaymentCancelPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50/50 dark:bg-slate-950 p-4 relative overflow-hidden">
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-red-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-orange-500/5 rounded-full blur-3xl pointer-events-none" />
      
      <Suspense fallback={<div className="text-center">Loading...</div>}>
        <PaymentCancelContent />
      </Suspense>
    </div>
  );
}
