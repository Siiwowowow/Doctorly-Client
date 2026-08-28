/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React from "react";
import { useQuery } from "@tanstack/react-query";
import { getMyAppointments } from "@/services/appointment.services";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CalendarDays, MapPin, AlertCircle, RefreshCw } from "lucide-react";
import Link from "next/link";
import { Appointment, AppointmentStatus, PaymentStatus } from "@/types/api.types";
import { Badge } from "@/components/ui/badge";
import { JoinCallButton } from "./_components/JoinCallButton";
import { PayNowButton } from "./_components/PayNowButton";
import { InvoiceDownloadButton } from "@/components/shared/InvoiceDownloadButton";
import { Skeleton } from "@/components/ui/skeleton";

export default function AppointmentsPage() {
  const { 
    data: appointmentsRes, 
    isLoading, 
    isError,
    refetch
  } = useQuery({
    queryKey: ["user-appointments"],
    queryFn: () => getMyAppointments(),
    staleTime: 1000 * 60 * 2, // 2 minutes
  });

  const appointments: Appointment[] = appointmentsRes?.data || [];

  const getStatusColor = (status: AppointmentStatus) => {
    switch (status) {
      case AppointmentStatus.SCHEDULED: return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300";
      case AppointmentStatus.INPROGRESS: return "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300";
      case AppointmentStatus.COMPLETED: return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300";
      case AppointmentStatus.CANCELED: return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300";
      default: return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300";
    }
  };

  const getPaymentColor = (status: PaymentStatus) => {
    switch (status) {
      case PaymentStatus.PAID: return "bg-green-100 text-green-800 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800";
      case PaymentStatus.UNPAID: return "bg-rose-100 text-rose-800 border-rose-200 dark:bg-rose-900/30 dark:text-rose-400 dark:border-rose-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">My Appointments</h1>
          <p className="text-muted-foreground">Manage your scheduled consultations and medical appointments.</p>
        </div>
        <Button asChild className="bg-doctorly-primary hover:bg-doctorly-primary/90 text-white">
          <Link href="/doctors">Book New Appointment</Link>
        </Button>
      </div>

      {isError && (
        <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-xl text-destructive flex items-center justify-between">
          <div className="flex items-center gap-3">
            <AlertCircle className="size-5" />
            <p className="text-sm font-medium">Failed to load your appointments. Please try again later.</p>
          </div>
          <Button variant="outline" size="sm" onClick={() => refetch()} className="border-destructive/30 hover:bg-destructive/10 text-destructive">
            <RefreshCw className="mr-2 size-4" /> Retry
          </Button>
        </div>
      )}

      {/* Appointments List */}
      {isLoading ? (
        <div className="grid grid-cols-1 gap-4">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="overflow-hidden shadow-sm border-border/50">
              <CardContent className="p-0">
                <div className="flex flex-col md:flex-row">
                  <div className="bg-muted/30 p-6 border-b md:border-b-0 md:border-r border-border/50 min-w-[200px] flex flex-col justify-center">
                    <Skeleton className="h-4 w-24 mb-2" />
                    <Skeleton className="h-8 w-20 mb-3" />
                    <Skeleton className="h-5 w-16 rounded-full" />
                  </div>
                  <div className="p-6 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start mb-4">
                        <div className="space-y-2">
                          <Skeleton className="h-6 w-48" />
                          <Skeleton className="h-4 w-32" />
                        </div>
                        <Skeleton className="h-6 w-24 rounded-full" />
                      </div>
                      <Skeleton className="h-4 w-40 mt-4" />
                    </div>
                    <div className="mt-6 flex gap-3 pt-4 border-t border-border/50 justify-end">
                      <Skeleton className="h-9 w-24" />
                      <Skeleton className="h-9 w-24" />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : appointments.length === 0 && !isError ? (
        <Card className="border-dashed border-2 bg-muted/10">
          <CardContent className="flex flex-col items-center justify-center py-20 text-center">
            <div className="rounded-full bg-muted p-6">
              <CalendarDays className="size-10 text-muted-foreground" />
            </div>
            <h3 className="mt-4 text-xl font-semibold">No appointments found</h3>
            <p className="mt-2 text-muted-foreground max-w-sm">
              You haven't scheduled any consultations yet. Find a doctor and book your appointment today.
            </p>
            <Button asChild className="mt-6 bg-doctorly-primary hover:bg-doctorly-primary/90 text-white">
              <Link href="/doctors">Find a Doctor</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {appointments.map((apt: Appointment) => (
            <Card key={apt.id} className="overflow-hidden shadow-sm transition-all hover:shadow-md border-border/50">
              <CardContent className="p-0">
                <div className="flex flex-col md:flex-row">
                  
                  {/* Left Side: Schedule & Status */}
                  <div className="bg-muted/30 p-6 flex flex-col justify-between border-b md:border-b-0 md:border-r border-border/50 min-w-[200px]">
                    <div className="text-center sm:text-left">
                      {apt.schedule?.startDateTime ? (
                        <>
                          <p className="text-sm font-semibold text-doctorly-primary uppercase tracking-wider">
                            {new Date(apt.schedule.startDateTime).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}
                          </p>
                          <p className="text-2xl font-bold mt-1">
                            {new Date(apt.schedule.startDateTime).toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' })}
                          </p>
                        </>
                      ) : (
                        <>
                          <p className="text-sm font-semibold text-doctorly-primary uppercase tracking-wider">
                            {new Date(apt.createdAt).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}
                          </p>
                          <p className="text-2xl font-bold mt-1">
                            TBA
                          </p>
                        </>
                      )}
                      <Badge variant="outline" className={`mt-3 ${getPaymentColor(apt.paymentStatus)}`}>
                        {apt.paymentStatus}
                      </Badge>
                    </div>
                  </div>

                  {/* Right Side: Details */}
                  <div className="p-6 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="text-xl font-semibold">{apt.doctor?.name || "Unknown Doctor"}</h3>
                          <p className="text-sm text-muted-foreground">{apt.doctor?.designation || "Doctor"}</p>
                        </div>
                        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${getStatusColor(apt.status)}`}>
                          {apt.status}
                        </span>
                      </div>
                      
                      <div className="mt-4 flex flex-col gap-2 text-sm text-muted-foreground">
                        <div className="flex items-center gap-2">
                          <MapPin className="size-4" />
                          <span>{apt.doctor?.currentWorkingPlace || "Online Consultation"}</span>
                        </div>
                      </div>
                    </div>

                    <div className="mt-6 flex flex-wrap items-center justify-end gap-3 pt-4 border-t border-border/50">
                      {/* View Details is always available */}
                      <Button variant="outline" size="sm" asChild>
                        <Link href={`/user/appointments/${apt.id}`}>
                          View Details
                        </Link>
                      </Button>

                      {/* Pay Now Button logic */}
                      {apt.paymentStatus === PaymentStatus.UNPAID && apt.status !== AppointmentStatus.CANCELED && (
                        <PayNowButton appointmentId={apt.id} />
                      )}

                      {/* Paid Invoice Logic */}
                      {apt.paymentStatus === PaymentStatus.PAID && (
                        <InvoiceDownloadButton paymentId={(apt as any).payment?.id || apt.id} variant="outline" size="sm" className="text-xs">
                          Download Invoice
                        </InvoiceDownloadButton>
                      )}
                      
                      {/* Join Video Call logic - only if PAID and (SCHEDULED or INPROGRESS) */}
                      {apt.paymentStatus === PaymentStatus.PAID && (apt.status === AppointmentStatus.SCHEDULED || apt.status === AppointmentStatus.INPROGRESS) && (
                        <JoinCallButton appointment={apt} />
                      )}
                    </div>
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
