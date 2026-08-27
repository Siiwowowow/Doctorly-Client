/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { useCallback, useEffect, useState } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Appointment, AppointmentStatus, PaymentStatus } from "@/types/api.types"
import { getMyAppointments, updateAppointmentStatus } from "@/services/appointment.services"
import { format } from "date-fns"
import { Clock, Search, Filter, Video, CalendarDays } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"

export default function DoctorAppointmentsPage() {
  const { toast } = useToast()
  
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [loading, setLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState<string>("ALL")
  const [searchQuery, setSearchQuery] = useState("")

  const fetchAppointments = useCallback(async () => {
    setLoading(true)
    try {
      const res = await getMyAppointments()
      setAppointments(res.data || [])
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to load appointments.",
      })
    } finally {
      setLoading(false)
    }
  }, [toast])

  useEffect(() => {
    fetchAppointments()
  }, [fetchAppointments])

  const handleStatusChange = async (id: string, newStatus: AppointmentStatus) => {
    try {
      await updateAppointmentStatus(id, newStatus)
      toast({
        title: "Status Updated",
        description: `Appointment marked as ${newStatus}.`,
      })
      fetchAppointments()
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Failed to update status",
        description: error.message || "Could not change appointment status.",
      })
    }
  }

  const filteredAppointments = appointments.filter((apt) => {
    const matchesStatus = statusFilter === "ALL" || apt.status === statusFilter
    const matchesSearch = apt.patient?.name?.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          apt.id.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesStatus && matchesSearch
  })

  // Sort: Upcoming (SCHEDULED) and INPROGRESS first, then COMPLETED, then CANCELED, and by date.
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
    
    // If same status, sort by date (newest first for completed/canceled, oldest first for scheduled/inprogress)
    if (a.status === AppointmentStatus.SCHEDULED || a.status === AppointmentStatus.INPROGRESS) {
      return dateA - dateB;
    } else {
      return dateB - dateA;
    }
  })

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
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Appointments</h1>
          <p className="text-muted-foreground">Manage your patient appointments and consultations.</p>
        </div>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <div className="flex flex-col sm:flex-row items-center gap-4 justify-between w-full">
            <div className="relative w-full sm:w-72">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search patient name..." 
                className="pl-8" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <Filter className="h-4 w-4 text-muted-foreground hidden sm:block" />
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-45">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">All Statuses</SelectItem>
                  <SelectItem value={AppointmentStatus.SCHEDULED}>Scheduled</SelectItem>
                  <SelectItem value={AppointmentStatus.INPROGRESS}>In Progress</SelectItem>
                  <SelectItem value={AppointmentStatus.COMPLETED}>Completed</SelectItem>
                  <SelectItem value={AppointmentStatus.CANCELED}>Canceled</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-4">
              <Skeleton className="h-24 w-full" />
              <Skeleton className="h-24 w-full" />
              <Skeleton className="h-24 w-full" />
            </div>
          ) : filteredAppointments.length === 0 ? (
            <div className="py-12 text-center text-muted-foreground border rounded-lg border-dashed">
              <CalendarDays className="h-12 w-12 opacity-20 mb-3 mx-auto" />
              <p>No appointments found.</p>
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
                        {apt.schedule?.startDateTime ? format(new Date(apt.schedule.startDateTime), "MMM dd, yyyy") : "N/A"}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Clock className="h-4 w-4" />
                        {apt.schedule?.startDateTime ? format(new Date(apt.schedule.startDateTime), "hh:mm a") : "N/A"}
                      </div>
                    </div>

                    {/* Patient Column */}
                    <div className="flex flex-col justify-center">
                      <h3 className="font-semibold text-lg">{apt.patient?.name || "Unknown Patient"}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-sm text-muted-foreground">ID: {apt.id.split("-")[0].toUpperCase()}</span>
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
                        <Button size="sm" onClick={() => handleStatusChange(apt.id, AppointmentStatus.INPROGRESS)}>
                          Start Consult
                        </Button>
                      )}
                      
                      {apt.status === AppointmentStatus.INPROGRESS && (
                        <Button size="sm" variant="default" className="bg-green-600 hover:bg-green-700" onClick={() => handleStatusChange(apt.id, AppointmentStatus.COMPLETED)}>
                          Complete
                        </Button>
                      )}

                      {/* Video Call Entry Point */}
                      {(apt.status === AppointmentStatus.SCHEDULED || apt.status === AppointmentStatus.INPROGRESS) && apt.videoCallingId && (
                        <Button size="sm" variant="outline" className="border-blue-200 text-blue-600 bg-blue-50 hover:bg-blue-100" asChild>
                           <Link href={`/video-call/${apt.videoCallingId}`}>
                             <Video className="h-4 w-4 mr-2" />
                             Join Video
                           </Link>
                        </Button>
                      )}
                      
                      <Button size="sm" variant="outline" asChild>
                        <Link href={`/doctor/appointments/${apt.id}`}>View Details</Link>
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
