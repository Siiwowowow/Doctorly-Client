/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import { getMyPayments } from "@/services/payment.services";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CreditCard, Download, ExternalLink, Calendar } from "lucide-react";

export const metadata = {
  title: "Payments | Doctorly",
};

export default async function PaymentsPage() {
  let payments = [];
  try {
    const res = await getMyPayments();
    payments = res.data || [];
  } catch (error) {
    console.error("Failed to load payments:", error);
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "PAID": return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400";
      case "UNPAID": return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400";
      default: return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300";
    }
  };

  return (
    <div className="space-y-6">
      
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Payments</h1>
          <p className="text-muted-foreground">View your payment history and download invoices.</p>
        </div>
      </div>

      {payments.length === 0 ? (
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
                      <h4 className="font-semibold text-lg">Consultation Fee</h4>
                      <p className="text-sm text-muted-foreground">Transaction ID: {payment.transactionId || payment.id.slice(0, 12)}</p>
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
                  <div className="flex gap-2 w-full sm:w-auto">
                    <Button variant="outline" size="icon" title="View Details">
                      <ExternalLink className="size-4" />
                    </Button>
                    <Button variant="outline" size="icon" className="text-doctorly-primary" title="Download Invoice">
                      <Download className="size-4" />
                    </Button>
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
