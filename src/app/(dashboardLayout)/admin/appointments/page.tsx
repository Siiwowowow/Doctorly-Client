"use client"

import React from 'react'
import { useQuery } from '@tanstack/react-query'
import { getAllAppointmentsAdmin } from '@/services/appointment.services'
import { AppointmentStatus, PaymentStatus } from '@/types/api.types'
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

export default function AppointmentsManagementPage() {
  const { data: appointmentsData, isLoading, isError } = useQuery({
    queryKey: ['admin-appointments'],
    queryFn: () => getAllAppointmentsAdmin(),
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
        <p>Failed to load appointments.</p>
      </div>
    )
  }

  const appointments = appointmentsData?.data || []

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Appointment Management</h2>
          <p className="text-muted-foreground">
            View all appointments across the platform.
          </p>
        </div>
      </div>

      <div className="rounded-md border bg-card overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date & Time</TableHead>
              <TableHead>Doctor</TableHead>
              <TableHead>Patient</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Payment</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {appointments.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-6 text-muted-foreground">
                  No appointments found.
                </TableCell>
              </TableRow>
            ) : (
              appointments.map((appointment) => (
                <TableRow key={appointment.id}>
                  <TableCell className="font-medium whitespace-nowrap">
                    {appointment.schedule?.startDateTime ? (
                      <>
                        <div className="text-sm">{format(new Date(appointment.schedule.startDateTime), "MMM dd, yyyy")}</div>
                        <div className="text-xs text-muted-foreground">{format(new Date(appointment.schedule.startDateTime), "hh:mm a")}</div>
                      </>
                    ) : "N/A"}
                  </TableCell>
                  <TableCell>
                    <div className="text-sm font-medium">{appointment.doctor?.name || "Unknown"}</div>
                    <div className="text-xs text-muted-foreground">{appointment.doctor?.email}</div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm font-medium">{appointment.patient?.name || "Unknown"}</div>
                    <div className="text-xs text-muted-foreground">{appointment.patient?.email}</div>
                  </TableCell>
                  <TableCell>
                    <Badge 
                      variant={
                        appointment.status === AppointmentStatus.SCHEDULED ? "secondary" : 
                        appointment.status === AppointmentStatus.CANCELED ? "destructive" : "default"
                      }
                      className={
                        appointment.status === AppointmentStatus.INPROGRESS ? "bg-blue-500 hover:bg-blue-600" : 
                        appointment.status === AppointmentStatus.COMPLETED ? "bg-green-500 hover:bg-green-600" : ""
                      }
                    >
                      {appointment.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Badge 
                      variant={appointment.paymentStatus === PaymentStatus.PAID ? "default" : "outline"}
                      className={appointment.paymentStatus === PaymentStatus.PAID ? "bg-green-500 hover:bg-green-600" : "text-orange-500 border-orange-500"}
                    >
                      {appointment.paymentStatus}
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
