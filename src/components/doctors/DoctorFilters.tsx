"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function DoctorFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const currentQuery = searchParams.get("query") || "";
  const currentSpecialty = searchParams.get("specialty") || "";

  const [query, setQuery] = useState(currentQuery);
  const [specialty, setSpecialty] = useState(currentSpecialty);

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (query) params.set("query", query);
    if (specialty) params.set("specialty", specialty);
    router.push(`/doctors?${params.toString()}`);
  };

  const handleClear = () => {
    setQuery("");
    setSpecialty("");
    router.push("/doctors");
  };

  return (
    <div className="mb-8 rounded-2xl bg-white p-4 shadow-sm border">
      <div className="flex flex-col md:flex-row gap-4 items-center">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by doctor name, designation, or keyword..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            className="pl-9 bg-muted/20"
          />
        </div>
        <div className="relative flex-1 w-full md:max-w-xs">
          <SlidersHorizontal className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <select
            value={specialty}
            onChange={(e) => setSpecialty(e.target.value)}
            className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-muted/20 px-3 py-2 pl-9 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 appearance-none"
          >
            <option value="">All Specialties</option>
            <option value="Cardiology">Cardiology</option>
            <option value="Dermatology">Dermatology</option>
            <option value="Neurology">Neurology</option>
            <option value="Pediatrics">Pediatrics</option>
            <option value="Orthopedics">Orthopedics</option>
            <option value="Gynecology">Gynecology</option>
            <option value="Psychiatry">Psychiatry</option>
            <option value="General Physician">General Physician</option>
          </select>
        </div>
        <div className="flex gap-2 w-full md:w-auto shrink-0">
          <Button onClick={handleSearch} className="flex-1 md:flex-none">
            Apply Filters
          </Button>
          {(currentQuery || currentSpecialty) && (
            <Button onClick={handleClear} variant="outline" size="icon" title="Clear filters">
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
