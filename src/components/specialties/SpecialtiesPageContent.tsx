"use client";

import React, { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { Search, ArrowRight, X } from "lucide-react";
import { Specialty } from "@/types/api.types";
import Footer from "@/components/landing/Footer";

export interface SpecialtyItem {
  id: string;
  title: string;
  slug: string;
  category: "General" | "Children" | "Women" | "Skin" | "Mental Health" | "Heart" | "Others";
  description: string;
  doctorCount: string;
  iconBg: string;
  iconColor: string;
  iconType: "stethoscope" | "pediatrics" | "gynecology" | "dermatology" | "mental" | "cardiology" | "ent" | "orthopedics";
}

const DEFAULT_SPECIALTIES: SpecialtyItem[] = [
  {
    id: "general-medicine",
    title: "General Medicine",
    slug: "general-medicine",
    category: "General",
    description: "Complete care for your overall health.",
    doctorCount: "120+ Doctors",
    iconBg: "bg-[#E8F3FC]",
    iconColor: "text-[#0D8BF2]",
    iconType: "stethoscope",
  },
  {
    id: "pediatrics",
    title: "Pediatrics",
    slug: "pediatrics",
    category: "Children",
    description: "Specialized care for your little-ones.",
    doctorCount: "90+ Doctors",
    iconBg: "bg-[#E0FAF7]",
    iconColor: "text-[#00BCD4]",
    iconType: "pediatrics",
  },
  {
    id: "gynecology",
    title: "Gynecology",
    slug: "gynecology",
    category: "Women",
    description: "Women's health at every stage of life.",
    doctorCount: "80+ Doctors",
    iconBg: "bg-[#FEECEF]",
    iconColor: "text-[#FF385C]",
    iconType: "gynecology",
  },
  {
    id: "dermatology",
    title: "Dermatology",
    slug: "dermatology",
    category: "Skin",
    description: "Healthy skin for a brighter you.",
    doctorCount: "70+ Doctors",
    iconBg: "bg-[#FFF0E6]",
    iconColor: "text-[#FF7715]",
    iconType: "dermatology",
  },
  {
    id: "mental-health",
    title: "Mental Health",
    slug: "mental-health",
    category: "Mental Health",
    description: "Support for a happier mind.",
    doctorCount: "60+ Doctors",
    iconBg: "bg-[#FAEAFD]",
    iconColor: "text-[#C026D3]",
    iconType: "mental",
  },
  {
    id: "cardiology",
    title: "Cardiology",
    slug: "cardiology",
    category: "Heart",
    description: "Expert care for your heart.",
    doctorCount: "50+ Doctors",
    iconBg: "bg-[#FEECEE]",
    iconColor: "text-[#EF4444]",
    iconType: "cardiology",
  },
  {
    id: "ent",
    title: "ENT",
    slug: "ent",
    category: "Others",
    description: "Care for ear, nose and throat issues.",
    doctorCount: "40+ Doctors",
    iconBg: "bg-[#EEF4FF]",
    iconColor: "text-[#2563EB]",
    iconType: "ent",
  },
  {
    id: "orthopedics",
    title: "Orthopedics",
    slug: "orthopedics",
    category: "Others",
    description: "Stronger bones for an active life.",
    doctorCount: "45+ Doctors",
    iconBg: "bg-[#E0F2FE]",
    iconColor: "text-[#0284C7]",
    iconType: "orthopedics",
  },
];

const CATEGORIES = [
  "All",
  "General",
  "Children",
  "Women",
  "Skin",
  "Mental Health",
  "Heart",
  "Others",
] as const;

type CategoryType = (typeof CATEGORIES)[number];

// Sleek Custom SVG Icons matching the reference design
function StethoscopeIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4.8 2.3A.3.3 0 1 0 5 2H4a2 2 0 0 0-2 2v5a6 6 0 0 0 6 6v0a6 6 0 0 0 6-6V4a2 2 0 0 0-2-2h-1a.2.2 0 1 0 .3.3" />
      <path d="M8 15v1a6 6 0 0 0 6 6v0a6 6 0 0 0 6-6v-4" />
      <circle cx="20" cy="10" r="2" />
    </svg>
  );
}

function PediatricsIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="13" r="7" />
      <path d="M9.5 12h.01" />
      <path d="M14.5 12h.01" />
      <path d="M10 15.2c.6.6 1.2.8 2 .8s1.4-.2 2-.8" />
      <path d="M12 6c-1.2 0-2.2-.8-2.2-1.8 1.2 0 2.2.8 2.2 1.8Z" />
      <path d="M5 12.5a2 2 0 1 0 0-3.5" />
      <path d="M19 12.5a2 2 0 1 1 0-3.5" />
    </svg>
  );
}

function GynecologyIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="8.5" r="5.5" />
      <path d="M12 14v8" />
      <path d="M8.5 18h7" />
    </svg>
  );
}

function DermatologyIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2.5c0 3.5-3.5 6.5-3.5 10a3.5 3.5 0 0 0 7 0c0-3.5-3.5-6.5-3.5-10Z" />
      <path d="M5 20c2-.8 4.2-1.2 7-1.2s5 .4 7 1.2" />
      <path d="M7 11c-.8-1.5-.8-3.5 0-5" strokeDasharray="1 2" />
      <path d="M17 11c.8-1.5.8-3.5 0-5" strokeDasharray="1 2" />
    </svg>
  );
}

function MentalHealthIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96.44 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 1.98-3.04A2.5 2.5 0 0 1 9.5 2Z" />
      <path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96.44 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-1.98-3.04A2.5 2.5 0 0 0 14.5 2Z" />
    </svg>
  );
}

function CardiologyIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
      <path d="M6 10.5h2.5l1.5-3 2.5 6 1.5-3H18" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function EntIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 8.5a6.5 6.5 0 0 1 13 0c0 4-2 7-4.5 9.5L14 20h-4l-.5-2C7 16 6 12 6 8.5Z" />
      <path d="M9.5 11.5a2 2 0 0 0 3.5 0" />
      <circle cx="15.5" cy="11" r="1" fill="currentColor" />
    </svg>
  );
}

function OrthopedicsIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 10c.7-.7 1.69 0 2.5 0a2.5 2.5 0 1 0 0-5 .5.5 0 0 1-.5-.5 2.5 2.5 0 1 0-5 0c0 .81.7 1.8 0 2.5l-7 7c-.7.7-1.69 0-2.5 0a2.5 2.5 0 1 0 0 5 .5.5 0 0 1 .5.5 2.5 2.5 0 1 0 5 0c0-.81-.7-1.8 0-2.5Z" />
    </svg>
  );
}

function SpecialtyCardIcon({ type, className }: { type: SpecialtyItem["iconType"]; className?: string }) {
  switch (type) {
    case "stethoscope":
      return <StethoscopeIcon className={className} />;
    case "pediatrics":
      return <PediatricsIcon className={className} />;
    case "gynecology":
      return <GynecologyIcon className={className} />;
    case "dermatology":
      return <DermatologyIcon className={className} />;
    case "mental":
      return <MentalHealthIcon className={className} />;
    case "cardiology":
      return <CardiologyIcon className={className} />;
    case "ent":
      return <EntIcon className={className} />;
    case "orthopedics":
      return <OrthopedicsIcon className={className} />;
    default:
      return <StethoscopeIcon className={className} />;
  }
}

interface SpecialtiesPageContentProps {
  initialSpecialties?: Specialty[];
}

export default function SpecialtiesPageContent({ initialSpecialties = [] }: SpecialtiesPageContentProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<CategoryType>("All");

  // Merge server specialties if any, ensuring the default 8 reference items are preserved
  const allSpecialties = useMemo(() => {
    if (!initialSpecialties.length) return DEFAULT_SPECIALTIES;

    const merged = [...DEFAULT_SPECIALTIES];
    initialSpecialties.forEach((apiItem) => {
      const exists = merged.some(
        (item) => item.title.toLowerCase() === apiItem.title.toLowerCase()
      );
      if (!exists) {
        merged.push({
          id: apiItem.id,
          title: apiItem.title,
          slug: apiItem.title.toLowerCase().replace(/\s+/g, "-"),
          category: "Others",
          description: apiItem.description || "Expert medical care tailored to your specific needs.",
          doctorCount: "30+ Doctors",
          iconBg: "bg-[#E8F3FC]",
          iconColor: "text-[#0D8BF2]",
          iconType: "stethoscope",
        });
      }
    });
    return merged;
  }, [initialSpecialties]);

  // Filter items based on active category & search query
  const filteredSpecialties = useMemo(() => {
    return allSpecialties.filter((item) => {
      const matchesCategory =
        selectedCategory === "All" || item.category === selectedCategory;

      const q = searchQuery.trim().toLowerCase();
      const matchesQuery =
        !q ||
        item.title.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q);

      return matchesCategory && matchesQuery;
    });
  }, [allSpecialties, selectedCategory, searchQuery]);

  const handleResetFilters = () => {
    setSelectedCategory("All");
    setSearchQuery("");
  };

  return (
    <div className="flex w-full flex-col bg-[#F9FBFE] font-sans text-slate-900 selection:bg-[#0D8BF2]/10 selection:text-[#0D8BF2]">
      {/* ============================================================ */}
      {/* 1. FULL WIDTH BANNER (Edge-to-Edge Full Width & Sleek Height)*/}
      {/* ============================================================ */}
      <section className="relative isolate min-h-[300px] overflow-hidden border-b border-blue-100/70 bg-[#E8F5FD] sm:min-h-[380px] lg:aspect-[1983/793] lg:min-h-0">
        <Image
          src="/doctorly-assest/specialties-banner-v2.webp"
          alt="Doctorly specialist care"
          fill
          priority
          sizes="100vw"
          className="object-cover object-[72%_center] select-none sm:object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#E8F5FD] via-[#E8F5FD]/88 to-transparent sm:bg-gradient-to-r sm:from-[#E8F5FD]/95 sm:via-[#E8F5FD]/45 sm:to-transparent" />
        <div className="relative z-10 mx-auto flex h-full min-h-[300px] w-full items-center px-3.5 py-6 sm:min-h-[380px] sm:px-6 sm:py-10 lg:min-h-0 lg:px-8">
          <div className="w-[70%] max-w-[560px] sm:w-full">
            <div className="inline-flex items-center gap-1.5 rounded-full border border-[#0D8BF2]/25 bg-white/80 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-[#0D8BF2] backdrop-blur-sm sm:text-xs">
              <span className="size-1.5 rounded-full bg-[#0D8BF2]" />
              <span>Our Specialties</span>
            </div>

            <h1 className="mt-3 max-w-[300px] text-[clamp(1.7rem,7.6vw,2.35rem)] font-extrabold leading-[1.02] tracking-[-0.04em] text-[#071B49] sm:mt-4 sm:max-w-[520px] sm:text-4xl md:text-5xl lg:text-6xl">
              Find the Right Care
              <span className="block text-[#0D8BF2]">for Every Health Need</span>
            </h1>

            <p className="mt-3 max-w-[280px] text-[10px] leading-4 text-[#3D6688] sm:mt-4 sm:max-w-[470px] sm:text-base sm:leading-relaxed">
              Explore our wide range of medical specialties and get expert care from verified doctors.
            </p>

            <div className="mt-4 grid max-w-[285px] grid-cols-3 gap-1.5 sm:mt-7 sm:max-w-[440px] sm:gap-3">
              <div className="rounded-lg border border-white/80 bg-white/80 px-1.5 py-2 backdrop-blur-sm sm:rounded-xl sm:px-3 sm:py-2.5">
                <p className="text-xs font-extrabold text-[#071B49] sm:text-lg">2,500+</p>
                <p className="text-[7px] font-medium leading-3 text-[#3D6688] sm:text-[11px]">Specialists</p>
              </div>
              <div className="rounded-lg border border-white/80 bg-white/80 px-1.5 py-2 backdrop-blur-sm sm:rounded-xl sm:px-3 sm:py-2.5">
                <p className="text-xs font-extrabold text-[#071B49] sm:text-lg">4.8/5</p>
                <p className="text-[7px] font-medium leading-3 text-[#3D6688] sm:text-[11px]">Patient Rating</p>
              </div>
              <div className="rounded-lg border border-white/80 bg-white/80 px-1.5 py-2 backdrop-blur-sm sm:rounded-xl sm:px-3 sm:py-2.5">
                <p className="text-xs font-extrabold text-[#071B49] sm:text-lg">100%</p>
                <p className="text-[7px] font-medium leading-3 text-[#3D6688] sm:text-[11px]">Trusted Doctors</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 2. CONTENT SECTION (Design matches 2nd Image)                */}
      {/* ============================================================ */}
      <section className="py-8 sm:py-12 lg:py-16">
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          
          {/* Search Bar - Centered Rounded Pill */}
          <div className="mx-auto w-full max-w-2xl">
            <div className="relative flex items-center rounded-full border border-slate-200/90 bg-white p-1.5 pl-4 sm:pl-5 shadow-xs transition-all focus-within:border-[#0D8BF2] focus-within:ring-2 focus-within:ring-[#0D8BF2]/15">
              <Search className="size-4.5 sm:size-5 shrink-0 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search speciality, condition or treatment..."
                className="w-full bg-transparent px-3 py-2 text-xs sm:text-sm text-slate-800 placeholder-slate-400 outline-none"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="mr-1.5 size-7 rounded-full text-slate-400 hover:bg-slate-100 hover:text-slate-600 flex items-center justify-center transition"
                  title="Clear search"
                >
                  <X className="size-3.5" />
                </button>
              )}
              <button
                type="button"
                className="size-9 sm:size-10 shrink-0 rounded-full sm:rounded-xl bg-[#0D8BF2] text-white flex items-center justify-center shadow-md shadow-[#0D8BF2]/25 hover:bg-[#0B78D1] active:scale-95 transition-all"
                aria-label="Search"
              >
                <Search className="size-4 sm:size-4.5 stroke-[2.2]" />
              </button>
            </div>
          </div>

          {/* Category Filter Pills (All, General, Children, Women, Skin, Mental Health, Heart, Others) */}
          <div className="mt-5 sm:mt-6 flex flex-wrap items-center justify-center gap-2 sm:gap-2.5">
            {CATEGORIES.map((cat) => {
              const isActive = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  className={`cursor-pointer rounded-full px-4 sm:px-5 py-1.5 sm:py-2 text-xs sm:text-sm font-semibold transition-all duration-200 ${
                    isActive
                      ? "bg-[#0D8BF2] text-white shadow-md shadow-[#0D8BF2]/25 scale-[1.02]"
                      : "bg-[#EBF4FA] text-[#3D6688] hover:bg-[#DFEEF8] hover:text-[#0D8BF2]"
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>

          {/* Section Header: Explore Our Specialities & View All Specialties */}
          <div className="mt-10 sm:mt-12 flex items-center justify-between gap-4">
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
              Explore Our Specialities
            </h2>
            <button
              type="button"
              onClick={handleResetFilters}
              className="group inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-[#0D8BF2] hover:text-[#0B78D1] transition"
            >
              <span>View All Specialties</span>
              <ArrowRight className="size-3.5 sm:size-4 transition-transform group-hover:translate-x-0.5" />
            </button>
          </div>

          {/* 8 Specialty Cards Grid (4 columns on desktop, 2 on tablet/mobile) */}
          {filteredSpecialties.length === 0 ? (
            <div className="mt-8 rounded-2xl border border-dashed border-sky-200 bg-white/70 p-10 text-center">
              <p className="text-base font-bold text-slate-700">No specialities found matching &quot;{searchQuery}&quot;</p>
              <p className="mt-1 text-sm text-slate-500">Try searching with a different medical specialty or reset your filters.</p>
              <button
                onClick={handleResetFilters}
                className="mt-4 rounded-full bg-[#0D8BF2] px-5 py-2 text-xs font-bold text-white shadow-md hover:bg-[#0B78D1] transition"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <div className="mt-6 sm:mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
              {filteredSpecialties.map((item) => (
                <Link
                  key={item.id}
                  href={`/doctors?specialty=${encodeURIComponent(item.title)}`}
                  className="group block h-full focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0D8BF2] rounded-2xl"
                >
                  <article className="flex h-full min-h-[200px] sm:min-h-[215px] flex-col justify-between rounded-2xl border border-slate-200/80 bg-white p-5 sm:p-6 shadow-[0_2px_12px_-2px_rgba(13,139,242,0.04)] transition-all duration-300 group-hover:-translate-y-1 group-hover:border-[#0D8BF2]/40 group-hover:shadow-[0_12px_28px_-4px_rgba(13,139,242,0.12)]">
                    <div>
                      {/* Icon Circle */}
                      <div className={`size-12 rounded-full flex items-center justify-center ${item.iconBg} ${item.iconColor} transition-transform duration-300 group-hover:scale-105`}>
                        <SpecialtyCardIcon type={item.iconType} className="size-6" />
                      </div>

                      {/* Title */}
                      <h3 className="mt-4 text-base sm:text-lg font-bold text-slate-900 transition-colors group-hover:text-[#0D8BF2]">
                        {item.title}
                      </h3>

                      {/* Description */}
                      <p className="mt-1 text-xs sm:text-sm text-slate-500 line-clamp-2 leading-relaxed">
                        {item.description}
                      </p>
                    </div>

                    {/* Bottom Row: Doctor Count + Arrow */}
                    <div className="flex items-center justify-between pt-3 border-t border-slate-50">
                      <span className="text-xs sm:text-sm font-semibold text-slate-600">
                        {item.doctorCount}
                      </span>
                      <span className="size-6 rounded-full text-[#0D8BF2] flex items-center justify-center transition-transform duration-300 group-hover:translate-x-1">
                        <ArrowRight className="size-4 stroke-[2.2]" />
                      </span>
                    </div>
                  </article>
                </Link>
              ))}
            </div>
          )}

          {/* ============================================================ */}
          {/* 3. BOTTOM HELP BANNER: "Not Sure Which Specialist You Need?"  */}
          {/* ============================================================ */}
          <div className="mt-12 sm:mt-16 overflow-hidden rounded-3xl border border-sky-100/90 bg-gradient-to-r from-[#E1F0FE] via-[#EDF7FF] to-[#E1F0FE] p-6 sm:p-8 shadow-xs">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
              {/* Left: Doctor Avatar + Text */}
              <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-5 text-center sm:text-left">
                <div className="relative size-16 sm:size-20 shrink-0 overflow-hidden rounded-full border-2 border-white shadow-md bg-white">
                  <Image
                    src="/doctorly-assest/bangladeshi-female-doctor-hero.webp"
                    alt="Doctorly Specialist"
                    fill
                    sizes="80px"
                    className="object-cover object-top"
                  />
                </div>

                <div>
                  <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
                    Not Sure Which Specialist You Need?
                  </h3>
                  <p className="mt-1 text-xs sm:text-sm text-slate-600">
                    Tell us your symptoms and we&apos;ll help you find the right doctor.
                  </p>
                </div>
              </div>

              {/* Right: Find My Doctor Button */}
              <Link
                href="/doctors"
                className="group inline-flex items-center gap-2 rounded-full bg-[#0D8BF2] px-6 sm:px-7 py-3 text-sm font-semibold text-white shadow-md shadow-[#0D8BF2]/25 hover:bg-[#0B78D1] transition-all shrink-0"
              >
                <span>Find My Doctor</span>
                <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-0.5" />
              </Link>
            </div>
          </div>

        </div>
      </section>

      {/* FOOTER */}
      <Footer />
    </div>
  );
}
