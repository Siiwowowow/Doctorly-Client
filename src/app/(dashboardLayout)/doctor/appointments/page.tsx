/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { useState, Suspense } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Appointment, AppointmentStatus, PaymentStatus } from "@/types/api.types"
import { getMyAppointments, updateAppointmentStatus } from "@/services/appointment.services"
import { format } from "date-fns"
import { Clock, Search, Filter, Video, CalendarDays, MessageSquare } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"
import { useRouter, useSearchParams } from "next/navigation"
import { initiateCall } from "@/services/call.services"
import { useTranslations } from "next-intl"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"

function DoctorAppointmentsContent() {
  const t = useTranslations("doctorAppointments")
  const { toast } = useToast()
  const router = useRouter()
  const searchParams = useSearchParams()
  const queryClient = useQueryClient()
  
  // URL synced state
  const initialStatus = searchParams.get("status") || "ALL"
  const [statusFilter, setStatusFilter] = useState<string>(initialStatus)
  const [searchQuery, setSearchQuery] = useState("")
  const [isCalling, setIsCalling] = useState(false)

  // React Query for data fetching
  const { data: appointmentsRes, isLoading, isError } = useQuery({
    queryKey: ["doctor-appointments"],
    queryFn: () => getMyAppointments(),
    staleTime: 1000 * 60 * 5, // 5 mins
  })

  // React Query Mutation for status update
  const statusMutation = useMutation({
    mutationFn: ({ id, newStatus }: { id: string, newStatus: AppointmentStatus }) => updateAppointmentStatus(id, newStatus),
    onSuccess: (data, variables) => {
      toast({
        title: t("messages.statusUpdated"),
        description: t("messages.statusUpdatedDesc", { status: variables.newStatus }),
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

  const appointments = appointmentsRes?.data || []

  const handleStatusChangeFilter = (value: string) => {
    setStatusFilter(value)
    const params = new URLSearchParams(searchParams.toString())
    if (value === "ALL") {
      params.delete("status")
    } else {
      params.set("status", value)
    }
    router.push(`?${params.toString()}`, { scroll: false })
  }

  const handleStartCall = async (apt: Appointment) => {
    if (!apt.patientId) return;
    setIsCalling(true);
    try {
      const res = await initiateCall({
        receiverId: apt.patientId,
        appointmentId: apt.id,
        isVideoCall: true
      });
      if (res.data?.id) {
        router.push(`/video-call/${res.data.id}`);
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: t("messages.callFailed"),
        description: error.message || "Could not start video call.",
      });
    } finally {
      setIsCalling(false);
    }
  }

  const filteredAppointments = appointments.filter((apt) => {
    const matchesStatus = statusFilter === "ALL" || apt.status === statusFilter
    const matchesSearch = apt.patient?.name?.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          apt.id.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesStatus && matchesSearch
  })

  // Sort logic
  filteredAppointments.sort((a, b) => {
    const dateA = a.schedule?.startDateTime ? new Date(a.schedule.startDateTime).getTime() : 0;
    const dateB = b.schedule?.startDateTime ? new Date(b.schedule.startDateTime).getTime() : 0;
    
    const priority = {
      [AppointmentStatus.INPROGRESS]: 1,
      [AppointmentStatus.SCHEDULED]: 2,
      [AppointmentStatus.COMPLETED]: 3,
      [AppointmentStatus.CANCELED]: 4,
    }
    
    if (priority[a.status] !== priority[b.status]) {
      return priority[a.status] - priority[b.status]
    }
    
    if (a.status === AppointmentStatus.SCHEDULED || a.status === AppointmentStatus.INPROGRESS) {
      return dateA - dateB;
    } else {
      return dateB - dateA;
    }
  })

  const getStatusBadge = (status: AppointmentStatus) => {
    switch(status) {
      case AppointmentStatus.SCHEDULED: return <Badge variant="secondary">{t("filters.scheduled")}</Badge>
      case AppointmentStatus.INPROGRESS: return <Badge className="bg-blue-500 hover:bg-blue-600">{t("filters.inProgress")}</Badge>
      case AppointmentStatus.COMPLETED: return <Badge className="bg-green-500 hover:bg-green-600">{t("filters.completed")}</Badge>
      case AppointmentStatus.CANCELED: return <Badge variant="destructive">{t("filters.canceled")}</Badge>
      default: return <Badge>{status}</Badge>
    }
  }

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
        <CardHeader className="pb-3">
          <div className="flex flex-col sm:flex-row items-center gap-4 justify-between w-full">
            <div className="relative w-full sm:w-72">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder={t("filters.searchPlaceholder")} 
                className="pl-8" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <Filter className="h-4 w-4 text-muted-foreground hidden sm:block" />
              <Select value={statusFilter} onValueChange={handleStatusChangeFilter}>
                <SelectTrigger className="w-full sm:w-45">
                  <SelectValue placeholder={t("filters.allStatuses")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">{t("filters.allStatuses")}</SelectItem>
                  <SelectItem value={AppointmentStatus.SCHEDULED}>{t("filters.scheduled")}</SelectItem>
                  <SelectItem value={AppointmentStatus.INPROGRESS}>{t("filters.inProgress")}</SelectItem>
                  <SelectItem value={AppointmentStatus.COMPLETED}>{t("filters.completed")}</SelectItem>
                  <SelectItem value={AppointmentStatus.CANCELED}>{t("filters.canceled")}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-4">
              <Skeleton className="h-24 w-full rounded-xl" />
              <Skeleton className="h-24 w-full rounded-xl" />
              <Skeleton className="h-24 w-full rounded-xl" />
            </div>
          ) : filteredAppointments.length === 0 ? (
            <div className="py-12 text-center text-muted-foreground border rounded-lg border-dashed">
              <CalendarDays className="h-12 w-12 opacity-20 mb-3 mx-auto" />
              <p>{t("emptyStates.noAppointments")}</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredAppointments.map((apt) => (
                <div key={apt.id} className="flex flex-col lg:flex-row items-start lg:items-center justify-between p-4 border rounded-xl hover:border-primary/50 transition-colors gap-4">
                  
                  <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 w-full lg:w-auto">
                    {/* Date/Time Column */}
                    <div className="flex flex-row sm:flex-col items-center sm:items-start gap-3 sm:gap-1 min-w-35 bg-muted/50 p-3 rounded-lg">
                      <div className="flex items-center gap-2 text-sm font-semibold">
                        <CalendarDays className="h-4 w-4 text-primary" />
                        {apt.schedule?.startDateTime ? format(new Date(apt.schedule.startDateTime), "MMM dd, yyyy") : t("table.na")}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Clock className="h-4 w-4" />
                        {apt.schedule?.startDateTime ? format(new Date(apt.schedule.startDateTime), "hh:mm a") : t("table.na")}
                      </div>
                    </div>

                    {/* Patient Column */}
                    <div className="flex flex-col justify-center">
                      <h3 className="font-semibold text-lg">{apt.patient?.name || t("table.unknownPatient")}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-sm text-muted-foreground">{t("table.id")}: {apt.id.split("-")[0].toUpperCase()}</span>
                        <span className="text-muted-foreground text-xs">•</span>
                        <span className={`text-xs font-semibold ${apt.paymentStatus === PaymentStatus.PAID ? 'text-green-600' : 'text-orange-600'}`}>
                          {apt.paymentStatus}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Actions & Status Column */}
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 w-full lg:w-auto">
                    <div className="min-w-25">
                      {getStatusBadge(apt.status)}
                    </div>
                    
                    <div className="flex flex-wrap items-center gap-2">
                      {/* State Transitions */}
                      {apt.status === AppointmentStatus.SCHEDULED && (
                        <Button 
                          size="sm" 
                          onClick={() => statusMutation.mutate({ id: apt.id, newStatus: AppointmentStatus.INPROGRESS })}
                          disabled={statusMutation.isPending}
                        >
                          {t("actions.startConsult")}
                        </Button>
                      )}
                      
                      {apt.status === AppointmentStatus.INPROGRESS && (
                        <Button 
                          size="sm" 
                          variant="default" 
                          className="bg-green-600 hover:bg-green-700" 
                          onClick={() => statusMutation.mutate({ id: apt.id, newStatus: AppointmentStatus.COMPLETED })}
                          disabled={statusMutation.isPending}
                        >
                          {t("actions.complete")}
                        </Button>
                      )}

                      {/* Video Call Entry Point */}
                      {(apt.status === AppointmentStatus.SCHEDULED || apt.status === AppointmentStatus.INPROGRESS) && (
                        <Button 
                           size="sm" 
                           variant="outline" 
                           className="border-blue-200 text-blue-600 bg-blue-50 hover:bg-blue-100" 
                           onClick={() => handleStartCall(apt)}
                           disabled={isCalling}
                        >
                           <Video className="h-4 w-4 mr-2" />
                           {isCalling ? t("actions.calling") : t("actions.callPatient")}
                        </Button>
                      )}

                      {/* Chat Entry Point */}
                      {(apt.status === AppointmentStatus.SCHEDULED || apt.status === AppointmentStatus.INPROGRESS) && (
                        <Button size="sm" variant="outline" asChild>
                           <Link href={`/chat`}>
                             <MessageSquare className="h-4 w-4 text-muted-foreground" />
                           </Link>
                        </Button>
                      )}
                      
                      <Button size="sm" variant="outline" asChild>
                        <Link href={`/doctor/appointments/${apt.id}`}>{t("actions.viewDetails")}</Link>
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export default function DoctorAppointmentsPage() {
  return (
    <Suspense fallback={
      <div className="space-y-4 p-6">
         <Skeleton className="h-8 w-1/3" />
         <Skeleton className="h-96 w-full" />
      </div>
    }>
       <DoctorAppointmentsContent />
    </Suspense>
  )
}
