/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { useQuery } from "@tanstack/react-query"
import { getMyPayments } from "@/services/payment.services"
import { PaymentStatus } from "@/types/api.types"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import { format } from "date-fns"
import { DollarSign, ArrowUpRight, TrendingUp, Calendar, AlertCircle } from "lucide-react"
import { InvoiceDownloadButton } from "@/components/shared/InvoiceDownloadButton"

export default function DoctorPaymentsPage() {
    const { data: paymentsResponse, isLoading, isError, refetch } = useQuery({
        queryKey: ["my-payments"],
        queryFn: () => getMyPayments(),
    })

    const payments = paymentsResponse?.data || []

    const totalEarnings = payments
        .filter((p: any) => p.status === PaymentStatus.PAID)
        .reduce((sum: number, p: any) => sum + (p.amount || 0), 0)

    const pendingEarnings = payments
        .filter((p: any) => p.status === PaymentStatus.UNPAID)
        .reduce((sum: number, p: any) => sum + (p.amount || 0), 0)

    const paidCount = payments.filter((p: any) => p.status === PaymentStatus.PAID).length

    if (isLoading) {
        return (
            <div className="space-y-6">
                <div>
                    <Skeleton className="h-8 w-48 mb-2" />
                    <Skeleton className="h-4 w-72" />
                </div>
                <div className="grid gap-4 md:grid-cols-3">
                    <Skeleton className="h-32 rounded-xl" />
                    <Skeleton className="h-32 rounded-xl" />
                    <Skeleton className="h-32 rounded-xl" />
                </div>
                <Skeleton className="h-96 rounded-xl" />
            </div>
        )
    }

    if (isError) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px] text-center p-6 bg-destructive/10 rounded-2xl border border-destructive/20">
                <AlertCircle className="size-12 text-destructive mb-4" />
                <h3 className="text-xl font-bold text-destructive">Failed to Load Payments</h3>
                <p className="text-muted-foreground mt-2 mb-6 max-w-md">
                    We could not retrieve your payment records. Please try again later.
                </p>
                <button
                    onClick={() => refetch()}
                    className="px-4 py-2 bg-destructive text-white rounded-lg hover:bg-destructive/90 transition-colors"
                >
                    Retry
                </button>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold tracking-tight">Payments & Earnings</h1>
                <p className="text-muted-foreground">
                    Track your consultation fees, transaction history, and download statements.
                </p>
            </div>

            {/* Metrics */}
            <div className="grid gap-4 md:grid-cols-3">
                <Card className="shadow-sm">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">
                            Total Earnings (Paid)
                        </CardTitle>
                        <DollarSign className="size-4 text-emerald-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-emerald-600">
                            ${totalEarnings.toLocaleString()}
                        </div>
                        <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                            <TrendingUp className="size-3 text-emerald-500" />
                            From {paidCount} completed payments
                        </p>
                    </CardContent>
                </Card>

                <Card className="shadow-sm">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">
                            Pending Payments
                        </CardTitle>
                        <Calendar className="size-4 text-amber-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-amber-600">
                            ${pendingEarnings.toLocaleString()}
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                            Awaiting appointment completion / patient checkout
                        </p>
                    </CardContent>
                </Card>

                <Card className="shadow-sm">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">
                            Total Transactions
                        </CardTitle>
                        <ArrowUpRight className="size-4 text-blue-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{payments.length}</div>
                        <p className="text-xs text-muted-foreground mt-1">
                            All scheduled & completed records
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Payments Table */}
            <Card className="shadow-sm">
                <CardHeader>
                    <CardTitle>Transaction History</CardTitle>
                    <CardDescription>
                        A detailed breakdown of all consultation payments.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {payments.length === 0 ? (
                        <div className="py-12 text-center text-muted-foreground">
                            No payment transactions found.
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left">
                                <thead className="text-xs text-muted-foreground uppercase bg-muted/50 border-b">
                                    <tr>
                                        <th className="px-6 py-4 font-medium">Transaction / ID</th>
                                        <th className="px-6 py-4 font-medium">Date</th>
                                        <th className="px-6 py-4 font-medium">Amount</th>
                                        <th className="px-6 py-4 font-medium">Status</th>
                                        <th className="px-6 py-4 font-medium text-right">Invoice</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y">
                                    {payments.map((payment: any) => (
                                        <tr key={payment.id} className="hover:bg-muted/30 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="font-semibold text-foreground">
                                                    {payment.appointment?.patient?.name ? `Patient: ${payment.appointment.patient.name}` : "Patient Consultation"}
                                                </div>
                                                <div className="text-xs text-muted-foreground font-mono mt-0.5">
                                                    ID: {payment.transactionId || payment.id.slice(0, 16)}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-muted-foreground">
                                                {format(new Date(payment.createdAt), "MMM d, yyyy")}
                                            </td>
                                            <td className="px-6 py-4 font-semibold text-foreground">
                                                ${payment.amount}
                                            </td>
                                            <td className="px-6 py-4">
                                                <Badge
                                                    variant="secondary"
                                                    className={
                                                        payment.status === PaymentStatus.PAID
                                                            ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
                                                            : "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300"
                                                    }
                                                >
                                                    {payment.status}
                                                </Badge>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <InvoiceDownloadButton
                                                    paymentId={payment.id}
                                                    disabled={payment.status !== PaymentStatus.PAID}
                                                    variant="ghost"
                                                    size="icon"
                                                />
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}
