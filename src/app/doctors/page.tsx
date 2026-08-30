/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import Link from "next/link";
import { 
  Star, 
  Building2, 
  Stethoscope, 
  Search, 
  ShieldCheck, 
  GraduationCap, 
  Clock, 
  Calendar, 
  Sparkles,
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

export const metadata = {
  title: "Find Verified Doctors | Doctorly",
  description: "Discover and consult BMDC-verified doctors and clinical specialists across Bangladesh.",
};

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
    <main className="min-h-screen bg-muted/20 pb-20 pt-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Hero / Header Section */}
        <div className="mb-10 text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-doctorly-primary/10 text-doctorly-primary text-xs font-semibold mb-3">
            <Sparkles className="size-3.5" />
            <span>BMDC Verified Practitioners Only</span>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
            Find the Right Doctor for You
          </h1>
          <p className="mt-3 text-base text-muted-foreground">
            Search from our verified network of licensed healthcare specialists across Bangladesh. Book video or in-person consultations in seconds.
          </p>
        </div>

        {/* Dynamic Filter Component */}
        <DoctorFilters specialties={specialties} />

        {/* Active Results Counter */}
        <div className="mb-6 flex items-center justify-between text-xs text-muted-foreground">
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
                  className="flex h-full flex-col overflow-hidden transition-all duration-200 hover:shadow-md hover:border-doctorly-primary/40 border-border bg-card group"
                >
                  <CardHeader className="p-5 pb-3">
                    <div className="flex items-start justify-between gap-3">
                      <Avatar className="size-16 border-2 border-background shadow-xs shrink-0">
                        <AvatarImage src={profileImg} alt={doctor.name} className="object-cover" />
                        <AvatarFallback className="bg-doctorly-primary/10 text-base font-bold text-doctorly-primary">
                          {initials}
                        </AvatarFallback>
                      </Avatar>

                      <div className="flex flex-col items-end gap-1.5">
                        <Badge 
                          variant="outline" 
                          className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30 text-[10px] font-semibold px-2 py-0.5"
                        >
                          <ShieldCheck className="size-3 mr-1 text-emerald-500" />
                          Verified
                        </Badge>
                        <div className="flex items-center gap-1 rounded-full bg-amber-500/10 px-2 py-0.5 text-[11px] font-bold text-amber-600 dark:text-amber-400">
                          <Star className="size-3 fill-amber-500 text-amber-500" />
                          {Number(doctor.averageRating || 5.0).toFixed(1)}
                        </div>
                      </div>
                    </div>

                    <div className="mt-3.5 space-y-1">
                      <Link 
                        href={`/doctors/${doctor.id}`}
                        className="group-hover:text-doctorly-primary transition-colors block"
                      >
                        <CardTitle className="line-clamp-1 text-base font-bold text-foreground">
                          {doctor.name}
                        </CardTitle>
                      </Link>
                      <p className="line-clamp-1 text-xs font-semibold text-doctorly-primary">
                        {doctor.designation || primarySpecialty}
                      </p>
                    </div>
                  </CardHeader>

                  <CardContent className="p-5 pt-0 flex-1 space-y-3">
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
                      <span className="text-[11px] text-muted-foreground">Consultation Fee</span>
                      <span className="text-sm font-bold text-foreground font-mono">
                        ৳{doctor.appointmentFee ?? 0}
                      </span>
                    </div>
                  </CardContent>

                  <CardFooter className="p-4 pt-0 gap-2 bg-transparent">
                    <Button asChild variant="outline" size="sm" className="w-1/2 text-xs h-8.5">
                      <Link href={`/doctors/${doctor.id}`}>
                        Profile
                      </Link>
                    </Button>
                    <Button asChild size="sm" className="w-1/2 text-xs h-8.5 gap-1 shadow-xs">
                      <Link href={`/book?doctorId=${doctor.id}`}>
                        <Calendar className="size-3" />
                        Book
                      </Link>
                    </Button>
                  </CardFooter>
                </Card>
              );
            })}
          </div>
        )}

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
    </main>
  );
}
