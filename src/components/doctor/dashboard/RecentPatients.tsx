import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Appointment } from "@/types/api.types"
import { User as UserIcon } from "lucide-react"
import { useTranslations } from "next-intl"

export function RecentPatients({ appointments }: { appointments: Appointment[] }) {
  const t = useTranslations("doctorDashboard")

  // Derive unique patients from appointments, sorted by most recent appointment first
  const sortedAppointments = [...appointments].sort((a, b) => {
    const dateA = a.schedule?.startDateTime ? new Date(a.schedule.startDateTime).getTime() : 0
    const dateB = b.schedule?.startDateTime ? new Date(b.schedule.startDateTime).getTime() : 0
    return dateB - dateA
  })

  const uniquePatientsMap = new Map()
  sortedAppointments.forEach((apt) => {
    if (apt.patientId && !uniquePatientsMap.has(apt.patientId) && apt.patient) {
      uniquePatientsMap.set(apt.patientId, apt.patient)
    }
  })

  const recentPatients = Array.from(uniquePatientsMap.values()).slice(0, 5)

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>{t("recentPatientsTitle")}</CardTitle>
      </CardHeader>
      <CardContent>
        {recentPatients.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-center text-muted-foreground border rounded-lg border-dashed">
            <UserIcon className="h-10 w-10 mb-2 opacity-20" />
            <p>{t("emptyStates.noRecentPatients")}</p>
          </div>
        ) : (
          <div className="space-y-4">
            {recentPatients.map((patient) => (
              <div key={patient.id} className="flex items-center gap-4 p-3 border rounded-lg">
                <div className="bg-primary/10 p-3 rounded-full">
                  <UserIcon className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-sm">{patient.name}</p>
                  <p className="text-xs text-muted-foreground">{patient.email}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
