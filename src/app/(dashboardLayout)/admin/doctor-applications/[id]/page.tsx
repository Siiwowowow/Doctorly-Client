"use client"

import React, { useState } from "react"
import { useParams } from "next/navigation"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import Link from "next/link"
import { format } from "date-fns"
import { 
  ArrowLeft, 
  CheckCircle2, 
  XCircle, 
  AlertCircle, 
  Clock, 
  RefreshCcw, 
  FileText, 
  ExternalLink, 
  Mail, 
  Phone, 
  Building2, 
  GraduationCap, 
  Award, 
  Stethoscope, 
  DollarSign, 
  ShieldCheck, 
  CheckSquare, 
  Square,
  AlertTriangle,
  User
} from "lucide-react"

import { 
  getDoctorApplicationById, 
  updateDoctorApplicationStatus, 
  verifyDoctorDocument, 
  approveDoctorApplication, 
  rejectDoctorApplication, 
  requestResubmissionDoctorApplication 
} from "@/services/doctorApplication.services"
import { 
  DoctorApplication, 
  DoctorApplicationDocument, 
  DoctorApplicationStatus, 
  DocumentVerificationStatus 
} from "@/types/api.types"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Textarea } from "@/components/ui/textarea"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter
} from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useToast } from "@/hooks/use-toast"

export default function DoctorApplicationDetailPage() {
  const params = useParams()
  const { toast } = useToast()
  const queryClient = useQueryClient()
  const applicationId = params?.id as string

  // Modal dialog states
  const [isApproveOpen, setIsApproveOpen] = useState(false)
  const [isRejectOpen, setIsRejectOpen] = useState(false)
  const [isResubmitOpen, setIsResubmitOpen] = useState(false)
  const [isRejectDocOpen, setIsRejectDocOpen] = useState(false)
  const [selectedDoc, setSelectedDoc] = useState<DoctorApplicationDocument | null>(null)
  const [previewDoc, setPreviewDoc] = useState<DoctorApplicationDocument | null>(null)

  // Input states for reasons/notes
  const [rejectionReason, setRejectionReason] = useState("")
  const [resubmissionNotes, setResubmissionNotes] = useState("")
  const [docAdminNote, setDocAdminNote] = useState("")

  // 1. Fetch single application
  const { 
    data: applicationResponse, 
    isLoading, 
    isError, 
    error,
    refetch,
    isFetching 
  } = useQuery({
    queryKey: ["admin-doctor-application", applicationId],
    queryFn: () => getDoctorApplicationById(applicationId),
    enabled: !!applicationId,
  })

  const application: DoctorApplication | undefined = applicationResponse?.data

  // Mutations
  const approveMutation = useMutation({
    mutationFn: () => approveDoctorApplication(applicationId),
    onSuccess: (res) => {
      toast({
        title: "Application Approved!",
        description: `Dr. ${res.data?.doctor?.name || "Doctor"} profile has been created and account activated.`,
      })
      setIsApproveOpen(false)
      queryClient.invalidateQueries({ queryKey: ["admin-doctor-application", applicationId] })
      queryClient.invalidateQueries({ queryKey: ["admin-doctor-applications"] })
    },
    onError: (err: unknown) => {
      toast({
        variant: "destructive",
        title: "Approval Failed",
        description: err instanceof Error ? err.message : "Failed to approve application",
      })
    },
  })

  const rejectMutation = useMutation({
    mutationFn: (reason: string) => rejectDoctorApplication(applicationId, reason),
    onSuccess: () => {
      toast({
        title: "Application Rejected",
        description: "The applicant has been notified with the provided reason.",
      })
      setIsRejectOpen(false)
      setRejectionReason("")
      queryClient.invalidateQueries({ queryKey: ["admin-doctor-application", applicationId] })
      queryClient.invalidateQueries({ queryKey: ["admin-doctor-applications"] })
    },
    onError: (err: unknown) => {
      toast({
        variant: "destructive",
        title: "Rejection Failed",
        description: err instanceof Error ? err.message : "Failed to reject application",
      })
    },
  })

  const resubmitMutation = useMutation({
    mutationFn: (notes: string) => requestResubmissionDoctorApplication(applicationId, notes),
    onSuccess: () => {
      toast({
        title: "Resubmission Requested",
        description: "The applicant has been asked to update their submission.",
      })
      setIsResubmitOpen(false)
      setResubmissionNotes("")
      queryClient.invalidateQueries({ queryKey: ["admin-doctor-application", applicationId] })
      queryClient.invalidateQueries({ queryKey: ["admin-doctor-applications"] })
    },
    onError: (err: unknown) => {
      toast({
        variant: "destructive",
        title: "Request Failed",
        description: err instanceof Error ? err.message : "Failed to request resubmission",
      })
    },
  })

  const markUnderReviewMutation = useMutation({
    mutationFn: () => updateDoctorApplicationStatus(applicationId, DoctorApplicationStatus.UNDER_REVIEW),
    onSuccess: () => {
      toast({
        title: "Status Updated",
        description: "Application is now marked as Under Review.",
      })
      queryClient.invalidateQueries({ queryKey: ["admin-doctor-application", applicationId] })
      queryClient.invalidateQueries({ queryKey: ["admin-doctor-applications"] })
    },
    onError: (err: unknown) => {
      toast({
        variant: "destructive",
        title: "Status Update Failed",
        description: err instanceof Error ? err.message : "Failed to update status",
      })
    },
  })

  const verifyDocMutation = useMutation({
    mutationFn: ({ docId, status, note }: { docId: string; status: DocumentVerificationStatus; note?: string }) => 
      verifyDoctorDocument(applicationId, docId, { verificationStatus: status, adminNote: note }),
    onSuccess: (_, variables) => {
      toast({
        title: variables.status === DocumentVerificationStatus.VERIFIED ? "Document Verified" : "Document Rejected",
        description: "Document verification status updated.",
      })
      setIsRejectDocOpen(false)
      setSelectedDoc(null)
      setDocAdminNote("")
      queryClient.invalidateQueries({ queryKey: ["admin-doctor-application", applicationId] })
    },
    onError: (err: unknown) => {
      toast({
        variant: "destructive",
        title: "Document Action Failed",
        description: err instanceof Error ? err.message : "Failed to update document status",
      })
    },
  })

  // Verification Checklist Calculations
  const hasIdentity = !!(application?.fullName && application?.email && application?.phone)
  const hasBmdc = !!(application?.bmdcRegistrationNumber)
  const hasDegree = !!(application?.qualifications)
  const hasSpecialty = !!(application?.specialtyId || application?.specialty)
  const hasExperience = !!(application?.currentWorkplace || (application?.experienceYears ?? 0) > 0)
  const hasFee = (application?.consultationFee ?? 0) > 0
  const docs = application?.documents || []
  const allDocsVerified = docs.length > 0 && docs.every((d) => d.verificationStatus === DocumentVerificationStatus.VERIFIED)

  const checklistItems = [
    { label: "Personal identity & contact details complete", passed: hasIdentity },
    { label: "BMDC medical registration number verified", passed: hasBmdc },
    { label: "Medical qualifications & degrees specified", passed: hasDegree },
    { label: "Clinical specialty assigned", passed: hasSpecialty },
    { label: "Clinical workplace & experience provided", passed: hasExperience },
    { label: "Consultation fee configured", passed: hasFee },
    { label: `All attached documents verified (${docs.filter(d => d.verificationStatus === DocumentVerificationStatus.VERIFIED).length}/${docs.length || 0})`, passed: allDocsVerified },
  ]

  const passedChecksCount = checklistItems.filter((i) => i.passed).length
  const totalChecks = checklistItems.length
  const isReadyForApproval = hasBmdc && hasIdentity && hasDegree

  const getStatusBadge = (status: DoctorApplicationStatus) => {
    switch (status) {
      case DoctorApplicationStatus.SUBMITTED:
        return (
          <Badge variant="outline" className="bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30 text-xs px-3 py-1 font-semibold">
            <Clock className="size-3.5 mr-1.5" /> Pending Review
          </Badge>
        )
      case DoctorApplicationStatus.UNDER_REVIEW:
        return (
          <Badge variant="outline" className="bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/30 text-xs px-3 py-1 font-semibold">
            <RefreshCcw className="size-3.5 mr-1.5 animate-spin" /> Under Review
          </Badge>
        )
      case DoctorApplicationStatus.APPROVED:
        return (
          <Badge variant="outline" className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30 text-xs px-3 py-1 font-semibold">
            <CheckCircle2 className="size-3.5 mr-1.5" /> Approved Doctor
          </Badge>
        )
      case DoctorApplicationStatus.RESUBMISSION_REQUIRED:
        return (
          <Badge variant="outline" className="bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/30 text-xs px-3 py-1 font-semibold">
            <AlertCircle className="size-3.5 mr-1.5" /> Resubmission Required
          </Badge>
        )
      case DoctorApplicationStatus.REJECTED:
        return (
          <Badge variant="outline" className="bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/30 text-xs px-3 py-1 font-semibold">
            <XCircle className="size-3.5 mr-1.5" /> Application Rejected
          </Badge>
        )
      default:
        return (
          <Badge variant="outline" className="bg-muted text-muted-foreground text-xs px-3 py-1 font-semibold">
            Draft
          </Badge>
        )
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-6 pb-12">
        <Skeleton className="h-10 w-48" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Skeleton className="h-96 lg:col-span-2" />
          <Skeleton className="h-96" />
        </div>
      </div>
    )
  }

  if (isError || !application) {
    return (
      <div className="p-12 text-center">
        <div className="inline-flex size-14 items-center justify-center rounded-full bg-destructive/10 text-destructive mb-4">
          <AlertCircle className="size-8" />
        </div>
        <h2 className="text-xl font-bold text-foreground">Doctor Application Not Found</h2>
        <p className="text-sm text-muted-foreground mt-2 max-w-md mx-auto">
          {error instanceof Error ? error.message : "The requested doctor onboarding application could not be loaded."}
        </p>
        <Button asChild variant="outline" className="mt-6 gap-2">
          <Link href="/admin/doctor-applications">
            <ArrowLeft className="size-4" />
            Back to Applications
          </Link>
        </Button>
      </div>
    )
  }

  const initials = application.fullName
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase() || "DR"

  return (
    <div className="space-y-6 pb-16">
      {/* Top Breadcrumb & Actions Bar */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <Button asChild variant="outline" size="sm" className="size-8 p-0">
            <Link href="/admin/doctor-applications">
              <ArrowLeft className="size-4" />
            </Link>
          </Button>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
                Review: {application.fullName}
              </h1>
              {getStatusBadge(application.status)}
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">
              Application ID: <span className="font-mono">{application.id}</span> • Submitted:{" "}
              {application.createdAt ? format(new Date(application.createdAt), "MMMM d, yyyy 'at' h:mm a") : "N/A"}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => refetch()} 
            disabled={isFetching}
            className="gap-1.5"
          >
            <RefreshCcw className={`size-3.5 ${isFetching ? "animate-spin" : ""}`} />
            Refresh
          </Button>

          {application.status === DoctorApplicationStatus.SUBMITTED && (
            <Button
              variant="secondary"
              size="sm"
              onClick={() => markUnderReviewMutation.mutate()}
              disabled={markUnderReviewMutation.isPending}
              className="gap-1.5"
            >
              <RefreshCcw className="size-3.5" />
              Mark Under Review
            </Button>
          )}

          {application.status !== DoctorApplicationStatus.APPROVED && (
            <>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => setIsRejectOpen(true)}
                className="gap-1.5"
              >
                <XCircle className="size-4" />
                Reject
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsResubmitOpen(true)}
                className="border-orange-500/40 text-orange-600 dark:text-orange-400 hover:bg-orange-500/10 gap-1.5"
              >
                <AlertCircle className="size-4" />
                Request Resubmission
              </Button>

              <Button
                variant="default"
                size="sm"
                onClick={() => setIsApproveOpen(true)}
                disabled={!isReadyForApproval}
                className="bg-emerald-600 hover:bg-emerald-700 text-white gap-1.5 shadow-sm"
              >
                <CheckCircle2 className="size-4" />
                Approve Doctor
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Rejection / Resubmission Notice Banner (if applicable) */}
      {application.rejectionReason && (
        <Card className={`border-l-4 ${application.status === DoctorApplicationStatus.REJECTED ? "border-l-rose-500 bg-rose-500/5 border-rose-500/20" : "border-l-orange-500 bg-orange-500/5 border-orange-500/20"}`}>
          <CardContent className="p-4 flex items-start gap-3">
            {application.status === DoctorApplicationStatus.REJECTED ? (
              <XCircle className="size-5 text-rose-500 shrink-0 mt-0.5" />
            ) : (
              <AlertCircle className="size-5 text-orange-500 shrink-0 mt-0.5" />
            )}
            <div>
              <h4 className="text-sm font-semibold text-foreground">
                {application.status === DoctorApplicationStatus.REJECTED ? "Rejection Reason Recorded" : "Resubmission Instructions Given"}
              </h4>
              <p className="text-xs text-muted-foreground mt-1 whitespace-pre-wrap">
                {application.rejectionReason}
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Main Grid: Left Column (Personal + Professional + Documents) | Right Column (Checklist + Status Panel) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: 2 Spans */}
        <div className="lg:col-span-2 space-y-6">

          {/* 1. Personal & Contact Information */}
          <Card className="border-border shadow-xs">
            <CardHeader className="pb-3 border-b border-border/50">
              <div className="flex items-center gap-2">
                <User className="size-4 text-primary" />
                <CardTitle className="text-base font-semibold">Personal Information</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 pb-6 border-b border-border/50">
                <Avatar className="size-16 border-2 border-primary/20 shadow-xs">
                  <AvatarImage src={application.user?.image || ""} alt={application.fullName} />
                  <AvatarFallback className="bg-primary/10 text-base font-bold text-primary">
                    {initials}
                  </AvatarFallback>
                </Avatar>
                <div className="space-y-1">
                  <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
                    {application.fullName}
                  </h3>
                  <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Mail className="size-3.5" />
                      {application.email}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1 font-mono">
                      <Phone className="size-3.5" />
                      {application.phone}
                    </span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 text-xs">
                <div>
                  <span className="text-muted-foreground block font-medium">Residential Address</span>
                  <span className="text-foreground mt-0.5 block">
                    {[application.address, application.city, application.country].filter(Boolean).join(", ") || "Not provided"}
                  </span>
                </div>
                <div>
                  <span className="text-muted-foreground block font-medium">User Account Status</span>
                  <span className="text-foreground mt-0.5 block font-mono">
                    {application.user?.status || "BLOCKED"}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 2. Professional & Medical Credentials */}
          <Card className="border-border shadow-xs">
            <CardHeader className="pb-3 border-b border-border/50">
              <div className="flex items-center gap-2">
                <Stethoscope className="size-4 text-primary" />
                <CardTitle className="text-base font-semibold">Professional Credentials</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
                <div className="p-3 rounded-lg bg-muted/40 border border-border/50">
                  <span className="text-muted-foreground font-medium flex items-center gap-1.5">
                    <ShieldCheck className="size-3.5 text-primary" />
                    BMDC Registration
                  </span>
                  <p className="text-sm font-mono font-bold text-foreground mt-1">
                    {application.bmdcRegistrationNumber || "N/A"}
                  </p>
                  <p className="text-[10px] text-muted-foreground mt-0.5">
                    Type: {application.registrationType || "Standard Medical Practitioner"}
                  </p>
                </div>

                <div className="p-3 rounded-lg bg-muted/40 border border-border/50">
                  <span className="text-muted-foreground font-medium flex items-center gap-1.5">
                    <Award className="size-3.5 text-primary" />
                    Clinical Specialty
                  </span>
                  <p className="text-sm font-semibold text-foreground mt-1">
                    {application.specialty?.title || "General Medicine"}
                  </p>
                  <p className="text-[10px] text-muted-foreground mt-0.5 truncate">
                    {application.specialty?.description || "Primary Care"}
                  </p>
                </div>

                <div className="p-3 rounded-lg bg-muted/40 border border-border/50">
                  <span className="text-muted-foreground font-medium flex items-center gap-1.5">
                    <DollarSign className="size-3.5 text-primary" />
                    Consultation Fee
                  </span>
                  <p className="text-sm font-bold text-foreground mt-1 font-mono">
                    ৳{application.consultationFee ?? 0}
                  </p>
                  <p className="text-[10px] text-muted-foreground mt-0.5">
                    Standard Video/In-person Fee
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs pt-2">
                <div>
                  <span className="text-muted-foreground block font-medium flex items-center gap-1.5">
                    <GraduationCap className="size-3.5 text-primary" />
                    Medical Degrees & Qualifications
                  </span>
                  <p className="text-foreground mt-1 font-semibold text-sm">
                    {application.qualifications || "MBBS"}
                  </p>
                </div>

                <div>
                  <span className="text-muted-foreground block font-medium flex items-center gap-1.5">
                    <Building2 className="size-3.5 text-primary" />
                    Current Workplace & Designation
                  </span>
                  <p className="text-foreground mt-1 font-semibold text-sm">
                    {application.designation ? `${application.designation} at ` : ""}{application.currentWorkplace || "Healthcare Institute"}
                  </p>
                  {application.experienceYears !== null && application.experienceYears !== undefined && (
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {application.experienceYears} Years of Clinical Practice
                    </p>
                  )}
                </div>
              </div>

              {application.about && (
                <div className="pt-2">
                  <span className="text-muted-foreground block font-medium text-xs">Biography & Medical Background</span>
                  <p className="text-xs text-foreground mt-1.5 p-3 rounded-lg bg-muted/30 border border-border/50 leading-relaxed whitespace-pre-wrap">
                    {application.about}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* 3. Uploaded Documents & Certificates */}
          <Card className="border-border shadow-xs">
            <CardHeader className="pb-3 border-b border-border/50">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FileText className="size-4 text-primary" />
                  <CardTitle className="text-base font-semibold">Verification Documents</CardTitle>
                </div>
                <Badge variant="secondary" className="text-xs">
                  {docs.length} Uploaded
                </Badge>
              </div>
              <CardDescription className="text-xs">
                Inspect applicant credential files, certificate scans, and identity proofs.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              {docs.length === 0 ? (
                <div className="p-8 text-center border-2 border-dashed border-border rounded-xl">
                  <FileText className="size-8 mx-auto text-muted-foreground mb-2" />
                  <p className="text-sm font-medium text-foreground">No verification documents attached</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    The applicant has not uploaded credential files or certificate scans.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {docs.map((doc) => {
                    const isVerified = doc.verificationStatus === DocumentVerificationStatus.VERIFIED
                    const isRejected = doc.verificationStatus === DocumentVerificationStatus.REJECTED

                    return (
                      <div 
                        key={doc.id}
                        className={`p-4 rounded-xl border transition-all ${
                          isVerified 
                            ? "bg-emerald-500/5 border-emerald-500/30" 
                            : isRejected 
                            ? "bg-rose-500/5 border-rose-500/30" 
                            : "bg-muted/20 border-border"
                        }`}
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                          <div className="flex items-start gap-3">
                            <div className={`p-2.5 rounded-lg shrink-0 ${
                              isVerified ? "bg-emerald-500/10 text-emerald-600" : isRejected ? "bg-rose-500/10 text-rose-600" : "bg-primary/10 text-primary"
                            }`}>
                              <FileText className="size-5" />
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <h4 className="text-sm font-semibold text-foreground">
                                  {doc.documentName || doc.documentType}
                                </h4>
                                <Badge variant="outline" className="text-[10px] font-mono uppercase">
                                  {doc.documentType.replace(/_/g, " ")}
                                </Badge>
                              </div>
                              <p className="text-xs text-muted-foreground mt-0.5">
                                Uploaded: {doc.createdAt ? format(new Date(doc.createdAt), "MMM d, yyyy") : "N/A"}
                              </p>
                              {doc.adminNote && (
                                <p className="text-xs text-rose-600 dark:text-rose-400 mt-1.5 font-medium">
                                  Note: {doc.adminNote}
                                </p>
                              )}
                            </div>
                          </div>

                          <div className="flex items-center gap-2 self-end sm:self-center">
                            {/* Status indicator */}
                            {isVerified ? (
                              <Badge className="bg-emerald-600 text-white text-xs">
                                <CheckCircle2 className="size-3 mr-1" /> Verified
                              </Badge>
                            ) : isRejected ? (
                              <Badge variant="destructive" className="text-xs">
                                <XCircle className="size-3 mr-1" /> Rejected
                              </Badge>
                            ) : (
                              <Badge variant="outline" className="bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30 text-xs">
                                <Clock className="size-3 mr-1" /> Pending
                              </Badge>
                            )}

                            {/* View / Download button with Modal Preview */}
                            {doc.fileUrl && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setPreviewDoc(doc)}
                                className="h-8 gap-1.5 text-xs text-primary hover:bg-primary/10"
                              >
                                <ExternalLink className="size-3.5" />
                                Preview Document
                              </Button>
                            )}

                            {/* Verify button */}
                            {!isVerified && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => verifyDocMutation.mutate({ docId: doc.id, status: DocumentVerificationStatus.VERIFIED })}
                                disabled={verifyDocMutation.isPending}
                                className="h-8 text-xs border-emerald-500/40 text-emerald-600 hover:bg-emerald-500/10"
                              >
                                <CheckCircle2 className="size-3.5 mr-1" />
                                Verify
                              </Button>
                            )}

                            {/* Reject button */}
                            {!isRejected && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  setSelectedDoc(doc)
                                  setDocAdminNote("")
                                  setIsRejectDocOpen(true)
                                }}
                                disabled={verifyDocMutation.isPending}
                                className="h-8 text-xs border-rose-500/40 text-rose-600 hover:bg-rose-500/10"
                              >
                                <XCircle className="size-3.5 mr-1" />
                                Reject
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right Column: 1 Span (Verification Checklist & Status Summary) */}
        <div className="space-y-6">

          {/* Verification Checklist */}
          <Card className="border-border shadow-xs sticky top-20">
            <CardHeader className="pb-3 border-b border-border/50">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CheckSquare className="size-4 text-primary" />
                  <CardTitle className="text-base font-semibold">Verification Checklist</CardTitle>
                </div>
                <Badge variant={passedChecksCount === totalChecks ? "default" : "secondary"} className="text-xs">
                  {passedChecksCount}/{totalChecks} Completed
                </Badge>
              </div>
              <CardDescription className="text-xs">
                All critical checkpoints should be satisfied prior to approving doctor registration.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6 space-y-3">
              {checklistItems.map((item, idx) => (
                <div key={idx} className="flex items-start gap-2.5 text-xs">
                  {item.passed ? (
                    <CheckCircle2 className="size-4 text-emerald-500 shrink-0 mt-0.5" />
                  ) : (
                    <Square className="size-4 text-muted-foreground/60 shrink-0 mt-0.5" />
                  )}
                  <span className={item.passed ? "text-foreground font-medium" : "text-muted-foreground"}>
                    {item.label}
                  </span>
                </div>
              ))}

              <div className="pt-4 mt-4 border-t border-border space-y-2">
                <div className="flex items-center justify-between text-xs font-semibold">
                  <span>Approval Readiness</span>
                  <span className={isReadyForApproval ? "text-emerald-600 dark:text-emerald-400" : "text-amber-600 dark:text-amber-400"}>
                    {isReadyForApproval ? "Ready for Approval" : "Requirements Incomplete"}
                  </span>
                </div>
                <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
                  <div 
                    className={`h-full transition-all duration-300 ${
                      passedChecksCount === totalChecks ? "bg-emerald-500" : "bg-primary"
                    }`}
                    style={{ width: `${(passedChecksCount / totalChecks) * 100}%` }}
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter className="p-4 bg-muted/20 border-t border-border flex flex-col gap-2">
              {application.status !== DoctorApplicationStatus.APPROVED ? (
                <Button
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white gap-2 shadow-xs"
                  onClick={() => setIsApproveOpen(true)}
                  disabled={!isReadyForApproval}
                >
                  <CheckCircle2 className="size-4" />
                  Approve Application
                </Button>
              ) : (
                <div className="w-full text-center py-2">
                  <Badge className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20 text-xs px-3 py-1 font-semibold">
                    <CheckCircle2 className="size-3.5 mr-1" /> Approved & Active
                  </Badge>
                </div>
              )}

              <Button
                variant="outline"
                className="w-full text-xs"
                asChild
              >
                <Link href="/admin/doctor-applications">
                  Back to All Applications
                </Link>
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* MODAL DIALOGS */}
      {/* ------------------------------------------------------------- */}

      {/* 1. Approve Doctor Confirmation Dialog */}
      <Dialog open={isApproveOpen} onOpenChange={setIsApproveOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <div className="size-10 rounded-full bg-emerald-500/10 text-emerald-600 flex items-center justify-center mb-2">
              <CheckCircle2 className="size-6" />
            </div>
            <DialogTitle>Approve Doctor Application</DialogTitle>
            <DialogDescription className="text-xs">
              Approving this application will automatically:
            </DialogDescription>
          </DialogHeader>

          <div className="text-xs space-y-2 py-2 text-muted-foreground">
            <p className="flex items-center gap-2 text-foreground font-medium">
              ✓ Activate user account and grant DOCTOR role.
            </p>
            <p className="flex items-center gap-2 text-foreground font-medium">
              ✓ Create public Doctor Profile with BMDC registration: <span className="font-mono text-primary font-bold">{application.bmdcRegistrationNumber}</span>.
            </p>
            <p className="flex items-center gap-2 text-foreground font-medium">
              ✓ Link clinical specialty: <span className="text-primary font-bold">{application.specialty?.title || "General Medicine"}</span>.
            </p>
            <p className="flex items-center gap-2 text-foreground font-medium">
              ✓ Mark all attached documents as verified.
            </p>
            <p className="flex items-center gap-2 text-foreground font-medium">
              ✓ Dispatch instant approval notification to Dr. {application.fullName}.
            </p>
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" size="sm" onClick={() => setIsApproveOpen(false)}>
              Cancel
            </Button>
            <Button
              size="sm"
              className="bg-emerald-600 hover:bg-emerald-700 text-white gap-1.5"
              onClick={() => approveMutation.mutate()}
              disabled={approveMutation.isPending}
            >
              {approveMutation.isPending && <RefreshCcw className="size-3.5 animate-spin mr-1" />}
              Confirm & Approve
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 2. Reject Application Modal */}
      <Dialog open={isRejectOpen} onOpenChange={setIsRejectOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <div className="size-10 rounded-full bg-rose-500/10 text-rose-600 flex items-center justify-center mb-2">
              <XCircle className="size-6" />
            </div>
            <DialogTitle>Reject Doctor Application</DialogTitle>
            <DialogDescription className="text-xs">
              Please provide the official justification for rejecting this doctor registration. This reason will be stored and sent to the applicant.
            </DialogDescription>
          </DialogHeader>

          <div className="py-2">
            <label className="text-xs font-medium text-foreground block mb-1.5">
              Rejection Reason <span className="text-rose-500">*</span>
            </label>
            <Textarea
              placeholder="e.g. Invalid BMDC registration number, forged certificate scans, or unverified qualifications..."
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              rows={4}
              className="text-xs"
            />
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" size="sm" onClick={() => setIsRejectOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => rejectMutation.mutate(rejectionReason.trim())}
              disabled={!rejectionReason.trim() || rejectMutation.isPending}
              className="gap-1.5"
            >
              {rejectMutation.isPending && <RefreshCcw className="size-3.5 animate-spin mr-1" />}
              Confirm Rejection
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 3. Request Resubmission Modal */}
      <Dialog open={isResubmitOpen} onOpenChange={setIsResubmitOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <div className="size-10 rounded-full bg-orange-500/10 text-orange-600 flex items-center justify-center mb-2">
              <AlertCircle className="size-6" />
            </div>
            <DialogTitle>Request Resubmission</DialogTitle>
            <DialogDescription className="text-xs">
              Specify what additional credentials, updated files, or corrections the doctor must submit before approval.
            </DialogDescription>
          </DialogHeader>

          <div className="py-2">
            <label className="text-xs font-medium text-foreground block mb-1.5">
              Instructions & Requirements for Resubmission <span className="text-rose-500">*</span>
            </label>
            <Textarea
              placeholder="e.g. Please upload a clearer scan of your BMDC certificate and provide your official hospital designation letter..."
              value={resubmissionNotes}
              onChange={(e) => setResubmissionNotes(e.target.value)}
              rows={4}
              className="text-xs"
            />
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" size="sm" onClick={() => setIsResubmitOpen(false)}>
              Cancel
            </Button>
            <Button
              size="sm"
              onClick={() => resubmitMutation.mutate(resubmissionNotes.trim())}
              disabled={!resubmissionNotes.trim() || resubmitMutation.isPending}
              className="bg-orange-600 hover:bg-orange-700 text-white gap-1.5"
            >
              {resubmitMutation.isPending && <RefreshCcw className="size-3.5 animate-spin mr-1" />}
              Send Resubmission Request
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 4. Reject Individual Document Modal */}
      <Dialog open={isRejectDocOpen} onOpenChange={setIsRejectDocOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <div className="size-10 rounded-full bg-rose-500/10 text-rose-600 flex items-center justify-center mb-2">
              <AlertTriangle className="size-6" />
            </div>
            <DialogTitle>Reject Document: {selectedDoc?.documentName || selectedDoc?.documentType}</DialogTitle>
            <DialogDescription className="text-xs">
              Provide a note explaining why this document was rejected (e.g. blurry scan, expired certificate).
            </DialogDescription>
          </DialogHeader>

          <div className="py-2">
            <label className="text-xs font-medium text-foreground block mb-1.5">
              Admin Note / Reason
            </label>
            <Textarea
              placeholder="e.g. Document image is unreadable or signature is cut off..."
              value={docAdminNote}
              onChange={(e) => setDocAdminNote(e.target.value)}
              rows={3}
              className="text-xs"
            />
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" size="sm" onClick={() => setIsRejectDocOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => {
                if (selectedDoc) {
                  verifyDocMutation.mutate({
                    docId: selectedDoc.id,
                    status: DocumentVerificationStatus.REJECTED,
                    note: docAdminNote.trim(),
                  })
                }
              }}
              disabled={verifyDocMutation.isPending}
              className="gap-1.5"
            >
              {verifyDocMutation.isPending && <RefreshCcw className="size-3.5 animate-spin mr-1" />}
              Reject Document
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Inline Document Preview Modal */}
      <Dialog open={!!previewDoc} onOpenChange={(open) => !open && setPreviewDoc(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] flex flex-col p-6">
          <DialogHeader className="pb-3 border-b border-border/50">
            <div className="flex items-center justify-between">
              <div>
                <DialogTitle className="text-base font-semibold text-foreground flex items-center gap-2">
                  <FileText className="size-4 text-primary" />
                  {previewDoc?.documentName || "Document Certificate Preview"}
                </DialogTitle>
                <DialogDescription className="text-xs mt-0.5 font-mono uppercase">
                  Type: {previewDoc?.documentType.replace(/_/g, " ")}
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          <div className="flex-1 overflow-auto my-4 min-h-[400px] flex items-center justify-center bg-muted/20 rounded-xl border border-border/60 p-2">
            {previewDoc?.fileUrl && (
              previewDoc.fileUrl.toLowerCase().endsWith(".pdf") ? (
                <iframe
                  src={previewDoc.fileUrl}
                  className="w-full h-[550px] rounded-lg border-0"
                  title="Document Preview"
                />
              ) : (
                <img
                  src={previewDoc.fileUrl}
                  alt={previewDoc.documentName || "Verification Certificate"}
                  className="max-h-[550px] max-w-full object-contain rounded-lg shadow-xs"
                />
              )
            )}
          </div>

          <DialogFooter className="flex flex-row justify-between items-center pt-2 border-t border-border/50">
            <p className="text-xs text-muted-foreground">
              Verification Status: <span className="font-semibold text-foreground">{previewDoc?.verificationStatus}</span>
            </p>
            <div className="flex gap-2">
              {previewDoc?.fileUrl && (
                <Button asChild variant="outline" size="sm" className="text-xs gap-1.5">
                  <a href={previewDoc.fileUrl} target="_blank" rel="noopener noreferrer" download>
                    <ExternalLink className="size-3.5" />
                    Open in New Tab / Download
                  </a>
                </Button>
              )}
              <Button size="sm" variant="secondary" className="text-xs" onClick={() => setPreviewDoc(null)}>
                Close Preview
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

