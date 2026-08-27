/* eslint-disable react/no-unescaped-entities */
"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { CalendarDays, Users, CheckCircle2, Clock, Pill, FileText, User } from "lucide-react"
import { getMyAppointments } from "@/services/appointment.services"
import { Appointment, AppointmentStatus } from "@/types/api.types"
import { useAuth } from "@/providers/AuthProvider"
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { format, isToday } from "date-fns"
import { Badge } from "@/components/ui/badge"

export default function DoctorDashboardPage() {
  const { user } = useAuth()
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getMyAppointments()
        setAppointments(response.data || [])
      } catch (error) {
        console.error("Failed to fetch appointments:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const todaysAppointments = appointments.filter((apt) => {
    if (!apt.schedule?.startDateTime) return false
    return isToday(new Date(apt.schedule.startDateTime))
  })

  const upcomingAppointments = appointments.filter((apt) => apt.status === AppointmentStatus.SCHEDULED)
  const completedConsultations = appointments.filter((apt) => apt.status === AppointmentStatus.COMPLETED)
  const totalPatients = new Set(appointments.map(apt => apt.patientId)).size

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-25 w-full rounded-xl" />
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Skeleton className="h-30 rounded-xl" />
          <Skeleton className="h-30 rounded-xl" />
          <Skeleton className="h-30 rounded-xl" />
          <Skeleton className="h-30 rounded-xl" />
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="bg-primary/5 p-6 rounded-2xl border flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">
            Good morning, Dr. {user?.name || "Doctor"}
          </h1>
          <p className="text-muted-foreground mt-1">
            You have {todaysAppointments.length} appointments scheduled for today.
          </p>
        </div>
        <div className="flex gap-2">
           <Button asChild variant="outline">
             <Link href="/doctor/schedule">Manage Schedule</Link>
           </Button>
           <Button asChild>
             <Link href="/doctor/appointments">View Appointments</Link>
           </Button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today's Appointments</CardTitle>
            <CalendarDays className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{todaysAppointments.length}</div>
            <p className="text-xs text-muted-foreground">
              Patients scheduled for today
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Upcoming</CardTitle>
            <Clock className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{upcomingAppointments.length}</div>
            <p className="text-xs text-muted-foreground">
              Total scheduled appointments
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{completedConsultations.length}</div>
            <p className="text-xs text-muted-foreground">
              Successfully completed
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Patients</CardTitle>
            <Users className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalPatients}</div>
            <p className="text-xs text-muted-foreground">
              Unique patients treated
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Today's Schedule & Quick Actions */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="lg:col-span-4">
          <CardHeader>
            <CardTitle>Today's Schedule</CardTitle>
            <CardDescription>Appointments for the current day</CardDescription>
          </CardHeader>
          <CardContent>
            {todaysAppointments.length === 0 ? (
              <div className="flex flex-col items-center justify-center p-8 text-center text-muted-foreground border rounded-lg border-dashed">
                <CalendarDays className="h-10 w-10 mb-2 opacity-20" />
                <p>No appointments scheduled for today.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {todaysAppointments.map(apt => (
                  <div key={apt.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                       <div className="bg-primary/10 p-3 rounded-full">
                          <User className="h-5 w-5 text-primary" />
                       </div>
                       <div>
                         <p className="font-medium">{apt.patient?.name || "Unknown Patient"}</p>
                         <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                           <Clock className="h-3 w-3" />
                           {apt.schedule?.startDateTime ? format(new Date(apt.schedule.startDateTime), "hh:mm a") : "TBD"}
                         </div>
                       </div>
                    </div>
                    <div className="flex items-center gap-3">
                       <Badge variant={apt.status === AppointmentStatus.SCHEDULED ? "secondary" : "default"}>
                         {apt.status}
                       </Badge>
                       <Button size="sm" variant="outline" asChild>
                         <Link href={`/doctor/appointments/${apt.id}`}>Details</Link>
                       </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
        
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Commonly used features</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button className="w-full justify-start" variant="outline" asChild>
              <Link href="/doctor/schedule">
                 <Clock className="mr-2 h-4 w-4" />
                 Manage Schedule
              </Link>
            </Button>
            <Button className="w-full justify-start" variant="outline" asChild>
              <Link href="/doctor/patients">
                 <Users className="mr-2 h-4 w-4" />
                 View Patients List
              </Link>
            </Button>
            <Button className="w-full justify-start" variant="outline" asChild>
              <Link href="/doctor/prescriptions">
                 <Pill className="mr-2 h-4 w-4" />
                 Write Prescription
              </Link>
            </Button>
            <Button className="w-full justify-start" variant="outline" asChild>
              <Link href="/doctor/medical-records">
                 <FileText className="mr-2 h-4 w-4" />
                 View Medical Records
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
