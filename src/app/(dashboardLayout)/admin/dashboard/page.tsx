"use client"

import React from 'react'
import { useQuery } from '@tanstack/react-query'
import { getAdminDashboardStats } from '@/services/admin.services'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { 
  Users, 
  Stethoscope, 
  UserRound, 
  CalendarDays, 
  CreditCard, 
  CheckCircle, 
  Clock, 
  XCircle 
} from 'lucide-react'

export default function AdminDashboardPage() {
  const { data: statsData, isLoading, isError } = useQuery({
    queryKey: ['admin-dashboard-stats'],
    queryFn: getAdminDashboardStats,
  })

  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
          <Skeleton key={i} className="h-[120px] rounded-xl" />
        ))}
      </div>
    )
  }

  if (isError) {
    return (
      <div className="flex h-[400px] items-center justify-center rounded-xl border border-dashed text-muted-foreground">
        <p>Failed to load dashboard statistics. Please try again.</p>
      </div>
    )
  }

  const stats = statsData?.data

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Overview</h2>
        <p className="text-muted-foreground">
          Platform statistics and current status.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {/* Users Summary */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalUsers || 0}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Doctors</CardTitle>
            <Stethoscope className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.activeDoctors || 0}</div>
            <p className="text-xs text-muted-foreground">
              Out of {stats?.totalDoctors || 0} registered
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Patients</CardTitle>
            <UserRound className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalPatients || 0}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Payments</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${stats?.totalPayments?.toLocaleString() || 0}
            </div>
          </CardContent>
        </Card>
      </div>

      <div>
        <h3 className="text-lg font-medium mb-4">Appointments Breakdown</h3>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total</CardTitle>
              <CalendarDays className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.totalAppointments || 0}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending</CardTitle>
              <Clock className="h-4 w-4 text-amber-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.pendingAppointments || 0}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completed</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.completedAppointments || 0}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Cancelled</CardTitle>
              <XCircle className="h-4 w-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.cancelledAppointments || 0}</div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
