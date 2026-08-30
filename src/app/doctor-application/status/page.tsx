"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { 
  Clock, 
  CheckCircle2, 
  XCircle, 
  AlertCircle, 
  ArrowLeft, 
  RefreshCcw, 
  FileText, 
  ArrowRight,
  Search,
  Loader2
} from "lucide-react";
import { toast } from "sonner";

import { getMyDoctorApplication, trackDoctorApplication } from "@/services/doctorApplication.services";
import { DoctorApplication, DoctorApplicationStatus } from "@/types/api.types";
import { Card, CardContent, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";

export default function DoctorApplicationStatusPage() {
  const [identifier, setIdentifier] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [application, setApplication] = useState<DoctorApplication | null>(null);
  const [loading, setLoading] = useState(true);
  const [searching, setSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  // Initial load: try getMyApplication or check localStorage
  useEffect(() => {
    let active = true;
    async function loadInitial() {
      try {
        const res = await getMyDoctorApplication();
        if (active && res.data) {
          setApplication(res.data);
          setLoading(false);
          return;
        }
      } catch {
        // Not logged in or no auth session
      }

      // Check localStorage
      if (typeof window !== "undefined") {
        const savedEmail = localStorage.getItem("recentDoctorApplicationEmail");
        if (savedEmail) {
          try {
            const trackRes = await trackDoctorApplication(savedEmail);
            if (active && trackRes.data) {
              setApplication(trackRes.data);
              setIdentifier(savedEmail);
              setSearchInput(savedEmail);
              setLoading(false);
              return;
            }
          } catch {
            // Ignore if not found
          }
        }
      }

      if (active) setLoading(false);
    }
    loadInitial();
    return () => { active = false; };
  }, []);

  const handleSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const query = searchInput.trim();
    if (!query) {
      toast.error("Please enter your registered Email or Application ID");
      return;
    }

    setSearching(true);
    setHasSearched(true);
    try {
      const res = await trackDoctorApplication(query);
      if (res.data) {
        setApplication(res.data);
        setIdentifier(query);
        if (typeof window !== "undefined") {
          localStorage.setItem("recentDoctorApplicationEmail", query);
        }
        toast.success("Application found!");
      }
    } catch (err: any) {
      setApplication(null);
      toast.error(err.response?.data?.message || err.message || "No application found");
    } finally {
      setSearching(false);
    }
  };

  const handleRefresh = async () => {
    if (identifier) {
      setSearching(true);
      try {
        const res = await trackDoctorApplication(identifier);
        if (res.data) {
          setApplication(res.data);
          toast.success("Status updated!");
        }
      } catch (err: any) {
        toast.error(err.message || "Failed to refresh status");
      } finally {
        setSearching(false);
      }
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-muted/20 py-16 px-4 flex items-center justify-center">
        <Card className="w-full max-w-lg shadow-sm border-border bg-card p-6 space-y-4">
          <Skeleton className="h-10 w-48 mx-auto" />
          <Skeleton className="h-32 w-full rounded-xl" />
          <Skeleton className="h-12 w-full" />
        </Card>
      </main>
    );
  }

  const isApproved = application?.status === DoctorApplicationStatus.APPROVED;
  const isRejected = application?.status === DoctorApplicationStatus.REJECTED;
  const isResubmission = application?.status === DoctorApplicationStatus.RESUBMISSION_REQUIRED;
  const isUnderReview = application?.status === DoctorApplicationStatus.UNDER_REVIEW;
  const isPending = application?.status === DoctorApplicationStatus.SUBMITTED || application?.status === DoctorApplicationStatus.DRAFT;

  return (
    <main className="min-h-screen bg-muted/20 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto space-y-6">
        
        {/* Top bar */}
        <div className="flex items-center justify-between">
          <Button asChild variant="outline" size="sm" className="gap-1.5 text-xs">
            <Link href="/">
              <ArrowLeft className="size-3.5" />
              Home
            </Link>
          </Button>

          {application && (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleRefresh} 
              disabled={searching}
              className="gap-1.5 text-xs"
            >
              <RefreshCcw className={`size-3.5 ${searching ? "animate-spin" : ""}`} />
              Refresh Status
            </Button>
          )}
        </div>

        {/* Search / Lookup Form */}
        <Card className="shadow-xs border-border bg-card">
          <CardContent className="p-4 sm:p-6">
            <form onSubmit={handleSearch} className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-2.5 size-4 text-muted-foreground" />
                <Input 
                  placeholder="Enter your registered email (e.g. dr.abrar.hossain@gmail.com)"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  className="pl-9 text-xs h-9.5"
                />
              </div>
              <Button type="submit" size="sm" disabled={searching} className="text-xs gap-1.5">
                {searching ? <Loader2 className="size-3.5 animate-spin" /> : <Search className="size-3.5" />}
                Track
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Application Card or Empty State */}
        {application ? (
          <Card className="shadow-sm border-border bg-card overflow-hidden">
            
            {/* Status Header Banner */}
            <div className={`p-6 text-center border-b ${
              isApproved 
                ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-700 dark:text-emerald-300"
                : isRejected
                ? "bg-rose-500/10 border-rose-500/20 text-rose-700 dark:text-rose-300"
                : isResubmission
                ? "bg-orange-500/10 border-orange-500/20 text-orange-700 dark:text-orange-300"
                : "bg-blue-500/10 border-blue-500/20 text-blue-700 dark:text-blue-300"
            }`}>
              
              <div className="size-16 rounded-full bg-background/80 shadow-xs flex items-center justify-center mx-auto mb-3">
                {isApproved && <CheckCircle2 className="size-8 text-emerald-600" />}
                {isRejected && <XCircle className="size-8 text-rose-600" />}
                {isResubmission && <AlertCircle className="size-8 text-orange-600" />}
                {(isPending || isUnderReview) && <Clock className="size-8 text-blue-600" />}
              </div>

              <h1 className="text-xl font-bold text-foreground">
                {isApproved && "Application Approved!"}
                {isRejected && "Application Rejected"}
                {isResubmission && "Action Required: Resubmission Requested"}
                {isUnderReview && "Application Under Active Review"}
                {isPending && "Application Submitted & Pending Review"}
              </h1>

              <p className="text-xs text-muted-foreground mt-1 max-w-md mx-auto">
                {isApproved && "Your credentials have been verified. Your doctor profile is active and published on Doctorly."}
                {isRejected && "Unfortunately, your application could not be approved based on the review criteria."}
                {isResubmission && "Our compliance team has requested updated information or clearer document scans."}
                {isUnderReview && "Our medical verification team is currently verifying your BMDC registration and certificates."}
                {isPending && "We have received your application. Admin review typically takes 24-48 business hours."}
              </p>
            </div>

            <CardContent className="p-6 space-y-5">
              
              {/* Feedback / Reason Note if Rejected or Resubmission */}
              {application.rejectionReason && (
                <div className={`p-4 rounded-xl border text-xs leading-relaxed ${
                  isRejected ? "bg-rose-500/5 border-rose-500/30 text-rose-700 dark:text-rose-300" : "bg-orange-500/5 border-orange-500/30 text-orange-700 dark:text-orange-300"
                }`}>
                  <h4 className="font-bold mb-1">
                    {isRejected ? "Rejection Reason:" : "Compliance Instructions:"}
                  </h4>
                  <p className="whitespace-pre-wrap">{application.rejectionReason}</p>
                </div>
              )}

              {/* Application Summary Box */}
              <div className="p-4 rounded-xl bg-muted/20 border border-border/60 text-xs space-y-2.5">
                <div className="flex justify-between items-center pb-2 border-b border-border/40">
                  <span className="font-semibold text-foreground">Application ID:</span>
                  <span className="font-mono text-muted-foreground">{application.id}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Applicant Name:</span>
                  <span className="font-semibold text-foreground">{application.fullName}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Registered Email:</span>
                  <span className="font-mono font-semibold text-foreground">{application.email}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">BMDC Registration:</span>
                  <span className="font-mono font-semibold text-foreground">{application.bmdcRegistrationNumber || "N/A"}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Specialty:</span>
                  <span className="font-semibold text-doctorly-primary">{application.specialty?.title || "General Medicine"}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Consultation Fee:</span>
                  <span className="font-semibold text-foreground">৳{application.consultationFee || 0}</span>
                </div>
              </div>

              {/* Action CTAs */}
              <div className="pt-2">
                {isApproved && (
                  <Button asChild className="w-full bg-emerald-600 hover:bg-emerald-700 text-white gap-2 text-xs shadow-xs">
                    <Link href="/login">
                      Login to Doctor Dashboard
                      <ArrowRight className="size-3.5" />
                    </Link>
                  </Button>
                )}

                {isResubmission && (
                  <Button asChild className="w-full bg-orange-600 hover:bg-orange-700 text-white gap-2 text-xs shadow-xs">
                    <Link href="/join-as-doctor">
                      Update & Resubmit Credentials
                      <ArrowRight className="size-3.5" />
                    </Link>
                  </Button>
                )}

                {!isApproved && !isResubmission && (
                  <Button asChild variant="outline" className="w-full text-xs">
                    <Link href="/doctors">
                      Explore Doctors Directory
                    </Link>
                  </Button>
                )}
              </div>

            </CardContent>
          </Card>
        ) : hasSearched ? (
          <Card className="shadow-xs border-border bg-card p-8 text-center space-y-3">
            <div className="size-12 rounded-full bg-muted/60 flex items-center justify-center mx-auto text-muted-foreground">
              <FileText className="size-6" />
            </div>
            <CardTitle className="text-base font-bold">No Application Found</CardTitle>
            <CardDescription className="text-xs max-w-sm mx-auto">
              We couldn&apos;t find any doctor onboarding application matching that email or ID. Please make sure the email is typed correctly.
            </CardDescription>
          </Card>
        ) : (
          <Card className="shadow-xs border-border bg-card p-8 text-center space-y-3">
            <div className="size-12 rounded-full bg-doctorly-primary/10 flex items-center justify-center mx-auto text-doctorly-primary">
              <Search className="size-6" />
            </div>
            <CardTitle className="text-base font-bold">Track Your Doctor Application</CardTitle>
            <CardDescription className="text-xs max-w-sm mx-auto">
              Enter your registered email address above to check the real-time compliance review status of your application.
            </CardDescription>
          </Card>
        )}

      </div>
    </main>
  );
}
