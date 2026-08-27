"use client";

import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { MedicalLoader } from "@/components/ui/medical-loader";

function PaymentSuccessContent() {
  const searchParams = useSearchParams();
  const appointmentId = searchParams.get("appointmentId");

  return (
    <div className="max-w-md w-full bg-white rounded-3xl shadow-xl shadow-primary/5 border p-10 text-center animate-in fade-in zoom-in duration-500 slide-in-from-bottom-4">
      <div className="mx-auto w-24 h-24 bg-green-50 text-green-500 rounded-full flex items-center justify-center mb-8 relative">
        <div className="absolute inset-0 bg-green-100 rounded-full animate-ping opacity-20" style={{ animationDuration: '3s' }}></div>
        <CheckCircle2 size={48} className="relative z-10" strokeWidth={2.5} />
      </div>
      
      <h1 className="text-3xl font-bold text-gray-900 mb-3 tracking-tight">Payment Successful!</h1>
      <p className="text-gray-500 mb-8 leading-relaxed">
        Your payment has been processed successfully and your appointment is confirmed. We look forward to seeing you.
      </p>

      {appointmentId && (
        <div className="bg-gray-50/80 rounded-2xl p-5 mb-8 border border-gray-100">
          <span className="block text-sm font-medium text-gray-500 mb-2">Appointment Reference</span>
          <code className="text-primary font-semibold tracking-wide text-sm bg-primary/10 px-3 py-1.5 rounded-lg">{appointmentId}</code>
        </div>
      )}

      <div className="flex flex-col gap-3">
        <Button asChild size="lg" className="w-full rounded-xl h-12 text-base font-semibold shadow-md hover:shadow-lg transition-all">
          <Link href="/user/dashboard">Go to Dashboard</Link>
        </Button>
        <Button asChild variant="outline" size="lg" className="w-full rounded-xl h-12 text-base font-medium">
          <Link href="/user/appointments">View Appointments</Link>
        </Button>
      </div>
    </div>
  );
}

export default function PaymentSuccessPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50/50 p-4 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-primary/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-green-500/5 rounded-full blur-3xl pointer-events-none" />
      
      <Suspense fallback={<MedicalLoader fullScreen={false} text="Verifying payment..." />}>
        <PaymentSuccessContent />
      </Suspense>
    </div>
  );
}
