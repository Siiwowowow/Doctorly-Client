/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import React from 'react'
import { useQuery } from '@tanstack/react-query'
import { getAppointmentById } from '@/services/appointment.services'
import { useParams } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { ArrowLeft, CalendarDays, UserRound, Stethoscope, CreditCard } from 'lucide-react'
import { AppointmentStatus, PaymentStatus } from '@/types/api.types'

export default function AppointmentDetailsPage() {
  const params = useParams()
  const appointmentId = params.appointmentId as string || params.id as string
  
  const { data: appointmentData, isLoading, isError } = useQuery({
    queryKey: ['admin-appointment', appointmentId],
    queryFn: () => getAppointmentById(appointmentId),
    enabled: !!appointmentId
  })

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-32" />
        <Card>
          <CardContent className="p-6 space-y-4">
            <Skeleton className="h-6 w-1/3" />
            <Skeleton className="h-4 w-1/4" />
            <Skeleton className="h-4 w-1/2" />
          </CardContent>
        </Card>
      </div>
    )
  }

  if (isError || !appointmentData?.data) {
    return (
      <div className="flex h-[400px] flex-col items-center justify-center rounded-xl border border-dashed text-muted-foreground gap-4">
        <p>Appointment not found or failed to load.</p>
        <Button asChild variant="outline">
          <Link href="/admin/appointments">Back to Appointments</Link>
        </Button>
      </div>
    )
  }

  const apt = appointmentData.data

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" asChild>
          <Link href="/admin/appointments">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <h2 className="text-2xl font-bold tracking-tight">Appointment Details</h2>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CalendarDays className="h-5 w-5 text-primary" />
              Schedule Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Status</span>
              <Badge 
                variant={
                  apt.status === AppointmentStatus.SCHEDULED ? "secondary" : 
                  apt.status === AppointmentStatus.CANCELED ? "destructive" : "default"
                }
                className={
                  apt.status === AppointmentStatus.INPROGRESS ? "bg-blue-500" : 
                  apt.status === AppointmentStatus.COMPLETED ? "bg-green-500" : ""
                }
              >
                {apt.status}
              </Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Date</span>
              <span className="font-medium">
                {apt.schedule?.startDateTime ? new Date(apt.schedule.startDateTime).toLocaleDateString() : "N/A"}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Time</span>
              <span className="font-medium">
                {apt.schedule?.startDateTime ? new Date(apt.schedule.startDateTime).toLocaleTimeString() : "N/A"}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5 text-primary" />
              Payment Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Payment Status</span>
              <Badge 
                variant={apt.paymentStatus === PaymentStatus.PAID ? "default" : "outline"}
                className={apt.paymentStatus === PaymentStatus.PAID ? "bg-green-500" : "text-orange-500 border-orange-500"}
              >
                {apt.paymentStatus}
              </Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Transaction ID</span>
              <span className="font-mono text-sm">
                {(apt as any).payment?.transactionId || "N/A"}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Amount</span>
              <span className="font-medium">
                {(apt as any).payment?.amount ? `$${(apt as any).payment.amount}` : "N/A"}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserRound className="h-5 w-5 text-primary" />
              Patient Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <p><span className="text-muted-foreground">Name:</span> <span className="font-medium">{apt.patient?.name || "Unknown"}</span></p>
            <p><span className="text-muted-foreground">Email:</span> {apt.patient?.email || "N/A"}</p>
            <p><span className="text-muted-foreground">Contact:</span> {apt.patient?.contactNumber || "N/A"}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Stethoscope className="h-5 w-5 text-primary" />
              Doctor Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <p><span className="text-muted-foreground">Name:</span> <span className="font-medium">{apt.doctor?.name || "Unknown"}</span></p>
            <p><span className="text-muted-foreground">Email:</span> {apt.doctor?.email || "N/A"}</p>
            <p><span className="text-muted-foreground">Designation:</span> {apt.doctor?.designation || "N/A"}</p>
          </CardContent>
        </Card>
      </div>
      
      <div className="bg-muted/50 border rounded-lg p-4 flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Note: Admin access to private clinical consultations and video sessions is restricted to protect patient privacy.
        </p>
      </div>
    </div>
  )
}
