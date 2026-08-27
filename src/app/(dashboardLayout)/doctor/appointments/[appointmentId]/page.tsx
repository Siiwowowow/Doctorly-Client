/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { useCallback, useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { Appointment, AppointmentStatus, PaymentStatus } from "@/types/api.types"
import { getAppointmentById, updateAppointmentStatus } from "@/services/appointment.services"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { format } from "date-fns"
import { CalendarDays, Clock, User, Phone, MapPin, Video, Pill, FileText } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { useToast } from "@/hooks/use-toast"

export default function DoctorAppointmentDetailsPage() {
  const { appointmentId } = useParams()
  const { toast } = useToast()
  
  const [appointment, setAppointment] = useState<Appointment | null>(null)
  const [loading, setLoading] = useState(true)

  const fetchAppointment = useCallback(async () => {
    try {
      const res = await getAppointmentById(appointmentId as string)
      setAppointment(res.data)
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to load appointment details.",
      })
    } finally {
      setLoading(false)
    }
  }, [appointmentId, toast])

  useEffect(() => {
    if (appointmentId) {
      fetchAppointment()
    }
  }, [appointmentId, fetchAppointment])

  const handleStatusChange = async (newStatus: AppointmentStatus) => {
    try {
      await updateAppointmentStatus(appointmentId as string, newStatus)
      toast({
        title: "Status Updated",
        description: `Appointment marked as ${newStatus}.`,
      })
      fetchAppointment()
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Update Failed",
        description: error.message || "Could not change appointment status.",
      })
    }
  }

  if (loading) {
    return (
      <div className="space-y-6 max-w-5xl mx-auto">
        <Skeleton className="h-37.5 w-full rounded-xl" />
        <div className="grid md:grid-cols-2 gap-6">
          <Skeleton className="h-75 rounded-xl" />
          <Skeleton className="h-75 rounded-xl" />
        </div>
      </div>
    )
  }

  if (!appointment) {
    return (
      <div className="p-12 text-center">
        <h2 className="text-2xl font-bold mb-2">Appointment Not Found</h2>
        <p className="text-muted-foreground mb-6">The appointment you are looking for does not exist or you do not have permission to view it.</p>
        <Button asChild>
          <Link href="/doctor/appointments">Back to Appointments</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 bg-background border rounded-2xl shadow-sm">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" asChild>
            <Link href="/doctor/appointments">← Back</Link>
          </Button>
          <div>
            <h1 className="font-bold text-lg">Appointment Details</h1>
            <p className="text-xs text-muted-foreground">ID: {appointment.id}</p>
          </div>
        </div>
        
        <div className="flex flex-wrap items-center gap-3">
          {appointment.status === AppointmentStatus.SCHEDULED && (
            <Button onClick={() => handleStatusChange(AppointmentStatus.INPROGRESS)}>
              Start Consultation
            </Button>
          )}
          {appointment.status === AppointmentStatus.INPROGRESS && (
            <Button className="bg-green-600 hover:bg-green-700" onClick={() => handleStatusChange(AppointmentStatus.COMPLETED)}>
              Mark as Completed
            </Button>
          )}
          {(appointment.status === AppointmentStatus.SCHEDULED || appointment.status === AppointmentStatus.INPROGRESS) && (
            <Button variant="destructive" onClick={() => {
              if(confirm("Are you sure you want to cancel this appointment?")) {
                handleStatusChange(AppointmentStatus.CANCELED)
              }
            }}>
              Cancel
            </Button>
          )}
          
          {appointment.videoCallingId && (appointment.status === AppointmentStatus.SCHEDULED || appointment.status === AppointmentStatus.INPROGRESS) && (
            <Button className="bg-blue-600 hover:bg-blue-700 text-white" asChild>
               <Link href={`/video-call/${appointment.videoCallingId}`}>
                 <Video className="mr-2 h-4 w-4" />
                 Join Video Call
               </Link>
            </Button>
          )}
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {/* Left Column: Patient & Status */}
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader className="pb-4 border-b">
              <CardTitle className="text-lg">Patient Information</CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="flex items-start gap-4">
                <div className="bg-primary/10 p-4 rounded-full">
                  <User className="h-8 w-8 text-primary" />
                </div>
                <div className="space-y-4 w-full">
                  <div>
                    <h3 className="text-xl font-bold">{appointment.patient?.name || "Unknown Patient"}</h3>
                    <p className="text-sm text-muted-foreground">{appointment.patient?.email}</p>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 text-sm">
                    {appointment.patient?.contactNumber && (
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        <span>{appointment.patient.contactNumber}</span>
                      </div>
                    )}
                    {appointment.patient?.address && (
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <span>{appointment.patient.address}</span>
                      </div>
                    )}
                  </div>
                  
                  <Button variant="outline" className="w-full sm:w-auto mt-2" asChild>
                    <Link href={`/doctor/patients/${appointment.patientId}`}>View Full Medical History</Link>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions (Prescriptions & Records) */}
          <Card>
            <CardHeader className="pb-4 border-b">
              <CardTitle className="text-lg">Clinical Actions</CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="border rounded-lg p-4 flex flex-col items-center text-center gap-3 bg-muted/20 hover:bg-muted/50 transition-colors">
                  <div className="p-3 bg-blue-100 text-blue-600 rounded-full">
                    <Pill className="h-6 w-6" />
                  </div>
                  <div>
                    <h4 className="font-semibold">Prescription</h4>
                    <p className="text-xs text-muted-foreground mb-3">Write or view prescription for this consultation.</p>
                  </div>
                  <Button variant="outline" className="w-full text-blue-600 border-blue-200" asChild>
                    <Link href={`/doctor/prescriptions/new?appointmentId=${appointment.id}&patientId=${appointment.patientId}`}>
                      Write Prescription
                    </Link>
                  </Button>
                </div>
                
                <div className="border rounded-lg p-4 flex flex-col items-center text-center gap-3 bg-muted/20 hover:bg-muted/50 transition-colors">
                  <div className="p-3 bg-teal-100 text-teal-600 rounded-full">
                    <FileText className="h-6 w-6" />
                  </div>
                  <div>
                    <h4 className="font-semibold">Medical Records</h4>
                    <p className="text-xs text-muted-foreground mb-3">Attach or review patient medical records.</p>
                  </div>
                  <Button variant="outline" className="w-full text-teal-600 border-teal-200" asChild>
                    <Link href={`/doctor/medical-records?patientId=${appointment.patientId}`}>
                      View Records
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
              <CardTitle className="text-lg">Schedule Details</CardTitle>
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
                    className={appointment.status === AppointmentStatus.INPROGRESS ? "bg-blue-500" : 
                              appointment.status === AppointmentStatus.COMPLETED ? "bg-green-500" : ""}
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
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
