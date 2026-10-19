"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, FileText, Printer, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { InvoiceDownloadButton } from "@/components/shared/InvoiceDownloadButton";
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
  const money = (amount: number) => new Intl.NumberFormat("en-BD", {
    style: "currency", currency: invoice?.currency || "BDT",
  }).format(amount);

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
        <article className="overflow-hidden rounded-xl border bg-background shadow-sm print:border-0 print:shadow-none">
          <header className="flex flex-wrap justify-between gap-4 bg-primary/10 p-6 sm:p-8">
            <div><p className="text-2xl font-bold text-primary">Doctorly</p><p className="text-sm text-muted-foreground">Consultation payment receipt</p></div>
            <div className="space-y-1 sm:text-right"><h1 className="text-xl font-bold">Invoice</h1><p className="break-all font-mono text-sm">{invoice.invoiceNumber}</p><p className="text-sm">{invoice.paymentDate}</p><span className="inline-block rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-800">{invoice.paymentStatus}</span></div>
          </header>
          <div className="space-y-8 p-6 sm:p-8">
            <div className="grid gap-6 sm:grid-cols-2">
              <section className="space-y-1"><h2 className="mb-2 text-sm font-semibold text-muted-foreground">Billed to</h2><p className="font-semibold">{invoice.patient.name}</p><p className="break-all text-sm">{invoice.patient.email}</p></section>
              <section className="space-y-1"><h2 className="mb-2 text-sm font-semibold text-muted-foreground">Consultation provider</h2><p className="font-semibold">{invoice.doctor.name}</p><p className="text-sm">{invoice.doctor.designation}</p><p className="text-sm">{invoice.doctor.hospital}</p></section>
            </div>
            <section className="rounded-lg border p-4">
              <div className="flex flex-wrap justify-between gap-3"><h2 className="font-semibold">Online medical consultation</h2><p className="font-semibold">{money(invoice.amount)}</p></div>
              <p className="mt-2 text-sm text-muted-foreground">{invoice.schedule.appointmentTime}</p>
              <p className="mt-2 break-all text-xs text-muted-foreground">Appointment: {invoice.appointmentId}</p>
            </section>
            <dl className="ml-auto max-w-sm space-y-3">
              <div className="flex justify-between gap-4"><dt>Subtotal</dt><dd>{money(invoice.amount)}</dd></div>
              <div className="flex justify-between gap-4 border-t pt-3 text-lg font-bold"><dt>Total paid</dt><dd>{money(invoice.amount)}</dd></div>
            </dl>
            <div className="space-y-2 border-t pt-5 text-sm text-muted-foreground"><p className="break-all">Transaction reference: {invoice.transactionId}</p><p>Currency: {invoice.currency}</p><p>This is a computer-generated receipt for your Doctorly consultation payment.</p></div>
          </div>
        </article>
      )}
    </div>
  );
}
