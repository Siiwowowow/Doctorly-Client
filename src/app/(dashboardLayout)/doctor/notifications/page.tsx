/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { useEffect, useState } from "react"
import { Notification } from "@/types/api.types"
import { getMyNotifications, markNotificationAsRead, markAllNotificationsAsRead } from "@/services/notification.services"
import { Card, CardContent} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Bell, CheckCircle2, Circle, Clock, Info } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"

export default function DoctorNotificationsPage() {
  const { toast } = useToast()
  
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loading, setLoading] = useState(true)

  const fetchNotifications = async () => {
    try {
      const res = await getMyNotifications()
      setNotifications(res.data || [])
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to load notifications.",
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchNotifications()
  }, [])

  const handleMarkAsRead = async (id: string) => {
    try {
      await markNotificationAsRead(id)
      setNotifications(notifications.map(n => n.id === id ? { ...n, isRead: true } : n))
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Could not mark notification as read.",
      })
    }
  }

  const handleMarkAllAsRead = async () => {
    try {
      await markAllNotificationsAsRead()
      setNotifications(notifications.map(n => ({ ...n, isRead: true })))
      toast({
        title: "Success",
        description: "All notifications marked as read.",
      })
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Could not mark notifications as read.",
      })
    }
  }

  const getNotificationIcon = (type: string) => {
    if (type.includes("APPOINTMENT")) return <CalendarIcon className="h-5 w-5 text-blue-500" />
    if (type.includes("PAYMENT")) return <BadgeDollarSign className="h-5 w-5 text-green-500" />
    if (type.includes("PRESCRIPTION") || type.includes("MEDICAL")) return <FileTextIcon className="h-5 w-5 text-teal-500" />
    if (type.includes("CALL")) return <PhoneIcon className="h-5 w-5 text-orange-500" />
    return <Info className="h-5 w-5 text-primary" />
  }

  // Sort by date, newest first
  const sortedNotifications = [...notifications].sort((a, b) => 
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  )

  const unreadCount = notifications.filter(n => !n.isRead).length

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            Notifications 
            {unreadCount > 0 && (
              <Badge variant="destructive" className="ml-2">{unreadCount} Unread</Badge>
            )}
          </h1>
          <p className="text-muted-foreground">Stay updated on your appointments and patient activity.</p>
        </div>
        
        {unreadCount > 0 && (
          <Button variant="outline" onClick={handleMarkAllAsRead}>
            <CheckCircle2 className="mr-2 h-4 w-4" />
            Mark all as read
          </Button>
        )}
      </div>

      <Card>
        <CardContent className="p-0">
          {loading ? (
            <div className="space-y-0 divide-y">
              {[1,2,3,4].map(i => (
                <div key={i} className="p-6 flex items-start gap-4">
                  <Skeleton className="h-10 w-10 rounded-full shrink-0" />
                  <div className="space-y-2 w-full">
                    <Skeleton className="h-5 w-1/3" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-3 w-24" />
                  </div>
                </div>
              ))}
            </div>
          ) : sortedNotifications.length === 0 ? (
            <div className="py-16 text-center text-muted-foreground flex flex-col items-center">
              <Bell className="h-16 w-16 opacity-20 mb-4" />
              <p className="text-lg font-medium">All caught up!</p>
              <p>You have no notifications at this time.</p>
            </div>
          ) : (
            <div className="divide-y">
              {sortedNotifications.map((notification) => (
                <div 
                  key={notification.id} 
                  className={`p-4 sm:p-6 flex items-start gap-4 transition-colors ${
                    !notification.isRead ? 'bg-primary/5 hover:bg-primary/10' : 'hover:bg-muted/50'
                  }`}
                  onClick={() => !notification.isRead && handleMarkAsRead(notification.id)}
                >
                  <div className="shrink-0 pt-1">
                    {!notification.isRead ? (
                      <Circle className="h-3 w-3 fill-primary text-primary mt-1.5" />
                    ) : (
                      <div className="w-3" /> // Placeholder to keep alignment
                    )}
                  </div>
                  
                  <div className={`bg-background p-2.5 rounded-full shadow-sm shrink-0 border ${!notification.isRead ? 'border-primary/20' : ''}`}>
                    {getNotificationIcon(notification.type)}
                  </div>
                  
                  <div className="flex-1 space-y-1">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                      <h3 className={`font-semibold ${!notification.isRead ? 'text-foreground' : 'text-foreground/80'}`}>
                        {notification.title}
                      </h3>
                      <span className="text-xs text-muted-foreground whitespace-nowrap flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                      </span>
                    </div>
                    <p className={`text-sm ${!notification.isRead ? 'text-foreground/90' : 'text-muted-foreground'}`}>
                      {notification.message}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

function CalendarIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M8 2v4" />
      <path d="M16 2v4" />
      <rect width="18" height="18" x="3" y="4" rx="2" />
      <path d="M3 10h18" />
    </svg>
  )
}

function BadgeDollarSign(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.77 4.78 4 4 0 0 1-6.75 0 4 4 0 0 1-4.78-4.77 4 4 0 0 1 0-6.76Z" />
      <path d="M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8" />
      <path d="M12 18V6" />
    </svg>
  )
}

function FileTextIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" />
      <path d="M14 2v4a2 2 0 0 0 2 2h4" />
      <path d="M10 9H8" />
      <path d="M16 13H8" />
      <path d="M16 17H8" />
    </svg>
  )
}

function PhoneIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
    </svg>
  )
}
