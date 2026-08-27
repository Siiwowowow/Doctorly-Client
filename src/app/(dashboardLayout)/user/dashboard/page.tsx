/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import { getMyAppointments } from "@/services/appointment.services";
import { getMyPrescriptions } from "@/services/prescription.services";
import { getMyMedicalRecords } from "@/services/medicalRecord.services";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CalendarDays, Clock, Activity, FileText } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export const metadata = {
  title: "Patient Dashboard | Doctorly",
};

export default async function PatientDashboardOverview() {
  let appointments: any[] = [];
  let prescriptionsCount = 0;
  let recordsCount = 0;

  try {
    const [appointmentsRes, prescriptionsRes, recordsRes] = await Promise.all([
      getMyAppointments().catch(() => ({ data: [] })),
      getMyPrescriptions().catch(() => ({ data: [] })),
      getMyMedicalRecords().catch(() => ({ data: [] }))
    ]);
    
    appointments = appointmentsRes?.data || [];
    prescriptionsCount = prescriptionsRes?.data?.length || 0;
    recordsCount = recordsRes?.data?.length || 0;
  } catch (error) {
    console.error("Failed to load dashboard data:", error);
  }

  const upcomingAppointments = appointments.filter((a: any) => a.status === "SCHEDULED");
  const pastAppointments = appointments.filter((a: any) => a.status === "COMPLETED");

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

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-border/50 shadow-sm">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="p-3 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full">
              <CalendarDays className="size-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Upcoming</p>
              <p className="text-2xl font-bold">{upcomingAppointments.length}</p>
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
              <p className="text-2xl font-bold">{pastAppointments.length}</p>
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
              <p className="text-2xl font-bold">{prescriptionsCount}</p>
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
              <p className="text-2xl font-bold">{recordsCount}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upcoming Appointments */}
        <Card className="border-border/50 shadow-sm col-span-1">
          <CardHeader className="flex flex-row items-center justify-between pb-2 border-b">
            <CardTitle className="text-lg font-semibold">Upcoming Appointments</CardTitle>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/user/appointments">View All</Link>
            </Button>
          </CardHeader>
          <CardContent className="p-0">
            {upcomingAppointments.length === 0 ? (
              <div className="p-8 text-center text-muted-foreground">
                <CalendarDays className="size-10 mx-auto mb-3 opacity-20" />
                <p>No upcoming appointments</p>
              </div>
            ) : (
              <div className="divide-y">
                {upcomingAppointments.slice(0, 3).map((apt: any) => (
                  <div key={apt.id} className="p-4 flex flex-col sm:flex-row justify-between sm:items-center gap-4 hover:bg-muted/30 transition-colors">
                    <div>
                      <p className="font-semibold">{apt.doctor?.name || "Unknown Doctor"}</p>
                      <p className="text-sm text-doctorly-primary">{apt.doctor?.designation || apt.doctor?.specialty?.name}</p>
                      <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
                        <Clock className="size-3" /> 
                        <span>
                            {apt.schedule?.date ? new Date(apt.schedule.date).toLocaleDateString() : new Date(apt.createdAt).toLocaleDateString()} 
                            {apt.schedule?.startTime && ` at ${apt.schedule.startTime}`}
                        </span>
                      </div>
                    </div>
                    <div>
                      <span className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-semibold text-blue-800 dark:bg-blue-900 dark:text-blue-300">
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
        <Card className="border-border/50 shadow-sm col-span-1">
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
