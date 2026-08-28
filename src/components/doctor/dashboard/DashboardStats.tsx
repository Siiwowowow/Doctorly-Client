import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CalendarDays, CheckCircle2, Clock, DollarSign, Users } from "lucide-react"
import { useTranslations } from "next-intl"

interface DashboardStatsProps {
  todaysCount: number
  upcomingCount: number
  completedCount: number
  totalPatients: number
  totalEarnings: number
}

export function DashboardStats({
  todaysCount,
  upcomingCount,
  completedCount,
  totalPatients,
  totalEarnings
}: DashboardStatsProps) {
  const t = useTranslations("doctorDashboard.stats")

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">{t("todaysAppointments")}</CardTitle>
          <CalendarDays className="h-4 w-4 text-primary" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{todaysCount}</div>
          <p className="text-xs text-muted-foreground">{t("todaysAppointmentsDesc")}</p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">{t("upcomingAppointments")}</CardTitle>
          <Clock className="h-4 w-4 text-blue-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{upcomingCount}</div>
          <p className="text-xs text-muted-foreground">{t("upcomingAppointmentsDesc")}</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">{t("completedAppointments")}</CardTitle>
          <CheckCircle2 className="h-4 w-4 text-green-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{completedCount}</div>
          <p className="text-xs text-muted-foreground">{t("completedAppointmentsDesc")}</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">{t("totalPatients")}</CardTitle>
          <Users className="h-4 w-4 text-orange-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalPatients}</div>
          <p className="text-xs text-muted-foreground">{t("totalPatientsDesc")}</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">{t("totalEarnings")}</CardTitle>
          <DollarSign className="h-4 w-4 text-emerald-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">৳{totalEarnings.toLocaleString()}</div>
          <p className="text-xs text-muted-foreground">{t("totalEarningsDesc")}</p>
        </CardContent>
      </Card>
    </div>
  )
}
