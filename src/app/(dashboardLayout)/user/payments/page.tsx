"use client";

import React from "react";
import { useQuery } from "@tanstack/react-query";
import { getMyPayments } from "@/services/payment.services";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CreditCard, ExternalLink, Calendar, AlertCircle, RefreshCw } from "lucide-react";
import { InvoiceDownloadButton } from "@/components/shared/InvoiceDownloadButton";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";
import { PaymentStatus } from "@/types/api.types";

export default function PaymentsPage() {
  const { 
    data: paymentsRes, 
    isLoading, 
    isError,
    refetch
  } = useQuery({
    queryKey: ["user-payments"],
    queryFn: () => getMyPayments(),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  const payments = paymentsRes?.data || [];

  const getStatusColor = (status: PaymentStatus | string) => {
    switch (status) {
      case PaymentStatus.PAID: return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400";
      case PaymentStatus.UNPAID: return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400";
      default: return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300";
    }
  };

  return (
    <div className="space-y-6">
      
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Payments</h1>
          <p className="text-muted-foreground">View your payment history and download official consultation invoices.</p>
        </div>
      </div>

      {isError && (
        <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-xl text-destructive flex items-center justify-between">
          <div className="flex items-center gap-3">
            <AlertCircle className="size-5" />
            <p className="text-sm font-medium">Failed to load payments. Please try again later.</p>
          </div>
          <Button variant="outline" size="sm" onClick={() => refetch()} className="border-destructive/30 hover:bg-destructive/10 text-destructive">
            <RefreshCw className="mr-2 size-4" /> Retry
          </Button>
        </div>
      )}

      {isLoading ? (
        <div className="grid grid-cols-1 gap-4">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="overflow-hidden shadow-sm border-border/50">
              <CardContent className="p-0">
                <div className="flex flex-col sm:flex-row items-center p-6 gap-6">
                  <div className="flex items-center gap-4 flex-1 w-full">
                    <Skeleton className="size-12 rounded-xl" />
                    <div className="space-y-2 flex-1">
                      <Skeleton className="h-5 w-48" />
                      <Skeleton className="h-4 w-32" />
                    </div>
                  </div>
                  <div className="flex items-center gap-6 justify-between w-full sm:w-auto">
                    <div className="space-y-2">
                      <Skeleton className="h-6 w-20" />
                      <Skeleton className="h-3 w-24" />
                    </div>
                    <Skeleton className="h-6 w-16 rounded-full" />
                  </div>
                  <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                    <Skeleton className="h-9 w-9 rounded-md" />
                    <Skeleton className="h-9 w-32 rounded-md" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : payments.length === 0 && !isError ? (
        <Card className="border-dashed border-2 bg-muted/10">
          <CardContent className="flex flex-col items-center justify-center py-20 text-center">
            <div className="rounded-full bg-muted p-6">
              <CreditCard className="size-10 text-muted-foreground" />
            </div>
            <h3 className="mt-4 text-xl font-semibold">No payments found</h3>
            <p className="mt-2 text-muted-foreground max-w-sm">
              Your consultation payment history will appear here once you book an appointment.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {payments.map((payment: any) => (
            <Card key={payment.id} className="overflow-hidden shadow-sm transition-all hover:shadow-md border-border/50">
              <CardContent className="p-0">
                <div className="flex flex-col sm:flex-row items-center p-6 gap-6">
                  
                  {/* Icon & Details */}
                  <div className="flex items-center gap-4 flex-1 w-full">
                    <div className="p-3 bg-doctorly-primary/10 text-doctorly-primary rounded-xl">
                      <CreditCard className="size-6" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-lg">
                        {payment.appointment?.doctor?.name ? `Consultation - Dr. ${payment.appointment.doctor.name}` : "Medical Consultation Fee"}
                      </h4>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        Transaction ID: <span className="font-mono">{payment.transactionId || payment.id.slice(0, 16)}</span>
                      </p>
                    </div>
                  </div>

                  {/* Status & Amount */}
                  <div className="flex items-center gap-6 justify-between w-full sm:w-auto">
                    <div className="text-left sm:text-right">
                      <p className="font-bold text-xl">৳ {payment.amount}</p>
                      <p className="text-xs text-muted-foreground flex items-center gap-1 justify-start sm:justify-end mt-1">
                        <Calendar className="size-3" />
                        {new Date(payment.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    
                    <span className={`inline-flex items-center justify-center rounded-full px-3 py-1 text-xs font-semibold ${getStatusColor(payment.status)}`}>
                      {payment.status}
                    </span>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                    {payment.appointmentId && (
                      <Button variant="outline" size="icon" asChild title="View Appointment">
                        <Link href={`/user/appointments/${payment.appointmentId}`}>
                          <ExternalLink className="size-4" />
                        </Link>
                      </Button>
                    )}
                    <InvoiceDownloadButton
                      paymentId={payment.id}
                      disabled={payment.status !== PaymentStatus.PAID}
                    />
                  </div>
                  
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
