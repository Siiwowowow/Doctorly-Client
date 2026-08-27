/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { useEffect, useState } from "react"
import { Payment, PaymentStatus } from "@/types/api.types"
import { getMyPayments } from "@/services/payment.services"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import { CreditCard, Download} from "lucide-react"
import { Button } from "@/components/ui/button"
import { format } from "date-fns"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"



export default function DoctorPaymentsPage() {
  const { toast } = useToast()
  
  const [payments, setPayments] = useState<Payment[]>([])
  const [loading, setLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState<string>("ALL")

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const res = await getMyPayments()
        setPayments(res.data || [])
      } catch (error: any) {
        toast({
          variant: "destructive",
          title: "Error fetching payments",
          description: error.message || "Failed to load payment history.",
        })
      } finally {
        setLoading(false)
      }
    }
    fetchPayments()
  }, [toast])

  const filteredPayments = payments.filter((payment) => {
    return statusFilter === "ALL" || payment.status === statusFilter
  })

  // Sort by date, newest first
  filteredPayments.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

  // Calculate totals
  const totalEarnings = payments
    .filter(p => p.status === PaymentStatus.PAID)
    .reduce((sum, p) => sum + Number(p.amount), 0)

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Payments & Earnings</h1>
          <p className="text-muted-foreground">Track your consultation earnings and payment history.</p>
        </div>
        
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-37.5">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All Payments</SelectItem>
            <SelectItem value={PaymentStatus.PAID}>Paid</SelectItem>
            <SelectItem value={PaymentStatus.UNPAID}>Unpaid</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card className="bg-primary/5 border-primary/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Earnings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-primary flex items-center gap-2">
              ৳{totalEarnings.toLocaleString()}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Paid Consultations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {payments.filter(p => p.status === PaymentStatus.PAID).length}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Pending Payments</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-orange-500">
              {payments.filter(p => p.status === PaymentStatus.UNPAID).length}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="p-0">
          {loading ? (
            <div className="space-y-4 p-6">
              <Skeleton className="h-16 w-full" />
              <Skeleton className="h-16 w-full" />
              <Skeleton className="h-16 w-full" />
            </div>
          ) : filteredPayments.length === 0 ? (
            <div className="py-16 text-center text-muted-foreground flex flex-col items-center">
              <CreditCard className="h-16 w-16 opacity-20 mb-4" />
              <p className="text-lg font-medium">No payment history</p>
              <p>No payments found matching the selected criteria.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-muted-foreground uppercase bg-muted/50 border-b">
                  <tr>
                    <th className="px-6 py-4 font-medium">Date</th>
                    <th className="px-6 py-4 font-medium">Transaction ID</th>
                    <th className="px-6 py-4 font-medium">Patient</th>
                    <th className="px-6 py-4 font-medium">Status</th>
                    <th className="px-6 py-4 font-medium text-right">Amount</th>
                    <th className="px-6 py-4 font-medium text-right">Invoice</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {filteredPayments.map((payment) => (
                    <tr key={payment.id} className="hover:bg-muted/10 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        {format(new Date(payment.createdAt), "MMM dd, yyyy")}
                      </td>
                      <td className="px-6 py-4 font-mono text-xs text-muted-foreground">
                        {payment.transactionId}
                      </td>
                      <td className="px-6 py-4 font-medium">
                        {payment.appointment?.patient?.name || "Unknown"}
                      </td>
                      <td className="px-6 py-4">
                        <Badge 
                          variant={payment.status === PaymentStatus.PAID ? "default" : "outline"}
                          className={payment.status === PaymentStatus.PAID ? "bg-green-500 hover:bg-green-600" : "text-orange-500 border-orange-500"}
                        >
                          {payment.status}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 text-right font-bold">
                        ৳{Number(payment.amount).toLocaleString()}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <Button variant="ghost" size="icon" title="Download Invoice" disabled={payment.status !== PaymentStatus.PAID}>
                          <Download className="h-4 w-4" />
                        </Button>
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
