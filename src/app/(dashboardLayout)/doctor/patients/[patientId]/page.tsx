
"use client"

import { useMemo } from "react"
import { useParams } from "next/navigation"
import { Appointment, AppointmentStatus, PaymentStatus } from "@/types/api.types"
import { getMyAppointments } from "@/services/appointment.services"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { User, Phone, MapPin, Mail, Calendar, FileText, Pill, CalendarDays, Clock, Video, MessageSquare, Droplet } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { useTranslations } from "next-intl"
import { useQuery } from "@tanstack/react-query"
import { format } from "date-fns"

export default function DoctorPatientDetailsPage() {
  const { patientId } = useParams()
  const t = useTranslations("doctorPatients")
  
  const { data: appointmentsRes, isLoading, isError } = useQuery({
    queryKey: ["doctor-appointments"],
    queryFn: () => getMyAppointments(),
    staleTime: 1000 * 60 * 5, // 5 mins
  })

  // Extract patient and specific appointments
  const { patient, patientAppointments, activeAppointment } = useMemo(() => {
    if (!appointmentsRes?.data || !patientId) return { patient: null, patientAppointments: [], activeAppointment: undefined }

    const allApts: Appointment[] = appointmentsRes.data
    const pApts = allApts.filter(apt => apt.patientId === patientId)
    
    // Sort descending by date
    pApts.sort((a, b) => {
       const dateA = a.schedule?.startDateTime ? new Date(a.schedule.startDateTime).getTime() : 0
       const dateB = b.schedule?.startDateTime ? new Date(b.schedule.startDateTime).getTime() : 0
       return dateB - dateA
    })

    // The patient payload is the same across appointments for this patientId, just take the first one
    const p = pApts.length > 0 ? pApts[0].patient : null

    const activeApt = pApts.find(a => a.status === AppointmentStatus.INPROGRESS) || 
                      pApts.slice().reverse().find(a => a.status === AppointmentStatus.SCHEDULED && new Date(a.schedule?.startDateTime || "") >= new Date(new Date().setHours(0,0,0,0)))

    return { patient: p, patientAppointments: pApts, activeAppointment: activeApt }
  }, [appointmentsRes, patientId])

  if (isLoading) {
    return (
      <div className="space-y-6 max-w-5xl mx-auto">
        <Skeleton className="h-37.5 w-full rounded-xl" />
        <Skeleton className="h-75 w-full rounded-xl" />
      </div>
    )
  }

  if (isError || !patient) {
    return (
      <div className="p-12 text-center">
        <h2 className="text-2xl font-bold mb-2">{t("emptyStates.notFound")}</h2>
        <p className="text-muted-foreground mb-6">{t("emptyStates.notFoundDesc")}</p>
        <Button asChild>
          <Link href="/doctor/patients">{t("actions.backToPatients")}</Link>
        </Button>
      </div>
    )
  }

  const getStatusBadge = (status: AppointmentStatus) => {
    switch(status) {
      case AppointmentStatus.SCHEDULED: return <Badge variant="secondary">Scheduled</Badge>
      case AppointmentStatus.INPROGRESS: return <Badge className="bg-blue-500 hover:bg-blue-600">In Progress</Badge>
      case AppointmentStatus.COMPLETED: return <Badge className="bg-green-500 hover:bg-green-600">Completed</Badge>
      case AppointmentStatus.CANCELED: return <Badge variant="destructive">Canceled</Badge>
      default: return <Badge>{status}</Badge>
    }
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 bg-background border rounded-2xl shadow-sm">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" asChild>
            <Link href="/doctor/patients">← Back</Link>
          </Button>
          <div>
            <h1 className="font-bold text-lg">{t("details.title")}</h1>
            <p className="text-xs text-muted-foreground">{t("details.id")}: {patient.id}</p>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {/* Left Column: Personal Info */}
        <div className="md:col-span-1 space-y-6">
          <Card>
            <CardContent className="pt-6 flex flex-col items-center text-center">
              <div className="bg-primary/10 p-6 rounded-full mb-4">
                <User className="h-16 w-16 text-primary" />
              </div>
              <h2 className="text-2xl font-bold">{patient.name}</h2>
              <p className="text-muted-foreground text-sm mb-4">{t("details.patient")}</p>
              
              <div className="w-full space-y-3 mt-4 text-sm text-left">
                <div className="flex items-center gap-3 p-2 bg-muted/30 rounded-md">
                  <Mail className="h-4 w-4 text-muted-foreground shrink-0" />
                  <span className="truncate">{patient.email}</span>
                </div>
                {patient.contactNumber && (
                  <div className="flex items-center gap-3 p-2 bg-muted/30 rounded-md">
                    <Phone className="h-4 w-4 text-muted-foreground shrink-0" />
                    <span>{patient.contactNumber}</span>
                  </div>
                )}
                {patient.address && (
                  <div className="flex items-center gap-3 p-2 bg-muted/30 rounded-md">
                    <MapPin className="h-4 w-4 text-muted-foreground shrink-0" />
                    <span>{patient.address}</span>
                  </div>
                )}
                {patient.bloodGroup && (
                  <div className="flex items-center gap-3 p-2 bg-red-50 text-red-800 rounded-md">
                    <Droplet className="h-4 w-4 shrink-0" />
                    <span className="font-semibold">{t("details.bloodGroup")}: {patient.bloodGroup}</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Clinical Data Access */}
        <div className="md:col-span-2 space-y-6">
          
          {/* Active Consultation Module */}
          {activeAppointment && (
            <Card className="border-blue-200 bg-blue-50/50 shadow-sm">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-blue-500 animate-pulse" />
                  <CardTitle className="text-blue-700">{t("details.activeConsultation")}</CardTitle>
                </div>
                <CardDescription>
                  {activeAppointment.schedule?.startDateTime ? format(new Date(activeAppointment.schedule.startDateTime), "MMM dd, yyyy - hh:mm a") : ""}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-3">
                  <Button className="bg-blue-600 hover:bg-blue-700 text-white" asChild>
                    <Link href={`/video-call/${activeAppointment.videoCallingId}`}>
                      <Video className="mr-2 h-4 w-4" />
                      {t("details.startVideo")}
                    </Link>
                  </Button>
                  <Button variant="outline" className="border-blue-200 text-blue-700 hover:bg-blue-100" asChild>
                    <Link href={`/chat?patientId=${patient.id}`}>
                      <MessageSquare className="mr-2 h-4 w-4" />
                      {t("details.messagePatient")}
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader>
              <CardTitle>{t("details.clinicalOverview")}</CardTitle>
              <CardDescription>{t("details.clinicalOverviewDesc")}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid sm:grid-cols-2 gap-4">
                {/* Medical Records */}
                <div className="border rounded-xl p-5 hover:bg-muted/30 transition-colors flex flex-col items-center text-center">
                  <div className="bg-teal-100 text-teal-600 p-3 rounded-full mb-3">
                    <FileText className="h-6 w-6" />
                  </div>
                  <h3 className="font-semibold text-lg">{t("details.medicalRecords")}</h3>
                  <p className="text-sm text-muted-foreground mb-4 mt-1">{t("details.medicalRecordsDesc")}</p>
                  <Button variant="outline" className="w-full mt-auto text-teal-600 border-teal-200 bg-background" asChild>
                    <Link href={`/doctor/medical-records?patientId=${patient.id}`}>{t("details.viewRecords")}</Link>
                  </Button>
                </div>

                {/* Prescriptions */}
                <div className="border rounded-xl p-5 hover:bg-muted/30 transition-colors flex flex-col items-center text-center">
                  <div className="bg-blue-100 text-blue-600 p-3 rounded-full mb-3">
                    <Pill className="h-6 w-6" />
                  </div>
                  <h3 className="font-semibold text-lg">{t("details.prescriptions")}</h3>
                  <p className="text-sm text-muted-foreground mb-4 mt-1">{t("details.prescriptionsDesc")}</p>
                  <Button variant="outline" className="w-full mt-auto text-blue-600 border-blue-200 bg-background" asChild>
                    <Link href={`/doctor/prescriptions?patientId=${patient.id}`}>{t("details.viewPrescriptions")}</Link>
                  </Button>
                </div>

                {/* Appointment Jump Link */}
                <div className="border rounded-xl p-5 hover:bg-muted/30 transition-colors flex flex-col items-center text-center sm:col-span-2">
                  <div className="bg-purple-100 text-purple-600 p-3 rounded-full mb-3">
                    <Calendar className="h-6 w-6" />
                  </div>
                  <h3 className="font-semibold text-lg">{t("details.appointmentHistory")}</h3>
                  <p className="text-sm text-muted-foreground mb-4 mt-1">{t("details.appointmentHistoryDesc")}</p>
                  <Button variant="outline" className="w-full max-w-xs mt-auto text-purple-600 border-purple-200 bg-background" asChild>
                    <Link href={`/doctor/appointments?search=${patient.name}`}>{t("details.viewAppointments")}</Link>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* History List */}
          <Card>
             <CardHeader>
                <CardTitle>{t("details.historyTitle")}</CardTitle>
                <CardDescription>{t("details.historyDesc")}</CardDescription>
             </CardHeader>
             <CardContent>
                {patientAppointments.length === 0 ? (
                   <p className="text-muted-foreground text-sm text-center py-8">{t("emptyStates.noHistory")}</p>
                ) : (
                   <div className="space-y-4">
                      {patientAppointments.map((apt) => (
                         <div key={apt.id} className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 border rounded-xl hover:border-primary/50 transition-colors gap-4">
                            <div className="flex gap-4 items-center">
                               <div className="bg-muted p-2 rounded-lg">
                                  <CalendarDays className="h-5 w-5 text-primary" />
                               </div>
                               <div>
                                  <p className="font-semibold">
                                     {apt.schedule?.startDateTime ? format(new Date(apt.schedule.startDateTime), "MMM dd, yyyy") : "N/A"}
                                  </p>
                                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                     <Clock className="h-3 w-3" />
                                     <span>{apt.schedule?.startDateTime ? format(new Date(apt.schedule.startDateTime), "hh:mm a") : "N/A"}</span>
                                  </div>
                               </div>
                            </div>
                            
                            <div className="flex items-center gap-3">
                               <div className="flex flex-col items-end mr-2">
                                  {getStatusBadge(apt.status)}
                                  <span className={`text-[10px] font-semibold mt-1 ${apt.paymentStatus === PaymentStatus.PAID ? 'text-green-600' : 'text-orange-600'}`}>
                                    {apt.paymentStatus}
                                  </span>
                               </div>
                               <Button variant="outline" size="sm" asChild>
                                  <Link href={`/doctor/appointments/${apt.id}`}>{t("details.viewAppointments")}</Link>
                               </Button>
                            </div>
                         </div>
                      ))}
                   </div>
                )}
             </CardContent>
          </Card>

        </div>
      </div>
    </div>
  )
}
