import React from "react";
import { getAllSpecialties } from "@/services/specialty.services";
import { Card, CardContent } from "@/components/ui/card";
import { Stethoscope } from "lucide-react";
import { Specialty } from "@/types/api.types";
import Link from "next/link";
import Image from "next/image";

export const metadata = {
  title: "Medical Specialties | Doctorly",
  description: "Browse healthcare professionals by their medical specialties.",
};

export default async function SpecialtiesPage() {
  let specialties: Specialty[] = [];
  try {
    const res = await getAllSpecialties();
    specialties = res.data || [];
  } catch (error) {
    console.error(error);
  }

  return (
    <main className="min-h-screen bg-muted/20 pb-16 pt-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Header Section */}
        <div className="mb-10 text-center">
          <h1 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
            Medical Specialties
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">
            Explore our wide range of medical specialties and find the right expert for your health needs.
          </p>
        </div>

        {/* Grid */}
        {specialties.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="rounded-full bg-muted p-6">
              <Stethoscope className="size-10 text-muted-foreground" />
            </div>
            <h3 className="mt-4 text-xl font-semibold">No specialties found</h3>
            <p className="mt-2 text-muted-foreground">
              We are currently updating our specialties list. Please check back later.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {specialties.map((specialty) => (
              <Link key={specialty.id} href={`/doctors?specialty=${specialty.title}`}>
                <Card className="flex h-full flex-col overflow-hidden transition-all hover:shadow-lg hover:border-doctorly-primary/50 group">
                  <CardContent className="flex flex-1 flex-col items-center justify-center gap-4 p-6 text-center">
                    <div className="flex size-16 items-center justify-center rounded-2xl bg-doctorly-primary/10 text-doctorly-primary transition-colors group-hover:bg-doctorly-primary group-hover:text-white">
                      {specialty.icon ? (
                        <Image src={specialty.icon} alt={specialty.title} width={32} height={32} className="object-contain" />
                      ) : (
                        <Stethoscope className="size-8" />
                      )}
                    </div>
                    <div>
                      <h3 className="font-bold text-lg text-foreground group-hover:text-doctorly-primary transition-colors">
                        {specialty.title}
                      </h3>
                      {specialty.description && (
                        <p className="mt-2 text-sm text-muted-foreground line-clamp-2">
                          {specialty.description}
                        </p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}

      </div>
    </main>
  );
}
