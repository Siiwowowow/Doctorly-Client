"use client"

import React from 'react'
import { useQuery } from '@tanstack/react-query'
import { getAllPaymentsAdmin } from '@/services/payment.services'
import { PaymentStatus } from '@/types/api.types'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { format } from "date-fns"

export default function PaymentsManagementPage() {
  const { data: paymentsData, isLoading, isError } = useQuery({
    queryKey: ['admin-payments'],
    queryFn: () => getAllPaymentsAdmin(),
  })

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-[250px]" />
        <Skeleton className="h-[400px] w-full" />
      </div>
    )
  }

  if (isError) {
    return (
      <div className="flex h-[400px] items-center justify-center rounded-xl border border-dashed text-muted-foreground">
        <p>Failed to load payments.</p>
      </div>
    )
  }

  const payments = paymentsData?.data || []

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Payment Management</h2>
          <p className="text-muted-foreground">
            View all transactions and payment statuses.
          </p>
        </div>
      </div>

      <div className="rounded-md border bg-card overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Transaction ID</TableHead>
              <TableHead>Appointment ID</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead className="text-right">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {payments.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-6 text-muted-foreground">
                  No payments found.
                </TableCell>
              </TableRow>
            ) : (
              payments.map((payment: any) => (
                <TableRow key={payment.id}>
                  <TableCell className="font-medium whitespace-nowrap">
                    {format(new Date(payment.createdAt), "MMM dd, yyyy hh:mm a")}
                  </TableCell>
                  <TableCell className="font-mono text-sm">
                    {payment.transactionId || "N/A"}
                  </TableCell>
                  <TableCell className="font-mono text-sm">
                    {payment.appointmentId}
                  </TableCell>
                  <TableCell>
                    ${payment.amount}
                  </TableCell>
                  <TableCell className="text-right">
                    <Badge 
                      variant={payment.status === PaymentStatus.PAID ? "default" : "outline"}
                      className={payment.status === PaymentStatus.PAID ? "bg-green-500 hover:bg-green-600" : "text-orange-500 border-orange-500"}
                    >
                      {payment.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
