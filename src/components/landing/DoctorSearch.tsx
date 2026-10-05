"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Search, Star, ArrowRight, X } from "lucide-react";
import DOCTORS from "@/json/doctors.json";

export default function DoctorSearch() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [specialty, setSpecialty] = useState("");

  const handleSearch = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const params = new URLSearchParams();
    if (searchTerm.trim()) params.set("query", searchTerm.trim());
    if (specialty) params.set("specialty", specialty);
    router.push(`/doctors?${params.toString()}`);
  };

  return (
    <section id="doctor-search" className="font-sans relative w-full py-10 sm:py-14 lg:py-16">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header Section: Black and Blue Mixed + Attractive English */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between mb-6 sm:mb-8">
          <div>
            {/* Pill Badge */}
            <div className="inline-flex items-center gap-1.5 rounded-full border border-[#0d8bf2]/25 bg-white px-3 py-0.5 text-xs font-bold tracking-wider text-[#0d8bf2] uppercase shadow-xs">
              <span className="size-2 rounded-full bg-[#0d8bf2]" />
              <span>VERIFIED MEDICAL LEADERS</span>
            </div>

            {/* Title: Black and Blue Mixed */}
            <h2 className="mt-2.5 font-sans text-2xl sm:text-3xl lg:text-[34px] xl:text-[36px] font-extrabold tracking-tight leading-tight">
              <span className="text-black">Consult With Our Most</span>{" "}
              <span className="text-[#0d8bf2]">Trusted Specialist Doctors</span>
            </h2>

            {/* Subtitle */}
            <p className="mt-1.5 text-xs sm:text-sm text-slate-600 font-normal max-w-2xl leading-relaxed">
              Board-certified practitioners with decades of clinical excellence. Book instant video consultations or visit chambers near you.
            </p>
          </div>

          {/* View All Doctors Link */}
          <Link
            href="/doctors"
            className="group inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold transition-colors shrink-0"
          >
            <span className="text-black transition-colors group-hover:text-[#0d8bf2]">Explore All</span>
            <span className="text-[#0d8bf2]">Specialists</span>
            <ArrowRight className="size-4 text-[#0d8bf2] transition-transform duration-200 group-hover:translate-x-1" />
          </Link>
        </div>

        {/* Search Dock: Sends user to /doctors on submit */}
        <form onSubmit={handleSearch} className="mb-7 sm:mb-9 w-full max-w-3xl">
          <div className="flex flex-col sm:flex-row items-center gap-2 rounded-2xl border border-slate-200/90 bg-white p-2 shadow-[0_4px_18px_-4px_rgba(13,139,242,0.06)] transition-all focus-within:border-[#0d8bf2] focus-within:shadow-[0_8px_24px_-4px_rgba(13,139,242,0.18)]">
            {/* Search Input */}
            <div className="flex flex-1 items-center gap-2.5 px-3 py-1.5 w-full">
              <Search className="size-4.5 text-[#0d8bf2] shrink-0" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by doctor name, department, symptoms, or hospital..."
                className="w-full bg-transparent text-sm font-medium text-slate-800 outline-none placeholder:text-slate-400"
              />
              {searchTerm && (
                <button
                  type="button"
                  onClick={() => setSearchTerm("")}
                  className="text-slate-400 hover:text-slate-600 p-1"
                >
                  <X className="size-3.5" />
                </button>
              )}
            </div>

            {/* Specialty Dropdown */}
            <div className="hidden sm:flex items-center border-l border-slate-200/80 pl-3 pr-2 py-1">
              <select
                value={specialty}
                onChange={(e) => setSpecialty(e.target.value)}
                className="cursor-pointer appearance-none bg-transparent text-xs font-bold text-slate-700 outline-none pr-2"
              >
                <option value="">All Medical Specialties</option>
                <option value="General Physician">General Medicine</option>
                <option value="Cardiologist">Cardiology (Heart Care)</option>
                <option value="Gynecologist">Gynecology & Obstetrics</option>
                <option value="Dermatologist">Dermatology & Skin Care</option>
                <option value="Mental Health Specialist">Neuro & Mental Health</option>
              </select>
            </div>

            {/* Search Button */}
            <button
              type="submit"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-[#0d8bf2] hover:bg-[#0b78d1] px-5 py-2.5 text-xs sm:text-sm font-bold text-white shadow-xs transition-all hover:shadow-md hover:shadow-[#0d8bf2]/20 cursor-pointer"
            >
              <Search className="size-4" />
              <span>Search Doctors</span>
            </button>
          </div>
        </form>

        {/* 5 Doctor Cards Grid: Matching user reference image with Black & Blue mixed typography */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 lg:gap-3.5 xl:gap-4">
          {DOCTORS.slice(0, 5).map((doctor) => (
            <Link
              key={doctor.id || doctor.name}
              href={`/doctors?doctor=${encodeURIComponent(doctor.name)}`}
              className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-[0_4px_18px_-4px_rgba(13,139,242,0.06)] transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_16px_32px_-6px_rgba(13,139,242,0.18)] hover:border-[#0d8bf2] cursor-pointer"
            >
              {/* Doctor Image Container */}
              <div className="relative aspect-[4/3.8] w-full overflow-hidden bg-[#F1F5F9]">
                <Image
                  src={doctor.image}
                  alt={doctor.name}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 33vw, 240px"
                  className="object-cover object-top transition-transform duration-500 group-hover:scale-105"
                  priority
                />

                {/* Floating Top-Right Circular Arrow Button */}
                <div className="absolute top-2.5 right-2.5 z-10">
                  <span className="flex size-7 items-center justify-center rounded-full border border-slate-200/60 bg-white/95 text-slate-700 shadow-sm backdrop-blur-xs transition-all duration-300 group-hover:border-[#0d8bf2] group-hover:bg-[#0d8bf2] group-hover:text-white group-hover:scale-105">
                    <ArrowRight className="size-3.5 transition-transform duration-300 group-hover:translate-x-0.5" />
                  </span>
                </div>
              </div>

              {/* Doctor Info Body */}
              <div className="p-4 sm:p-4.5 pt-3.5 flex flex-col flex-1 justify-between">
                <div>
                  {/* Doctor Name: Solid Black */}
                  <h3
                    style={{ color: "#000000" }}
                    className="font-sans text-[15px] sm:text-[16px] font-extrabold leading-tight text-black! group-hover:text-[#0d8bf2] transition-colors"
                  >
                    {doctor.name}
                  </h3>

                  {/* Specialty: Clean #0d8bf2 Blue text */}
                  <p className="mt-1 font-sans text-xs sm:text-[13px] font-bold text-[#0d8bf2] leading-snug">
                    {doctor.specialty}
                  </p>
                </div>

                <div className="mt-3">
                  {/* Rating: Black number with golden star */}
                  <div className="flex items-center gap-1.5 text-xs font-medium">
                    <Star className="size-3.5 fill-amber-400 text-amber-400 shrink-0" />
                    <span className="font-extrabold text-black">{doctor.rating}</span>
                    <span className="text-slate-400 font-normal">({doctor.reviews})</span>
                  </div>

                  {/* Status row: Green dot + Available Now & Blue Book Slot */}
                  <div className="mt-2.5 flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
                    <span className="inline-flex items-center gap-1.5 font-semibold text-emerald-600">
                      <span className="relative flex size-2">
                        <span className="absolute size-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                        <span className="relative size-2 rounded-full bg-emerald-500" />
                      </span>
                      <span>Available Now</span>
                    </span>

                    <span className="text-[11px] font-bold text-[#0d8bf2] group-hover:underline flex items-center gap-0.5">
                      Book Slot <ArrowRight className="size-3 transition-transform group-hover:translate-x-0.5" />
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}