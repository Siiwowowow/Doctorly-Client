
"use client"

import { useState, Suspense, useMemo } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Appointment, AppointmentStatus, Patient } from "@/types/api.types"
import { getMyAppointments } from "@/services/appointment.services"
import { Search, User, Phone, MapPin } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { useTranslations } from "next-intl"
import { useQuery } from "@tanstack/react-query"
import { format } from "date-fns"

interface DerivedPatient extends Patient {
  appointmentCount: number
  latestStatus: AppointmentStatus | null
  lastConsultationDate: string | null
}

function DoctorPatientsContent() {
  const t = useTranslations("doctorPatients")
  
  const [searchQuery, setSearchQuery] = useState("")

  // Fetch appointments to derive patients
  const { data: appointmentsRes, isLoading, isError } = useQuery({
    queryKey: ["doctor-appointments"],
    queryFn: () => getMyAppointments(),
    staleTime: 1000 * 60 * 5, // 5 mins
  })

  // Deduplicate and aggregate patients client-side
  const derivedPatients = useMemo(() => {
    if (!appointmentsRes?.data) return []
    
    const appointments = appointmentsRes.data
    const patientMap = new Map<string, DerivedPatient>()

    appointments.forEach((apt: Appointment) => {
      if (!apt.patient) return

      const existing = patientMap.get(apt.patientId)
      
      const aptDate = apt.schedule?.startDateTime || null
      
      if (!existing) {
        patientMap.set(apt.patientId, {
          ...apt.patient,
          appointmentCount: 1,
          latestStatus: apt.status,
          lastConsultationDate: aptDate
        })
      } else {
        existing.appointmentCount += 1
        
        // Update latest status/date if this appointment is newer
        if (aptDate && existing.lastConsultationDate) {
          const currentNewest = new Date(existing.lastConsultationDate).getTime()
          const thisApt = new Date(aptDate).getTime()
          
          if (thisApt > currentNewest) {
            existing.lastConsultationDate = aptDate
            existing.latestStatus = apt.status
          }
        } else if (aptDate && !existing.lastConsultationDate) {
           existing.lastConsultationDate = aptDate
           existing.latestStatus = apt.status
        }
      }
    })

    return Array.from(patientMap.values())
  }, [appointmentsRes])

  const filteredPatients = derivedPatients.filter((patient) => {
    return patient.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
           (patient.contactNumber && patient.contactNumber.includes(searchQuery))
  })
  
  // Sort by most recent consultation
  filteredPatients.sort((a, b) => {
    const timeA = a.lastConsultationDate ? new Date(a.lastConsultationDate).getTime() : 0
    const timeB = b.lastConsultationDate ? new Date(b.lastConsultationDate).getTime() : 0
    return timeB - timeA
  })

  if (isError) {
    return (
      <div className="py-12 text-center text-red-500 bg-red-50 rounded-lg border border-red-200">
        <p>{t("errors.loadAppointments")}</p>
        <Button variant="outline" className="mt-4" onClick={() => window.location.reload()}>Retry</Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">{t("title")}</h1>
          <p className="text-muted-foreground">{t("subtitle")}</p>
        </div>
      </div>

      <Card>
        <CardHeader className="pb-3 border-b mb-4">
          <div className="flex justify-between items-center w-full">
            <div className="relative w-full max-w-sm">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder={t("filters.searchPlaceholder")} 
                className="pl-8" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="hidden sm:block text-sm text-muted-foreground">
              {t("stats.totalAppointments")}: {derivedPatients.length}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <Skeleton className="h-44 w-full rounded-xl" />
              <Skeleton className="h-44 w-full rounded-xl" />
              <Skeleton className="h-44 w-full rounded-xl" />
            </div>
          ) : filteredPatients.length === 0 ? (
            <div className="py-12 text-center text-muted-foreground border rounded-lg border-dashed">
              <User className="h-12 w-12 opacity-20 mb-3 mx-auto" />
              <p>{t("emptyStates.noPatients")}</p>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filteredPatients.map((patient) => (
                <Card key={patient.id} className="overflow-hidden hover:border-primary/50 transition-colors flex flex-col shadow-sm">
                  <div className="p-4 flex-1">
                    <div className="flex items-start gap-4">
                      <div className="bg-primary/10 p-3 rounded-full shrink-0">
                        <User className="h-6 w-6 text-primary" />
                      </div>
                      <div className="overflow-hidden w-full">
                        <div className="flex items-start justify-between w-full">
                           <h3 className="font-bold truncate" title={patient.name}>{patient.name}</h3>
                           {patient.bloodGroup && (
                              <Badge variant="outline" className="ml-2 shrink-0 bg-red-50 text-red-600 border-red-200">
                                 {patient.bloodGroup}
                              </Badge>
                           )}
                        </div>
                        <p className="text-sm text-muted-foreground truncate">{patient.email}</p>
                      </div>
                    </div>
                    
                    <div className="mt-4 space-y-2 text-sm text-muted-foreground">
                      {patient.contactNumber && (
                        <div className="flex items-center gap-2">
                          <Phone className="h-4 w-4" />
                          <span>{patient.contactNumber}</span>
                        </div>
                      )}
                      {patient.address && (
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4" />
                          <span className="truncate">{patient.address}</span>
                        </div>
                      )}
                      <div className="flex items-center justify-between pt-2 border-t mt-2">
                         <span className="text-xs">{t("stats.totalAppointments")}:</span>
                         <span className="font-semibold">{patient.appointmentCount}</span>
                      </div>
                      <div className="flex items-center justify-between">
                         <span className="text-xs">{t("stats.lastConsultation")}:</span>
                         <span className="font-semibold text-xs text-right">
                           {patient.lastConsultationDate ? format(new Date(patient.lastConsultationDate), "MMM dd, yyyy") : t("stats.na")}
                         </span>
                      </div>
                    </div>
                  </div>
                  <div className="p-3 bg-muted/30 border-t flex gap-2">
                    <Button variant="outline" size="sm" className="flex-1 bg-background" asChild>
                      <Link href={`/doctor/patients/${patient.id}`}>
                        {t("actions.profile")}
                      </Link>
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1 bg-background" asChild>
                      <Link href={`/doctor/medical-records?patientId=${patient.id}`}>
                        {t("actions.records")}
                      </Link>
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export default function DoctorPatientsPage() {
  return (
    <Suspense fallback={<div className="p-8"><Skeleton className="h-64 w-full" /></div>}>
       <DoctorPatientsContent />
    </Suspense>
  )
}
