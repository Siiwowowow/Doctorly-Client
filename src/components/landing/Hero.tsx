"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Play, Users, UserCheck, Star, Headphones } from "lucide-react";
import { useTranslations } from "next-intl";

const patientAvatars = [
  "/doctors/doctor4.png",
  "/doctors/doc-ahmed-hd.jpg",
  "/doctors/doctor7.png",
  "/doctors/doc-rafiqul-hd.jpg",
];

export default function Hero() {
  const t = useTranslations("hero");

  return (
    <div className="relative w-full pb-20 sm:pb-24">
      {/* Hero Section Container */}
      <section className="relative w-full bg-linear-to-r from-[#F0F8FF] via-[#EAF4FF] to-[#E1EFFF] pt-6 sm:pt-10 lg:pt-12 pb-0">
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
        <div className="relative z-10 mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 items-end gap-8 lg:grid-cols-12 lg:gap-8 xl:gap-12">
            {/* Left Column: Text & CTAs */}
            <div className="flex flex-col items-start lg:col-span-7 xl:col-span-7 pb-6 sm:pb-8 lg:pb-10 pt-4 sm:pt-6">
              {/* Eyebrow Pill Tag */}
              <div className="inline-flex items-center gap-2 rounded-full bg-[#DCEBFE] px-3.5 py-1.5 text-xs sm:text-[13px] font-bold tracking-wider text-[#1D63ED] uppercase shadow-xs">
                <span className="size-2 rounded-full bg-[#1D63ED]" />
                <span>{t("eyebrow")}</span>
              </div>

              {/* Main Headline (All Heading Text Blue) */}
              <h1 className="mt-5 font-sans text-4xl sm:text-5xl lg:text-[54px] xl:text-[62px] font-extrabold tracking-tight text-[#1D63ED] leading-[1.12]">
                {t("titleLine1")}
                <br />
                {t("titleLine2")}
                <br />
                <span>{t("titleHighlight")}</span>
              </h1>

              {/* Subtitle Description */}
              <p className="mt-5 max-w-xl text-base sm:text-lg text-slate-600 leading-relaxed font-normal">
                {t("description")}
              </p>

              {/* CTA Action Buttons */}
              <div className="mt-7 sm:mt-8 flex flex-wrap items-center gap-3.5 sm:gap-4">
                {/* Primary Button */}
                <Link
                  href="/doctors"
                  className="group inline-flex items-center justify-center gap-2.5 rounded-full bg-[#1D63ED] hover:bg-[#1552cc] px-7 py-3.5 text-sm sm:text-base font-semibold text-white shadow-lg shadow-[#1D63ED]/25 transition-all duration-200 hover:shadow-xl hover:shadow-[#1D63ED]/35 hover:-translate-y-0.5 active:translate-y-0"
                >
                  <span>{t("bookAppointment")}</span>
                  <ArrowRight className="size-4.5 transition-transform duration-200 group-hover:translate-x-1" />
                </Link>

                {/* Secondary Button with Play Icon */}
                <Link
                  href="/how-it-works"
                  className="group inline-flex items-center justify-center gap-2.5 rounded-full border border-blue-200/90 bg-white hover:bg-blue-50/70 px-6 py-3.5 text-sm sm:text-base font-semibold text-[#1D63ED] shadow-sm transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0"
                >
                  <span>{t("howItWorks")}</span>
                  <span className="flex size-6 items-center justify-center rounded-full border-2 border-[#1D63ED] text-[#1D63ED] transition-transform duration-200 group-hover:scale-105">
                    <Play className="size-2.5 fill-current ml-0.5" />
                  </span>
                </Link>
              </div>

              {/* Social Proof / Avatars */}
              <div className="mt-8 sm:mt-10 flex items-center gap-3.5">
                <div className="flex -space-x-2.5 overflow-hidden">
                  {patientAvatars.map((src, idx) => (
                    <div
                      key={idx}
                      className="relative size-10 rounded-full border-2 border-white shadow-sm overflow-hidden bg-slate-100"
                    >
                      <Image
                        src={src}
                        alt="Patient avatar"
                        fill
                        className="object-cover"
                        sizes="40px"
                      />
                    </div>
                  ))}
                </div>
                <div className="text-xs sm:text-sm leading-tight text-slate-600">
                  <span>{t("trustedBy")} </span>
                  <strong className="font-bold text-slate-900">{t("patientCount")}</strong>
                  <span className="block text-slate-500 font-normal">{t("acrossCountry")}</span>
                </div>
              </div>
            </div>

            {/* Right Column: Doctor, Abstract Bubbles & Floating Card */}
            <div className="relative flex items-end justify-center lg:col-span-5 xl:col-span-5 self-end">
              {/* Doctor Composition Wrapper (Flush with Hero Bottom) */}
              <div className="relative w-full max-w-115 sm:max-w-125 lg:max-w-135 aspect-1122/1402 select-none flex items-end">
                {/* Layer 1: Abstract Blue Circles & Dots Background */}
                <Image
                  src="/doctorly-assest/bg-1.png"
                  alt="Doctorly graphic background"
                  fill
                  priority
                  sizes="(max-width: 768px) 90vw, (max-width: 1200px) 45vw, 540px"
                  className="object-contain object-bottom pointer-events-none select-none scale-105 sm:scale-110"
                />

                {/* Layer 2: Female Doctor Standing with Tablet (Aligned to Bottom) */}
                <Image
                  src="/doctorly-assest/banner1.png"
                  alt="Doctorly Specialist"
                  fill
                  priority
                  sizes="(max-width: 768px) 90vw, (max-width: 1200px) 45vw, 540px"
                  className="relative z-10 object-contain object-bottom pointer-events-none drop-shadow-[0_12px_24px_rgba(0,0,0,0.06)]"
                />

                {/* Layer 3: Handwritten Cursive Note & Arrow (Clear of Doctor's Face) */}
                <div className="absolute top-[26%] sm:top-[28%] lg:top-[30%] -left-8 sm:-left-16 lg:-left-24 xl:-left-28 z-20 select-none pointer-events-none text-left">
                  <div className="font-cursive text-xl sm:text-2xl lg:text-[26px] font-semibold text-[#1D63ED] leading-tight -rotate-6 whitespace-nowrap">
                    {t("priorityNote1")}
                    <br />
                    <span className="inline-flex items-center gap-1.5 ml-1">
                      {t("priorityNote2")}
                    </span>
                  </div>
                  {/* Hand-drawn arrow pointing down towards the doctor */}
                  <svg
                    className="w-8 h-8 sm:w-9 sm:h-9 text-[#1D63ED] mt-0.5 ml-8 rotate-6"
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
        <div className="absolute inset-x-0 bottom-0 z-30 mx-auto w-full max-w-6xl translate-y-[85%] px-4 sm:px-6">
          <div className="w-full rounded-2xl lg:rounded-[22px] bg-white px-5 py-4 sm:px-8 sm:py-5 lg:px-10 lg:py-5 shadow-[0_12px_40px_-10px_rgba(29,99,237,0.10)] border border-blue-100/80">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8 items-center divide-y sm:divide-y-0 lg:divide-x divide-slate-100">
              {/* Stat 1: Patients Served */}
              <div className="flex items-center gap-3.5 sm:gap-4 py-2 sm:py-0">
                <div className="flex size-11 sm:size-12 shrink-0 items-center justify-center rounded-full bg-[#EBF3FE] text-[#1D63ED]">
                  <Users className="size-5 sm:size-6" />
                </div>
                <div>
                  <div className="font-sans text-xl sm:text-2xl font-black tracking-tight text-slate-900 leading-tight">
                    {t("stat1Value")}
                  </div>
                  <div className="text-xs sm:text-sm font-medium text-slate-500">
                    {t("stat1Label")}
                  </div>
                </div>
              </div>

              {/* Stat 2: Verified Doctors */}
              <div className="flex items-center gap-3.5 sm:gap-4 py-2 sm:py-0 pt-4 sm:pt-0 lg:pl-6 xl:pl-8">
                <div className="flex size-11 sm:size-12 shrink-0 items-center justify-center rounded-full bg-[#EBF3FE] text-[#1D63ED]">
                  <UserCheck className="size-5 sm:size-6" />
                </div>
                <div>
                  <div className="font-sans text-xl sm:text-2xl font-black tracking-tight text-slate-900 leading-tight">
                    {t("stat2Value")}
                  </div>
                  <div className="text-xs sm:text-sm font-medium text-slate-500">
                    {t("stat2Label")}
                  </div>
                </div>
              </div>

              {/* Stat 3: Patient Rating */}
              <div className="flex items-center gap-3.5 sm:gap-4 py-2 sm:py-0 pt-4 sm:pt-0 lg:pl-6 xl:pl-8">
                <div className="flex size-11 sm:size-12 shrink-0 items-center justify-center rounded-full bg-[#FEF5E7] text-[#F59E0B]">
                  <Star className="size-5 sm:size-6 fill-[#F59E0B]" />
                </div>
                <div>
                  <div className="font-sans text-xl sm:text-2xl font-black tracking-tight text-slate-900 leading-tight">
                    {t("stat3Value")}
                  </div>
                  <div className="text-xs sm:text-sm font-medium text-slate-500">
                    {t("stat3Label")}
                  </div>
                </div>
              </div>

              {/* Stat 4: Care Support */}
              <div className="flex items-center gap-3.5 sm:gap-4 py-2 sm:py-0 pt-4 sm:pt-0 lg:pl-6 xl:pl-8">
                <div className="flex size-11 sm:size-12 shrink-0 items-center justify-center rounded-full bg-[#E9FBF0] text-[#10B981]">
                  <Headphones className="size-5 sm:size-6" />
                </div>
                <div>
                  <div className="font-sans text-xl sm:text-2xl font-black tracking-tight text-slate-900 leading-tight">
                    {t("stat4Value")}
                  </div>
                  <div className="text-xs sm:text-sm font-medium text-slate-500">
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
