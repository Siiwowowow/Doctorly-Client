"use client"

import React, { useState, useMemo } from "react"
import { useQuery } from "@tanstack/react-query"
import Link from "next/link"
import { format } from "date-fns"
import { 
  UserCheck, 
  Search, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  AlertCircle, 
  FileText, 
  RefreshCcw, 
  Eye
} from "lucide-react"

import { getAllDoctorApplications } from "@/services/doctorApplication.services"
import { getAllSpecialties } from "@/services/specialty.services"
import { DoctorApplication, DoctorApplicationStatus, Specialty } from "@/types/api.types"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Card,
  CardContent,
  CardHeader,
} from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export default function AdminDoctorApplicationsPage() {
  const [activeTab, setActiveTab] = useState<string>("ALL")
  const [searchTerm, setSearchTerm] = useState<string>("")
  const [selectedSpecialty, setSelectedSpecialty] = useState<string>("ALL")
  const [page, setPage] = useState<number>(1)
  const limit = 10

  // 1. Fetch applications
  const { 
    data: applicationsResponse, 
    isLoading, 
    isError, 
    error,
    refetch,
    isFetching 
  } = useQuery({
    queryKey: ["admin-doctor-applications", { page, limit, searchTerm, activeTab, selectedSpecialty }],
    queryFn: () => {
      const params: Record<string, unknown> = {
        page,
        limit,
      }
      if (searchTerm.trim()) {
        params.searchTerm = searchTerm.trim()
      }
      if (activeTab !== "ALL") {
        params.status = activeTab
      }
      if (selectedSpecialty !== "ALL") {
        params.specialtyId = selectedSpecialty
      }
      return getAllDoctorApplications(params)
    },
  })

  // 2. Fetch specialties for filter
  const { data: specialtiesData } = useQuery({
    queryKey: ["specialties-list"],
    queryFn: () => getAllSpecialties(),
  })

  const specialties: Specialty[] = Array.isArray(specialtiesData?.data) ? specialtiesData.data : []
  const applications: DoctorApplication[] = Array.isArray(applicationsResponse?.data) ? applicationsResponse.data : []
  const meta = applicationsResponse?.meta

  // Fetch all applications once to calculate accurate global summary counts
  const { data: allSummaryResponse } = useQuery({
    queryKey: ["admin-doctor-applications-summary"],
    queryFn: () => getAllDoctorApplications({ limit: 1000 }),
    staleTime: 30000,
  })


  const rawApps = applicationsResponse?.data
  const rawAllApps = allSummaryResponse?.data
  const counts = useMemo(() => {
    const appsList = Array.isArray(rawApps) ? rawApps : []
    const allList = Array.isArray(rawAllApps) ? rawAllApps : []
    const list = allList.length > 0 ? allList : appsList
    return {
      total: allList.length || (meta?.total ?? 0),
      submitted: list.filter((a) => a.status === DoctorApplicationStatus.SUBMITTED).length,
      underReview: list.filter((a) => a.status === DoctorApplicationStatus.UNDER_REVIEW).length,
      approved: list.filter((a) => a.status === DoctorApplicationStatus.APPROVED).length,
      resubmission: list.filter((a) => a.status === DoctorApplicationStatus.RESUBMISSION_REQUIRED).length,
      rejected: list.filter((a) => a.status === DoctorApplicationStatus.REJECTED).length,
    }
  }, [rawAllApps, rawApps, meta])

  const getStatusBadge = (status: DoctorApplicationStatus) => {
    switch (status) {
      case DoctorApplicationStatus.SUBMITTED:
        return (
          <Badge variant="outline" className="bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20 font-medium">
            <Clock className="size-3 mr-1" /> Pending Review
          </Badge>
        )
      case DoctorApplicationStatus.UNDER_REVIEW:
        return (
          <Badge variant="outline" className="bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20 font-medium">
            <RefreshCcw className="size-3 mr-1 animate-spin" /> Under Review
          </Badge>
        )
      case DoctorApplicationStatus.APPROVED:
        return (
          <Badge variant="outline" className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20 font-medium">
            <CheckCircle2 className="size-3 mr-1" /> Approved
          </Badge>
        )
      case DoctorApplicationStatus.RESUBMISSION_REQUIRED:
        return (
          <Badge variant="outline" className="bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/20 font-medium">
            <AlertCircle className="size-3 mr-1" /> Action Required
          </Badge>
        )
      case DoctorApplicationStatus.REJECTED:
        return (
          <Badge variant="outline" className="bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20 font-medium">
            <XCircle className="size-3 mr-1" /> Rejected
          </Badge>
        )
      default:
        return (
          <Badge variant="outline" className="bg-muted text-muted-foreground font-medium">
            Draft
          </Badge>
        )
    }
  }

  return (
    <div className="space-y-6 pb-12">
      {/* Page Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-primary/10 text-primary">
              <UserCheck className="size-6" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
              Doctor Applications
            </h1>
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            Review, verify credentials, and approve medical doctor onboarding applications.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => refetch()} 
            disabled={isFetching}
            className="gap-2"
          >
            <RefreshCcw className={`size-4 ${isFetching ? "animate-spin" : ""}`} />
            Refresh
          </Button>
        </div>
      </div>

      {/* Summary KPI Metric Cards */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        <Card 
          className={`cursor-pointer transition-all hover:border-primary/50 ${activeTab === "ALL" ? "border-primary shadow-sm ring-1 ring-primary/20" : ""}`}
          onClick={() => { setActiveTab("ALL"); setPage(1); }}
        >
          <CardContent className="p-4">
            <p className="text-xs font-medium text-muted-foreground">Total Applications</p>
            <p className="text-2xl font-bold mt-1 text-foreground">{counts.total}</p>
          </CardContent>
        </Card>

        <Card 
          className={`cursor-pointer transition-all hover:border-amber-500/50 ${activeTab === DoctorApplicationStatus.SUBMITTED ? "border-amber-500 shadow-sm ring-1 ring-amber-500/20" : ""}`}
          onClick={() => { setActiveTab(DoctorApplicationStatus.SUBMITTED); setPage(1); }}
        >
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <p className="text-xs font-medium text-amber-600 dark:text-amber-400">Pending</p>
              <Clock className="size-3.5 text-amber-500" />
            </div>
            <p className="text-2xl font-bold mt-1 text-amber-600 dark:text-amber-400">{counts.submitted}</p>
          </CardContent>
        </Card>

        <Card 
          className={`cursor-pointer transition-all hover:border-blue-500/50 ${activeTab === DoctorApplicationStatus.UNDER_REVIEW ? "border-blue-500 shadow-sm ring-1 ring-blue-500/20" : ""}`}
          onClick={() => { setActiveTab(DoctorApplicationStatus.UNDER_REVIEW); setPage(1); }}
        >
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <p className="text-xs font-medium text-blue-600 dark:text-blue-400">Under Review</p>
              <RefreshCcw className="size-3.5 text-blue-500" />
            </div>
            <p className="text-2xl font-bold mt-1 text-blue-600 dark:text-blue-400">{counts.underReview}</p>
          </CardContent>
        </Card>

        <Card 
          className={`cursor-pointer transition-all hover:border-emerald-500/50 ${activeTab === DoctorApplicationStatus.APPROVED ? "border-emerald-500 shadow-sm ring-1 ring-emerald-500/20" : ""}`}
          onClick={() => { setActiveTab(DoctorApplicationStatus.APPROVED); setPage(1); }}
        >
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <p className="text-xs font-medium text-emerald-600 dark:text-emerald-400">Approved</p>
              <CheckCircle2 className="size-3.5 text-emerald-500" />
            </div>
            <p className="text-2xl font-bold mt-1 text-emerald-600 dark:text-emerald-400">{counts.approved}</p>
          </CardContent>
        </Card>

        <Card 
          className={`cursor-pointer transition-all hover:border-orange-500/50 ${activeTab === DoctorApplicationStatus.RESUBMISSION_REQUIRED ? "border-orange-500 shadow-sm ring-1 ring-orange-500/20" : ""}`}
          onClick={() => { setActiveTab(DoctorApplicationStatus.RESUBMISSION_REQUIRED); setPage(1); }}
        >
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <p className="text-xs font-medium text-orange-600 dark:text-orange-400">Resubmission</p>
              <AlertCircle className="size-3.5 text-orange-500" />
            </div>
            <p className="text-2xl font-bold mt-1 text-orange-600 dark:text-orange-400">{counts.resubmission}</p>
          </CardContent>
        </Card>

        <Card 
          className={`cursor-pointer transition-all hover:border-rose-500/50 ${activeTab === DoctorApplicationStatus.REJECTED ? "border-rose-500 shadow-sm ring-1 ring-rose-500/20" : ""}`}
          onClick={() => { setActiveTab(DoctorApplicationStatus.REJECTED); setPage(1); }}
        >
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <p className="text-xs font-medium text-rose-600 dark:text-rose-400">Rejected</p>
              <XCircle className="size-3.5 text-rose-500" />
            </div>
            <p className="text-2xl font-bold mt-1 text-rose-600 dark:text-rose-400">{counts.rejected}</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Table Card with Search & Filters */}
      <Card className="shadow-xs border-border">
        <CardHeader className="pb-4">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            {/* Tabs for fast switching */}
            <Tabs 
              value={activeTab} 
              onValueChange={(val) => { setActiveTab(val); setPage(1); }}
              className="w-full lg:w-auto"
            >
              <TabsList className="grid grid-cols-3 sm:flex sm:flex-wrap h-auto gap-1 bg-muted/50 p-1">
                <TabsTrigger value="ALL" className="text-xs">All</TabsTrigger>
                <TabsTrigger value={DoctorApplicationStatus.SUBMITTED} className="text-xs">Pending</TabsTrigger>
                <TabsTrigger value={DoctorApplicationStatus.UNDER_REVIEW} className="text-xs">Under Review</TabsTrigger>
                <TabsTrigger value={DoctorApplicationStatus.APPROVED} className="text-xs">Approved</TabsTrigger>
                <TabsTrigger value={DoctorApplicationStatus.RESUBMISSION_REQUIRED} className="text-xs">Resubmission</TabsTrigger>
                <TabsTrigger value={DoctorApplicationStatus.REJECTED} className="text-xs">Rejected</TabsTrigger>
              </TabsList>
            </Tabs>

            {/* Filter controls */}
            <div className="flex flex-col sm:flex-row items-center gap-2">
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                <Input
                  placeholder="Search by name, BMDC, email..."
                  value={searchTerm}
                  onChange={(e) => { setSearchTerm(e.target.value); setPage(1); }}
                  className="pl-9 text-xs h-9"
                />
              </div>

              <div className="w-full sm:w-48">
                <Select 
                  value={selectedSpecialty} 
                  onValueChange={(val) => { setSelectedSpecialty(val); setPage(1); }}
                >
                  <SelectTrigger className="text-xs h-9">
                    <SelectValue placeholder="All Specialties" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ALL">All Specialties</SelectItem>
                    {specialties.map((spec) => (
                      <SelectItem key={spec.id} value={spec.id}>
                        {spec.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-6 space-y-4">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-14 w-full" />
              <Skeleton className="h-14 w-full" />
              <Skeleton className="h-14 w-full" />
              <Skeleton className="h-14 w-full" />
            </div>
          ) : isError ? (
            <div className="p-12 text-center">
              <div className="inline-flex size-12 items-center justify-center rounded-full bg-destructive/10 text-destructive mb-3">
                <AlertCircle className="size-6" />
              </div>
              <h3 className="text-base font-semibold text-foreground">Failed to load doctor applications</h3>
              <p className="text-sm text-muted-foreground mt-1 max-w-md mx-auto">
                {error instanceof Error ? error.message : "An unexpected server error occurred while retrieving application records."}
              </p>
              <Button variant="outline" size="sm" onClick={() => refetch()} className="mt-4">
                Try Again
              </Button>
            </div>
          ) : applications.length === 0 ? (
            <div className="p-12 text-center">
              <div className="inline-flex size-12 items-center justify-center rounded-full bg-muted text-muted-foreground mb-3">
                <FileText className="size-6" />
              </div>
              <h3 className="text-base font-semibold text-foreground">No applications found</h3>
              <p className="text-sm text-muted-foreground mt-1 max-w-sm mx-auto">
                {searchTerm || activeTab !== "ALL" || selectedSpecialty !== "ALL"
                  ? "No doctor applications matched your search criteria or filter."
                  : "There are currently no doctor onboarding applications registered in the system."}
              </p>
              {(searchTerm || activeTab !== "ALL" || selectedSpecialty !== "ALL") && (
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => { setSearchTerm(""); setActiveTab("ALL"); setSelectedSpecialty("ALL"); }}
                  className="mt-4"
                >
                  Clear Filters
                </Button>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/40 hover:bg-muted/40">
                    <TableHead className="font-semibold text-xs">Doctor Applicant</TableHead>
                    <TableHead className="font-semibold text-xs">BMDC Reg.</TableHead>
                    <TableHead className="font-semibold text-xs">Specialty</TableHead>
                    <TableHead className="font-semibold text-xs">Qualifications & Workplace</TableHead>
                    <TableHead className="font-semibold text-xs">Fee</TableHead>
                    <TableHead className="font-semibold text-xs">Status</TableHead>
                    <TableHead className="font-semibold text-xs">Submitted Date</TableHead>
                    <TableHead className="text-right font-semibold text-xs">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {applications.map((app) => {
                    const initials = app.fullName
                      ?.split(" ")
                      .map((n) => n[0])
                      .join("")
                      .slice(0, 2)
                      .toUpperCase() || "DR"

                    return (
                      <TableRow key={app.id} className="hover:bg-muted/30 transition-colors">
                        <TableCell className="py-3">
                          <div className="flex items-center gap-3">
                            <Avatar className="size-10 border border-border/80">
                              <AvatarImage src={app.user?.image || ""} alt={app.fullName} />
                              <AvatarFallback className="bg-primary/10 text-xs font-bold text-primary">
                                {initials}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex flex-col">
                              <span className="text-sm font-semibold text-foreground hover:underline">
                                <Link href={`/admin/doctor-applications/${app.id}`}>
                                  {app.fullName}
                                </Link>
                              </span>
                              <span className="text-xs text-muted-foreground">{app.email}</span>
                              <span className="text-xs text-muted-foreground font-mono">{app.phone}</span>
                            </div>
                          </div>
                        </TableCell>

                        <TableCell className="py-3">
                          <div className="flex flex-col">
                            <span className="font-mono text-xs font-medium text-foreground">
                              {app.bmdcRegistrationNumber || "N/A"}
                            </span>
                            <span className="text-[10px] text-muted-foreground">
                              {app.registrationType || "Medical Practitioner"}
                            </span>
                          </div>
                        </TableCell>

                        <TableCell className="py-3">
                          {app.specialty ? (
                            <Badge variant="secondary" className="text-xs font-medium">
                              {app.specialty.title}
                            </Badge>
                          ) : (
                            <span className="text-xs text-muted-foreground italic">General Medicine</span>
                          )}
                        </TableCell>

                        <TableCell className="py-3 max-w-[200px]">
                          <div className="flex flex-col">
                            <span className="text-xs font-medium text-foreground truncate" title={app.qualifications || ""}>
                              {app.qualifications || "MBBS"}
                            </span>
                            <span className="text-[11px] text-muted-foreground truncate" title={app.currentWorkplace || ""}>
                              {app.designation ? `${app.designation}, ` : ""}{app.currentWorkplace || "Healthcare"}
                            </span>
                            {app.experienceYears !== null && app.experienceYears !== undefined && (
                              <span className="text-[10px] text-muted-foreground">
                                {app.experienceYears} yrs experience
                              </span>
                            )}
                          </div>
                        </TableCell>

                        <TableCell className="py-3 font-mono text-xs font-semibold">
                          ৳{app.consultationFee ?? 0}
                        </TableCell>

                        <TableCell className="py-3">
                          {getStatusBadge(app.status)}
                        </TableCell>

                        <TableCell className="py-3 text-xs text-muted-foreground">
                          {app.createdAt ? format(new Date(app.createdAt), "MMM d, yyyy") : "N/A"}
                        </TableCell>

                        <TableCell className="py-3 text-right">
                          <Button asChild size="sm" variant="default" className="h-8 gap-1 text-xs">
                            <Link href={`/admin/doctor-applications/${app.id}`}>
                              <Eye className="size-3.5" />
                              Review
                            </Link>
                          </Button>
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </div>
          )}

          {/* Pagination Controls */}
          {meta && meta.totalPages > 1 && (
            <div className="flex items-center justify-between px-6 py-4 border-t border-border">
              <p className="text-xs text-muted-foreground">
                Showing page <span className="font-semibold text-foreground">{meta.page}</span> of{" "}
                <span className="font-semibold text-foreground">{meta.totalPages}</span> ({meta.total} applications)
              </p>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={meta.page <= 1}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  className="text-xs h-8"
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={meta.page >= meta.totalPages}
                  onClick={() => setPage((p) => p + 1)}
                  className="text-xs h-8"
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
