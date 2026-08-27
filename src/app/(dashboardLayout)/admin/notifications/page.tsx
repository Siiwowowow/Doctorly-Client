"use client"

import React from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getMyNotifications, markNotificationAsRead, markAllNotificationsAsRead } from '@/services/notification.services'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { format } from "date-fns"
import { Bell, Check, CheckCheck } from "lucide-react"

export default function NotificationsManagementPage() {
  const queryClient = useQueryClient()

  const { data: notificationsData, isLoading, isError } = useQuery({
    queryKey: ['admin-notifications'],
    queryFn: () => getMyNotifications(),
  })

  const markAsReadMutation = useMutation({
    mutationFn: (id: string) => markNotificationAsRead(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-notifications'] })
    }
  })

  const markAllAsReadMutation = useMutation({
    mutationFn: () => markAllNotificationsAsRead(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-notifications'] })
    }
  })

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-[250px]" />
        <Skeleton className="h-[400px] w-full" />
      </div>
    )
  }

  if (isError) {
    return (
      <div className="flex h-[400px] items-center justify-center rounded-xl border border-dashed text-muted-foreground">
        <p>Failed to load notifications.</p>
      </div>
    )
  }

  const notifications = notificationsData?.data || []
  const unreadCount = notifications.filter((n: any) => !n.isRead).length

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight flex items-center gap-2">
            <Bell className="h-6 w-6" /> Notifications
            {unreadCount > 0 && (
              <Badge variant="destructive" className="ml-2">{unreadCount} unread</Badge>
            )}
          </h2>
          <p className="text-muted-foreground">
            System alerts and administrative notifications.
          </p>
        </div>
        {unreadCount > 0 && (
          <Button 
            variant="outline" 
            onClick={() => markAllAsReadMutation.mutate()}
            disabled={markAllAsReadMutation.isPending}
          >
            <CheckCheck className="mr-2 h-4 w-4" />
            Mark all as read
          </Button>
        )}
      </div>

      <div className="space-y-4">
        {notifications.length === 0 ? (
          <div className="flex h-[200px] items-center justify-center rounded-xl border border-dashed text-muted-foreground">
            <p>You have no notifications.</p>
          </div>
        ) : (
          notifications.map((notification: any) => (
            <Card key={notification.id} className={!notification.isRead ? "border-l-4 border-l-primary" : ""}>
              <CardHeader className="py-4">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-base">{notification.message}</CardTitle>
                    <CardDescription className="mt-1">
                      {format(new Date(notification.createdAt), "MMM dd, yyyy 'at' hh:mm a")}
                    </CardDescription>
                  </div>
                  {!notification.isRead && (
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => markAsReadMutation.mutate(notification.id)}
                      disabled={markAsReadMutation.isPending}
                    >
                      <Check className="mr-2 h-4 w-4" /> Mark as read
                    </Button>
                  )}
                </div>
              </CardHeader>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}
