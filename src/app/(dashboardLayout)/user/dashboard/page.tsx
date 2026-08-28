"use client";

import React from "react";
import { useQuery } from "@tanstack/react-query";
import { getMyAppointments } from "@/services/appointment.services";
import { getMyPrescriptions } from "@/services/prescription.services";
import { getMyMedicalRecords } from "@/services/medicalRecord.services";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CalendarDays, Clock, Activity, FileText, AlertCircle, RefreshCw } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { AppointmentStatus } from "@/types/api.types";

export default function PatientDashboardOverview() {
  const { 
    data: appointmentsRes, 
    isLoading: isLoadingAppointments, 
    isError: isErrorAppointments,
    refetch: refetchAppointments
  } = useQuery({
    queryKey: ["user-appointments"],
    queryFn: () => getMyAppointments(),
    staleTime: 1000 * 60 * 2, // 2 minutes
  });

  const { 
    data: prescriptionsRes, 
    isLoading: isLoadingPrescriptions 
  } = useQuery({
    queryKey: ["user-prescriptions"],
    queryFn: () => getMyPrescriptions(),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  const { 
    data: recordsRes, 
    isLoading: isLoadingRecords 
  } = useQuery({
    queryKey: ["user-medical-records"],
    queryFn: () => getMyMedicalRecords(),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  const appointments = appointmentsRes?.data || [];
  const prescriptionsCount = prescriptionsRes?.data?.length || 0;
  const recordsCount = recordsRes?.data?.length || 0;

  const upcomingAppointments = appointments.filter((a) => a.status === AppointmentStatus.SCHEDULED || a.status === AppointmentStatus.INPROGRESS);
  const pastAppointments = appointments.filter((a) => a.status === AppointmentStatus.COMPLETED);

  const isLoading = isLoadingAppointments || isLoadingPrescriptions || isLoadingRecords;

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <Card className="bg-doctorly-primary text-white shadow-md border-none overflow-hidden relative">
        <div className="absolute right-0 top-0 opacity-10">
          <Activity className="size-48 -mt-10 -mr-10" />
        </div>
        <CardContent className="p-8 relative z-10">
          <h2 className="text-2xl font-bold mb-2">Welcome to your Dashboard</h2>
          <p className="text-white/80 max-w-lg">
            Manage your appointments, view medical records, and stay updated with your health journey.
          </p>
        </CardContent>
      </Card>

      {isErrorAppointments && (
        <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-xl text-destructive flex items-center justify-between">
          <div className="flex items-center gap-3">
            <AlertCircle className="size-5" />
            <p className="text-sm font-medium">Unable to load dashboard data.</p>
          </div>
          <Button variant="outline" size="sm" onClick={() => refetchAppointments()} className="border-destructive/30 hover:bg-destructive/10 text-destructive">
            <RefreshCw className="mr-2 size-4" /> Retry
          </Button>
        </div>
      )}

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-border/50 shadow-sm">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="p-3 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full">
              <CalendarDays className="size-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Upcoming</p>
              {isLoading ? <Skeleton className="h-8 w-12 mt-1" /> : <p className="text-2xl font-bold">{upcomingAppointments.length}</p>}
            </div>
          </CardContent>
        </Card>
        <Card className="border-border/50 shadow-sm">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="p-3 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-full">
              <Clock className="size-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Completed</p>
              {isLoading ? <Skeleton className="h-8 w-12 mt-1" /> : <p className="text-2xl font-bold">{pastAppointments.length}</p>}
            </div>
          </CardContent>
        </Card>
        <Card className="border-border/50 shadow-sm">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="p-3 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-full">
              <FileText className="size-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Prescriptions</p>
              {isLoading ? <Skeleton className="h-8 w-12 mt-1" /> : <p className="text-2xl font-bold">{prescriptionsCount}</p>}
            </div>
          </CardContent>
        </Card>
        <Card className="border-border/50 shadow-sm">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="p-3 bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 rounded-full">
              <Activity className="size-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Records</p>
              {isLoading ? <Skeleton className="h-8 w-12 mt-1" /> : <p className="text-2xl font-bold">{recordsCount}</p>}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upcoming Appointments */}
        <Card className="border-border/50 shadow-sm col-span-1 h-full">
          <CardHeader className="flex flex-row items-center justify-between pb-2 border-b">
            <CardTitle className="text-lg font-semibold">Upcoming Appointments</CardTitle>
            <Button variant="ghost" size="sm" asChild disabled={isLoading}>
              <Link href="/user/appointments">View All</Link>
            </Button>
          </CardHeader>
          <CardContent className="p-0">
            {isLoading ? (
              <div className="divide-y p-4">
                {[1, 2].map((i) => (
                  <div key={i} className="py-4 flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                    <div className="space-y-2">
                      <Skeleton className="h-5 w-40" />
                      <Skeleton className="h-4 w-24" />
                      <Skeleton className="h-3 w-32" />
                    </div>
                    <Skeleton className="h-6 w-20 rounded-full" />
                  </div>
                ))}
              </div>
            ) : upcomingAppointments.length === 0 ? (
              <div className="p-8 text-center text-muted-foreground">
                <CalendarDays className="size-10 mx-auto mb-3 opacity-20" />
                <p>No upcoming appointments</p>
              </div>
            ) : (
              <div className="divide-y">
                {upcomingAppointments.slice(0, 3).map((apt) => (
                  <div key={apt.id} className="p-4 flex flex-col sm:flex-row justify-between sm:items-center gap-4 hover:bg-muted/30 transition-colors">
                    <div>
                      <p className="font-semibold">{apt.doctor?.name || "Unknown Doctor"}</p>
                      <p className="text-sm text-doctorly-primary">{apt.doctor?.designation || "Doctor"}</p>
                      <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
                        <Clock className="size-3" /> 
                        <span>
                            {apt.schedule?.startDateTime ? new Date(apt.schedule.startDateTime).toLocaleDateString() : new Date(apt.createdAt).toLocaleDateString()} 
                            {apt.schedule?.startDateTime && ` at ${new Date(apt.schedule.startDateTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}`}
                        </span>
                      </div>
                    </div>
                    <div>
                      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                        apt.status === AppointmentStatus.INPROGRESS 
                          ? "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400"
                          : "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400"
                      }`}>
                        {apt.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="border-border/50 shadow-sm col-span-1 h-full">
          <CardHeader className="pb-2 border-b">
            <CardTitle className="text-lg font-semibold">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-2 gap-4">
              <Link href="/doctors" className="flex flex-col items-center justify-center p-4 border rounded-xl hover:bg-doctorly-primary/5 hover:border-doctorly-primary/30 transition-all text-center group">
                <div className="p-3 bg-muted rounded-full mb-3 group-hover:bg-doctorly-primary group-hover:text-white transition-colors">
                  <CalendarDays className="size-5" />
                </div>
                <span className="font-medium text-sm">Book Appointment</span>
              </Link>
              <Link href="/user/medical-records" className="flex flex-col items-center justify-center p-4 border rounded-xl hover:bg-doctorly-primary/5 hover:border-doctorly-primary/30 transition-all text-center group">
                <div className="p-3 bg-muted rounded-full mb-3 group-hover:bg-doctorly-primary group-hover:text-white transition-colors">
                  <FileText className="size-5" />
                </div>
                <span className="font-medium text-sm">View Records</span>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>

    </div>
  );
}
