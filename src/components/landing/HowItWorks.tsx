"use client";

import Image from "next/image";
import { User, Calendar, Video, FileText, ArrowRight, Phone, Mic, Camera, Sparkles, MessageSquare, Home, Stethoscope } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";

export default function HowItWorks() {
  const t = useTranslations("howItWorks");
  const locale = useLocale();

  const steps = [
    {
      step: 1,
      icon: User,
      titlePart1: locale === "bn" ? "অ্যাকাউন্ট" : "Create",
      titlePart2: locale === "bn" ? "তৈরি করুন" : "Account",
      desc: t("step1Desc"),
    },
    {
      step: 2,
      icon: Calendar,
      titlePart1: locale === "bn" ? "অ্যাপয়েন্টমেন্ট" : "Book",
      titlePart2: locale === "bn" ? "বুক করুন" : "Appointment",
      desc: t("step2Desc"),
    },
    {
      step: 3,
      icon: Video,
      titlePart1: locale === "bn" ? "অনলাইনে" : "Consult",
      titlePart2: locale === "bn" ? "পরামর্শ নিন" : "Online",
      desc: t("step3Desc"),
    },
    {
      step: 4,
      icon: FileText,
      titlePart1: locale === "bn" ? "চিকিৎসা সেবা" : "Get",
      titlePart2: locale === "bn" ? "পান" : "Treatment",
      desc: t("step4Desc"),
    },
  ];

  return (
    <section
      id="how-it-works"
      className="font-sans relative overflow-hidden bg-gradient-to-r from-[#EBF9F6] via-[#F4FBFA] to-[#F1F9FD] border-y border-[#D6F5EE]/80 py-10 sm:py-12 lg:py-14"
    >
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Main Content Layout: Left Phone Mockup & Right Header + 4 Steps */}
        <div className="flex flex-col lg:flex-row items-center lg:items-start gap-8 lg:gap-6 xl:gap-8">
          {/* Left Column: Phone Mockup with Organic Mint Splash Backdrop & Handwritten Note */}
          <div className="relative shrink-0 flex justify-center lg:w-[320px] xl:w-[350px]">
            {/* Organic Watercolor Mint Splash SVG Shape Behind Phone */}
            <div className="absolute -inset-10 -z-10 flex items-center justify-center pointer-events-none">
              <svg className="w-88 h-88 sm:w-96 sm:h-96 text-[#CEF3EB]/85" viewBox="0 0 200 200" fill="currentColor">
                <path
                  d="M43.3,-62.7C55.4,-54.6,64.2,-41.8,70.1,-27.5C76.1,-13.2,79.1,2.6,75.4,17.2C71.8,31.7,61.4,45,48.5,54.4C35.5,63.7,20.1,69.1,4.2,70.9C-11.7,72.7,-28.1,70.9,-41.6,62.8C-55.1,54.6,-65.7,40.1,-71.4,24.1C-77.2,8,-78.1,-9.6,-72.6,-24.5C-67.1,-39.4,-55.1,-51.7,-41.6,-59.3C-28.1,-66.9,-13,-69.8,1.4,-71.7C15.8,-73.6,31.2,-70.7,43.3,-62.7Z"
                  transform="translate(100 100)"
                />
              </svg>
            </div>

            {/* Additional Radial Mint/Cyan Blur Glow */}
            <div className="absolute -inset-4 rounded-full bg-gradient-to-tr from-cyan-200/50 via-teal-100/40 to-blue-200/40 blur-3xl -z-10" />

            {/* Decorative Sparkle Doodles matching reference image */}
            <span className="absolute -top-3 left-4 text-[#00BCD4] text-lg select-none">✦</span>
            <span className="absolute bottom-10 -left-4 text-amber-400 text-xl select-none">✦</span>
            <span className="absolute top-1/2 -right-4 text-teal-400 text-base select-none">★</span>
            <span className="absolute -bottom-2 right-12 text-[#0d8bf2] text-sm select-none">✦</span>

            {/* Playful Handwritten Note Above Phone */}
            <div className="pointer-events-none absolute -top-11 left-0 sm:-top-12 sm:left-2 z-20 select-none flex items-end gap-1.5">
              <p className="font-cursive text-2xl sm:text-[26px] font-bold text-[#00897B] -rotate-6 leading-tight whitespace-nowrap">
                {locale === "bn" ? "আপনার স্বাস্থ্য আপনার হাতে" : "Your health\nin your hands"}
              </p>
              {/* Cute Burst Lines Doodle \ | / */}
              <svg className="size-6 text-[#00BCD4] -rotate-12 mb-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <line x1="12" y1="2" x2="12" y2="7" />
                <line x1="4.5" y1="5.5" x2="8" y2="9" />
                <line x1="19.5" y1="5.5" x2="16" y2="9" />
              </svg>
            </div>

            {/* Realistic Smartphone Frame with Subtle Angle */}
            <div className="relative w-64 sm:w-70 rounded-[38px] border-[7px] border-slate-900 bg-slate-900 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.25)] overflow-hidden select-none -rotate-1 sm:-rotate-2 hover:rotate-0 transition-transform duration-500">
              {/* Top Notch / Dynamic Island */}
              <div className="absolute top-2.5 left-1/2 -translate-x-1/2 h-3.5 w-24 rounded-full bg-slate-900 z-30 flex items-center justify-center gap-2">
                <span className="size-1 rounded-full bg-slate-700" />
                <span className="size-2 rounded-full bg-slate-800" />
              </div>

              {/* Screen Content */}
              <div className="bg-white">
                {/* Status Bar */}
                <div className="flex items-center justify-between px-6 pt-2 pb-1 text-[10px] font-semibold text-slate-800">
                  <span>9:41</span>
                  <div className="flex items-center gap-1.5 text-slate-700">
                    <span className="text-[10px]">5G</span>
                    <span className="size-2 rounded-full bg-slate-800" />
                  </div>
                </div>

                {/* Top Half: Video Consultation Call Screen */}
                <div className="relative h-56 w-full bg-slate-100 overflow-hidden">
                  <Image
                    src="/doctors/doc-ahmed-hd.jpg"
                    alt="Doctor Consultation"
                    fill
                    sizes="280px"
                    className="object-cover object-top"
                    priority
                  />

                  {/* Gradient Overlay for controls */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20 pointer-events-none" />

                  {/* Top Doctor Info Badge */}
                  <div className="absolute top-3 left-3 right-3 flex items-center justify-between text-white text-[11px] font-medium z-10">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-black/40 backdrop-blur-md px-2.5 py-0.5">
                      <span className="size-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      Dr. Ahmed (Online)
                    </span>
                    <span className="rounded-full bg-black/40 backdrop-blur-md px-2 py-0.5 text-[10px]">
                      12:45
                    </span>
                  </div>

                  {/* In-Call Action Control Buttons */}
                  <div className="absolute bottom-3 left-0 right-0 flex items-center justify-center gap-3 z-10">
                    <button
                      type="button"
                      aria-label="Mute microphone"
                      className="size-7.5 rounded-full bg-black/50 backdrop-blur-md text-white flex items-center justify-center hover:bg-black/70 transition-colors"
                    >
                      <Mic className="size-3.5" />
                    </button>
                    <button
                      type="button"
                      aria-label="End consultation call"
                      className="size-9 rounded-full bg-red-500 text-white flex items-center justify-center shadow-md hover:bg-red-600 transition-colors"
                    >
                      <Phone className="size-4 rotate-[135deg]" />
                    </button>
                    <button
                      type="button"
                      aria-label="Toggle camera"
                      className="size-7.5 rounded-full bg-black/50 backdrop-blur-md text-white flex items-center justify-center hover:bg-black/70 transition-colors"
                    >
                      <Camera className="size-3.5" />
                    </button>
                  </div>
                </div>

                {/* Bottom Half: App Dashboard Grid Shortcuts */}
                <div className="p-3.5 bg-white">
                  <div className="grid grid-cols-4 gap-2 text-center">
                    <div className="flex flex-col items-center">
                      <div className="flex size-9 items-center justify-center rounded-xl bg-blue-50 text-[#0d8bf2] shadow-xs">
                        <Video className="size-4" />
                      </div>
                      <span className="mt-1 text-[9px] font-bold text-slate-700">Video</span>
                    </div>

                    <div className="flex flex-col items-center">
                      <div className="flex size-9 items-center justify-center rounded-xl bg-teal-50 text-[#00BCD4] shadow-xs">
                        <Stethoscope className="size-4" />
                      </div>
                      <span className="mt-1 text-[9px] font-bold text-slate-700">Doctors</span>
                    </div>

                    <div className="flex flex-col items-center">
                      <div className="flex size-9 items-center justify-center rounded-xl bg-rose-50 text-rose-500 shadow-xs">
                        <FileText className="size-4" />
                      </div>
                      <span className="mt-1 text-[9px] font-bold text-slate-700">Rx</span>
                    </div>

                    <div className="flex flex-col items-center">
                      <div className="flex size-9 items-center justify-center rounded-xl bg-amber-50 text-amber-500 shadow-xs">
                        <Calendar className="size-4" />
                      </div>
                      <span className="mt-1 text-[9px] font-bold text-slate-700">Book</span>
                    </div>
                  </div>

                  {/* Mini Bottom Nav Icons */}
                  <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-around text-slate-400">
                    <Home className="size-3.5 text-[#0d8bf2]" />
                    <User className="size-3.5" />
                    <MessageSquare className="size-3.5" />
                    <Calendar className="size-3.5" />
                  </div>

                  {/* Mini Home Indicator Bar */}
                  <div className="mt-2.5 flex justify-center">
                    <div className="h-1 w-20 rounded-full bg-slate-300" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Unified Header + 4 Steps Spreading out comfortably */}
          <div className="flex-1 w-full flex flex-col justify-between">
            {/* Top Header Section with Cursive Note on Right */}
            <div className="relative mb-10 sm:mb-12">
              <div className="mx-auto max-w-2xl text-center">
                {/* Pill Badge with Doodle Arrow to its left */}
                <div className="inline-flex items-center gap-2">
                  {/* Left Hand-drawn Arrow Doodle pointing to Badge */}
                  <svg
                    className="size-5 text-[#00BCD4] -rotate-12 hidden sm:block"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <path d="M4 18 C 6 8, 14 6, 20 8" />
                    <polyline points="15 4 20 8 16 12" />
                  </svg>

                  <div className="inline-flex items-center gap-1.5 rounded-full border border-[#B7EFE8] bg-[#E2F8F4] px-4 py-1 text-xs font-bold tracking-wider text-[#00897B] uppercase shadow-xs">
                    <Sparkles className="size-3 text-[#00897B]" />
                    <span>{t("eyebrow")}</span>
                  </div>
                </div>

                {/* Heading: Black and Blue mixed together */}
                <h2 className="mt-3.5 font-sans text-2xl sm:text-3xl lg:text-[34px] font-extrabold leading-tight tracking-tight">
                  {locale === "bn" ? (
                    <>
                      <span className="text-black">শুরু করুন মাত্র</span>{" "}
                      <span className="text-[#0d8bf2]">৪টি সহজ ধাপে</span>
                    </>
                  ) : (
                    <>
                      <span className="text-black">Get Started in</span>{" "}
                      <span className="text-[#0d8bf2]">4 Simple Steps</span>
                    </>
                  )}
                </h2>

                {/* Subtitle */}
                <p className="mt-2 font-sans text-sm leading-relaxed text-slate-600 sm:text-base font-normal">
                  {locale === "bn" ? (
                    <>
                      <span className="font-semibold text-[#0d8bf2]">স্বাস্থ্যসেবা</span> এখন মাত্র কয়েকটি ক্লিকেই আপনার কাছে।
                    </>
                  ) : (
                    <>
                      <span className="font-semibold text-[#0d8bf2]">Healthcare</span> is just a few clicks away.
                    </>
                  )}
                </p>
              </div>

              {/* Top Right Cursive Annotation with Hand-drawn Arrow */}
              <div className="pointer-events-none absolute right-0 top-0 hidden select-none xl:block">
                <p className="font-cursive text-xl font-bold text-[#00897B] rotate-3 whitespace-nowrap">
                  {t("noteRight")}
                </p>
                {/* Curved Hand-Drawn Arrow pointing down towards Step 4 */}
                <svg
                  className="ml-6 mt-1 size-7 text-[#00BCD4] rotate-12"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M4 4 C 12 6, 16 12, 14 20" />
                  <polyline points="9 16 14 20 18 16" />
                </svg>
              </div>
            </div>

            {/* 4 Connected Steps Flow (Well-organized & Horizontal Sequence) */}
            <div className="w-full">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-4 lg:gap-3 items-start relative">
                {steps.map((step, idx) => {
                  const Icon = step.icon;
                  const isLast = idx === steps.length - 1;

                  return (
                    <div key={step.step} className="flex flex-col items-center text-center relative group">
                      {/* Step Icon Circle with Cyan Number Badge */}
                      <div className="relative">
                        {/* Number Badge at Top-Left */}
                        <span className="absolute -top-1.5 -left-1.5 size-7 sm:size-7.5 rounded-full bg-[#00BCD4] text-white text-xs font-black flex items-center justify-center shadow-md border-2 border-white z-20">
                          {step.step}
                        </span>

                        {/* Soft Circular Icon Halo */}
                        <div className="flex size-18 sm:size-20 items-center justify-center rounded-full bg-white border-2 border-[#C6F2EA] shadow-[0_4px_16px_rgba(0,188,212,0.12)] transition-transform duration-300 group-hover:scale-105 group-hover:border-[#00BCD4]">
                          <Icon className="size-7 sm:size-7.5 text-[#00BCD4]" strokeWidth={2.2} />
                        </div>
                      </div>

                      {/* Step Title: Black and Blue mixed */}
                      <h3 className="mt-4 font-sans text-base sm:text-[17px] font-bold leading-tight">
                        <span className="text-black">{step.titlePart1}</span>{" "}
                        <span className="text-[#0d8bf2]">{step.titlePart2}</span>
                      </h3>

                      {/* Description: Well-organized, readable text */}
                      <p className="mt-2 font-sans text-xs sm:text-[13px] leading-relaxed text-slate-500 max-w-[200px]">
                        {step.desc}
                      </p>

                      {/* Connecting Arrow between steps (only on desktop between cards) */}
                      {!isLast && (
                        <div className="hidden lg:flex absolute -right-3 top-8 text-[#00BCD4]/70 z-10">
                          <ArrowRight className="size-5" />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
