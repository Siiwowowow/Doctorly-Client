"use client"

import React from 'react'
import { useQuery } from '@tanstack/react-query'
import { getAllDoctorSchedulesAdmin } from '@/services/doctorSchedule.services'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { format } from "date-fns"

export default function SchedulesManagementPage() {
  const { data: schedulesData, isLoading, isError } = useQuery({
    queryKey: ['admin-schedules'],
    queryFn: () => getAllDoctorSchedulesAdmin(),
  })

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
          <h2 className="text-2xl font-bold tracking-tight">Schedule Management</h2>
          <p className="text-muted-foreground">
            View all doctor schedules across the platform.
          </p>
        </div>
      </div>

      <div className="rounded-md border bg-card overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date & Time</TableHead>
              <TableHead>Doctor</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {schedules.length === 0 ? (
              <TableRow>
                <TableCell colSpan={3} className="text-center py-6 text-muted-foreground">
                  No schedules found.
                </TableCell>
              </TableRow>
            ) : (
              schedules.map((schedule) => (
                <TableRow key={schedule.doctorId + schedule.scheduleId}>
                  <TableCell className="font-medium whitespace-nowrap">
                    {schedule.schedule?.startDateTime && schedule.schedule?.endDateTime ? (
                      <>
                        <div className="text-sm">{format(new Date(schedule.schedule.startDateTime), "MMM dd, yyyy")}</div>
                        <div className="text-xs text-muted-foreground">
                          {format(new Date(schedule.schedule.startDateTime), "hh:mm a")} - {format(new Date(schedule.schedule.endDateTime), "hh:mm a")}
                        </div>
                      </>
                    ) : "N/A"}
                  </TableCell>
                  <TableCell>
                    <div className="text-sm font-medium">{schedule.doctor?.name || "Unknown"}</div>
                    <div className="text-xs text-muted-foreground">{schedule.doctor?.email}</div>
                  </TableCell>
                  <TableCell>
                    {schedule.isBooked ? (
                      <Badge variant="default" className="bg-blue-500 hover:bg-blue-600">Booked</Badge>
                    ) : (
                      <Badge variant="outline" className="border-green-500 text-green-600">Available</Badge>
                    )}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
