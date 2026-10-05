"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";

export default function Specialties() {
  const t = useTranslations("specialties");
  const locale = useLocale();

  const specialties = [
    {
      id: "general-medicine",
      name: t("generalMedicine"),
      desc: t("generalMedicineDesc"),
      href: "/doctors?specialty=General Medicine",
      haloBg: "bg-[#E1EFFF]",
      icon: (
        <svg
          className="size-8 text-[#0d8bf2]"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.3"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M4.5 3v5a4.5 4.5 0 0 0 9 0V3" />
          <path d="M3.5 3h2" />
          <path d="M12.5 3h2" />
          <path d="M9 12.5v3.5a4 4 0 0 0 4 4h1" />
          <circle cx="18" cy="20" r="2.5" fill="currentColor" />
        </svg>
      ),
    },
    {
      id: "pediatrics",
      name: t("pediatrics"),
      desc: t("pediatricsDesc"),
      href: "/doctors?specialty=Pediatrics",
      haloBg: "bg-[#DDF8F5]",
      icon: (
        <svg
          className="size-8 text-[#00BCD4]"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <circle cx="12" cy="13" r="7.5" />
          <path d="M12 5.5c-.8-1.3-2.2-1.5-2.2-.2 0 1.5 2.2 1.2 2.2 2.2" />
          <path d="M4.5 11.5a2 2 0 0 0 0 3.5" />
          <path d="M19.5 11.5a2 2 0 0 1 0 3.5" />
          <circle cx="9.5" cy="12" r="1.1" fill="currentColor" stroke="none" />
          <circle cx="14.5" cy="12" r="1.1" fill="currentColor" stroke="none" />
          <path d="M9.5 15.5c.8 1.2 4.2 1.2 5 0" />
        </svg>
      ),
    },
    {
      id: "gynecology",
      name: t("gynecology"),
      desc: t("gynecologyDesc"),
      href: "/doctors?specialty=Gynecology",
      haloBg: "bg-[#FEE5E9]",
      icon: (
        <svg
          className="size-8 text-[#FF385C]"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.4"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <circle cx="12" cy="9" r="6" />
          <path d="M12 15v6.5" />
          <path d="M8.5 19.5h7" />
        </svg>
      ),
    },
    {
      id: "dermatology",
      name: t("dermatology"),
      desc: t("dermatologyDesc"),
      href: "/doctors?specialty=Dermatology",
      haloBg: "bg-[#FFEFE3]",
      icon: (
        <svg
          className="size-8 text-[#FF7715]"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.3"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M12 3.5v12.5" />
          <path d="M8 8.5c-.8 2-.8 5 0 7.5" />
          <path d="M16 8.5c.8 2 .8 5 0 7.5" />
          <circle cx="6" cy="13" r="0.8" fill="currentColor" stroke="none" />
          <circle cx="18" cy="13" r="0.8" fill="currentColor" stroke="none" />
          <path d="M4 19.5c2.5-.8 5.5-1 8-1s5.5.2 8 1" />
        </svg>
      ),
    },
    {
      id: "mental-health",
      name: t("mentalHealth"),
      desc: t("mentalHealthDesc"),
      href: "/doctors?specialty=Mental Health",
      haloBg: "bg-[#F1EAFF]",
      icon: (
        <svg
          className="size-8 text-[#8B5CF6]"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M9.5 2a4.5 4.5 0 0 0-4.5 4.5c0 .4.05.8.15 1.18A4 4 0 0 0 3 11.5a4 4 0 0 0 1.5 3.16 4.5 4.5 0 0 0 5 7.34V22" />
          <path d="M14.5 2a4.5 4.5 0 0 1 4.5 4.5c0 .4-.05.8-.15 1.18A4 4 0 0 1 21 11.5a4 4 0 0 1-1.5 3.16 4.5 4.5 0 0 1-5 7.34V22" />
          <path d="M8 12a3 3 0 0 0 4 2.5" />
          <path d="M16 12a3 3 0 0 1-4 2.5" />
          <path d="M8.5 17.5a2.5 2.5 0 0 0 3.5 1.5" />
          <path d="M15.5 17.5a2.5 2.5 0 0 1-3.5 1.5" />
          <circle cx="9.5" cy="7" r="1" fill="currentColor" stroke="none" />
          <circle cx="14.5" cy="7" r="1" fill="currentColor" stroke="none" />
        </svg>
      ),
    },
  ];

  return (
    <section id="specialties" className="font-sans relative w-full py-8 sm:py-10 lg:py-12">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Top Header Section - Compact & Sleek */}
        <div className="mb-6 flex flex-col gap-3 sm:mb-8 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-2xl">
            {/* Pill Badge: Dot + OUR SPECIALTIES */}
            <div className="inline-flex items-center gap-1.5 rounded-full border border-[#0d8bf2]/25 bg-white px-3 py-0.5 text-xs font-bold tracking-wider text-[#0d8bf2] uppercase shadow-xs">
              <span className="size-2 rounded-full bg-[#0d8bf2]" />
              <span>{t("eyebrow")}</span>
            </div>

            {/* Heading: Black and Blue (#0d8bf2) mixed together */}
            <h2 className="mt-2.5 font-sans text-xl sm:text-2xl lg:text-[30px] font-extrabold leading-tight tracking-tight">
              {locale === "bn" ? (
                <>
                  <span className="text-black">বিশেষজ্ঞ স্বাস্থ্যসেবা</span>{" "}
                  <span className="text-[#0d8bf2]">বিভিন্ন বিশেষত্বে</span>
                </>
              ) : (
                <>
                  <span className="text-black">Expert Care Across a</span>{" "}
                  <span className="text-[#0d8bf2]">Wide Range of Specialties</span>
                </>
              )}
            </h2>

            {/* Subtitle */}
            <p className="mt-1 font-sans text-xs sm:text-sm leading-relaxed text-slate-600 font-normal">
              {t("subtitle")}
            </p>
          </div>

          {/* View All Specialties Link */}
          <Link
            href="/specialties"
            className="group inline-flex w-fit items-center gap-2 font-sans text-xs sm:text-sm font-bold text-[#0d8bf2] transition-colors hover:text-[#0b78d1] shrink-0"
          >
            <span>{t("viewAll")}</span>
            <span className="flex size-7.5 items-center justify-center rounded-full border border-[#0d8bf2]/20 bg-white text-[#0d8bf2] shadow-xs transition-all duration-300 group-hover:border-[#0d8bf2] group-hover:bg-[#0d8bf2] group-hover:text-white group-hover:translate-x-0.5 group-hover:shadow-[0_4px_12px_rgba(13,139,242,0.3)]">
              <ArrowRight className="size-3.5" />
            </span>
          </Link>
        </div>

        {/* 5 Specialty Cards Grid - Standalone Cards without outer container */}
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 lg:gap-3.5">
          {specialties.map((spec) => (
            <Link
              key={spec.id}
              href={spec.href}
              className="group flex min-h-[230px] sm:min-h-[250px] flex-col justify-between rounded-2xl border border-slate-200/80 bg-white p-5 shadow-[0_4px_18px_-4px_rgba(13,139,242,0.08)] backdrop-blur-xs transition-all duration-300 hover:-translate-y-1 hover:border-[#0d8bf2] hover:shadow-[0_12px_28px_-6px_rgba(13,139,242,0.2)]"
            >
              {/* Top Content (Centered like the reference image) */}
              <div className="flex w-full flex-col items-center text-center">
                {/* Icon Halo */}
                <div
                  className={`flex size-14 sm:size-16 items-center justify-center rounded-full ${spec.haloBg} shadow-xs transition-transform duration-300 group-hover:scale-108`}
                >
                  {spec.icon}
                </div>

                {/* Title: Solid Black */}
                <h3
                  style={{ color: "#000000" }}
                  className="mt-3.5 sm:mt-4 font-sans text-[16px] sm:text-[17px] font-bold leading-tight text-black!"
                >
                  {spec.name}
                </h3>

                {/* Description: Clean #0d8bf2 Blue text */}
                <p className="mt-1.5 font-sans text-[12px] sm:text-[13px] font-medium leading-snug text-[#0d8bf2] max-w-[170px]">
                  {spec.desc}
                </p>
              </div>

              {/* Bottom Action: Circular Arrow Button on Bottom-Left */}
              <div className="mt-4 pt-1 w-full flex justify-start">
                <span className="flex size-7.5 items-center justify-center rounded-full border border-[#DCEAF8] bg-white text-[#0d8bf2] shadow-xs transition-all duration-300 group-hover:border-[#0d8bf2] group-hover:bg-[#0d8bf2] group-hover:text-white group-hover:shadow-[0_4px_12px_rgba(13,139,242,0.3)]">
                  <ArrowRight className="size-3.5 transition-transform duration-300 group-hover:translate-x-0.5" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
