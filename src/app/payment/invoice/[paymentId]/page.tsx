"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, FileText, Printer, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { InvoiceDownloadButton } from "@/components/shared/InvoiceDownloadButton";
import { InvoiceDocument } from "@/components/shared/InvoiceDocument";
import { getPaymentInvoice } from "@/services/payment.services";
import { useAuth } from "@/providers/AuthProvider";

export default function InvoicePage() {
  const { paymentId } = useParams<{ paymentId: string }>();
  const { user } = useAuth();
  const paymentsPath = user?.role === "DOCTOR" ? "/doctor/payments"
    : user?.role === "ADMIN" || user?.role === "SUPER_ADMIN" ? "/admin/payments" : "/user/payments";
  const { data, isPending, error, refetch } = useQuery({
    queryKey: ["payment-invoice", paymentId],
    queryFn: () => getPaymentInvoice(paymentId),
    enabled: !!paymentId,
    retry: false,
    staleTime: 0,
    refetchOnMount: "always",
  });
  const invoice = data?.data;

  return (
    <div className="mx-auto max-w-4xl space-y-6 px-4 py-10 print:p-0">
      <div className="flex flex-wrap items-center justify-between gap-3 print:hidden">
        <Button variant="ghost" asChild><Link href={paymentsPath}><ArrowLeft className="mr-2 size-4" />Back to Payments</Link></Button>
        {invoice && <div className="flex gap-2">
          <Button variant="outline" onClick={() => window.print()}><Printer className="mr-2 size-4" />Print</Button>
          <InvoiceDownloadButton paymentId={invoice.paymentId} size="default">Download PDF</InvoiceDownloadButton>
        </div>}
      </div>

      {isPending ? <Skeleton className="h-[560px] w-full rounded-xl" /> : error || !invoice ? (
        <Card><CardContent className="space-y-4 py-12 text-center">
          <FileText className="mx-auto size-10 text-muted-foreground" />
          <h1 className="text-2xl font-bold">Invoice unavailable</h1>
          <p className="text-muted-foreground">{error?.message || "This invoice could not be found."}</p>
          <p className="text-sm text-muted-foreground">Invoices are available after payment is confirmed. Sign in with the account that made the payment.</p>
          <Button variant="outline" onClick={() => refetch()}><RefreshCw className="mr-2 size-4" />Try Again</Button>
        </CardContent></Card>
      ) : (
        <InvoiceDocument invoice={invoice} />
      )}
    </div>
  );
}
