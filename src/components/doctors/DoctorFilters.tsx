"use client";

import React, { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search, SlidersHorizontal, X, ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Specialty } from "@/types/api.types";

interface DoctorFiltersProps {
  specialties?: Specialty[];
}

export default function DoctorFilters({ specialties = [] }: DoctorFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const currentQuery = searchParams.get("query") || searchParams.get("searchTerm") || "";
  const currentSpecialty = searchParams.get("specialty") || "";
  const currentSortBy = searchParams.get("sortBy") || "";

  const [query, setQuery] = useState(currentQuery);
  const [specialty, setSpecialty] = useState(currentSpecialty);
  const [sortBy, setSortBy] = useState(currentSortBy);

  const applyFilters = (newQuery = query, newSpecialty = specialty, newSortBy = sortBy) => {
    const params = new URLSearchParams();
    if (newQuery.trim()) params.set("query", newQuery.trim());
    if (newSpecialty && newSpecialty !== "ALL") params.set("specialty", newSpecialty);
    if (newSortBy) {
      params.set("sortBy", newSortBy);
      params.set("sortOrder", newSortBy === "appointmentFee" ? "asc" : "desc");
    }
    params.set("page", "1");
    router.push(`/doctors?${params.toString()}`);
  };

  const handleClear = () => {
    setQuery("");
    setSpecialty("");
    setSortBy("");
    router.push("/doctors");
  };

  const hasActiveFilters = Boolean(currentQuery || (currentSpecialty && currentSpecialty !== "ALL") || currentSortBy);

  return (
    <div className="mb-8 rounded-2xl bg-card p-4 sm:p-5 shadow-xs border border-border">
      <div className="flex flex-col md:flex-row gap-3 items-center">
        
        {/* Search by Name / Keyword */}
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by doctor name, designation, qualification, or workplace..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && applyFilters(query, specialty, sortBy)}
            className="pl-9.5 bg-muted/20 border-border text-sm h-11"
          />
        </div>

        {/* Specialty Selector Dropdown */}
        <div className="relative flex-1 w-full md:max-w-xs">
          <SlidersHorizontal className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
          <select
            value={specialty}
            onChange={(e) => {
              setSpecialty(e.target.value);
              applyFilters(query, e.target.value, sortBy);
            }}
            className="flex h-11 w-full items-center justify-between rounded-md border border-input bg-muted/20 px-3 py-2 pl-9.5 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 appearance-none text-foreground"
          >
            <option value="">All Specialties</option>
            {specialties.map((spec) => (
              <option key={spec.id} value={spec.title}>
                {spec.title}
              </option>
            ))}
          </select>
        </div>

        {/* Sort By Dropdown */}
        <div className="relative flex-1 w-full md:max-w-[180px]">
          <ArrowUpDown className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
          <select
            value={sortBy}
            onChange={(e) => {
              setSortBy(e.target.value);
              applyFilters(query, specialty, e.target.value);
            }}
            className="flex h-11 w-full items-center justify-between rounded-md border border-input bg-muted/20 px-3 py-2 pl-9.5 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 appearance-none text-foreground"
          >
            <option value="">Sort: Default</option>
            <option value="experience">Most Experienced</option>
            <option value="appointmentFee">Lowest Fee</option>
            <option value="averageRating">Highest Rated</option>
            <option value="name">Doctor Name (A-Z)</option>
          </select>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 w-full md:w-auto shrink-0">
          <Button 
            onClick={() => applyFilters(query, specialty, sortBy)} 
            className="flex-1 md:flex-none h-11 px-5"
          >
            Search
          </Button>
          {hasActiveFilters && (
            <Button 
              onClick={handleClear} 
              variant="outline" 
              className="h-11 px-3 gap-1.5 border-border hover:bg-muted text-muted-foreground hover:text-foreground text-xs" 
              title="Clear all filters"
            >
              <X className="h-4 w-4" />
              <span className="hidden sm:inline">Clear</span>
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
