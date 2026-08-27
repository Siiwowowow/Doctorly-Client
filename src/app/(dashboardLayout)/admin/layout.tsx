import { AdminSidebar } from "@/components/layout/AdminSidebar"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { getUserInfo } from "@/services/auth.services"
import { redirect } from "next/navigation"

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const user = await getUserInfo();
  
  if (!user) {
    redirect("/login");
  }

  if (user.role !== "ADMIN" && user.role !== "SUPER_ADMIN") {
    redirect("/"); // Redirect unauthorized users to home or user dashboard
  }

  return (
    <SidebarProvider>
      <AdminSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem className="hidden md:block">
                <BreadcrumbLink href="/admin/dashboard">
                  Admin
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem>
                <BreadcrumbPage>Dashboard</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0 mt-4">
          {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
