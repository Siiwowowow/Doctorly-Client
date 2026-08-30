"use client";

import React, { useEffect, useState } from "react";
import { useAuth } from "@/providers/AuthProvider";
import { useRouter, useSearchParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Loader2, CalendarDays, AlertCircle, Clock, ShieldCheck, ArrowLeft, Stethoscope, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { getDoctorById } from "@/services/doctor.services";
import { getDoctorSchedulesByDoctorId } from "@/services/doctorSchedule.services";
import { createAppointment } from "@/services/appointment.services";
import { createCheckoutSession } from "@/services/payment.services";
import { Doctor, DoctorSchedule } from "@/types/api.types";
import { toast } from "sonner";
import { format } from "date-fns";

export default function BookConsultationPage() {
  const { isAuthenticated, user } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const doctorId = searchParams.get("doctorId");
  const preselectedScheduleId = searchParams.get("scheduleId");
  
  const [loading, setLoading] = useState(true);
  const [doctor, setDoctor] = useState<Doctor | null>(null);
  const [schedules, setSchedules] = useState<DoctorSchedule[]>([]);
  const [selectedScheduleId, setSelectedScheduleId] = useState<string | null>(preselectedScheduleId || null);
  const [isBooking, setIsBooking] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      if (!doctorId) {
        setLoading(false);
        return;
      }
      try {
        setErrorMsg(null);
        const [doctorRes, scheduleRes] = await Promise.all([
          getDoctorById(doctorId),
          getDoctorSchedulesByDoctorId(doctorId, { isBooked: false }).catch(() => ({ data: [] as DoctorSchedule[] }))
        ]);
        
        if (doctorRes.data) {
          setDoctor(doctorRes.data);
          setSchedules(scheduleRes.data || []);
          if (preselectedScheduleId) {
            setSelectedScheduleId(preselectedScheduleId);
          }
        } else {
          setErrorMsg("The selected doctor is currently inactive, unverified, or not accepting online consultations.");
        }
      } catch (err: unknown) {
        setErrorMsg(err instanceof Error ? err.message : "Doctor is currently inactive or not verified for public bookings.");
      } finally {
        setLoading(false);
      }
    }
    
    const timer = setTimeout(() => {
      if (isAuthenticated) {
        fetchData();
      } else {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [doctorId, preselectedScheduleId, isAuthenticated]);

  const handleBook = async () => {
    if (!selectedScheduleId || !doctorId) return;
    setIsBooking(true);
    try {
      // 1. Create Appointment
      const aptRes = await createAppointment({ doctorId, scheduleId: selectedScheduleId });
      toast.success("Consultation booked successfully!");
      
      // 2. Initiate Payment
      try {
        const paymentRes = await createCheckoutSession(aptRes.data.id);
        if (paymentRes.data?.paymentUrl) {
          window.location.href = paymentRes.data.paymentUrl;
        } else {
          router.push("/user/appointments");
        }
      } catch {
        toast.error("Booking confirmed! Please complete payment from your appointments tab.");
        router.push("/user/appointments");
      }
    } catch (error: unknown) {
      toast.error(error instanceof Error ? error.message : "Failed to book appointment.");
      setIsBooking(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-muted/20">
        <Loader2 className="size-10 animate-spin text-doctorly-primary" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-muted/20 px-4">
        <Card className="w-full max-w-md shadow-lg border-border">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex size-12 items-center justify-center rounded-full bg-doctorly-primary/10 text-doctorly-primary">
              <AlertCircle className="size-6" />
            </div>
            <CardTitle className="text-lg">Sign in to Book</CardTitle>
            <CardDescription className="text-xs">
              You must be logged in as a patient to book a consultation.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            <Button asChild className="w-full bg-doctorly-primary text-white hover:bg-doctorly-primary/90 text-xs">
              <Link href={`/login?callbackUrl=/book${doctorId ? `?doctorId=${doctorId}` : ""}`}>
                Sign In / Register
              </Link>
            </Button>
            <Button asChild variant="outline" className="w-full text-xs">
              <Link href="/doctors">Back to Doctors</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (user?.role !== "PATIENT") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-muted/20 px-4">
        <Card className="w-full max-w-md shadow-lg border-destructive/30">
          <CardHeader className="text-center text-destructive">
            <AlertCircle className="mx-auto mb-3 size-10" />
            <CardTitle className="text-lg">Patient Account Required</CardTitle>
            <CardDescription className="text-foreground text-xs">
              Only registered patient accounts can book doctor appointments. You are currently signed in as {user?.role}.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild className="w-full text-xs">
              <Link href="/">Return to Home</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const profileImg = doctor?.profilePhoto || doctor?.user?.image || undefined;
  const initials = doctor?.name
    ? doctor.name
        .replace(/^Dr.?s*/i, "")
        .split(" ")
        .map((n) => n[0])
        .join("")
        .slice(0, 2)
        .toUpperCase()
    : "DR";

  const primarySpecialty = doctor?.specialties?.[0]?.specialty?.title || "Specialist";

  return (
    <main className="min-h-screen bg-muted/20 pb-20 pt-8">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        
        <div className="mb-6 flex items-center justify-between">
          <Link 
            href="/doctors" 
            className="inline-flex items-center gap-2 text-xs font-semibold text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="size-4" />
            Back to Doctors
          </Link>
        </div>

        <Card className="shadow-sm border-border bg-card">
          <CardHeader className="pb-4 border-b border-border/50">
            <div className="flex items-center gap-2">
              <CalendarDays className="size-5 text-doctorly-primary" />
              <div>
                <CardTitle className="text-xl font-bold">Book Video Consultation</CardTitle>
                <CardDescription className="text-xs">
                  Select your preferred consultation time slot with your verified specialist.
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          
          <CardContent className="p-6">
            {!doctorId ? (
              <div className="text-center py-10">
                <Stethoscope className="size-10 mx-auto text-muted-foreground mb-3" />
                <p className="text-sm font-semibold text-foreground">No Doctor Selected</p>
                <p className="text-xs text-muted-foreground mt-1 mb-5">Please browse our directory and select a verified doctor to begin booking.</p>
                <Button asChild className="text-xs">
                  <Link href="/doctors">Browse Verified Doctors</Link>
                </Button>
              </div>
            ) : errorMsg || !doctor ? (
              <div className="text-center py-10">
                <div className="size-12 rounded-full bg-rose-500/10 text-rose-600 flex items-center justify-center mx-auto mb-3">
                  <AlertCircle className="size-6" />
                </div>
                <h3 className="text-base font-bold text-foreground">Doctor Unavailable or Not Verified</h3>
                <p className="text-xs text-muted-foreground mt-1.5 max-w-md mx-auto mb-6">
                  {errorMsg || "The doctor you are attempting to book is currently inactive, unverified, or not accepting online consultations."}
                </p>
                <Button asChild variant="outline" className="text-xs">
                  <Link href="/doctors">
                    Explore Available Specialists
                  </Link>
                </Button>
              </div>
            ) : (
              <div className="space-y-6">
                
                {/* Doctor Verification Header Summary */}
                <div className="flex items-start sm:items-center justify-between gap-4 rounded-xl border border-border/60 bg-muted/20 p-4">
                  <div className="flex items-center gap-3.5">
                    <Avatar className="size-14 border-2 border-background shadow-xs">
                      <AvatarImage src={profileImg} alt={doctor.name} className="object-cover" />
                      <AvatarFallback className="bg-doctorly-primary/10 text-base font-bold text-doctorly-primary">
                        {initials}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-base text-foreground">{doctor.name}</h3>
                        <Badge variant="outline" className="bg-emerald-500/10 text-emerald-600 border-emerald-500/30 text-[10px] py-0">
                          <ShieldCheck className="size-3 mr-1" /> Verified
                        </Badge>
                      </div>
                      <p className="text-xs font-semibold text-doctorly-primary mt-0.5">{doctor.designation || primarySpecialty}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{doctor.qualification}</p>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="text-[11px] text-muted-foreground block">Consultation Fee</span>
                    <span className="text-lg font-bold text-foreground font-mono">৳{doctor.appointmentFee ?? 0}</span>
                  </div>
                </div>

                {/* Available Slot Selection */}
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3 flex items-center gap-1.5">
                    <Clock className="size-3.5" /> Available Consultation Slots
                  </h4>

                  {schedules.length === 0 ? (
                    <div className="rounded-xl border border-dashed border-border p-8 text-center text-muted-foreground bg-muted/10">
                      <Clock className="size-8 mx-auto text-muted-foreground/60 mb-2" />
                      <p className="text-xs font-semibold text-foreground">No open consultation slots available</p>
                      <p className="text-[11px] text-muted-foreground mt-1">
                        Please check back soon or consult another verified specialist in {primarySpecialty}.
                      </p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {schedules.map((schedule) => {
                        const isSelected = selectedScheduleId === schedule.scheduleId;
                        const start = schedule.schedule?.startDateTime ? new Date(schedule.schedule.startDateTime) : null;
                        const end = schedule.schedule?.endDateTime ? new Date(schedule.schedule.endDateTime) : null;

                        return (
                          <button
                            key={schedule.scheduleId}
                            type="button"
                            onClick={() => setSelectedScheduleId(schedule.scheduleId)}
                            className={`flex flex-col text-left p-3.5 rounded-xl border transition-all ${
                              isSelected 
                                ? "border-doctorly-primary bg-doctorly-primary/10 ring-1 ring-doctorly-primary" 
                                : "border-border hover:border-doctorly-primary/50 hover:bg-muted/40"
                            }`}
                          >
                            <div className="flex items-center justify-between w-full">
                              <span className="text-xs font-bold text-foreground">
                                {start ? format(start, "EEEE, MMM d, yyyy") : "Consultation Slot"}
                              </span>
                              {isSelected && <CheckCircle2 className="size-4 text-doctorly-primary shrink-0" />}
                            </div>
                            <span className="text-xs text-muted-foreground mt-1 font-mono">
                              {start ? format(start, "h:mm a") : ""} - {end ? format(end, "h:mm a") : ""}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* Confirm Action */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-border">
                  <div className="text-xs text-muted-foreground">
                    {selectedScheduleId ? (
                      <span className="text-emerald-600 font-medium flex items-center gap-1">
                        <CheckCircle2 className="size-3.5" /> Slot selected. Ready for checkout.
                      </span>
                    ) : (
                      <span>Please pick an available time slot above to proceed.</span>
                    )}
                  </div>

                  <Button 
                    onClick={handleBook} 
                    disabled={!selectedScheduleId || isBooking}
                    className="w-full sm:w-auto text-xs px-6 shadow-sm"
                  >
                    {isBooking && <Loader2 className="mr-2 size-3.5 animate-spin" />}
                    Confirm Booking & Pay (৳{doctor.appointmentFee ?? 0})
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
