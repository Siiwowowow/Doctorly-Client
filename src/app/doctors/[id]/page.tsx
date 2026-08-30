/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { format } from "date-fns";
import { 
  Star, 
  Building2, 
  GraduationCap, 
  Stethoscope, 
  Clock, 
  ShieldCheck, 
  ArrowLeft, 
  CalendarDays, 
  Award, 
  MessageSquare
} from "lucide-react";

import { getDoctorById } from "@/services/doctor.services";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Doctor } from "@/types/api.types";

export async function generateMetadata(props: { params: Promise<{ id: string }> }) {
  try {
    const params = await props.params;
    const res = await getDoctorById(params.id);
    const doctor = res.data;
    const primarySpecialty = doctor.specialties?.[0]?.specialty?.title || "Specialist";
    return {
      title: `${doctor.name} | ${primarySpecialty} | Doctorly`,
      description: `Book consultation with ${doctor.name}, ${doctor.designation || primarySpecialty}. Qualifications: ${doctor.qualification || "MBBS"}.`,
    };
  } catch {
    return { title: "Verified Doctor | Doctorly" };
  }
}

export default async function DoctorDetailsPage(props: { params: Promise<{ id: string }> }) {
  let doctor: Doctor | null = null;
  try {
    const params = await props.params;
    const res = await getDoctorById(params.id);
    doctor = res.data;
  } catch (error) {
    console.error("Doctor lookup error:", error);
  }

  if (!doctor) {
    notFound();
  }

  const profileImg = doctor.profilePhoto || doctor.user?.image || undefined;
  const initials = doctor.name
    ? doctor.name
        .replace(/^Dr.?s*/i, "")
        .split(" ")
        .map((n) => n[0])
        .join("")
        .slice(0, 2)
        .toUpperCase()
    : "DR";

  const specialtyTitles = doctor.specialties
    ?.map((s) => s.specialty?.title)
    .filter(Boolean) || [];
  const primarySpecialty = specialtyTitles[0] || "General Medicine";

  const availableSchedules = (doctor.doctorSchedules || []).filter((s) => !s.isBooked && s.schedule);
  const reviews = doctor.reviews || [];

  return (
    <main className="min-h-screen bg-muted/20 pb-20 pt-8">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        
        {/* Back Navigation Bar */}
        <div className="mb-6 flex items-center justify-between">
          <Link 
            href="/doctors" 
            className="inline-flex items-center gap-2 text-xs font-semibold text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="size-4" />
            Back to Verified Doctors
          </Link>
          <Badge 
            variant="outline" 
            className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30 text-xs px-2.5 py-1 font-semibold"
          >
            <ShieldCheck className="size-3.5 mr-1 text-emerald-500" />
            BMDC Verified Practitioner
          </Badge>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          
          {/* Left Column: Doctor Profile Overview Card */}
          <div className="lg:col-span-1 space-y-6">
            <Card className="sticky top-24 overflow-hidden shadow-xs border-border bg-card">
              <div className="h-28 bg-gradient-to-r from-doctorly-primary/90 via-doctorly-primary to-doctorly-primary/80" />
              <div className="relative px-6 pb-6 pt-0 text-center">
                
                {/* Profile Photo */}
                <Avatar className="mx-auto -mt-14 size-28 border-4 border-card shadow-md">
                  <AvatarImage src={profileImg} alt={doctor.name} className="object-cover" />
                  <AvatarFallback className="bg-doctorly-primary/10 text-2xl font-bold text-doctorly-primary">
                    {initials}
                  </AvatarFallback>
                </Avatar>

                {/* Name & Title */}
                <h1 className="mt-3.5 text-xl font-extrabold text-foreground">{doctor.name}</h1>
                <p className="mt-0.5 text-xs font-semibold text-doctorly-primary">
                  {doctor.designation || primarySpecialty}
                </p>

                {/* Rating Badge */}
                <div className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-amber-500/10 px-3 py-1 text-xs font-bold text-amber-600 dark:text-amber-400">
                  <Star className="size-3.5 fill-amber-500 text-amber-500" />
                  <span>{Number(doctor.averageRating || 5.0).toFixed(1)}</span>
                  <span className="text-muted-foreground font-normal">({reviews.length} {reviews.length === 1 ? "review" : "reviews"})</span>
                </div>

                {/* Quick Credentials Summary */}
                <div className="mt-6 flex flex-col gap-3 rounded-xl bg-muted/30 p-4 text-xs text-left border border-border/50">
                  <div className="flex items-start gap-2.5">
                    <Stethoscope className="size-4 shrink-0 text-doctorly-primary mt-0.5" />
                    <div>
                      <span className="block font-semibold text-foreground">Specialties</span>
                      <span className="text-muted-foreground">
                        {specialtyTitles.join(", ") || "General Medicine"}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5">
                    <GraduationCap className="size-4 shrink-0 text-doctorly-primary mt-0.5" />
                    <div>
                      <span className="block font-semibold text-foreground">Qualifications</span>
                      <span className="text-muted-foreground">{doctor.qualification || "MBBS"}</span>
                    </div>
                  </div>

                  {doctor.currentWorkingPlace && (
                    <div className="flex items-start gap-2.5">
                      <Building2 className="size-4 shrink-0 text-doctorly-primary mt-0.5" />
                      <div>
                        <span className="block font-semibold text-foreground">Current Workplace</span>
                        <span className="text-muted-foreground">{doctor.currentWorkingPlace}</span>
                      </div>
                    </div>
                  )}

                  {doctor.experience !== undefined && doctor.experience !== null && (
                    <div className="flex items-start gap-2.5">
                      <Clock className="size-4 shrink-0 text-doctorly-primary mt-0.5" />
                      <div>
                        <span className="block font-semibold text-foreground">Experience</span>
                        <span className="text-muted-foreground">{doctor.experience} Years of Clinical Practice</span>
                      </div>
                    </div>
                  )}

                  {doctor.registrationNumber && (
                    <div className="flex items-start gap-2.5">
                      <ShieldCheck className="size-4 shrink-0 text-emerald-500 mt-0.5" />
                      <div>
                        <span className="block font-semibold text-foreground">BMDC Reg. Status</span>
                        <span className="text-muted-foreground font-mono">Verified #{doctor.registrationNumber}</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Consultation Fee */}
                <div className="mt-6 pt-4 border-t border-border">
                  <p className="text-xs text-muted-foreground mb-1">Standard Consultation Fee</p>
                  <p className="text-2xl font-extrabold text-foreground font-mono">৳{doctor.appointmentFee ?? 0}</p>
                </div>

                {/* Primary Booking Trigger */}
                <div className="mt-6">
                  <Button asChild size="lg" className="w-full shadow-sm gap-2">
                    <Link href={`/book?doctorId=${doctor.id}`}>
                      <CalendarDays className="size-4" />
                      Book Video Consultation
                    </Link>
                  </Button>
                </div>

              </div>
            </Card>
          </div>

          {/* Right Column: Detailed Bio, Schedules & Reviews */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* 1. Professional Biography */}
            <Card className="border-border shadow-xs bg-card">
              <CardHeader className="pb-3 border-b border-border/50">
                <div className="flex items-center gap-2">
                  <Award className="size-4 text-doctorly-primary" />
                  <CardTitle className="text-base font-bold">About Dr. {doctor.name}</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">
                  {doctor.qualification ? `Dr. ${doctor.name} holds ${doctor.qualification}. ` : ""}
                  {doctor.experience ? `With over ${doctor.experience} years of clinical experience, Dr. ${doctor.name} provides expert diagnosis, medical consultation, and comprehensive patient care. ` : ""}
                  {doctor.currentWorkingPlace ? `Currently practicing at ${doctor.currentWorkingPlace}.` : ""}
                </p>

                <div className="mt-4 flex flex-wrap gap-2 pt-4 border-t border-border/50">
                  {specialtyTitles.map((spec, i) => (
                    <Badge key={i} variant="secondary" className="text-xs py-1 px-3">
                      <Stethoscope className="size-3 mr-1.5" />
                      {spec}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* 2. Available Consultation Schedules */}
            <Card className="border-border shadow-xs bg-card">
              <CardHeader className="pb-3 border-b border-border/50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CalendarDays className="size-4 text-doctorly-primary" />
                    <CardTitle className="text-base font-bold">Available Consultation Slots</CardTitle>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {availableSchedules.length} Available Slots
                  </Badge>
                </div>
                <CardDescription className="text-xs">
                  Select an available slot below to start your consultation booking.
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                {availableSchedules.length === 0 ? (
                  <div className="p-8 text-center border border-dashed border-border rounded-xl bg-muted/10">
                    <CalendarDays className="size-8 mx-auto text-muted-foreground mb-2" />
                    <p className="text-sm font-semibold text-foreground">No upcoming slots currently published</p>
                    <p className="text-xs text-muted-foreground mt-1 max-w-sm mx-auto">
                      Dr. {doctor.name} has not published open slots for the upcoming week. You can still initiate a booking request.
                    </p>
                    <Button asChild size="sm" variant="outline" className="mt-4 text-xs">
                      <Link href={`/book?doctorId=${doctor.id}`}>
                        Request Custom Schedule
                      </Link>
                    </Button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {availableSchedules.map((ds) => {
                      const start = ds.schedule?.startDateTime ? new Date(ds.schedule.startDateTime) : null;
                      const end = ds.schedule?.endDateTime ? new Date(ds.schedule.endDateTime) : null;

                      return (
                        <div 
                          key={ds.scheduleId}
                          className="p-3.5 rounded-xl border border-border bg-muted/20 hover:border-doctorly-primary/50 transition-colors flex items-center justify-between gap-3"
                        >
                          <div>
                            <p className="text-xs font-bold text-foreground">
                              {start ? format(start, "EEEE, MMM d, yyyy") : "Available Slot"}
                            </p>
                            <p className="text-[11px] text-muted-foreground mt-0.5 font-mono">
                              {start ? format(start, "h:mm a") : ""} - {end ? format(end, "h:mm a") : ""}
                            </p>
                          </div>

                          <Button asChild size="sm" className="h-8 text-xs px-3 shadow-xs">
                            <Link href={`/book?doctorId=${doctor.id}&scheduleId=${ds.scheduleId}`}>
                              Book Slot
                            </Link>
                          </Button>
                        </div>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* 3. Patient Reviews & Ratings */}
            <Card className="border-border shadow-xs bg-card">
              <CardHeader className="pb-3 border-b border-border/50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <MessageSquare className="size-4 text-doctorly-primary" />
                    <CardTitle className="text-base font-bold">Patient Reviews & Feedback</CardTitle>
                  </div>
                  <div className="flex items-center gap-1 text-xs font-semibold text-amber-500">
                    <Star className="size-3.5 fill-amber-500" />
                    <span>{Number(doctor.averageRating || 5.0).toFixed(1)} / 5.0</span>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                {reviews.length === 0 ? (
                  <div className="p-8 text-center border border-dashed border-border rounded-xl bg-muted/10">
                    <Star className="size-8 mx-auto text-amber-500/40 mb-2" />
                    <p className="text-sm font-semibold text-foreground">No patient reviews yet</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Be the first to consult with Dr. {doctor.name} and share your experience!
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {reviews.map((rev: any) => (
                      <div key={rev.id} className="p-4 rounded-xl border border-border bg-muted/20 space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2.5">
                            <Avatar className="size-8">
                              <AvatarImage src={rev.patient?.profilePhoto} alt={rev.patient?.name || "Patient"} />
                              <AvatarFallback className="bg-primary/10 text-xs font-bold text-primary">
                                {(rev.patient?.name || "PT").slice(0, 2).toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <span className="text-xs font-bold text-foreground">{rev.patient?.name || "Verified Patient"}</span>
                              <p className="text-[10px] text-muted-foreground">
                                {rev.createdAt ? format(new Date(rev.createdAt), "MMM d, yyyy") : ""}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-0.5">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <Star 
                                key={i} 
                                className={`size-3 ${i < (rev.rating || 5) ? "fill-amber-500 text-amber-500" : "text-muted-foreground/30"}`} 
                              />
                            ))}
                          </div>
                        </div>

                        {rev.comment && (
                          <p className="text-xs text-muted-foreground leading-relaxed pt-1">
                            &ldquo;{rev.comment}&rdquo;
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

          </div>
        </div>
      </div>
    </main>
  );
}
