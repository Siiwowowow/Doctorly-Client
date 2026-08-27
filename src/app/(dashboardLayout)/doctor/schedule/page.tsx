/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { DoctorSchedule, Schedule } from "@/types/api.types"
import { getMyDoctorSchedules, deleteDoctorSchedule, createDoctorSchedule } from "@/services/doctorSchedule.services"
import { getAllSchedules } from "@/services/schedule.services"
import { format } from "date-fns"
import { Calendar, Clock, Trash2, Plus, CalendarDays } from "lucide-react"
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

export default function DoctorSchedulePage() {
  const { toast } = useToast()
  
  const [mySchedules, setMySchedules] = useState<DoctorSchedule[]>([])
  const [availableSlots, setAvailableSlots] = useState<Schedule[]>([])
  const [loading, setLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [selectedSlotIds, setSelectedSlotIds] = useState<string[]>([])
  const [processing, setProcessing] = useState(false)

  const fetchData = async () => {
    setLoading(true)
    try {
      const [myRes, slotsRes] = await Promise.all([
        getMyDoctorSchedules(),
        getAllSchedules() // Assuming this returns all active/future global schedule slots
      ])
      setMySchedules(myRes.data || [])
      setAvailableSlots(slotsRes.data || [])
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error fetching schedules",
        description: error.message || "Failed to load schedule data.",
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const handleDelete = async (scheduleId: string) => {
    if (!confirm("Are you sure you want to remove this availability slot?")) return
    
    try {
      await deleteDoctorSchedule(scheduleId)
      toast({
        title: "Slot Removed",
        description: "Your availability slot has been removed.",
      })
      fetchData() // Refresh list
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Failed to remove slot",
        description: error.message || "Something went wrong.",
      })
    }
  }

  const handleCreateAvailability = async () => {
    if (selectedSlotIds.length === 0) return
    
    setProcessing(true)
    try {
      await createDoctorSchedule(selectedSlotIds)
      toast({
        title: "Availability Created",
        description: "Successfully added new availability slots.",
      })
      setIsDialogOpen(false)
      setSelectedSlotIds([])
      fetchData()
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Failed to create availability",
        description: error.message || "Check if these slots are already added.",
      })
    } finally {
      setProcessing(false)
    }
  }

  const toggleSlotSelection = (id: string) => {
    if (selectedSlotIds.includes(id)) {
      setSelectedSlotIds(selectedSlotIds.filter(s => s !== id))
    } else {
      setSelectedSlotIds([...selectedSlotIds, id])
    }
  }

  // Filter out slots that the doctor has already added
  const myScheduleIds = new Set(mySchedules.map(ms => ms.scheduleId))
  const unassignedSlots = availableSlots.filter(s => !myScheduleIds.has(s.id))

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-48" />
        <Skeleton className="h-100 w-full" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">My Schedule</h1>
          <p className="text-muted-foreground">Manage your availability for patient consultations.</p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Availability
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Add Availability Slots</DialogTitle>
              <DialogDescription>
                Select the time slots you want to be available for consultations.
              </DialogDescription>
            </DialogHeader>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 py-4">
              {unassignedSlots.length === 0 ? (
                <div className="col-span-full py-8 text-center text-muted-foreground border border-dashed rounded-lg">
                  No available system time slots found.
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
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
              <Button 
                onClick={handleCreateAvailability} 
                disabled={selectedSlotIds.length === 0 || processing}
              >
                {processing ? "Adding..." : `Add ${selectedSlotIds.length} Slot(s)`}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Tabs defaultValue="upcoming">
        <TabsList>
          <TabsTrigger value="upcoming">Upcoming Schedule</TabsTrigger>
          <TabsTrigger value="all">All Schedules</TabsTrigger>
        </TabsList>
        
        <TabsContent value="upcoming" className="mt-4">
          <Card>
            <CardContent className="p-0">
              {mySchedules.length === 0 ? (
                <div className="p-8 text-center text-muted-foreground">
                  <Calendar className="mx-auto h-12 w-12 opacity-20 mb-3" />
                  <p>You have not added any availability slots yet.</p>
                  <Button variant="link" onClick={() => setIsDialogOpen(true)}>Add slots now</Button>
                </div>
              ) : (
                <div className="divide-y">
                  {mySchedules.filter(ms => new Date(ms.schedule?.startDateTime || "") >= new Date()).map((ms) => (
                    <div key={ms.scheduleId} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 gap-4">
                      <div className="flex items-center gap-4">
                        <div className="bg-primary/10 p-3 rounded-lg flex flex-col items-center justify-center min-w-17.5">
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
                              <Badge variant="default" className="text-[10px] h-5">Booked</Badge>
                            )}
                            {!ms.isBooked && (
                              <Badge variant="outline" className="text-[10px] h-5 text-green-600 border-green-600">Available</Badge>
                            )}
                          </div>
                          <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
                            <Clock className="h-3.5 w-3.5" />
                            {ms.schedule?.startDateTime ? format(new Date(ms.schedule.startDateTime), "hh:mm a") : ""} - 
                            {ms.schedule?.endDateTime ? format(new Date(ms.schedule.endDateTime), "hh:mm a") : ""}
                          </div>
                        </div>
                      </div>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="text-destructive hover:text-destructive hover:bg-destructive/10"
                        onClick={() => handleDelete(ms.scheduleId)}
                        disabled={ms.isBooked}
                        title={ms.isBooked ? "Cannot remove booked slot" : "Remove slot"}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
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
                      {/* Similar layout as upcoming, but shows past too */}
                      <div className="flex items-center gap-4 opacity-75">
                        <div className="bg-muted p-3 rounded-lg flex flex-col items-center justify-center min-w-17.5">
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
                              {ms.isBooked ? "Booked" : "Available"}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
                            <Clock className="h-3.5 w-3.5" />
                            {ms.schedule?.startDateTime ? format(new Date(ms.schedule.startDateTime), "hh:mm a") : ""} - 
                            {ms.schedule?.endDateTime ? format(new Date(ms.schedule.endDateTime), "hh:mm a") : ""}
                          </div>
                        </div>
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
