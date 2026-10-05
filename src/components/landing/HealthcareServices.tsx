"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";

export default function HealthcareServices() {
  const t = useTranslations("services");
  const locale = useLocale();

  const services = [
    {
      title: t("srv1Title"),
      desc: t("srv1Desc"),
      href: "/doctors",
      haloBg: "bg-[#0d8bf2]/10",
      icon: (
        <svg className="size-6 text-[#0d8bf2]" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M4 6a3 3 0 0 0-3 3v6a3 3 0 0 0 3 3h8a3 3 0 0 0 3-3V9a3 3 0 0 0-3-3H4zm13.73 3.12 3.82-2.55A1 1 0 0 1 23 7.4v9.2a1 1 0 0 1-1.45.83l-3.82-2.55a1 1 0 0 1-.45-.83V9.95a1 1 0 0 1 .45-.83z" />
        </svg>
      ),
    },
    {
      title: t("srv2Title"),
      desc: t("srv2Desc"),
      href: "/doctors",
      haloBg: "bg-[#E1FAF7]",
      icon: (
        <svg className="size-6 text-[#00BCD4]" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <rect x="2" y="3" width="20" height="14" rx="4" fill="currentColor" />
          <path d="M5 17l-2.5 3.5A.5.5 0 0 0 3.3 21.3L7 17H5z" fill="currentColor" />
          <circle cx="7.5" cy="10" r="1.3" fill="white" />
          <circle cx="12" cy="10" r="1.3" fill="white" />
          <circle cx="16.5" cy="10" r="1.3" fill="white" />
        </svg>
      ),
    },
    {
      title: t("srv3Title"),
      desc: t("srv3Desc"),
      href: "/services",
      haloBg: "bg-[#FEECEF]",
      icon: (
        <svg className="size-6 text-[#FF385C]" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M4 4a2 2 0 0 1 2-2h8.5L20 7.5V20a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V4z" fill="currentColor" />
          <path d="M14 2v6h6" fill="#FFA4B2" fillOpacity="0.4" />
          <rect x="7.5" y="11" width="9" height="1.8" rx="0.9" fill="white" />
          <rect x="7.5" y="15" width="6" height="1.8" rx="0.9" fill="white" />
        </svg>
      ),
    },
    {
      title: t("srv4Title"),
      desc: t("srv4Desc"),
      href: "/services",
      haloBg: "bg-[#F8EAFD]",
      icon: (
        <svg
          className="size-6 text-[#BA29E8]"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M10 2v7.5a2 2 0 0 1-.2 1L5 20a1.5 1.5 0 0 0 1.3 2h11.4a1.5 1.5 0 0 0 1.3-2l-4.8-9.5a2 2 0 0 1-.2-1V2" />
          <path d="M8.5 2h7" />
          <path d="M7 16h10" />
          <path
            d="M6.8 16.5 L17.2 16.5 L16.4 18.2 C15.9 19.3 14.8 20 13.6 20 L10.4 20 C9.2 20 8.1 19.3 7.6 18.2 Z"
            fill="currentColor"
            fillOpacity="0.25"
            stroke="none"
          />
        </svg>
      ),
    },
    {
      title: t("srv5Title"),
      desc: t("srv5Desc"),
      href: "/services",
      haloBg: "bg-[#FFF1E4]",
      icon: (
        <svg className="size-6 text-[#FF7715]" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M1 5a2 2 0 0 1 2-2h11a2 2 0 0 1 2 2v2h2.38a2 2 0 0 1 1.6.8l2.62 3.5A2 2 0 0 1 23 12.5V16a2 2 0 0 1-2 2h-1.17a3.001 3.001 0 0 1-5.66 0H9.83a3.001 3.001 0 0 1-5.66 0H3a2 2 0 0 1-2-2V5zm15 4V5H3v10h1.17a3.001 3.001 0 0 1 5.66 0h4.34a3.001 3.001 0 0 1 5.66 0H21v-3.5l-2.62-3.5H16zM7 17.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3zm11 0a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3z" />
        </svg>
      ),
    },
  ];

  return (
    <section id="services" className="font-sans relative overflow-hidden py-8 sm:py-10 lg:py-12 border-b border-sky-100/60">
      {/* Rich Healthcare Brand Background from doctorly-assest */}
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <Image
          src="/doctorly-assest/bg-7.png"
          alt="Healthcare background"
          fill
          priority
          sizes="100vw"
          className="object-cover object-right-top opacity-60 mix-blend-multiply"
        />
        {/* Soft luminous medical gradient overlay to keep text ultra-crisp */}
        <div className="absolute inset-0 bg-gradient-to-r from-white/95 via-[#F2F8FE]/85 to-[#EBF5FE]/75" />
      </div>

      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Top Header Section - Compact & Tight */}
        <div className="mb-5 flex flex-col gap-3 sm:mb-6 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-2xl">
            {/* Pill Badge: Cloud Icon + OUR SERVICES */}
            <div className="inline-flex items-center gap-1.5 rounded-full border border-[#0d8bf2]/25 bg-white/90 px-3 py-0.5 text-xs font-bold tracking-wider text-[#0d8bf2] uppercase shadow-xs backdrop-blur-xs">
              <svg className="size-3.5 fill-[#0d8bf2] shrink-0" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M19.35 10.04A7.49 7.49 0 0 0 12 4C9.11 4 6.6 5.64 5.35 8.04A5.994 5.994 0 0 0 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96z" />
              </svg>
              <span>{t("eyebrow")}</span>
            </div>

            {/* Heading: Black and Blue (#0d8bf2) mixed together - Sleek & punchy */}
            <h2 className="mt-2 font-sans text-xl sm:text-2xl lg:text-[28px] font-extrabold leading-tight tracking-tight">
              {locale === "bn" ? (
                <>
                  <span className="text-black">আপনার হাতের মুঠোয়</span>{" "}
                  <span className="text-[#0d8bf2]">সম্পূর্ণ স্বাস্থ্যসেবা</span>
                </>
              ) : (
                <>
                  <span className="text-black">Complete Healthcare</span>{" "}
                  <span className="text-[#0d8bf2]">Services at Your Fingertips</span>
                </>
              )}
            </h2>

            {/* Subtitle */}
            <p className="mt-1 font-sans text-xs sm:text-sm leading-relaxed text-slate-600 font-normal">
              {t("subtitle")}
            </p>
          </div>

          {/* View All Services Link: Blue text with light blue circular arrow */}
          <Link
            href="/services"
            className="group inline-flex w-fit items-center gap-2 font-sans text-xs sm:text-sm font-bold text-[#0d8bf2] transition-colors hover:text-[#0b78d1]"
          >
            <span>{t("viewAll")}</span>
            <span className="flex size-7 items-center justify-center rounded-full bg-white text-[#0d8bf2] border border-[#0d8bf2]/20 shadow-xs transition-all duration-300 group-hover:bg-[#0d8bf2] group-hover:text-white group-hover:translate-x-0.5 group-hover:shadow-[0_4px_12px_rgba(13,139,242,0.3)]">
              <ArrowRight className="size-3.5" />
            </span>
          </Link>
        </div>

        {/* 5 Service Cards Grid - Compact height & reduced gap */}
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 lg:gap-3.5">
          {services.map((service) => {
            return (
              <Link
                key={service.title}
                href={service.href}
                className="group flex min-h-[220px] sm:min-h-[235px] flex-col justify-between rounded-2xl border border-white/90 bg-white/90 p-4 sm:p-5 shadow-[0_4px_18px_-4px_rgba(13,139,242,0.08)] backdrop-blur-xs transition-all duration-300 hover:-translate-y-1 hover:border-[#0d8bf2] hover:bg-white hover:shadow-[0_12px_28px_-6px_rgba(13,139,242,0.2)]"
              >
                <div>
                  {/* Icon Halo: Soft pastel background, NO black */}
                  <div
                    className={`flex size-11 sm:size-12 items-center justify-center rounded-xl ${service.haloBg} shadow-xs transition-transform duration-300 group-hover:scale-105`}
                  >
                    {service.icon}
                  </div>

                  {/* Title: Solid Black */}
                  <h3
                    style={{ color: "#000000" }}
                    className="mt-3.5 sm:mt-4 font-sans text-[16px] sm:text-[17px] font-bold leading-tight text-black!"
                  >
                    {service.title}
                  </h3>

                  {/* Description: Clean #0d8bf2 Blue text */}
                  <p className="mt-1.5 font-sans text-[12px] sm:text-[13px] font-medium leading-snug text-[#0d8bf2]">
                    {service.desc}
                  </p>
                </div>

                {/* Bottom Circular Arrow Button - Sleek & Compact */}
                <div className="mt-3 pt-1">
                  <span className="flex size-7.5 items-center justify-center rounded-full border border-[#DCEAF8] bg-white text-[#0d8bf2] shadow-xs transition-all duration-300 group-hover:border-[#0d8bf2] group-hover:bg-[#0d8bf2] group-hover:text-white group-hover:shadow-[0_4px_12px_rgba(13,139,242,0.3)]">
                    <ArrowRight className="size-3.5 transition-transform duration-300 group-hover:translate-x-0.5" />
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
