"use client"

import React, { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getAllSchedules, createSchedule, deleteSchedule } from '@/services/schedule.services'
import { Schedule } from '@/types/api.types'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { useToast } from "@/hooks/use-toast"
import { format } from "date-fns"
import { Plus, Trash2 } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function SchedulesManagementPage() {
  const { toast } = useToast()
  const queryClient = useQueryClient()
  
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")
  const [startTime, setStartTime] = useState("08:00")
  const [endTime, setEndTime] = useState("18:00")

  const { data: schedulesData, isLoading, isError } = useQuery({
    queryKey: ['admin-schedules'],
    queryFn: () => getAllSchedules(),
  })

  const saveMutation = useMutation({
    mutationFn: (data: { startDate: string; endDate: string; startTime: string; endTime: string }) => createSchedule(data),
    onSuccess: () => {
      toast({ title: "Schedules created successfully" })
      queryClient.invalidateQueries({ queryKey: ['admin-schedules'] })
      setIsDialogOpen(false)
    },
    onError: (err: unknown) => {
      toast({ variant: "destructive", title: "Operation failed", description: err instanceof Error ? err.message : "Unknown error" })
    }
  })

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteSchedule(id),
    onSuccess: () => {
      toast({ title: "Schedule deleted successfully" })
      queryClient.invalidateQueries({ queryKey: ['admin-schedules'] })
    },
    onError: (err: unknown) => {
      toast({ variant: "destructive", title: "Failed to delete schedule", description: err instanceof Error ? err.message : "Unknown error" })
    }
  })

  const handleSave = () => {
    if (!startDate || !endDate || !startTime || !endTime) return
    saveMutation.mutate({ startDate, endDate, startTime, endTime })
  }

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-[250px]" />
        <Skeleton className="h-[400px] w-full" />
      </div>
    )
  }

  if (isError) {
    return (
      <div className="flex h-[400px] items-center justify-center rounded-xl border border-dashed text-muted-foreground">
        <p>Failed to load schedules.</p>
      </div>
    )
  }

  const schedules = schedulesData?.data || []

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Global Schedule Management</h2>
          <p className="text-muted-foreground">
            Manage global time slots available for doctors to book.
          </p>
        </div>
        <Button onClick={() => setIsDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" /> Generate Schedules
        </Button>
      </div>

      <div className="rounded-md border bg-card overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Start Time</TableHead>
              <TableHead>End Time</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {schedules.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-6 text-muted-foreground">
                  No schedules found.
                </TableCell>
              </TableRow>
            ) : (
              schedules.map((schedule: Schedule) => (
                <TableRow key={schedule.id}>
                  <TableCell className="font-medium">
                    {format(new Date(schedule.startDateTime), "MMM dd, yyyy")}
                  </TableCell>
                  <TableCell>
                    {format(new Date(schedule.startDateTime), "hh:mm a")}
                  </TableCell>
                  <TableCell>
                    {format(new Date(schedule.endDateTime), "hh:mm a")}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="text-destructive hover:text-destructive hover:bg-destructive/10"
                      onClick={() => {
                        if(confirm("Are you sure you want to delete this schedule?")) {
                          deleteMutation.mutate(schedule.id)
                        }
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Generate Schedules</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="startDate">Start Date</Label>
                <Input 
                  id="startDate" 
                  type="date"
                  value={startDate} 
                  onChange={(e) => setStartDate(e.target.value)} 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="endDate">End Date</Label>
                <Input 
                  id="endDate" 
                  type="date"
                  value={endDate} 
                  onChange={(e) => setEndDate(e.target.value)} 
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="startTime">Start Time</Label>
                <Input 
                  id="startTime" 
                  type="time"
                  value={startTime} 
                  onChange={(e) => setStartTime(e.target.value)} 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="endTime">End Time</Label>
                <Input 
                  id="endTime" 
                  type="time"
                  value={endTime} 
                  onChange={(e) => setEndTime(e.target.value)} 
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)} disabled={saveMutation.isPending}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={!startDate || !endDate || !startTime || !endTime || saveMutation.isPending}>
              {saveMutation.isPending ? "Generating..." : "Generate"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
