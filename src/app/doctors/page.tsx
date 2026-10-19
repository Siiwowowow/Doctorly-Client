/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import Link from "next/link";
import Image from "next/image";
import { 
  Star,
  Heart,
  Video,
  Building2, 
  Stethoscope, 
  Search, 
  ShieldCheck, 
  GraduationCap, 
  Clock, 
  Calendar, 
  ChevronLeft,
  ChevronRight
} from "lucide-react";

import { getAllDoctors } from "@/services/doctor.services";
import { getAllSpecialties } from "@/services/specialty.services";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import DoctorFilters from "@/components/doctors/DoctorFilters";
import { Doctor, Specialty } from "@/types/api.types";
import Footer from "@/components/landing/Footer";

export const metadata = {
  title: "Find Verified Doctors | Doctorly",
  description: "Discover and consult BMDC-verified doctors and clinical specialists across Bangladesh.",
};

export const revalidate = 60;

export default async function DoctorsPage(props: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const searchParams = await props.searchParams;
  const query = typeof searchParams.query === "string" ? searchParams.query : typeof searchParams.searchTerm === "string" ? searchParams.searchTerm : "";
  const specialty = typeof searchParams.specialty === "string" ? searchParams.specialty : "";
  const sortBy = typeof searchParams.sortBy === "string" ? searchParams.sortBy : undefined;
  const sortOrder = typeof searchParams.sortOrder === "string" ? (searchParams.sortOrder as "asc" | "desc") : undefined;
  const page = Number(searchParams.page) || 1;
  const limit = Number(searchParams.limit) || 12;

  let doctors: Doctor[] = [];
  let specialties: Specialty[] = [];
  let meta: any = null;

  try {
    const [doctorsRes, specialtiesRes] = await Promise.all([
      getAllDoctors({ query, specialty, page, limit, sortBy, sortOrder }),
      getAllSpecialties().catch(() => ({ data: [] as Specialty[] }))
    ]);

    doctors = doctorsRes.data || [];
    meta = doctorsRes.meta;
    specialties = specialtiesRes.data || [];
  } catch (error) {
    console.error("Failed to load doctors discovery data:", error);
  }

  const totalDoctors = meta?.total ?? doctors.length;
  const totalPages = meta?.totalPage ?? Math.ceil(totalDoctors / limit);

  return (
    <main className="min-h-screen overflow-hidden bg-[#f5faff] pb-20 pt-0 text-slate-900">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <section className="relative left-1/2 mb-8 w-screen -translate-x-1/2 overflow-hidden border-y border-white/80 bg-[#eaf7ff]">
          <Image
            src="/doctorly-assest/doctors-page-banner.webp"
            alt="Doctorly expert care team"
            width={2048}
            height={768}
            priority
            sizes="(max-width: 1280px) 100vw, 1280px"
            className="block h-auto w-full select-none"
          />
        </section>

        {/* Dynamic Filter Component */}
        <DoctorFilters specialties={specialties} />

        {/* Active Results Counter */}
        <div className="mb-6 flex items-center justify-between text-xs text-slate-500">
          <div>
            Showing <span className="font-semibold text-foreground">{doctors.length}</span> of <span className="font-semibold text-foreground">{totalDoctors}</span> verified doctors
            {specialty && (
              <span> in <span className="font-semibold text-doctorly-primary">{specialty}</span></span>
            )}
            {query && (
              <span> matching &ldquo;<span className="font-semibold text-doctorly-primary">{query}</span>&rdquo;</span>
            )}
          </div>
          {totalPages > 1 && (
            <div>Page {page} of {totalPages}</div>
          )}
        </div>

        {/* Doctor Grid */}
        {doctors.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center bg-card rounded-2xl border border-dashed border-border p-8">
            <div className="rounded-full bg-muted/60 p-5 mb-4">
              <Search className="size-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-bold text-foreground">No verified doctors found</h3>
            <p className="mt-1.5 text-xs text-muted-foreground max-w-md">
              We couldn&apos;t find any verified practitioners matching your search criteria. Try broadening your keywords or clearing selected filters.
            </p>
            <Button asChild variant="outline" size="sm" className="mt-5 text-xs gap-1.5">
              <Link href="/doctors">
                Reset All Filters
              </Link>
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {doctors.map((doctor) => {
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

              return (
                <Card 
                  key={doctor.id} 
                  className="group relative flex h-full flex-col overflow-hidden rounded-[1.5rem] border border-slate-200/80 bg-gradient-to-b from-white to-slate-50/70 shadow-[0_12px_35px_-26px_rgba(15,61,112,0.45)] transition-all duration-300 hover:-translate-y-1 hover:border-doctorly-primary/40 hover:shadow-[0_22px_42px_-25px_rgba(29,99,237,0.35)]"
                >
                  <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-sky-400 via-blue-600 to-cyan-400" />
                  <div className="relative aspect-[1.15/1] overflow-hidden bg-gradient-to-br from-sky-50 to-blue-100">
                    <Avatar className="size-full rounded-none border-0 shadow-none">
                      <AvatarImage src={profileImg} alt={doctor.name} className="object-cover object-top" />
                      <AvatarFallback className="rounded-none bg-doctorly-primary/10 text-3xl font-bold text-doctorly-primary">
                        {initials}
                      </AvatarFallback>
                    </Avatar>
                    <span className="absolute right-3 top-3 flex size-8 items-center justify-center rounded-full border border-white/80 bg-white/90 text-slate-400 shadow-sm">
                      <Heart className="size-4" />
                    </span>
                    <span className="absolute bottom-3 left-3 inline-flex items-center gap-1 rounded-full bg-white/95 px-2 py-1 text-[9px] font-semibold text-emerald-600 shadow-sm">
                      <span className="size-1.5 rounded-full bg-emerald-500" />
                      Available Today
                    </span>
                  </div>

                  <CardHeader className="p-4 pb-2">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <Link href={`/doctors/${doctor.id}`} className="block transition-colors group-hover:text-doctorly-primary">
                          <CardTitle className="line-clamp-1 text-sm font-bold text-foreground sm:text-base">
                            {doctor.name}
                          </CardTitle>
                        </Link>
                        <p className="mt-0.5 line-clamp-1 text-[10px] font-semibold text-doctorly-primary sm:text-xs">
                          {doctor.designation || primarySpecialty}
                        </p>
                      </div>
                      <div className="flex shrink-0 items-center gap-1 rounded-full bg-amber-50 px-2 py-1 text-[10px] font-bold text-amber-600">
                        <Star className="size-3 fill-amber-400 text-amber-400" />
                        {Number(doctor.averageRating || 5.0).toFixed(1)}
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="flex-1 space-y-3 p-4 pt-0">
                    {/* Specialty Pill */}
                    <div className="flex flex-wrap gap-1">
                      <Badge variant="secondary" className="text-[10px] font-medium py-0">
                        <Stethoscope className="size-2.5 mr-1" />
                        {primarySpecialty}
                      </Badge>
                      {specialtyTitles.length > 1 && (
                        <Badge variant="outline" className="text-[10px] text-muted-foreground py-0">
                          +{specialtyTitles.length - 1} more
                        </Badge>
                      )}
                    </div>

                    {/* Qualifications & Workplace */}
                    <div className="space-y-1 text-xs text-muted-foreground pt-1 border-t border-border/50">
                      {doctor.qualification && (
                        <div className="flex items-center gap-1.5 truncate">
                          <GraduationCap className="size-3.5 shrink-0 text-muted-foreground/80" />
                          <span className="truncate">{doctor.qualification}</span>
                        </div>
                      )}
                      {doctor.currentWorkingPlace && (
                        <div className="flex items-center gap-1.5 truncate">
                          <Building2 className="size-3.5 shrink-0 text-muted-foreground/80" />
                          <span className="truncate">{doctor.currentWorkingPlace}</span>
                        </div>
                      )}
                      {doctor.experience !== undefined && doctor.experience !== null && (
                        <div className="flex items-center gap-1.5">
                          <Clock className="size-3.5 shrink-0 text-muted-foreground/80" />
                          <span>{doctor.experience} Years of Practice</span>
                        </div>
                      )}
                    </div>

                    {/* Consultation Fee */}
                    <div className="pt-2 flex items-baseline justify-between border-t border-border/50">
                      <span className="inline-flex items-center gap-1 text-[11px] text-muted-foreground">
                        <Video className="size-3 text-doctorly-primary" />
                        Video Consultation
                      </span>
                      <span className="text-sm font-bold text-foreground font-mono">
                        ৳{doctor.appointmentFee ?? 0}
                      </span>
                    </div>
                  </CardContent>

                  <CardFooter className="flex flex-col gap-2 p-4 pt-0">
                    <Button asChild size="sm" className="h-9 w-full rounded-lg text-[11px] font-bold shadow-sm">
                      <Link href={`/book?doctorId=${doctor.id}`}>
                        <Calendar className="mr-1.5 size-3.5" />
                        Book Appointment
                      </Link>
                    </Button>
                    <Button asChild variant="outline" size="sm" className="h-8 w-full rounded-lg border-slate-200 text-[10px] font-semibold">
                      <Link href={`/doctors/${doctor.id}`}>View Profile</Link>
                    </Button>
                  </CardFooter>
                </Card>
              );
            })}
          </div>
        )}

        <section className="mt-10 overflow-hidden rounded-[1.75rem] border border-sky-100 bg-gradient-to-r from-[#e5f6ff] via-white to-[#dff4ff]">
          <div className="grid items-stretch md:grid-cols-[0.9fr_1.1fr]">
            <div className="relative min-h-[190px] overflow-hidden bg-sky-100 sm:min-h-[230px]">
              <Image
                src="/doctorly-assest/bangladeshi-doctor-consultation.webp"
                alt="Doctorly doctors caring for patients"
                fill
                sizes="(max-width: 768px) 100vw, 40vw"
                className="object-cover object-center"
              />
            </div>
            <div className="flex flex-col justify-center p-6 sm:p-8 lg:p-10">
              <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-doctorly-primary">
                Doctorly Care Network
              </span>
              <h2 className="mt-2 max-w-lg text-2xl font-black leading-tight tracking-[-0.03em] text-slate-900 sm:text-3xl">
                Join 500,000+ patients who trust Doctorly
              </h2>
              <p className="mt-2 max-w-xl text-xs leading-relaxed text-slate-600 sm:text-sm">
                Find verified specialists, get personalized care, and take your next confident step toward better health.
              </p>
              <div className="mt-4 flex flex-wrap gap-x-4 gap-y-2 text-[10px] font-semibold text-slate-600 sm:text-xs">
                <span className="inline-flex items-center gap-1.5"><ShieldCheck className="size-3.5 text-emerald-500" /> Verified doctors</span>
                <span className="inline-flex items-center gap-1.5"><ShieldCheck className="size-3.5 text-emerald-500" /> Secure consultations</span>
              </div>
              <Link href="/book" className="mt-5 inline-flex w-fit items-center gap-2 rounded-lg bg-doctorly-primary px-5 py-2.5 text-xs font-bold text-white shadow-sm transition hover:bg-blue-700">
                Book Appointment
                <Calendar className="size-3.5" />
              </Link>
            </div>
          </div>
        </section>

        {/* Pagination Navigation */}
        {totalPages > 1 && (
          <div className="mt-12 flex items-center justify-center gap-2">
            {page > 1 ? (
              <Button asChild variant="outline" size="sm" className="gap-1 text-xs">
                <Link href={`/doctors?query=${encodeURIComponent(query)}&specialty=${encodeURIComponent(specialty)}&page=${page - 1}`}>
                  <ChevronLeft className="size-4" />
                  Previous
                </Link>
              </Button>
            ) : (
              <Button variant="outline" size="sm" disabled className="gap-1 text-xs">
                <ChevronLeft className="size-4" />
                Previous
              </Button>
            )}

            <span className="px-3 text-xs font-medium text-muted-foreground">
              Page {page} of {totalPages}
            </span>

            {page < totalPages ? (
              <Button asChild variant="outline" size="sm" className="gap-1 text-xs">
                <Link href={`/doctors?query=${encodeURIComponent(query)}&specialty=${encodeURIComponent(specialty)}&page=${page + 1}`}>
                  Next
                  <ChevronRight className="size-4" />
                </Link>
              </Button>
            ) : (
              <Button variant="outline" size="sm" disabled className="gap-1 text-xs">
                Next
                <ChevronRight className="size-4" />
              </Button>
            )}
          </div>
        )}

      </div>
      <Footer />
    </main>
  );
}
