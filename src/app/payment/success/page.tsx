/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import Link from "next/link";
import { CheckCircle2, AlertCircle, RefreshCw, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState, useCallback } from "react";
import { MedicalLoader } from "@/components/ui/medical-loader";
import { getAppointmentById } from "@/services/appointment.services";
import { verifyPaymentSession } from "@/services/payment.services";
import { PaymentStatus } from "@/types/api.types";
import { InvoiceDownloadButton } from "@/components/shared/InvoiceDownloadButton";

function PaymentSuccessContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const appointmentId = searchParams.get("appointmentId");
  
  const [loading, setLoading] = useState(true);
  const [verified, setVerified] = useState(false);
  const [attemptCount, setAttemptCount] = useState(0);
  const [paymentData, setPaymentData] = useState<any>(null);

  const checkPayment = useCallback(async () => {
    try {
      // 1. Try active session verification with backend/Stripe if session_id is available
      if (sessionId) {
        const verifyRes = await verifyPaymentSession(sessionId);
        if (verifyRes?.data?.isPaid || verifyRes?.data?.appointment?.paymentStatus === PaymentStatus.PAID) {
          setVerified(true);
          setPaymentData(verifyRes.data.payment || verifyRes.data.appointment?.payment);
          setLoading(false);
          return true;
        }
      }

      // 2. Fallback check by appointmentId
      if (appointmentId) {
        const aptRes = await getAppointmentById(appointmentId);
        if (aptRes?.data && aptRes.data.paymentStatus === PaymentStatus.PAID) {
          setVerified(true);
          setPaymentData((aptRes.data as any)?.payment);
          setLoading(false);
          return true;
        }
      }
    } catch (error) {
      console.error("Payment verification check error:", error);
    }
    return false;
  }, [sessionId, appointmentId]);

  useEffect(() => {
    let isMounted = true;
    let timeoutId: NodeJS.Timeout;

    async function pollVerification() {
      const isConfirmed = await checkPayment();
      if (isConfirmed || !isMounted) return;

      // Poll up to 5 times with 1.5s delay to accommodate webhook latency
      if (attemptCount < 5) {
        timeoutId = setTimeout(() => {
          if (isMounted) {
            setAttemptCount((prev) => prev + 1);
          }
        }, 1500);
      } else {
        if (isMounted) setLoading(false);
      }
    }

    pollVerification();

    return () => {
      isMounted = false;
      clearTimeout(timeoutId);
    };
  }, [checkPayment, attemptCount]);

  if (loading) {
    return (
      <div className="max-w-md w-full bg-white dark:bg-slate-900 rounded-3xl shadow-xl border p-10 text-center animate-in fade-in duration-300">
        <MedicalLoader text="Verifying your payment with Stripe..." fullScreen={false} />
        <p className="text-xs text-muted-foreground mt-4">
          Confirming transaction details. Please wait a moment...
        </p>
      </div>
    );
  }

  if (!verified) {
    return (
      <div className="max-w-md w-full bg-white dark:bg-slate-900 rounded-3xl shadow-xl shadow-amber-500/5 border p-10 text-center animate-in fade-in zoom-in duration-500">
        <div className="mx-auto w-20 h-20 bg-amber-50 dark:bg-amber-950 text-amber-500 rounded-full flex items-center justify-center mb-6">
          <AlertCircle size={40} strokeWidth={2.5} />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Payment Verification in Progress</h1>
        <p className="text-muted-foreground mb-6 text-sm leading-relaxed">
          Your transaction was received and is currently being synchronized with our healthcare system.
        </p>
        
        <div className="flex flex-col gap-3">
          <Button
            onClick={() => {
              setLoading(true);
              setAttemptCount(0);
            }}
            className="w-full bg-doctorly-primary hover:bg-doctorly-primary/90 text-white rounded-xl h-11"
          >
            <RefreshCw className="mr-2 size-4" /> Check Status Again
          </Button>
          <Button asChild variant="outline" className="w-full rounded-xl h-11">
            <Link href="/user/appointments">View My Appointments</Link>
          </Button>
        </div>
      </div>
    );
  }

  const paymentId = paymentData?.id || appointmentId;

  return (
    <div className="max-w-md w-full bg-white dark:bg-slate-900 rounded-3xl shadow-xl shadow-primary/5 border p-10 text-center animate-in fade-in zoom-in duration-500 slide-in-from-bottom-4">
      <div className="mx-auto w-24 h-24 bg-green-50 dark:bg-green-950 text-green-500 rounded-full flex items-center justify-center mb-6 relative">
        <div className="absolute inset-0 bg-green-100 dark:bg-green-900 rounded-full animate-ping opacity-20" style={{ animationDuration: '3s' }}></div>
        <CheckCircle2 size={48} className="relative z-10" strokeWidth={2.5} />
      </div>
      
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2 tracking-tight">Payment Successful!</h1>
      <p className="text-muted-foreground mb-6 text-sm leading-relaxed">
        Your payment has been confirmed and your consultation is booked.
      </p>

      {appointmentId && (
        <div className="bg-gray-50 dark:bg-slate-800/60 rounded-2xl p-4 mb-6 border border-border/50 text-left">
          <span className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">Appointment Reference</span>
          <code className="text-doctorly-primary font-mono font-semibold text-sm">{appointmentId}</code>
        </div>
      )}

      <div className="flex flex-col gap-3">
        {paymentId && (
          <InvoiceDownloadButton paymentId={paymentId} variant="outline" size="lg" className="w-full rounded-xl h-12 text-sm font-semibold border-doctorly-primary/30 text-doctorly-primary hover:bg-doctorly-primary/5">
            <FileText className="mr-2 size-4" /> Download Official Invoice
          </InvoiceDownloadButton>
        )}
        <Button asChild size="lg" className="w-full rounded-xl h-12 text-base font-semibold bg-doctorly-primary hover:bg-doctorly-primary/90 text-white shadow-md hover:shadow-lg transition-all">
          <Link href="/user/dashboard">Go to Dashboard</Link>
        </Button>
        <Button asChild variant="ghost" size="lg" className="w-full rounded-xl h-11 text-sm font-medium">
          <Link href="/user/appointments">View All Appointments</Link>
        </Button>
      </div>
    </div>
  );
}

export default function PaymentSuccessPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50/50 dark:bg-slate-950 p-4 relative overflow-hidden">
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-primary/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-green-500/5 rounded-full blur-3xl pointer-events-none" />
      
      <Suspense fallback={<MedicalLoader fullScreen={false} text="Confirming payment..." />}>
        <PaymentSuccessContent />
      </Suspense>
    </div>
  );
}
