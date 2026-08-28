import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Appointment, AppointmentStatus } from "@/types/api.types"
import { CalendarDays, Clock, User } from "lucide-react"
import { useTranslations } from "next-intl"
import { format } from "date-fns"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export function TodaysAppointments({ appointments }: { appointments: Appointment[] }) {
  const t = useTranslations("doctorDashboard")

  return (
    <Card className="h-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>{t("todaysAppointmentsTitle")}</CardTitle>
          <CardDescription>{t("stats.todaysAppointmentsDesc")}</CardDescription>
        </div>
        <Button variant="ghost" size="sm" asChild>
          <Link href="/doctor/appointments">{t("viewAll")}</Link>
        </Button>
      </CardHeader>
      <CardContent>
        {appointments.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-center text-muted-foreground border rounded-lg border-dashed">
            <CalendarDays className="h-10 w-10 mb-2 opacity-20" />
            <p>{t("emptyStates.noTodaysAppointments")}</p>
          </div>
        ) : (
          <div className="space-y-4">
            {appointments.map((apt) => (
              <div key={apt.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="bg-primary/10 p-2 rounded-full">
                    <User className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">{apt.patient?.name || t("patientName")}</p>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground mt-0.5">
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
                    <Link href={`/doctor/appointments/${apt.id}`}>{t("details")}</Link>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
