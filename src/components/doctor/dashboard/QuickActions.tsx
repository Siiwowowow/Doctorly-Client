import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Clock, Users, Pill, FileText } from "lucide-react"
import { useTranslations } from "next-intl"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export function QuickActions() {
  const t = useTranslations("doctorDashboard")

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>{t("quickActionsTitle")}</CardTitle>
        <CardDescription>{t("quickActionsDesc")}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button className="w-full justify-start" variant="outline" asChild>
          <Link href="/doctor/schedule">
             <Clock className="mr-2 h-4 w-4" />
             {t("manageSchedule")}
          </Link>
        </Button>
        <Button className="w-full justify-start" variant="outline" asChild>
          <Link href="/doctor/patients">
             <Users className="mr-2 h-4 w-4" />
             {t("viewPatientsList")}
          </Link>
        </Button>
        <Button className="w-full justify-start" variant="outline" asChild>
          <Link href="/doctor/prescriptions/new">
             <Pill className="mr-2 h-4 w-4" />
             {t("writePrescription")}
          </Link>
        </Button>
        <Button className="w-full justify-start" variant="outline" asChild>
          <Link href="/doctor/medical-records">
             <FileText className="mr-2 h-4 w-4" />
             {t("viewMedicalRecords")}
          </Link>
        </Button>
      </CardContent>
    </Card>
  )
}
