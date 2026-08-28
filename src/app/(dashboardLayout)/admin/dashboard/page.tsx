"use client"

import React from 'react'
import { useQuery } from '@tanstack/react-query'
import { getAllAdmins } from '@/services/admin.services'
import { getAllPatients } from '@/services/patient.services'
import { getAllDoctorsAdmin } from '@/services/doctor.services'
import { getAllAppointmentsAdmin } from '@/services/appointment.services'
import { getAllPaymentsAdmin } from '@/services/payment.services'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { 
  Users, 
  Stethoscope, 
  UserRound, 
  CalendarDays, 
  CreditCard, 
} from 'lucide-react'

export default function AdminDashboardPage() {
  const { data: dashboardData, isLoading, isError } = useQuery({
    queryKey: ['admin-dashboard-stats'],
    queryFn: async () => {
      // Fetch concurrently to minimize load time, using limit=1 to save bandwidth
      const params = { limit: 1 };
      
      const [adminsRes, patientsRes, doctorsRes, appointmentsRes, paymentsRes] = await Promise.all([
        getAllAdmins(params),
        getAllPatients(params),
        getAllDoctorsAdmin(params),
        getAllAppointmentsAdmin(params),
        getAllPaymentsAdmin(params)
      ]);

      // Calculate totals using meta.total from paginated responses if available, or data.length
      const totalAdmins = adminsRes.meta?.total || adminsRes.data?.length || 0;
      const totalPatients = patientsRes.meta?.total || patientsRes.data?.length || 0;
      const totalDoctors = doctorsRes.meta?.total || doctorsRes.data?.length || 0;
      const totalAppointments = appointmentsRes.meta?.total || appointmentsRes.data?.length || 0;
      const totalPaymentsCount = paymentsRes.meta?.total || paymentsRes.data?.length || 0;
      
      return {
        totalUsers: totalAdmins + totalPatients + totalDoctors,
        totalDoctors,
        totalPatients,
        totalAppointments,
        totalPaymentsCount
      };
    },
  })

  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4, 5].map((i) => (
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

  const stats = dashboardData

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Overview</h2>
        <p className="text-muted-foreground">
          Platform statistics derived from operational records.
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
            <CardTitle className="text-sm font-medium">Total Doctors</CardTitle>
            <Stethoscope className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalDoctors || 0}</div>
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
              {stats?.totalPaymentsCount?.toLocaleString() || 0}
            </div>
          </CardContent>
        </Card>
      </div>

      <div>
        <h3 className="text-lg font-medium mb-4">Appointments Breakdown</h3>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Appointments</CardTitle>
              <CalendarDays className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.totalAppointments || 0}</div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
