/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import { getMyAppointments } from "@/services/appointment.services";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CalendarDays, Clock, Video, MapPin, Search } from "lucide-react";
import Link from "next/link";
import { AppointmentStatus, PaymentStatus } from "@/types/api.types";
import { Badge } from "@/components/ui/badge";

export const metadata = {
  title: "My Appointments | Doctorly",
};

export default async function AppointmentsPage() {
  let appointments: any[] = [];
  try {
    const res = await getMyAppointments();
    appointments = res.data || [];
  } catch (error) {
    console.error("Failed to load appointments:", error);
  }

  const getStatusColor = (status: AppointmentStatus) => {
    switch (status) {
      case AppointmentStatus.SCHEDULED: return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
      case AppointmentStatus.INPROGRESS: return "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300";
      case AppointmentStatus.COMPLETED: return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
      case AppointmentStatus.CANCELED: return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
      default: return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300";
    }
  };

  const getPaymentColor = (status: PaymentStatus) => {
    if (status === PaymentStatus.PAID) return "border-green-500 text-green-600";
    return "border-red-500 text-red-600";
  };

  return (
    <div className="space-y-6">
      
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">My Appointments</h1>
          <p className="text-muted-foreground">Manage your upcoming and past consultations.</p>
        </div>
        <Button asChild className="bg-doctorly-primary text-white hover:bg-doctorly-primary/90">
          <Link href="/doctors">
            <CalendarDays className="mr-2 size-4" />
            Book New
          </Link>
        </Button>
      </div>

      {appointments.length === 0 ? (
        <Card className="border-dashed border-2 bg-muted/10">
          <CardContent className="flex flex-col items-center justify-center py-20 text-center">
            <div className="rounded-full bg-muted p-6">
              <Search className="size-10 text-muted-foreground" />
            </div>
            <h3 className="mt-4 text-xl font-semibold">No appointments found</h3>
            <p className="mt-2 text-muted-foreground max-w-sm">
              You haven't booked any consultations yet. Find a doctor to get started.
            </p>
            <Button asChild className="mt-6 bg-doctorly-primary text-white">
              <Link href="/doctors">Find a Doctor</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {appointments.map((apt: any) => (
            <Card key={apt.id} className="overflow-hidden shadow-sm transition-all hover:shadow-md border-border/50">
              <CardContent className="p-0">
                <div className="flex flex-col sm:flex-row">
                  
                  {/* Left Side: Date/Time Info */}
                  <div className="bg-muted/30 p-6 sm:w-64 flex flex-col justify-center border-b sm:border-b-0 sm:border-r border-border/50">
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
                          <p className="text-sm text-muted-foreground">{apt.doctor?.designation}</p>
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

                    <div className="mt-6 flex items-center justify-end gap-3 pt-4 border-t border-border/50">
                      <Button variant="outline" size="sm" asChild>
                        <Link href={`/doctors/${apt.doctorId}`}>
                          View Profile
                        </Link>
                      </Button>
                      
                      {(apt.status === AppointmentStatus.SCHEDULED || apt.status === AppointmentStatus.INPROGRESS) && apt.videoCallingId && (
                        <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white shadow-sm" asChild>
                          <Link href={`/video-call/${apt.videoCallingId}`}>
                            <Video className="mr-2 size-4" />
                            Join Call
                          </Link>
                        </Button>
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
