/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import { getMyNotifications } from "@/services/notification.services";
import { Card, CardContent } from "@/components/ui/card";
import { Bell, Check, Clock, Info } from "lucide-react";
import { Button } from "@/components/ui/button";

export const metadata = {
  title: "Notifications | Doctorly",
};

export default async function NotificationsPage() {
  let notifications = [];
  try {
    const res = await getMyNotifications();
    notifications = res.data || [];
  } catch (error) {
    console.error("Failed to load notifications:", error);
  }

  const getIcon = (type: string) => {
    if (type.includes("APPOINTMENT")) return <Clock className="size-5 text-blue-500" />;
    if (type.includes("PAYMENT")) return <Check className="size-5 text-green-500" />;
    return <Info className="size-5 text-doctorly-primary" />;
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto w-full">
      
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Notifications</h1>
          <p className="text-muted-foreground">Stay updated with your appointments and health records.</p>
        </div>
        {notifications.length > 0 && (
          <Button variant="outline" size="sm">
            <Check className="mr-2 size-4" />
            Mark all as read
          </Button>
        )}
      </div>

      {notifications.length === 0 ? (
        <Card className="border-dashed border-2 bg-muted/10">
          <CardContent className="flex flex-col items-center justify-center py-20 text-center">
            <div className="rounded-full bg-muted p-6">
              <Bell className="size-10 text-muted-foreground" />
            </div>
            <h3 className="mt-4 text-xl font-semibold">No notifications yet</h3>
            <p className="mt-2 text-muted-foreground max-w-sm">
              When you have new updates about your appointments or account, they will appear here.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {notifications.map((notification: any) => (
            <div 
              key={notification.id} 
              className={`flex items-start gap-4 p-4 rounded-xl border ${!notification.isRead ? 'bg-doctorly-primary/5 border-doctorly-primary/30' : 'bg-background border-border/50'}`}
            >
              <div className={`p-2 rounded-full ${!notification.isRead ? 'bg-doctorly-primary/10' : 'bg-muted'}`}>
                {getIcon(notification.type)}
              </div>
              <div className="flex-1">
                <h4 className={`text-base ${!notification.isRead ? 'font-semibold' : 'font-medium'}`}>
                  {notification.title}
                </h4>
                <p className="text-sm text-muted-foreground mt-1 leading-relaxed">
                  {notification.message}
                </p>
                <p className="text-xs text-muted-foreground/70 mt-2 flex items-center gap-1">
                  <Clock className="size-3" />
                  {new Date(notification.createdAt).toLocaleString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
