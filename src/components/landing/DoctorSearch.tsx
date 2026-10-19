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
    <section id="doctor-search" className="relative w-full py-[clamp(28px,5vw,64px)] font-sans">
      <div className="mx-auto w-full max-w-[1440px] px-[clamp(16px,3vw,40px)]">
        {/* Header Section: Black and Blue Mixed + Attractive English */}
        <div className="mb-[clamp(18px,3vw,32px)] flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between sm:gap-4">
          <div className="min-w-0">
            {/* Pill Badge */}
            <div className="inline-flex items-center gap-1.5 rounded-full border border-[#0d8bf2]/25 bg-white px-[clamp(8px,1vw,12px)] py-1 text-[clamp(9px,0.9vw,12px)] font-bold tracking-wider text-[#0d8bf2] uppercase shadow-xs">
              <span className="size-[clamp(6px,0.6vw,8px)] rounded-full bg-[#0d8bf2]" />
              <span>VERIFIED MEDICAL LEADERS</span>
            </div>

            {/* Title: Black and Blue Mixed */}
            <h2 className="mt-2.5 max-w-[780px] font-sans text-[clamp(22px,3vw,36px)] font-extrabold leading-[1.08] tracking-tight">
              <span className="text-black">Consult With Our Most</span>{" "}
              <span className="text-[#0d8bf2]">Trusted Specialist Doctors</span>
            </h2>

            {/* Subtitle */}
            <p className="mt-2 max-w-2xl text-[clamp(11px,1.1vw,14px)] leading-relaxed font-normal text-slate-600">
              Board-certified practitioners with decades of clinical excellence. Book instant video consultations or visit chambers near you.
            </p>
          </div>

          {/* View All Doctors Link */}
          <Link
            href="/doctors"
            className="group inline-flex shrink-0 self-end items-center gap-1.5 text-[clamp(10px,1.1vw,14px)] font-bold transition-colors sm:self-auto"
          >
            <span className="text-black transition-colors group-hover:text-[#0d8bf2]">Explore All</span>
            <span className="text-[#0d8bf2]">Specialists</span>
            <ArrowRight className="size-4 text-[#0d8bf2] transition-transform duration-200 group-hover:translate-x-1" />
          </Link>
        </div>

        {/* Search Dock: Sends user to /doctors on submit */}
        <form onSubmit={handleSearch} className="mb-[clamp(20px,3vw,36px)] w-full max-w-4xl">
          <div className="flex flex-col items-center gap-2 rounded-[clamp(12px,1.5vw,16px)] border border-slate-200/90 bg-white p-[clamp(6px,0.8vw,8px)] shadow-[0_4px_18px_-4px_rgba(13,139,242,0.06)] transition-all focus-within:border-[#0d8bf2] focus-within:shadow-[0_8px_24px_-4px_rgba(13,139,242,0.18)] sm:flex-row">
            {/* Search Input */}
            <div className="flex w-full flex-1 items-center gap-2.5 px-2 py-1.5 sm:px-3">
              <Search className="size-4 shrink-0 text-[#0d8bf2]" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by doctor name, department, symptoms, or hospital..."
                className="w-full bg-transparent text-[clamp(11px,1vw,14px)] font-medium text-slate-800 outline-none placeholder:text-slate-400"
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
              className="inline-flex h-10 w-full items-center justify-center gap-2 rounded-xl bg-[#0d8bf2] px-5 text-[clamp(11px,1vw,14px)] font-bold text-white shadow-xs transition-all hover:bg-[#0b78d1] hover:shadow-md hover:shadow-[#0d8bf2]/20 sm:h-11 sm:w-auto sm:cursor-pointer"
            >
              <Search className="size-4" />
              <span>Search Doctors</span>
            </button>
          </div>
        </form>

        {/* 5 Doctor Cards Grid: Matching user reference image with Black & Blue mixed typography */}
        <div className="grid grid-cols-2 gap-[clamp(8px,1.2vw,16px)] lg:grid-cols-5">
          {DOCTORS.slice(0, 5).map((doctor) => (
            <Link
              key={doctor.id || doctor.name}
              href={`/doctors?doctor=${encodeURIComponent(doctor.name)}`}
              className="group relative flex min-w-0 flex-col justify-between overflow-hidden rounded-[clamp(12px,1.5vw,16px)] border border-slate-200/80 bg-white shadow-[0_4px_18px_-4px_rgba(13,139,242,0.06)] transition-all duration-300 hover:-translate-y-1.5 hover:border-[#0d8bf2] hover:shadow-[0_16px_32px_-6px_rgba(13,139,242,0.18)]"
            >
              {/* Doctor Image Container */}
              <div className="relative aspect-[4/3.8] w-full overflow-hidden bg-[#F1F5F9]">
                <Image
                  src={doctor.image}
                  alt={doctor.name}
                  fill
                  sizes="(max-width: 1024px) 50vw, 240px"
                  className="object-cover object-top transition-transform duration-500 group-hover:scale-105"
                  priority
                />

                {/* Floating Top-Right Circular Arrow Button */}
                <div className="absolute top-2.5 right-2.5 z-10">
                  <span className="flex size-[clamp(24px,2.2vw,28px)] items-center justify-center rounded-full border border-slate-200/60 bg-white/95 text-slate-700 shadow-sm backdrop-blur-xs transition-all duration-300 group-hover:scale-105 group-hover:border-[#0d8bf2] group-hover:bg-[#0d8bf2] group-hover:text-white">
                    <ArrowRight className="size-[clamp(11px,1.1vw,14px)] transition-transform duration-300 group-hover:translate-x-0.5" />
                  </span>
                </div>
              </div>

              {/* Doctor Info Body */}
              <div className="flex flex-1 flex-col justify-between p-[clamp(8px,1.2vw,16px)] pt-[clamp(8px,1vw,14px)]">
                <div>
                  {/* Doctor Name: Solid Black */}
                  <h3
                    style={{ color: "#000000" }}
                    className="font-sans text-[clamp(10px,1.25vw,16px)] font-extrabold leading-tight text-black! transition-colors group-hover:text-[#0d8bf2]"
                  >
                    {doctor.name}
                  </h3>

                  {/* Specialty: Clean #0d8bf2 Blue text */}
                  <p className="mt-1 font-sans text-[clamp(8px,1vw,13px)] font-bold leading-snug text-[#0d8bf2]">
                    {doctor.specialty}
                  </p>
                </div>

                <div className="mt-[clamp(8px,1vw,12px)]">
                  {/* Rating: Black number with golden star */}
                  <div className="flex items-center gap-1 text-[clamp(8px,0.9vw,12px)] font-medium">
                    <Star className="size-[clamp(11px,1.1vw,14px)] shrink-0 fill-amber-400 text-amber-400" />
                    <span className="font-extrabold text-black">{doctor.rating}</span>
                    <span className="text-slate-400 font-normal">({doctor.reviews})</span>
                  </div>

                  {/* Status row: Green dot + Available Now & Blue Book Slot */}
                  <div className="mt-2 flex items-center justify-between border-t border-slate-100 pt-2 text-[clamp(8px,0.9vw,12px)]">
                    <span className="inline-flex items-center gap-1.5 font-semibold text-emerald-600">
                      <span className="relative flex size-2">
                        <span className="absolute size-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                        <span className="relative size-2 rounded-full bg-emerald-500" />
                      </span>
                      <span className="text-[clamp(7px,0.8vw,12px)]">Available Now</span>
                    </span>

                    <span className="hidden items-center gap-0.5 text-[11px] font-bold text-[#0d8bf2] group-hover:underline sm:flex">
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
