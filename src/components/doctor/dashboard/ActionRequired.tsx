import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Appointment, AppointmentStatus } from "@/types/api.types"
import { AlertCircle, User, Clock } from "lucide-react"
import { useTranslations } from "next-intl"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { format } from "date-fns"

export function ActionRequired({ appointments }: { appointments: Appointment[] }) {
  const t = useTranslations("doctorDashboard")
  
  // Filter for INPROGRESS appointments
  const actionRequiredAppointments = appointments.filter(
    (apt) => apt.status === AppointmentStatus.INPROGRESS
  )

  return (
    <Card className="h-full border-orange-200 dark:border-orange-900/50">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-orange-600 dark:text-orange-400 flex items-center gap-2">
            <AlertCircle className="h-5 w-5" />
            {t("actionRequiredTitle")}
          </CardTitle>
          <CardDescription>{t("actionRequiredDesc")}</CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        {actionRequiredAppointments.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-center text-muted-foreground border rounded-lg border-dashed">
            <AlertCircle className="h-10 w-10 mb-2 opacity-20" />
            <p>{t("emptyStates.noActionRequired")}</p>
          </div>
        ) : (
          <div className="space-y-4">
            {actionRequiredAppointments.map((apt) => (
              <div key={apt.id} className="flex items-center justify-between p-3 border border-orange-200 dark:border-orange-900/50 bg-orange-50 dark:bg-orange-950/20 rounded-lg">
                <div className="flex items-center gap-4">
                  <div className="bg-orange-100 dark:bg-orange-900/50 p-2 rounded-full">
                    <User className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">{apt.patient?.name || t("patientName")}</p>
                    <div className="flex flex-col text-xs text-muted-foreground mt-0.5">
                      <span>
                         <Clock className="h-3 w-3 inline mr-1" />
                         {apt.schedule?.startDateTime ? format(new Date(apt.schedule.startDateTime), "hh:mm a") : "TBD"}
                      </span>
                    </div>
                  </div>
                </div>
                <Button size="sm" variant="default" className="bg-orange-600 hover:bg-orange-700 text-white" asChild>
                  <Link href={`/doctor/appointments/${apt.id}`}>{t("details")}</Link>
                </Button>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
