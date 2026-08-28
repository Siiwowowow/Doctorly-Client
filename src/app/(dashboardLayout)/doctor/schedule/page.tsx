/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { getMyDoctorSchedules, deleteDoctorSchedule, createDoctorSchedule } from "@/services/doctorSchedule.services"
import { getAllSchedules } from "@/services/schedule.services"
import { format } from "date-fns"
import { Calendar, Clock, Trash2, Plus, CalendarDays, User } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useTranslations } from "next-intl"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import Link from "next/link"

export default function DoctorSchedulePage() {
  const { toast } = useToast()
  const t = useTranslations("doctorSchedule")
  const queryClient = useQueryClient()
  
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [selectedSlotIds, setSelectedSlotIds] = useState<string[]>([])

  // Fetch my claimed schedules
  const { data: mySchedulesRes, isLoading: myLoading, isError: myError } = useQuery({
    queryKey: ["doctor-schedules"],
    queryFn: () => getMyDoctorSchedules(),
    staleTime: 1000 * 60 * 5, // 5 mins
  })

  // Fetch all available global slots
  const { data: availableSlotsRes, isLoading: availableLoading } = useQuery({
    queryKey: ["available-schedules"],
    queryFn: () => getAllSchedules(),
    staleTime: 1000 * 60 * 5,
  })

  const createMutation = useMutation({
    mutationFn: (ids: string[]) => createDoctorSchedule(ids),
    onSuccess: () => {
      toast({
        title: t("messages.created"),
        description: t("messages.createdDesc"),
      })
      setIsDialogOpen(false)
      setSelectedSlotIds([])
      queryClient.invalidateQueries({ queryKey: ["doctor-schedules"] })
      queryClient.invalidateQueries({ queryKey: ["available-schedules"] })
      queryClient.invalidateQueries({ queryKey: ["doctor-appointments"] })
      queryClient.invalidateQueries({ queryKey: ["doctor-dashboard"] })
    },
    onError: (error: any) => {
      toast({
        variant: "destructive",
        title: t("messages.createFailed"),
        description: error.message || "Check if these slots are already added.",
      })
    }
  })

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteDoctorSchedule(id),
    onSuccess: () => {
      toast({
        title: t("messages.removed"),
        description: t("messages.removedDesc"),
      })
      queryClient.invalidateQueries({ queryKey: ["doctor-schedules"] })
      queryClient.invalidateQueries({ queryKey: ["available-schedules"] })
      queryClient.invalidateQueries({ queryKey: ["doctor-dashboard"] })
    },
    onError: (error: any) => {
      toast({
        variant: "destructive",
        title: t("messages.removeFailed"),
        description: error.message || "Something went wrong.",
      })
    }
  })

  const handleDelete = (scheduleId: string) => {
    if (!confirm(t("messages.confirmRemove"))) return
    deleteMutation.mutate(scheduleId)
  }

  const toggleSlotSelection = (id: string) => {
    if (selectedSlotIds.includes(id)) {
      setSelectedSlotIds(selectedSlotIds.filter(s => s !== id))
    } else {
      setSelectedSlotIds([...selectedSlotIds, id])
    }
  }

  const mySchedules = mySchedulesRes?.data || []
  const availableSlots = availableSlotsRes?.data || []

  const myScheduleIds = new Set(mySchedules.map(ms => ms.scheduleId))
  const unassignedSlots = availableSlots.filter(s => !myScheduleIds.has(s.id))

  if (myLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-48" />
        <Skeleton className="h-[400px] w-full rounded-xl" />
      </div>
    )
  }

  if (myError) {
    return (
      <div className="py-12 text-center text-red-500 bg-red-50 rounded-lg border border-red-200">
        <p>{t("messages.loadFailed")}</p>
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
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              {t("actions.addAvailability")}
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{t("dialog.title")}</DialogTitle>
              <DialogDescription>
                {t("dialog.description")}
              </DialogDescription>
            </DialogHeader>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 py-4">
              {availableLoading ? (
                 <div className="col-span-full py-8 text-center text-muted-foreground border border-dashed rounded-lg">
                   Loading system slots...
                 </div>
              ) : unassignedSlots.length === 0 ? (
                <div className="col-span-full py-8 text-center text-muted-foreground border border-dashed rounded-lg">
                  {t("dialog.noSlots")}
                </div>
              ) : (
                unassignedSlots.map((slot) => (
                  <div
                    key={slot.id}
                    onClick={() => toggleSlotSelection(slot.id)}
                    className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                      selectedSlotIds.includes(slot.id) 
                        ? 'border-primary bg-primary/10' 
                        : 'hover:border-primary/50'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <CalendarDays className="h-4 w-4 text-primary" />
                      <span className="font-medium text-sm">
                        {format(new Date(slot.startDateTime), "MMM d, yyyy")}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Clock className="h-4 w-4" />
                      <span>
                        {format(new Date(slot.startDateTime), "hh:mm a")} - {format(new Date(slot.endDateTime), "hh:mm a")}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>{t("actions.cancel")}</Button>
              <Button 
                onClick={() => createMutation.mutate(selectedSlotIds)} 
                disabled={selectedSlotIds.length === 0 || createMutation.isPending}
              >
                {createMutation.isPending ? t("actions.adding") : t("actions.addSelected", { count: selectedSlotIds.length })}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Tabs defaultValue="upcoming">
        <TabsList>
          <TabsTrigger value="upcoming">{t("tabs.upcoming")}</TabsTrigger>
          <TabsTrigger value="all">{t("tabs.all")}</TabsTrigger>
        </TabsList>
        
        <TabsContent value="upcoming" className="mt-4">
          <Card>
            <CardContent className="p-0">
              {mySchedules.length === 0 ? (
                <div className="p-8 text-center text-muted-foreground">
                  <Calendar className="mx-auto h-12 w-12 opacity-20 mb-3" />
                  <p>{t("emptyStates.noAdded")}</p>
                  <Button variant="link" onClick={() => setIsDialogOpen(true)}>{t("emptyStates.addNow")}</Button>
                </div>
              ) : (
                <div className="divide-y">
                  {mySchedules.filter(ms => new Date(ms.schedule?.startDateTime || "") >= new Date()).map((ms) => (
                    <div key={ms.scheduleId} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 gap-4">
                      
                      <div className="flex items-center gap-4">
                        <div className="bg-primary/10 p-3 rounded-lg flex flex-col items-center justify-center min-w-[70px]">
                          <span className="text-xs font-semibold uppercase text-primary">
                            {ms.schedule?.startDateTime ? format(new Date(ms.schedule.startDateTime), "MMM") : ""}
                          </span>
                          <span className="text-xl font-bold text-primary">
                            {ms.schedule?.startDateTime ? format(new Date(ms.schedule.startDateTime), "dd") : ""}
                          </span>
                        </div>
                        <div>
                          <div className="font-medium flex items-center gap-2">
                            {ms.schedule?.startDateTime ? format(new Date(ms.schedule.startDateTime), "EEEE") : ""}
                            {ms.isBooked && (
                              <Badge variant="default" className="text-[10px] h-5">{t("badges.booked")}</Badge>
                            )}
                            {!ms.isBooked && (
                              <Badge variant="outline" className="text-[10px] h-5 text-green-600 border-green-600">{t("badges.available")}</Badge>
                            )}
                          </div>
                          <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
                            <Clock className="h-3.5 w-3.5" />
                            {ms.schedule?.startDateTime ? format(new Date(ms.schedule.startDateTime), "hh:mm a") : ""} - 
                            {ms.schedule?.endDateTime ? format(new Date(ms.schedule.endDateTime), "hh:mm a") : ""}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-4 w-full sm:w-auto mt-2 sm:mt-0 justify-between sm:justify-end">
                         {/* Patient Integration */}
                         {ms.isBooked && ms.appointment && ms.appointment.patient && (
                           <div className="flex items-center gap-2 bg-muted p-2 rounded-lg text-sm border">
                              <User className="h-4 w-4 text-muted-foreground" />
                              <div className="flex flex-col">
                                 <span className="font-semibold">{ms.appointment.patient.name}</span>
                                 <span className="text-[10px] text-muted-foreground">{ms.appointment.status}</span>
                              </div>
                              <Button size="sm" variant="outline" className="ml-2 h-7" asChild>
                                 <Link href={`/doctor/appointments/${ms.appointmentId}`}>View</Link>
                              </Button>
                           </div>
                         )}

                         <Button 
                           variant="ghost" 
                           size="icon" 
                           className="text-destructive hover:text-destructive hover:bg-destructive/10 shrink-0"
                           onClick={() => handleDelete(ms.scheduleId)}
                           disabled={ms.isBooked || deleteMutation.isPending}
                           title={ms.isBooked ? t("actions.cannotRemove") : t("actions.remove")}
                         >
                           <Trash2 className="h-4 w-4" />
                         </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="all" className="mt-4">
          <Card>
            <CardContent className="p-0">
               <div className="divide-y">
                  {mySchedules.map((ms) => (
                    <div key={ms.scheduleId} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 gap-4">
                      
                      <div className="flex items-center gap-4 opacity-75">
                        <div className="bg-muted p-3 rounded-lg flex flex-col items-center justify-center min-w-[70px]">
                          <span className="text-xs font-semibold uppercase text-muted-foreground">
                            {ms.schedule?.startDateTime ? format(new Date(ms.schedule.startDateTime), "MMM") : ""}
                          </span>
                          <span className="text-xl font-bold text-muted-foreground">
                            {ms.schedule?.startDateTime ? format(new Date(ms.schedule.startDateTime), "dd") : ""}
                          </span>
                        </div>
                        <div>
                          <div className="font-medium flex items-center gap-2">
                            {ms.schedule?.startDateTime ? format(new Date(ms.schedule.startDateTime), "EEEE") : ""}
                            <Badge variant={ms.isBooked ? "default" : "outline"} className="text-[10px] h-5">
                              {ms.isBooked ? t("badges.booked") : t("badges.available")}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
                            <Clock className="h-3.5 w-3.5" />
                            {ms.schedule?.startDateTime ? format(new Date(ms.schedule.startDateTime), "hh:mm a") : ""} - 
                            {ms.schedule?.endDateTime ? format(new Date(ms.schedule.endDateTime), "hh:mm a") : ""}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-4 w-full sm:w-auto mt-2 sm:mt-0 justify-between sm:justify-end">
                         {/* Patient Integration */}
                         {ms.isBooked && ms.appointment && ms.appointment.patient && (
                           <div className="flex items-center gap-2 bg-muted p-2 rounded-lg text-sm border opacity-75">
                              <User className="h-4 w-4 text-muted-foreground" />
                              <div className="flex flex-col">
                                 <span className="font-semibold">{ms.appointment.patient.name}</span>
                                 <span className="text-[10px] text-muted-foreground">{ms.appointment.status}</span>
                              </div>
                              <Button size="sm" variant="outline" className="ml-2 h-7" asChild>
                                 <Link href={`/doctor/appointments/${ms.appointmentId}`}>View</Link>
                              </Button>
                           </div>
                         )}

                         <Button 
                           variant="ghost" 
                           size="icon" 
                           className="text-destructive hover:text-destructive hover:bg-destructive/10 shrink-0"
                           onClick={() => handleDelete(ms.scheduleId)}
                           disabled={ms.isBooked || deleteMutation.isPending}
                           title={ms.isBooked ? t("actions.cannotRemove") : t("actions.remove")}
                         >
                           <Trash2 className="h-4 w-4" />
                         </Button>
                      </div>

                    </div>
                  ))}
                </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
