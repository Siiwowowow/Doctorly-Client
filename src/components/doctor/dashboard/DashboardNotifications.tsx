import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Bell } from "lucide-react"
import { useTranslations } from "next-intl"
import { formatDistanceToNow } from "date-fns"
import { Button } from "@/components/ui/button"
import Link from "next/link"

/* eslint-disable @typescript-eslint/no-explicit-any */
export function DashboardNotifications({ notifications }: { notifications: any[] }) {
  const t = useTranslations("doctorDashboard")

  const recentNotifications = notifications.slice(0, 5)

  return (
    <Card className="h-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>{t("notificationsTitle")}</CardTitle>
        <Button variant="ghost" size="sm" asChild>
          <Link href="/doctor/notifications">{t("viewAll")}</Link>
        </Button>
      </CardHeader>
      <CardContent>
        {recentNotifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-center text-muted-foreground border rounded-lg border-dashed">
            <Bell className="h-10 w-10 mb-2 opacity-20" />
            <p>{t("emptyStates.noNotifications")}</p>
          </div>
        ) : (
          <div className="space-y-4">
            {recentNotifications.map((notification) => (
              <div key={notification.id} className={`flex items-start gap-4 p-3 border rounded-lg ${!notification.isRead ? 'bg-primary/5 border-primary/20' : ''}`}>
                <div className={`mt-1 p-2 rounded-full ${!notification.isRead ? 'bg-primary/20 text-primary' : 'bg-muted text-muted-foreground'}`}>
                  <Bell className="h-4 w-4" />
                </div>
                <div className="flex-1 space-y-1">
                  <p className="font-medium text-sm">{notification.title}</p>
                  <p className="text-xs text-muted-foreground line-clamp-2">{notification.message}</p>
                  <p className="text-[10px] text-muted-foreground/70">
                    {notification.createdAt ? formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true }) : ""}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
