import React from "react";
import { getDoctorById } from "@/services/doctor.services";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CalendarDays, Star, MapPin, Building2, GraduationCap, Stethoscope, Clock, ShieldCheck, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

export async function generateMetadata(props: { params: Promise<{ id: string }> }) {
  try {
    const params = await props.params;
    const res = await getDoctorById(params.id);
    const doctor = res.data;
    return {
      title: `${doctor.name} | Doctorly`,
      description: doctor.designation,
    };
  } catch {
    return { title: "Doctor Not Found | Doctorly" };
  }
}

export default async function DoctorDetailsPage(props: { params: Promise<{ id: string }> }) {
  let doctor = null;
  try {
    const params = await props.params;
    const res = await getDoctorById(params.id);
    doctor = res.data;
  } catch (error) {
    console.error(error);
  }

  if (!doctor) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-muted/20 pb-16 pt-8">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        
        {/* Back Button */}
        <Link href="/doctors" className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
          <ArrowLeft className="size-4" />
          Back to Doctors
        </Link>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          
          {/* Left Column - Doctor Profile Card */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24 overflow-hidden shadow-lg border-border/60">
              <div className="h-24 bg-gradient-to-br from-doctorly-primary/80 to-doctorly-primary" />
              <div className="relative px-6 pb-6 pt-0 text-center">
                <Avatar className="mx-auto -mt-12 size-24 border-4 border-background shadow-md">
                  <AvatarImage src={doctor.profilePhoto || undefined} alt={doctor.name} />
                  <AvatarFallback className="bg-doctorly-primary/10 text-2xl font-bold text-doctorly-primary">
                    {doctor.name.slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>

                <h1 className="mt-4 text-2xl font-bold">{doctor.name}</h1>
                <p className="mt-1 text-sm font-medium text-doctorly-primary">{doctor.designation}</p>
                
                <div className="mt-4 flex items-center justify-center gap-1 text-sm font-semibold text-amber-500">
                  <Star className="size-4 fill-amber-500" />
                  <span>{doctor.averageRating.toFixed(1)}</span>
                  <span className="text-muted-foreground ml-1 font-normal">(Reviews)</span>
                </div>

                <div className="mt-6 flex flex-col gap-2 rounded-xl bg-muted/40 p-4 text-sm text-left">
                  <div className="flex items-start gap-3">
                    <Stethoscope className="size-4 shrink-0 text-muted-foreground mt-0.5" />
                    <div>
                      <span className="block font-medium text-foreground">Specialties</span>
                      <span className="text-muted-foreground">
                        {doctor.specialties?.map(s => s.specialty?.title).join(", ") || "General"}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <GraduationCap className="size-4 shrink-0 text-muted-foreground mt-0.5" />
                    <div>
                      <span className="block font-medium text-foreground">Qualification</span>
                      <span className="text-muted-foreground">{doctor.qualification}</span>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Clock className="size-4 shrink-0 text-muted-foreground mt-0.5" />
                    <div>
                      <span className="block font-medium text-foreground">Experience</span>
                      <span className="text-muted-foreground">{doctor.experience} Years+</span>
                    </div>
                  </div>
                </div>

                <div className="mt-6">
                  <p className="text-sm text-muted-foreground mb-1">Consultation Fee</p>
                  <p className="text-3xl font-extrabold text-foreground">৳ {doctor.appointmentFee}</p>
                </div>

                <Button asChild className="mt-6 w-full rounded-full bg-doctorly-primary text-white shadow-lg shadow-doctorly-primary/20 hover:bg-doctorly-primary/90" size="lg">
                  <Link href={`/book?doctorId=${doctor.id}`}>
                    <CalendarDays className="mr-2 size-5" />
                    Book Consultation
                  </Link>
                </Button>
              </div>
            </Card>
          </div>

          {/* Right Column - Details */}
          <div className="space-y-6 lg:col-span-2">
            
            {/* About Card */}
            <Card className="border-border/60 shadow-sm">
              <CardHeader>
                <CardTitle className="text-xl">About {doctor.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="leading-relaxed text-muted-foreground">
                  {doctor.name} is a highly experienced healthcare professional specializing in {doctor.specialties?.map(s => s.specialty?.title).join(", ") || "General Medicine"}. 
                  With over {doctor.experience} years of clinical experience, they are currently working at {doctor.currentWorkingPlace}. 
                  Committed to providing the best patient care, {doctor.name} ensures a comprehensive and compassionate approach to medical treatment.
                </p>
              </CardContent>
            </Card>

            {/* Location Card */}
            <Card className="border-border/60 shadow-sm">
              <CardHeader>
                <CardTitle className="text-xl flex items-center gap-2">
                  <MapPin className="size-5 text-doctorly-primary" />
                  Clinic & Location
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-4 rounded-xl border border-border/50 bg-muted/20 p-4">
                  <div className="rounded-full bg-doctorly-primary/10 p-3 text-doctorly-primary">
                    <Building2 className="size-6" />
                  </div>
                  <div>
                    <h4 className="font-semibold">{doctor.currentWorkingPlace}</h4>
                    <p className="mt-1 text-sm text-muted-foreground">{doctor.address || "Address not provided"}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Verifications Card */}
            <Card className="border-border/60 shadow-sm">
              <CardHeader>
                <CardTitle className="text-xl flex items-center gap-2">
                  <ShieldCheck className="size-5 text-green-600" />
                  Verifications
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col gap-3">
                  <div className="flex items-center gap-3 text-sm font-medium text-foreground">
                    <ShieldCheck className="size-4 text-green-600" />
                    Medical License Verified (Reg: {doctor.registrationNumber})
                  </div>
                  <div className="flex items-center gap-3 text-sm font-medium text-foreground">
                    <ShieldCheck className="size-4 text-green-600" />
                    Identity Verified
                  </div>
                </div>
              </CardContent>
            </Card>

          </div>
        </div>
      </div>
    </main>
  );
}
