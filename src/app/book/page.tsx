"use client";

import React, { useEffect, useState } from "react";
import { useAuth } from "@/providers/AuthProvider";
import { useRouter, useSearchParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, CalendarDays, AlertCircle, Clock } from "lucide-react";
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
  
  const [loading, setLoading] = useState(true);
  const [doctor, setDoctor] = useState<Doctor | null>(null);
  const [schedules, setSchedules] = useState<DoctorSchedule[]>([]);
  const [selectedScheduleId, setSelectedScheduleId] = useState<string | null>(null);
  const [isBooking, setIsBooking] = useState(false);

  useEffect(() => {
    async function fetchData() {
      if (!doctorId) {
        setLoading(false);
        return;
      }
      try {
        const [doctorRes, scheduleRes] = await Promise.all([
          getDoctorById(doctorId),
          getDoctorSchedulesByDoctorId(doctorId, { isBooked: false })
        ]);
        setDoctor(doctorRes.data);
        setSchedules(scheduleRes.data || []);
      } catch (error) {
        toast.error("Failed to load booking details.");
      } finally {
        setLoading(false);
      }
    }
    
    // Auth check timeout to avoid hydration mismatch
    const timer = setTimeout(() => {
      if (isAuthenticated) {
        fetchData();
      } else {
        setLoading(false);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [doctorId, isAuthenticated]);

  const handleBook = async () => {
    if (!selectedScheduleId || !doctorId) return;
    setIsBooking(true);
    try {
      // 1. Create Appointment
      const aptRes = await createAppointment({ doctorId, scheduleId: selectedScheduleId });
      toast.success("Appointment booked successfully!");
      
      // 2. Initiate Payment
      try {
        const paymentRes = await createCheckoutSession(aptRes.data.id);
        if (paymentRes.data?.paymentUrl) {
          window.location.href = paymentRes.data.paymentUrl;
        } else {
          router.push("/user/appointments");
        }
      } catch (paymentError) {
        toast.error("Booking successful, but failed to initiate payment.");
        router.push("/user/appointments");
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to book appointment.");
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
        <Card className="w-full max-w-md shadow-lg">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex size-12 items-center justify-center rounded-full bg-doctorly-primary/10 text-doctorly-primary">
              <AlertCircle className="size-6" />
            </div>
            <CardTitle>Sign in to Book</CardTitle>
            <CardDescription>
              You must be logged in as a patient to book a consultation.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <Button asChild className="w-full bg-doctorly-primary text-white hover:bg-doctorly-primary/90">
              <Link href={`/login?callbackUrl=/book${doctorId ? `?doctorId=${doctorId}` : ''}`}>
                Sign In / Register
              </Link>
            </Button>
            <Button asChild variant="outline" className="w-full">
              <Link href="/doctors">Cancel</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (user?.role !== "PATIENT") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-muted/20 px-4">
        <Card className="w-full max-w-md shadow-lg border-destructive/50">
          <CardHeader className="text-center text-destructive">
            <AlertCircle className="mx-auto mb-4 size-10" />
            <CardTitle>Access Denied</CardTitle>
            <CardDescription className="text-foreground">
              Only patients can book consultations. You are logged in as {user?.role}.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild className="w-full">
              <Link href="/">Return to Home</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-muted/20 pb-16 pt-8">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <Card className="shadow-md">
          <CardHeader>
            <CardTitle className="text-2xl flex items-center gap-2">
              <CalendarDays className="size-6 text-doctorly-primary" />
              Book Consultation
            </CardTitle>
            <CardDescription>
              Schedule an appointment with your preferred healthcare professional.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {!doctorId ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground mb-4">Please select a doctor first to book a consultation.</p>
                <Button asChild className="bg-doctorly-primary text-white hover:bg-doctorly-primary/90">
                  <Link href="/doctors">Find a Doctor</Link>
                </Button>
              </div>
            ) : doctor ? (
              <div className="space-y-6">
                <div className="flex items-center gap-4 rounded-xl border border-border/50 bg-muted/30 p-4">
                  <div className="size-16 rounded-full bg-doctorly-primary/10 flex items-center justify-center overflow-hidden">
                    {doctor.profilePhoto ? (
                      <img src={doctor.profilePhoto} alt={doctor.name} className="size-full object-cover" />
                    ) : (
                      <span className="text-doctorly-primary font-bold text-xl">{doctor.name.slice(0, 2).toUpperCase()}</span>
                    )}
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">{doctor.name}</h3>
                    <p className="text-doctorly-primary text-sm">{doctor.designation}</p>
                    <p className="text-muted-foreground text-sm font-medium mt-1">Fee: ৳ {doctor.appointmentFee}</p>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-foreground mb-3 flex items-center gap-2">
                    <Clock className="size-4" /> Available Slots
                  </h4>
                  {schedules.length === 0 ? (
                    <div className="rounded-lg border border-dashed p-6 text-center text-muted-foreground">
                      No available slots for this doctor at the moment.
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {schedules.map((schedule) => {
                        const isSelected = selectedScheduleId === schedule.scheduleId;
                        const start = new Date(schedule.schedule?.startDateTime || "");
                        const end = new Date(schedule.schedule?.endDateTime || "");
                        return (
                          <button
                            key={schedule.scheduleId}
                            onClick={() => setSelectedScheduleId(schedule.scheduleId)}
                            className={`flex flex-col text-left p-3 rounded-xl border transition-all ${
                              isSelected 
                                ? "border-doctorly-primary bg-doctorly-primary/10 ring-1 ring-doctorly-primary" 
                                : "border-border hover:border-doctorly-primary/50 hover:bg-muted/50"
                            }`}
                          >
                            <span className="font-medium">{format(start, "MMM d, yyyy")}</span>
                            <span className="text-sm text-muted-foreground mt-1">
                              {format(start, "h:mm a")} - {format(end, "h:mm a")}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>

                <div className="flex justify-end pt-4 border-t">
                  <Button 
                    onClick={handleBook} 
                    disabled={!selectedScheduleId || isBooking}
                    className="w-full sm:w-auto bg-doctorly-primary hover:bg-doctorly-primary/90 text-white"
                  >
                    {isBooking && <Loader2 className="mr-2 size-4 animate-spin" />}
                    Confirm Booking & Pay
                  </Button>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-muted-foreground mb-4">Doctor not found.</p>
                <Button asChild className="bg-doctorly-primary text-white">
                  <Link href="/doctors">Browse Doctors</Link>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
