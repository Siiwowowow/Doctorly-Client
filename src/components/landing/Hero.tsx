"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Play, Users, UserCheck, Star, Headphones } from "lucide-react";
import { useTranslations } from "next-intl";

const patientAvatars = [
  "/doctors/doctor4.webp",
  "/doctors/doc-ahmed-hd.webp",
  "/doctors/doctor7.webp",
  "/doctors/doc-rafiqul-hd.webp",
];

export default function Hero() {
  const t = useTranslations("hero");

  return (
    <div className="relative w-full pb-6 sm:pb-8 xl:pb-24">
      {/* Hero Section Container */}
      <section className="relative w-full bg-linear-to-r from-[#F0F8FF] via-[#EAF4FF] to-[#E1EFFF] pt-3 sm:pt-5 lg:pt-12 pb-0">
        {/* Clinic Bokeh Atmosphere & Ambient Background Lights */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          {/* Soft upper-left ambient cloud */}
          <div className="absolute -left-20 -top-20 h-96 w-96 rounded-full bg-white/80 blur-3xl" />
          <div className="absolute left-1/3 top-1/4 h-80 w-80 rounded-full bg-white/50 blur-3xl" />
          {/* Right-side hospital/clinic bokeh background atmosphere */}
          <div className="absolute right-0 top-0 h-full w-full lg:w-1/2 bg-linear-to-l from-emerald-100/30 via-sky-100/40 to-transparent" />
          <div className="absolute right-12 top-10 h-72 w-72 rounded-full bg-teal-200/20 blur-3xl" />
          <div className="absolute right-1/4 bottom-10 h-80 w-80 rounded-full bg-blue-300/25 blur-3xl" />
        </div>

        {/* Main Content Area: Left Text and Right Doctor Image */}
        <div className="relative z-10 mx-auto w-full max-w-7xl px-3 sm:px-5 lg:px-8">
          <div className="grid grid-cols-12 items-end gap-1 sm:gap-3 lg:gap-8 xl:gap-12">
            {/* Left Column: Text & CTAs */}
            <div className="col-span-7 flex min-w-0 flex-col items-start pb-4 pt-2 sm:pb-6 sm:pt-3 lg:pb-10 lg:pt-6 xl:col-span-7">
              {/* Eyebrow Pill Tag */}
              <div className="inline-flex items-center gap-1 rounded-full bg-[#DCEBFE] px-2 py-1 text-[7px] font-bold tracking-wider text-[#1D63ED] uppercase shadow-xs sm:gap-1.5 sm:px-3 sm:text-[9px] lg:gap-2 lg:px-3.5 lg:py-1.5 lg:text-[13px]">
                <span className="size-1 rounded-full bg-[#1D63ED] sm:size-1.5 lg:size-2" />
                <span>{t("eyebrow")}</span>
              </div>

              {/* Main Headline (All Heading Text Blue) */}
              <h1 className="mt-2 font-sans text-[clamp(1.35rem,5.5vw,3.875rem)] leading-[1.05] font-extrabold tracking-tight text-[#1D63ED] sm:mt-3 lg:mt-5 lg:leading-[1.12]">
                {t("titleLine1")}
                <br />
                {t("titleLine2")}
                <br />
                <span>{t("titleHighlight")}</span>
              </h1>

              {/* Subtitle Description */}
              <p className="mt-2 max-w-xl text-[9px] leading-[1.4] font-normal text-slate-600 sm:mt-3 sm:text-xs lg:mt-5 lg:text-lg lg:leading-relaxed">
                {t("description")}
              </p>

              {/* CTA Action Buttons */}
              <div className="mt-3 flex flex-nowrap items-center gap-1.5 sm:mt-5 sm:gap-2.5 lg:mt-8 lg:gap-4">
                {/* Primary Button */}
                <Link
                  href="/doctors"
                  className="group inline-flex items-center justify-center gap-1 whitespace-nowrap rounded-full bg-[#1D63ED] px-3 py-2 text-[8px] font-semibold text-white shadow-lg shadow-[#1D63ED]/25 transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#1552cc] hover:shadow-xl hover:shadow-[#1D63ED]/35 active:translate-y-0 sm:gap-1.5 sm:px-4 sm:py-2.5 sm:text-[10px] lg:gap-2.5 lg:px-7 lg:py-3.5 lg:text-base"
                >
                  <span>{t("bookAppointment")}</span>
                  <ArrowRight className="size-3 transition-transform duration-200 group-hover:translate-x-1 sm:size-3.5 lg:size-4.5" />
                </Link>

                {/* Secondary Button with Play Icon */}
                <Link
                  href="/how-it-works"
                  className="group inline-flex items-center justify-center gap-1 whitespace-nowrap rounded-full border border-blue-200/90 bg-white px-2.5 py-2 text-[8px] font-semibold text-[#1D63ED] shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:bg-blue-50/70 active:translate-y-0 sm:gap-1.5 sm:px-4 sm:py-2.5 sm:text-[10px] lg:gap-2.5 lg:px-6 lg:py-3.5 lg:text-base"
                >
                  <span>{t("howItWorks")}</span>
                  <span className="flex size-4 items-center justify-center rounded-full border border-[#1D63ED] text-[#1D63ED] transition-transform duration-200 group-hover:scale-105 sm:size-5 lg:size-6 lg:border-2">
                    <Play className="ml-0.5 size-1.5 fill-current sm:size-2 lg:size-2.5" />
                  </span>
                </Link>
              </div>

              {/* Social Proof / Avatars */}
              <div className="mt-3 flex items-center gap-1.5 sm:mt-5 sm:gap-2.5 lg:mt-10 lg:translate-y-[-1rem] lg:gap-3.5">
                <div className="flex -space-x-1.5 overflow-hidden sm:-space-x-2 lg:-space-x-2.5">
                  {patientAvatars.map((src, idx) => (
                    <div
                      key={idx}
                      className="relative size-6 overflow-hidden rounded-full border border-white bg-slate-100 shadow-sm sm:size-8 lg:size-10 lg:border-2"
                    >
                      <Image
                        src={src}
                        alt="Patient avatar"
                        fill
                        className="object-cover"
                        sizes="(max-width: 640px) 24px, (max-width: 1024px) 32px, 40px"
                      />
                    </div>
                  ))}
                </div>
                <div className="text-[7px] leading-tight text-slate-600 sm:text-[9px] lg:text-sm">
                  <span>{t("trustedBy")} </span>
                  <strong className="font-bold text-slate-900">{t("patientCount")}</strong>
                  <span className="block text-slate-500 font-normal">{t("acrossCountry")}</span>
                </div>
              </div>
            </div>

            {/* Right Column: Doctor, Abstract Bubbles & Floating Card */}
            <div className="relative col-span-5 flex items-end justify-center self-end xl:col-span-5">
              {/* Doctor Composition Wrapper (Flush with Hero Bottom) */}
              <div className="relative flex aspect-1122/1402 w-full max-w-115 select-none items-end sm:max-w-125 lg:max-w-135">
                {/* Layer 1: Abstract Blue Circles & Dots Background */}
                <Image
                  src="/doctorly-assest/bg-1.webp"
                  alt="Doctorly graphic background"
                  fill
                  priority
                  sizes="(max-width: 768px) 90vw, (max-width: 1200px) 45vw, 540px"
                  className="object-contain object-bottom pointer-events-none select-none scale-105 sm:scale-110"
                />

                {/* Layer 2: Female Doctor Standing with Tablet (Aligned to Bottom) */}
                <Image
                  src="/doctorly-assest/banner1.webp"
                  alt="Doctorly Specialist"
                  fill
                  priority
                  sizes="(max-width: 768px) 90vw, (max-width: 1200px) 45vw, 540px"
                  className="relative z-10 object-contain object-bottom pointer-events-none drop-shadow-[0_12px_24px_rgba(0,0,0,0.06)]"
                />

                {/* Layer 3: Handwritten Cursive Note & Arrow (Clear of Doctor's Face) */}
                <div className="pointer-events-none absolute top-[27%] -left-4 z-20 hidden select-none text-left sm:top-[28%] sm:-left-10 lg:top-[30%] lg:left-[-6rem] lg:block xl:left-[-7rem]">
                  <div className="-rotate-6 whitespace-nowrap font-cursive text-[9px] leading-tight font-semibold text-[#1D63ED] sm:text-sm lg:text-[26px]">
                    {t("priorityNote1")}
                    <br />
                    <span className="inline-flex items-center gap-1.5 ml-1">
                      {t("priorityNote2")}
                    </span>
                  </div>
                  {/* Hand-drawn arrow pointing down towards the doctor */}
                  <svg
                    className="mt-0.5 ml-4 h-4 w-4 rotate-6 text-[#1D63ED] sm:ml-6 sm:h-6 sm:w-6 lg:ml-8 lg:h-9 lg:w-9"
                    viewBox="0 0 36 36"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M8 8C12 16 18 22 26 24"
                      stroke="currentColor"
                      strokeWidth="2.2"
                      strokeLinecap="round"
                    />
                    <path
                      d="M20 25L26 24L24 18"
                      stroke="currentColor"
                      strokeWidth="2.2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>

              </div>
            </div>
          </div>
        </div>

        {/* Floating Stats Bar: Half inside Hero bottom, Half outside */}
        <div className="relative z-30 mx-auto mt-3 w-full max-w-6xl px-3 sm:mt-4 sm:px-5 xl:absolute xl:inset-x-0 xl:bottom-0 xl:mt-0 xl:px-6 xl:translate-y-1/2">
          <div className="w-full rounded-xl border border-blue-100/80 bg-white px-1.5 py-2 shadow-[0_12px_40px_-10px_rgba(29,99,237,0.10)] sm:rounded-2xl sm:px-3 sm:py-3 lg:rounded-[22px] lg:px-10 lg:py-5">
            <div className="grid grid-cols-4 items-center divide-x divide-slate-100">
              {/* Stat 1: Patients Served */}
              <div className="flex min-w-0 items-center gap-1 px-1 py-1 sm:gap-2 sm:px-2 lg:gap-4 lg:px-0 lg:py-0">
                <div className="flex size-7 shrink-0 items-center justify-center rounded-full bg-[#EBF3FE] text-[#1D63ED] sm:size-9 lg:size-12">
                  <Users className="size-3 sm:size-4 lg:size-6" />
                </div>
                <div className="min-w-0">
                  <div className="font-sans text-[11px] leading-tight font-black tracking-tight text-slate-900 sm:text-base lg:text-2xl">
                    {t("stat1Value")}
                  </div>
                  <div className="whitespace-nowrap text-[6px] font-medium text-slate-500 sm:text-[9px] lg:text-sm">
                    {t("stat1Label")}
                  </div>
                </div>
              </div>

              {/* Stat 2: Verified Doctors */}
              <div className="flex min-w-0 items-center gap-1 px-1 py-1 sm:gap-2 sm:px-2 lg:gap-4 lg:px-6 lg:py-0 xl:px-8">
                <div className="flex size-7 shrink-0 items-center justify-center rounded-full bg-[#EBF3FE] text-[#1D63ED] sm:size-9 lg:size-12">
                  <UserCheck className="size-3 sm:size-4 lg:size-6" />
                </div>
                <div className="min-w-0">
                  <div className="font-sans text-[11px] leading-tight font-black tracking-tight text-slate-900 sm:text-base lg:text-2xl">
                    {t("stat2Value")}
                  </div>
                  <div className="whitespace-nowrap text-[6px] font-medium text-slate-500 sm:text-[9px] lg:text-sm">
                    {t("stat2Label")}
                  </div>
                </div>
              </div>

              {/* Stat 3: Patient Rating */}
              <div className="flex min-w-0 items-center gap-1 px-1 py-1 sm:gap-2 sm:px-2 lg:gap-4 lg:px-6 lg:py-0 xl:px-8">
                <div className="flex size-7 shrink-0 items-center justify-center rounded-full bg-[#FEF5E7] text-[#F59E0B] sm:size-9 lg:size-12">
                  <Star className="size-3 fill-[#F59E0B] sm:size-4 lg:size-6" />
                </div>
                <div className="min-w-0">
                  <div className="font-sans text-[11px] leading-tight font-black tracking-tight text-slate-900 sm:text-base lg:text-2xl">
                    {t("stat3Value")}
                  </div>
                  <div className="whitespace-nowrap text-[6px] font-medium text-slate-500 sm:text-[9px] lg:text-sm">
                    {t("stat3Label")}
                  </div>
                </div>
              </div>

              {/* Stat 4: Care Support */}
              <div className="flex min-w-0 items-center gap-1 px-1 py-1 sm:gap-2 sm:px-2 lg:gap-4 lg:px-6 lg:py-0 xl:px-8">
                <div className="flex size-7 shrink-0 items-center justify-center rounded-full bg-[#E9FBF0] text-[#10B981] sm:size-9 lg:size-12">
                  <Headphones className="size-3 sm:size-4 lg:size-6" />
                </div>
                <div className="min-w-0">
                  <div className="font-sans text-[11px] leading-tight font-black tracking-tight text-slate-900 sm:text-base lg:text-2xl">
                    {t("stat4Value")}
                  </div>
                  <div className="whitespace-nowrap text-[6px] font-medium text-slate-500 sm:text-[9px] lg:text-sm">
                    {t("stat4Label")}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
