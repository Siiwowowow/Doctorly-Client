"use client";

import { JoinCallButton } from "../_components/JoinCallButton";
import { useParams } from "next/navigation"
import { AppointmentStatus, PaymentStatus } from "@/types/api.types"
import { getAppointmentById } from "@/services/appointment.services"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { format } from "date-fns"
import { CalendarDays, Clock, User, Phone, MapPin, Video, Pill, FileText, MessageSquare, Receipt } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { BackButton } from "@/components/shared/BackButton"
import { useQuery } from "@tanstack/react-query"

export default function UserAppointmentDetailsPage() {
  const { appointmentId } = useParams()

  const { data: appointmentRes, isLoading, isError } = useQuery({
    queryKey: ["user-appointments", appointmentId],
    queryFn: () => getAppointmentById(appointmentId as string),
    enabled: !!appointmentId,
    staleTime: 1000 * 60 * 5,
  })

  if (isLoading) {
    return (
      <div className="space-y-6 max-w-5xl mx-auto">
        <Skeleton className="h-32 w-full rounded-xl" />
        <div className="grid md:grid-cols-2 gap-6">
          <Skeleton className="h-72 rounded-xl" />
          <Skeleton className="h-72 rounded-xl" />
        </div>
      </div>
    )
  }

  if (isError || !appointmentRes?.data) {
    return (
      <div className="p-12 text-center">
        <h2 className="text-2xl font-bold mb-2">Appointment Not Found</h2>
        <p className="text-muted-foreground mb-6">The requested appointment details could not be found.</p>
        <Button asChild>
          <Link href="/user/appointments">Back to Appointments</Link>
        </Button>
      </div>
    )
  }

  const appointment = appointmentRes.data

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex items-center justify-between">
        <BackButton fallbackUrl="/user/appointments" label="Back to Appointments" />
      </div>
      {/* Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 bg-background border rounded-2xl shadow-sm">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" asChild>
            <Link href="/user/appointments">← Back</Link>
          </Button>
          <div>
            <h1 className="font-bold text-lg">Appointment Details</h1>
            <p className="text-xs text-muted-foreground">ID: {appointment.id}</p>
          </div>
        </div>
        
        <div className="flex flex-wrap items-center gap-3">
          <JoinCallButton appointment={appointment as any} />
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {/* Left Column: Doctor & Clinical Info */}
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader className="pb-4 border-b">
              <CardTitle className="text-lg">Doctor Information</CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="flex items-start gap-4">
                <div className="bg-primary/10 p-4 rounded-full">
                  <User className="h-8 w-8 text-primary" />
                </div>
                <div className="space-y-4 w-full">
                  <div>
                    <h3 className="text-xl font-bold">{appointment.doctor?.name || "Unknown Doctor"}</h3>
                    <p className="text-sm text-primary font-medium">{appointment.doctor?.designation}</p>
                    <p className="text-sm text-muted-foreground">{appointment.doctor?.email}</p>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 text-sm">
                    {appointment.doctor?.contactNumber && (
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        <span>{appointment.doctor.contactNumber}</span>
                      </div>
                    )}
                    {appointment.doctor?.currentWorkingPlace && (
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <span>{appointment.doctor.currentWorkingPlace}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions (Prescriptions & Records) */}
          <Card>
            <CardHeader className="pb-4 border-b">
              <CardTitle className="text-lg">Clinical Follow-up</CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="grid sm:grid-cols-3 gap-4">
                <div className="border rounded-lg p-4 flex flex-col items-center text-center gap-3 bg-muted/20 hover:bg-muted/50 transition-colors">
                  <div className="p-3 bg-blue-100 text-blue-600 rounded-full">
                    <Pill className="h-6 w-6" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold">Prescription</h4>
                    <p className="text-xs text-muted-foreground mb-3">View your prescribed medications</p>
                  </div>
                  <Button variant="outline" className="w-full text-blue-600 border-blue-200" asChild>
                    <Link href={`/user/prescriptions`}>
                      View Prescriptions
                    </Link>
                  </Button>
                </div>
                
                <div className="border rounded-lg p-4 flex flex-col items-center text-center gap-3 bg-muted/20 hover:bg-muted/50 transition-colors">
                  <div className="p-3 bg-teal-100 text-teal-600 rounded-full">
                    <FileText className="h-6 w-6" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold">Medical Record</h4>
                    <p className="text-xs text-muted-foreground mb-3">View clinical notes and findings</p>
                  </div>
                  <Button variant="outline" className="w-full text-teal-600 border-teal-200" asChild>
                    <Link href={`/user/medical-records`}>
                      View Records
                    </Link>
                  </Button>
                </div>

                <div className="border rounded-lg p-4 flex flex-col items-center text-center gap-3 bg-muted/20 hover:bg-muted/50 transition-colors">
                  <div className="p-3 bg-purple-100 text-purple-600 rounded-full">
                    <MessageSquare className="h-6 w-6" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold">Chat with Doctor</h4>
                    <p className="text-xs text-muted-foreground mb-3">Follow up with messages</p>
                  </div>
                  <Button variant="outline" className="w-full text-purple-600 border-purple-200" asChild>
                    <Link href={`/chat?doctorId=${appointment.doctorId || appointment.doctor?.id}`}>
                      Go to Chat
                    </Link>
                  </Button>
                </div>

              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Appointment Details */}
        <div className="space-y-6">
          <Card>
            <CardHeader className="pb-4 border-b">
              <CardTitle className="text-lg">Schedule & Status</CardTitle>
            </CardHeader>
            <CardContent className="pt-6 space-y-4">
              <div className="flex items-center gap-3">
                <div className="bg-primary/10 p-2 rounded-md">
                  <CalendarDays className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium">Date</p>
                  <p className="text-sm text-muted-foreground">
                    {appointment.schedule?.startDateTime ? format(new Date(appointment.schedule.startDateTime), "MMMM dd, yyyy") : "N/A"}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="bg-primary/10 p-2 rounded-md">
                  <Clock className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium">Time</p>
                  <p className="text-sm text-muted-foreground">
                    {appointment.schedule?.startDateTime ? format(new Date(appointment.schedule.startDateTime), "hh:mm a") : "N/A"} - 
                    {appointment.schedule?.endDateTime ? format(new Date(appointment.schedule.endDateTime), "hh:mm a") : "N/A"}
                  </p>
                </div>
              </div>

              <div className="pt-4 border-t space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Appointment Status</span>
                  <Badge 
                    variant={appointment.status === AppointmentStatus.SCHEDULED ? "secondary" : 
                            appointment.status === AppointmentStatus.CANCELED ? "destructive" : "default"}
                    className={appointment.status === AppointmentStatus.INPROGRESS ? "bg-blue-500 hover:bg-blue-600" : 
                              appointment.status === AppointmentStatus.COMPLETED ? "bg-green-500 hover:bg-green-600" : ""}
                  >
                    {appointment.status}
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Payment Status</span>
                  <Badge variant={appointment.paymentStatus === PaymentStatus.PAID ? "default" : "outline"}
                         className={appointment.paymentStatus === PaymentStatus.PAID ? "bg-green-500 hover:bg-green-600" : "text-orange-500 border-orange-500"}>
                    {appointment.paymentStatus}
                  </Badge>
                </div>
              </div>
              
              {appointment.paymentStatus === PaymentStatus.PAID && (
                <div className="pt-4 border-t">
                  <Button variant="outline" className="w-full gap-2" asChild>
                    <Link href={`/payment/invoice/${appointment.id}`}>
                      <Receipt className="h-4 w-4" /> View Invoice
                    </Link>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
