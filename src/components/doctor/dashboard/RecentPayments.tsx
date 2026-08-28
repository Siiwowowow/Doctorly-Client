import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DollarSign } from "lucide-react"
import { useTranslations } from "next-intl"
import { format } from "date-fns"
import { Badge } from "@/components/ui/badge"

/* eslint-disable @typescript-eslint/no-explicit-any */
export function RecentPayments({ payments }: { payments: any[] }) {
  const t = useTranslations("doctorDashboard")

  const recentPayments = payments.slice(0, 5)

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>{t("recentPaymentsTitle")}</CardTitle>
      </CardHeader>
      <CardContent>
        {recentPayments.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-center text-muted-foreground border rounded-lg border-dashed">
            <DollarSign className="h-10 w-10 mb-2 opacity-20" />
            <p>{t("emptyStates.noRecentPayments")}</p>
          </div>
        ) : (
          <div className="space-y-4">
            {recentPayments.map((payment) => (
              <div key={payment.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-4">
                  <div className="bg-emerald-500/10 p-2 rounded-full">
                    <DollarSign className="h-5 w-5 text-emerald-500" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">৳{payment.amount}</p>
                    <p className="text-xs text-muted-foreground">
                      {payment.createdAt ? format(new Date(payment.createdAt), "MMM dd, yyyy") : ""}
                    </p>
                  </div>
                </div>
                <Badge variant={payment.status === "PAID" ? "default" : "secondary"} className={payment.status === "PAID" ? "bg-emerald-500 hover:bg-emerald-600" : ""}>
                  {payment.status}
                </Badge>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
