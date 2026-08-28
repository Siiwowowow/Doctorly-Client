"use client";

import Link from "next/link";
import { XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function PaymentCancelPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50/50 p-4 relative overflow-hidden">
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-red-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-orange-500/5 rounded-full blur-3xl pointer-events-none" />
      
      <div className="max-w-md w-full bg-white rounded-3xl shadow-xl shadow-red-500/5 border p-10 text-center animate-in fade-in zoom-in duration-500 slide-in-from-bottom-4">
        <div className="mx-auto w-24 h-24 bg-red-50 text-red-500 rounded-full flex items-center justify-center mb-8 relative">
          <div className="absolute inset-0 bg-red-100 rounded-full animate-ping opacity-20" style={{ animationDuration: '3s' }}></div>
          <XCircle size={48} className="relative z-10" strokeWidth={2.5} />
        </div>
        
        <h1 className="text-3xl font-bold text-gray-900 mb-3 tracking-tight">Payment Cancelled</h1>
        <p className="text-gray-500 mb-8 leading-relaxed">
          Your payment process was interrupted or cancelled. Don&apos;t worry, no charges were made to your account.
        </p>

        <div className="flex flex-col gap-3">
          <Button asChild size="lg" className="w-full rounded-xl h-12 text-base font-semibold shadow-md hover:shadow-lg transition-all">
            <Link href="/user/dashboard">Return to Dashboard</Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="w-full rounded-xl h-12 text-base font-medium">
            <Link href="/">Back to Home</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
