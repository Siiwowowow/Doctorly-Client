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
      <SidebarInset className="min-w-0 w-full max-w-full overflow-hidden">
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
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
        <div className="flex flex-1 flex-col min-w-0 w-full max-w-full gap-4 p-2 sm:p-4 pt-0 mt-2 sm:mt-4 h-[calc(100vh-80px)] overflow-hidden">
          {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
