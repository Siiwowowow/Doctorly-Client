"use client"

import { useQuery } from "@tanstack/react-query"
import { useAuth } from "@/providers/AuthProvider"
import { useTranslations } from "next-intl"
import { isToday, isFuture } from "date-fns"
import { AppointmentStatus, Appointment } from "@/types/api.types"
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { AlertCircle } from "lucide-react"

// Services
import { getMyAppointments } from "@/services/appointment.services"
import { getMyPayments } from "@/services/payment.services"
import { getMyNotifications } from "@/services/notification.services"

// Dashboard Components
import { DashboardStats } from "@/components/doctor/dashboard/DashboardStats"
import { TodaysAppointments } from "@/components/doctor/dashboard/TodaysAppointments"
import { UpcomingAppointments } from "@/components/doctor/dashboard/UpcomingAppointments"
import { ActionRequired } from "@/components/doctor/dashboard/ActionRequired"
import { RecentPatients } from "@/components/doctor/dashboard/RecentPatients"
import { RecentPayments } from "@/components/doctor/dashboard/RecentPayments"
import { DashboardNotifications } from "@/components/doctor/dashboard/DashboardNotifications"
import { QuickActions } from "@/components/doctor/dashboard/QuickActions"

export default function DoctorDashboardPage() {
  const { user } = useAuth()
  const t = useTranslations("doctorDashboard")

  // Parallel Data Fetching with React Query
  const { data: appointmentsRes, isLoading: isLoadingAppts, isError: isErrorAppts } = useQuery({
    queryKey: ["doctor-appointments"],
    queryFn: () => getMyAppointments(),
    staleTime: 1000 * 60 * 5, // 5 minutes
  })

  const { data: paymentsRes, isLoading: isLoadingPayments, isError: isErrorPayments } = useQuery({
    queryKey: ["doctor-payments"],
    queryFn: () => getMyPayments(),
    staleTime: 1000 * 60 * 5, // 5 minutes
  })

  const { data: notificationsRes, isLoading: isLoadingNotifs, isError: isErrorNotifs } = useQuery({
    queryKey: ["doctor-notifications"],
    queryFn: () => getMyNotifications(),
    staleTime: 1000 * 60, // 1 minute
  })

  // Extract Data
  const appointments: Appointment[] = appointmentsRes?.data || []
  const payments = paymentsRes?.data || []
  const notifications = notificationsRes?.data || []

  const isLoading = isLoadingAppts || isLoadingPayments || isLoadingNotifs
  const isError = isErrorAppts || isErrorPayments || isErrorNotifs

  // Computed Derived States
  const todaysAppointments = appointments.filter((apt) => {
    if (!apt.schedule?.startDateTime) return false
    return isToday(new Date(apt.schedule.startDateTime))
  })

  const upcomingAppointments = appointments.filter((apt) => {
    if (!apt.schedule?.startDateTime) return false
    return isFuture(new Date(apt.schedule.startDateTime)) && apt.status === AppointmentStatus.SCHEDULED
  })

  const completedCount = appointments.filter((apt) => apt.status === AppointmentStatus.COMPLETED).length
  const totalPatients = new Set(appointments.map((apt) => apt.patientId)).size
  const totalEarnings = payments
    .filter((payment) => payment.status === "PAID")
    .reduce((sum, payment) => sum + (Number(payment.amount) || 0), 0)

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-24 w-full rounded-2xl" />
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
          <Skeleton className="h-32 rounded-xl" />
          <Skeleton className="h-32 rounded-xl" />
          <Skeleton className="h-32 rounded-xl" />
          <Skeleton className="h-32 rounded-xl" />
          <Skeleton className="h-32 rounded-xl" />
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
          <Skeleton className="h-[400px] lg:col-span-4 rounded-xl" />
          <Skeleton className="h-[400px] lg:col-span-3 rounded-xl" />
        </div>
      </div>
    )
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900 rounded-xl">
        <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
        <h2 className="text-xl font-semibold text-red-700 dark:text-red-400">Failed to load dashboard data</h2>
        <p className="text-red-600 dark:text-red-300 mt-2 max-w-md">
          {isErrorAppts && t("errors.loadAppointments")} {isErrorPayments && t("errors.loadPayments")} {isErrorNotifs && t("errors.loadNotifications")}
        </p>
        <Button className="mt-6" variant="outline" onClick={() => window.location.reload()}>
          Retry
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Welcome Header */}
      <div className="bg-primary/5 p-6 rounded-2xl border flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">
            {t("greeting", { name: user?.name || "Doctor" })}
          </h1>
          <p className="text-muted-foreground mt-1">
            {t("appointmentsForToday", { count: todaysAppointments.length })}
          </p>
        </div>
        <div className="flex gap-2">
           <Button asChild variant="outline">
             <Link href="/doctor/schedule">{t("manageSchedule")}</Link>
           </Button>
           <Button asChild>
             <Link href="/doctor/appointments">{t("viewAll")}</Link>
           </Button>
        </div>
      </div>

      {/* Statistics Cards */}
      <DashboardStats 
        todaysCount={todaysAppointments.length}
        upcomingCount={upcomingAppointments.length}
        completedCount={completedCount}
        totalPatients={totalPatients}
        totalEarnings={totalEarnings}
      />

      {/* Row 1: Today's Appointments & Action Required */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <div className="lg:col-span-4">
          <TodaysAppointments appointments={todaysAppointments} />
        </div>
        <div className="lg:col-span-3">
          <ActionRequired appointments={appointments} />
        </div>
      </div>

      {/* Row 2: Upcoming Appointments & Recent Patients */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <div className="lg:col-span-4">
          <UpcomingAppointments appointments={upcomingAppointments} />
        </div>
        <div className="lg:col-span-3">
          <RecentPatients appointments={appointments} />
        </div>
      </div>

      {/* Row 3: Recent Payments, Notifications & Quick Actions */}
      <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-3">
        <div>
          <RecentPayments payments={payments} />
        </div>
        <div>
          <DashboardNotifications notifications={notifications} />
        </div>
        <div>
          <QuickActions />
        </div>
      </div>
    </div>
  )
}
