/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { useParams } from "next/navigation"
import { AppointmentStatus, PaymentStatus } from "@/types/api.types"
import { getAppointmentById, updateAppointmentStatus } from "@/services/appointment.services"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { format } from "date-fns"
import { CalendarDays, Clock, User, Phone, MapPin, Video, Pill, FileText, MessageSquare } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { useToast } from "@/hooks/use-toast"
import { useTranslations } from "next-intl"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { useState } from "react"

export default function DoctorAppointmentDetailsPage() {
  const { appointmentId } = useParams()
  const { toast } = useToast()
  const t = useTranslations("doctorAppointments")
  const queryClient = useQueryClient()
  const [isCompletionDialogOpen, setIsCompletionDialogOpen] = useState(false)

  const { data: appointmentRes, isLoading, isError } = useQuery({
    queryKey: ["doctor-appointments", appointmentId],
    queryFn: () => getAppointmentById(appointmentId as string),
    enabled: !!appointmentId,
    staleTime: 1000 * 60 * 5, // 5 mins
  })

  const statusMutation = useMutation({
    mutationFn: (newStatus: AppointmentStatus) => updateAppointmentStatus(appointmentId as string, newStatus),
    onSuccess: (data, variables) => {
      toast({
        title: t("messages.statusUpdated"),
        description: t("messages.statusUpdatedDesc", { status: variables }),
      })
      queryClient.invalidateQueries({ queryKey: ["doctor-appointments"] })
      queryClient.invalidateQueries({ queryKey: ["doctor-dashboard"] })
    },
    onError: (error: any) => {
      toast({
        variant: "destructive",
        title: t("messages.updateFailed"),
        description: error.message || "Could not change appointment status.",
      })
    }
  })

  if (isLoading) {
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

  if (isError || !appointmentRes?.data) {
    return (
      <div className="p-12 text-center">
        <h2 className="text-2xl font-bold mb-2">{t("emptyStates.notFound")}</h2>
        <p className="text-muted-foreground mb-6">{t("emptyStates.notFoundDesc")}</p>
        <Button asChild>
          <Link href="/doctor/appointments">{t("emptyStates.backToAppointments")}</Link>
        </Button>
      </div>
    )
  }

  const appointment = appointmentRes.data

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 bg-background border rounded-2xl shadow-sm">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" asChild>
            <Link href="/doctor/appointments">← {t("actions.back")}</Link>
          </Button>
          <div>
            <h1 className="font-bold text-lg">{t("details.title")}</h1>
            <p className="text-xs text-muted-foreground">{t("details.id")}: {appointment.id}</p>
          </div>
        </div>
        
        <div className="flex flex-wrap items-center gap-3">
          {appointment.status === AppointmentStatus.SCHEDULED && (
            <Button 
               onClick={() => statusMutation.mutate(AppointmentStatus.INPROGRESS)}
               disabled={statusMutation.isPending}
            >
              {t("actions.startConsult")}
            </Button>
          )}
          {appointment.status === AppointmentStatus.INPROGRESS && (
            <Dialog open={isCompletionDialogOpen} onOpenChange={setIsCompletionDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-green-600 hover:bg-green-700">
                  {t("details.markCompleted")}
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>{t("details.completeConsultation")}</DialogTitle>
                  <DialogDescription>
                    {t("details.completeConfirmMsg")}
                  </DialogDescription>
                </DialogHeader>
                <div className="py-4 space-y-2">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Pill className="h-4 w-4" /> {t("details.prescription")}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <FileText className="h-4 w-4" /> {t("details.medicalRecords")}
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsCompletionDialogOpen(false)}>{t("details.cancel")}</Button>
                  <Button 
                    className="bg-green-600 hover:bg-green-700 text-white"
                    onClick={() => {
                      setIsCompletionDialogOpen(false)
                      statusMutation.mutate(AppointmentStatus.COMPLETED)
                    }}
                    disabled={statusMutation.isPending}
                  >
                    {t("details.confirmCompletion")}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          )}
          {(appointment.status === AppointmentStatus.SCHEDULED || appointment.status === AppointmentStatus.INPROGRESS) && (
            <Button 
               variant="destructive" 
               onClick={() => {
                 if(confirm(t("details.confirmCancel"))) {
                   statusMutation.mutate(AppointmentStatus.CANCELED)
                 }
               }}
               disabled={statusMutation.isPending}
            >
              {t("details.cancel")}
            </Button>
          )}
          
          {appointment.videoCallingId && (appointment.status === AppointmentStatus.SCHEDULED || appointment.status === AppointmentStatus.INPROGRESS) && (
            <Button className="bg-blue-600 hover:bg-blue-700 text-white" asChild>
               <Link href={`/video-call/${appointment.videoCallingId}`}>
                 <Video className="mr-2 h-4 w-4" />
                 {t("details.joinVideo")}
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
              <CardTitle className="text-lg">{t("details.patientInfo")}</CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="flex items-start gap-4">
                <div className="bg-primary/10 p-4 rounded-full">
                  <User className="h-8 w-8 text-primary" />
                </div>
                <div className="space-y-4 w-full">
                  <div>
                    <h3 className="text-xl font-bold">{appointment.patient?.name || t("table.unknownPatient")}</h3>
                    <p className="text-sm text-muted-foreground">{appointment.patient?.email}</p>
                    <div className="mt-2 flex flex-wrap gap-2 text-xs">
                      <span className="bg-muted px-2 py-1 rounded-md font-medium text-muted-foreground">
                        Blood: <span className="text-foreground font-semibold">{appointment.patient?.bloodGroup || appointment.patient?.patientHealthData?.bloodGroup || t("table.na")}</span>
                      </span>
                      <span className="bg-muted px-2 py-1 rounded-md font-medium text-muted-foreground">
                        Gender: <span className="text-foreground font-semibold">{appointment.patient?.patientHealthData?.gender || (appointment.patient as any)?.gender || t("table.na")}</span>
                      </span>
                      <span className="bg-muted px-2 py-1 rounded-md font-medium text-muted-foreground">
                        DOB: <span className="text-foreground font-semibold">{appointment.patient?.patientHealthData?.dateOfBirth ? format(new Date(appointment.patient.patientHealthData.dateOfBirth), "MMM d, yyyy") : t("table.na")}</span>
                      </span>
                    </div>
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
                  
                  {/* Notice we removed the href target to /doctor/patients/:id to avoid unauthorized fetch for now if that page fetches GET /patient/:id. Since patient ID is authorized, Phase 21 Patient List will use authorized routes, so we can keep it as is, but we must make sure the linked page respects the rules. For now, it stays. */}
                  <Button variant="outline" className="w-full sm:w-auto mt-2" asChild>
                    <Link href={`/doctor/patients/${appointment.patientId}`}>{t("details.viewMedicalHistory")}</Link>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions (Prescriptions & Records) */}
          <Card>
            <CardHeader className="pb-4 border-b">
              <CardTitle className="text-lg">{t("details.clinicalActions")}</CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="grid sm:grid-cols-3 gap-4">
                <div className="border rounded-lg p-4 flex flex-col items-center text-center gap-3 bg-muted/20 hover:bg-muted/50 transition-colors">
                  <div className="p-3 bg-blue-100 text-blue-600 rounded-full">
                    <Pill className="h-6 w-6" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold">{t("details.prescription")}</h4>
                    <p className="text-xs text-muted-foreground mb-3">{t("details.prescriptionDesc")}</p>
                  </div>
                  <Button variant="outline" className="w-full text-blue-600 border-blue-200" asChild>
                    <Link href={`/doctor/prescriptions/new?appointmentId=${appointment.id}&patientId=${appointment.patientId}`}>
                      {t("details.writePrescription")}
                    </Link>
                  </Button>
                </div>
                
                <div className="border rounded-lg p-4 flex flex-col items-center text-center gap-3 bg-muted/20 hover:bg-muted/50 transition-colors">
                  <div className="p-3 bg-teal-100 text-teal-600 rounded-full">
                    <FileText className="h-6 w-6" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold">{t("details.medicalRecords")}</h4>
                    <p className="text-xs text-muted-foreground mb-3">{t("details.medicalRecordsDesc")}</p>
                  </div>
                  <div className="flex w-full gap-2">
                    <Button variant="outline" className="w-1/2 text-teal-600 border-teal-200 px-0" asChild>
                      <Link href={`/doctor/medical-records?patientId=${appointment.patientId}`} className="text-xs">
                        {t("details.view")}
                      </Link>
                    </Button>
                    <Button variant="default" className="w-1/2 bg-teal-600 hover:bg-teal-700 text-white px-0" asChild>
                      <Link href={`/doctor/medical-records/new?appointmentId=${appointment.id}&patientId=${appointment.patientId}`} className="text-xs">
                        {t("details.create")}
                      </Link>
                    </Button>
                  </div>
                </div>

                <div className="border rounded-lg p-4 flex flex-col items-center text-center gap-3 bg-muted/20 hover:bg-muted/50 transition-colors">
                  <div className="p-3 bg-purple-100 text-purple-600 rounded-full">
                    <MessageSquare className="h-6 w-6" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold">{t("details.openChat")}</h4>
                    <p className="text-xs text-muted-foreground mb-3">{t("details.openChatDesc")}</p>
                  </div>
                  <Button variant="outline" className="w-full text-purple-600 border-purple-200" asChild>
                    <Link href={`/chat?patientId=${appointment.patientId || appointment.patient?.id}`}>
                      {t("details.goToChat")}
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
              <CardTitle className="text-lg">{t("details.scheduleDetails")}</CardTitle>
            </CardHeader>
            <CardContent className="pt-6 space-y-4">
              <div className="flex items-center gap-3">
                <div className="bg-primary/10 p-2 rounded-md">
                  <CalendarDays className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium">{t("details.date")}</p>
                  <p className="text-sm text-muted-foreground">
                    {appointment.schedule?.startDateTime ? format(new Date(appointment.schedule.startDateTime), "MMMM dd, yyyy") : t("table.na")}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="bg-primary/10 p-2 rounded-md">
                  <Clock className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium">{t("details.time")}</p>
                  <p className="text-sm text-muted-foreground">
                    {appointment.schedule?.startDateTime ? format(new Date(appointment.schedule.startDateTime), "hh:mm a") : t("table.na")} - 
                    {appointment.schedule?.endDateTime ? format(new Date(appointment.schedule.endDateTime), "hh:mm a") : t("table.na")}
                  </p>
                </div>
              </div>

              <div className="pt-4 border-t space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">{t("details.appointmentStatus")}</span>
                  <Badge 
                    variant={appointment.status === AppointmentStatus.SCHEDULED ? "secondary" : 
                            appointment.status === AppointmentStatus.CANCELED ? "destructive" : "default"}
                    className={appointment.status === AppointmentStatus.INPROGRESS ? "bg-blue-500" : 
                              appointment.status === AppointmentStatus.COMPLETED ? "bg-green-500" : ""}
                  >
                    {appointment.status === AppointmentStatus.SCHEDULED ? t("filters.scheduled") :
                     appointment.status === AppointmentStatus.INPROGRESS ? t("filters.inProgress") :
                     appointment.status === AppointmentStatus.COMPLETED ? t("filters.completed") :
                     appointment.status === AppointmentStatus.CANCELED ? t("filters.canceled") :
                     appointment.status}
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">{t("details.paymentStatus")}</span>
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
