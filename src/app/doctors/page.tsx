/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import { getAllDoctors } from "@/services/doctor.services";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";
import { Star, MapPin, Building2, Stethoscope, Search } from "lucide-react";

export const metadata = {
  title: "Find Doctors | Doctorly",
  description: "Search and book appointments with top healthcare professionals",
};

export default async function DoctorsPage(props: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const searchParams = await props.searchParams;
  const query = typeof searchParams.query === 'string' ? searchParams.query : '';
  const specialty = typeof searchParams.specialty === 'string' ? searchParams.specialty : '';

  let doctors: any[] = [];
  try {
    const res = await getAllDoctors({ searchTerm: query, specialty });
    doctors = res.data || [];
  } catch (error) {
    console.error(error);
  }

  return (
    <main className="min-h-screen bg-muted/20 pb-16 pt-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Header Section */}
        <div className="mb-10 text-center">
          <h1 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
            Find the Right Doctor for You
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">
            Search from our extensive network of trusted healthcare professionals.
          </p>
        </div>

        {/* Doctor Grid */}
        {doctors.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="rounded-full bg-muted p-6">
              <Search className="size-10 text-muted-foreground" />
            </div>
            <h3 className="mt-4 text-xl font-semibold">No doctors found</h3>
            <p className="mt-2 text-muted-foreground">
              Try adjusting your search criteria or explore other specialties.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {doctors.map((doctor) => (
              <Card key={doctor.id} className="flex h-full flex-col overflow-hidden transition-all hover:shadow-lg hover:border-doctorly-primary/30">
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between">
                    <Avatar className="size-16 border-2 border-background shadow-sm">
                      <AvatarImage src={doctor.profilePhoto || undefined} alt={doctor.name} />
                      <AvatarFallback className="bg-doctorly-primary/10 text-lg font-bold text-doctorly-primary">
                        {doctor.name.slice(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex items-center gap-1 rounded-full bg-amber-100 px-2 py-1 text-xs font-semibold text-amber-600 dark:bg-amber-900/30 dark:text-amber-500">
                      <Star className="size-3 fill-amber-500" />
                      {doctor.averageRating.toFixed(1)}
                    </div>
                  </div>
                  <div className="mt-3">
                    <CardTitle className="line-clamp-1 text-lg">{doctor.name}</CardTitle>
                    <CardDescription className="line-clamp-1 font-medium text-doctorly-primary mt-1">
                      {doctor.designation}
                    </CardDescription>
                  </div>
                </CardHeader>
                <CardContent className="flex flex-1 flex-col justify-start gap-3 pb-4 text-sm text-muted-foreground">
                  
                  {/* Specialties */}
                  {doctor.specialties && doctor.specialties.length > 0 && (
                    <div className="flex items-start gap-2">
                      <Stethoscope className="mt-0.5 size-4 shrink-0" />
                      <div className="line-clamp-2">
                        {doctor.specialties.map((s: { specialty: { title: any; }; }) => s.specialty?.title).join(", ")}
                      </div>
                    </div>
                  )}

                  {/* Workplace */}
                  {doctor.currentWorkingPlace && (
                    <div className="flex items-start gap-2">
                      <Building2 className="mt-0.5 size-4 shrink-0" />
                      <span className="line-clamp-1">{doctor.currentWorkingPlace}</span>
                    </div>
                  )}

                  {/* Address */}
                  {doctor.address && (
                    <div className="flex items-start gap-2">
                      <MapPin className="mt-0.5 size-4 shrink-0" />
                      <span className="line-clamp-1">{doctor.address}</span>
                    </div>
                  )}

                </CardContent>
                <CardFooter className="flex items-center justify-between border-t border-border/50 bg-muted/10 pt-4">
                  <div className="flex flex-col">
                    <span className="text-xs font-medium text-muted-foreground">Consultation Fee</span>
                    <span className="font-bold text-foreground">৳ {doctor.appointmentFee}</span>
                  </div>
                  <Button asChild size="sm" className="bg-doctorly-primary hover:bg-doctorly-primary/90 text-white rounded-full">
                    <Link href={`/doctors/${doctor.id}`}>
                      Book Now
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
