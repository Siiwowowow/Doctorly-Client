import { AdminSidebar } from "@/components/layout/AdminSidebar"
import { DoctorSidebar } from "@/components/layout/DoctorSidebar"
import { UserSidebar } from "@/components/layout/UserSidebar"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb"
import { getUserInfo } from "@/services/auth.services"
import { redirect } from "next/navigation"
import React from "react"

export default async function ChatLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const user = await getUserInfo();
  
  if (!user) {
    redirect("/login");
  }

  const renderSidebar = () => {
    switch (user.role) {
      case "ADMIN":
      case "SUPER_ADMIN":
        return <AdminSidebar />;
      case "DOCTOR":
        return <DoctorSidebar />;
      case "PATIENT":
        return <UserSidebar />;
      default:
        return null;
    }
  }

  return (
    <SidebarProvider>
      {renderSidebar()}
      <SidebarInset className="min-w-0 w-full max-w-full flex-1 flex flex-col h-screen overflow-hidden">
        <header className="flex h-14 sm:h-16 shrink-0 items-center gap-2 border-b px-4 bg-background/80 backdrop-blur-md">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbPage>Messages</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </header>
        <main className="flex-1 min-w-0 w-full p-2 sm:p-3 md:p-4 overflow-hidden flex flex-col">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}
