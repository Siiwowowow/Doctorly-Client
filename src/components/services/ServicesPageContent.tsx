"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CheckCircle2, Clock, FlaskConical, ShieldCheck, Truck, FileText } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import Footer from "@/components/landing/Footer";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

type ActiveModal = "lab-test" | "medicine" | "prescription" | null;

export default function ServicesPageContent() {
  const t = useTranslations("services");
  const locale = useLocale();
  const [activeModal, setActiveModal] = useState<ActiveModal>(null);

  const services = [
    {
      id: "video",
      title: t("srv1Title"),
      desc: t("srv1Desc"),
      href: "/doctors",
      haloBg: "bg-[#E8F3FC]",
      iconColor: "text-[#0D8BF2]",
      icon: (
        <svg className="size-7 text-[#0D8BF2]" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M4 6a3 3 0 0 0-3 3v6a3 3 0 0 0 3 3h8a3 3 0 0 0 3-3V9a3 3 0 0 0-3-3H4zm13.73 3.12 3.82-2.55A1 1 0 0 1 23 7.4v9.2a1 1 0 0 1-1.45.83l-3.82-2.55a1 1 0 0 1-.45-.83V9.95a1 1 0 0 1 .45-.83z" />
        </svg>
      ),
      isAction: false,
    },
    {
      id: "chat",
      title: t("srv2Title"),
      desc: t("srv2Desc"),
      href: "/doctors",
      haloBg: "bg-[#E1FAF7]",
      iconColor: "text-[#00BCD4]",
      icon: (
        <svg className="size-7 text-[#00BCD4]" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <rect x="2" y="3" width="20" height="14" rx="4" />
          <path d="M5 17l-2.5 3.5A.5.5 0 0 0 3.3 21.3L7 17H5z" />
          <circle cx="7.5" cy="10" r="1.3" fill="white" />
          <circle cx="12" cy="10" r="1.3" fill="white" />
          <circle cx="16.5" cy="10" r="1.3" fill="white" />
        </svg>
      ),
      isAction: false,
    },
    {
      id: "prescription",
      title: t("srv3Title"),
      desc: t("srv3Desc"),
      href: "/services",
      haloBg: "bg-[#FEECEF]",
      iconColor: "text-[#FF385C]",
      icon: (
        <svg className="size-7 text-[#FF385C]" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M4 4a2 2 0 0 1 2-2h8.5L20 7.5V20a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V4z" fill="currentColor" />
          <path d="M14 2v6h6" fill="#FFA4B2" fillOpacity="0.5" />
          <rect x="7.5" y="11" width="9" height="1.8" rx="0.9" fill="white" />
          <rect x="7.5" y="15" width="6" height="1.8" rx="0.9" fill="white" />
        </svg>
      ),
      isAction: true,
      modalType: "prescription" as ActiveModal,
    },
    {
      id: "lab",
      title: t("srv4Title"),
      desc: t("srv4Desc"),
      href: "/services",
      haloBg: "bg-[#F8EAFD]",
      iconColor: "text-[#BA29E8]",
      icon: (
        <svg
          className="size-7 text-[#BA29E8]"
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
      isAction: true,
      modalType: "lab-test" as ActiveModal,
    },
    {
      id: "medicine",
      title: t("srv5Title"),
      desc: t("srv5Desc"),
      href: "/services",
      haloBg: "bg-[#FFF1E4]",
      iconColor: "text-[#FF7715]",
      icon: (
        <svg className="size-7 text-[#FF7715]" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M1 5a2 2 0 0 1 2-2h11a2 2 0 0 1 2 2v2h2.38a2 2 0 0 1 1.6.8l2.62 3.5A2 2 0 0 1 23 12.5V16a2 2 0 0 1-2 2h-1.17a3.001 3.001 0 0 1-5.66 0H9.83a3.001 3.001 0 0 1-5.66 0H3a2 2 0 0 1-2-2V5zm15 4V5H3v10h1.17a3.001 3.001 0 0 1 5.66 0h4.34a3.001 3.001 0 0 1 5.66 0H21v-3.5l-2.62-3.5H16zM7 17.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3zm11 0a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3z" />
        </svg>
      ),
      isAction: true,
      modalType: "medicine" as ActiveModal,
    },
    {
      id: "records",
      title: t("srv6Title"),
      desc: t("srv6Desc"),
      href: "/doctors",
      haloBg: "bg-[#EDF4FF]",
      iconColor: "text-[#2563EB]",
      icon: (
        <svg className="size-7 text-[#2563EB]" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M3 4a2 2 0 0 1 2-2h4.586a1 1 0 0 1 .707.293L12 4.586V19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4z" />
          <path d="M12 4.586 13.707 2.88a1 1 0 0 1 .707-.293H19a2 2 0 0 1 2 2v15a2 2 0 0 1-2 2h-7V4.586z" fillOpacity="0.8" />
        </svg>
      ),
      isAction: false,
    },
  ];

  return (
    <div className="flex w-full flex-col bg-[#F9FBFE] font-sans text-slate-900 selection:bg-[#0D8BF2]/10 selection:text-[#0D8BF2]">
      {/* 1. FULL WIDTH & FULL HEIGHT BANNER */}
      <section className="relative isolate w-full min-h-[360px] sm:min-h-[460px] md:min-h-[520px] lg:min-h-[600px] xl:min-h-[680px] overflow-hidden bg-[#D0EBFD] border-b border-blue-100/70">
        <Image
          src="/doctorly-assest/service-page-banner.webp"
          alt="Complete healthcare services for a healthier you"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center select-none"
        />
      </section>

      {/* 2. HERO CONTENT (Standard Font Sizes, Beautiful Typography) */}
      <section className="hidden py-8 sm:py-10 lg:py-12 border-b border-slate-100">
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 lg:gap-10">
            <div className="max-w-2xl">
              {/* Pill badge: ▪ OUR SERVICES */}
              <div className="inline-flex items-center gap-1.5 rounded-full border border-blue-200/80 bg-blue-50/90 px-3 py-0.5 text-[11px] font-bold uppercase tracking-wider text-[#0D8BF2] shadow-xs">
                <span className="size-1.5 rounded-xs bg-[#0D8BF2]" />
                <span>{t("heroEyebrow")}</span>
              </div>

              {/* Title - Standard elegant size */}
              <h1 className="mt-3 text-2xl sm:text-3xl lg:text-[34px] font-bold tracking-tight text-slate-900 leading-snug">
                {t("heroTitle1")} <br className="hidden sm:inline" />
                {t("heroTitle2")}
              </h1>

              {/* Description - Standard readable size */}
              <p className="mt-3 max-w-xl text-sm sm:text-base leading-relaxed text-slate-600">
                {t("heroDesc")}
              </p>
            </div>

            {/* CTA Button: Standard proportion */}
            <div className="shrink-0 pt-1 lg:pt-0">
              <Link
                href="/book"
                className="group inline-flex items-center gap-2 rounded-full bg-[#0D8BF2] px-6 py-3 text-sm font-semibold text-white shadow-md shadow-[#0D8BF2]/20 transition-all duration-300 hover:gap-3 hover:bg-[#0B78D1] hover:shadow-[#0D8BF2]/30 hover:-translate-y-0.5 active:translate-y-0"
              >
                <span>{t("bookAppt")}</span>
                <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-0.5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 3. SERVICES GRID: "Complete Healthcare at Your Fingertips" */}
      <section id="services-grid" className="scroll-mt-24 py-8 sm:py-10 lg:py-14">
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="text-left">
            <div className="inline-flex items-center gap-1.5 rounded-full border border-blue-200/70 bg-white px-2.5 py-0.5 text-[11px] font-bold text-[#0D8BF2] shadow-xs">
              <span className="size-1.5 rounded-xs bg-[#0D8BF2]" />
              <span>{t("eyebrow")}</span>
            </div>

            <h2 className="mt-2.5 text-xl sm:text-2xl lg:text-[28px] font-bold tracking-tight text-slate-900">
              {t("title")}
            </h2>

            <p className="mt-1.5 text-xs sm:text-sm text-slate-500">
              {t("subtitle")}
            </p>
          </div>

          {/* 6 Service Cards Grid (3x2) - Refined Standard Proportions */}
          <div className="mt-6 sm:mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 sm:gap-6">
            {services.map((service) => {
              const cardContent = (
                <div className="group relative flex h-full min-h-[200px] flex-col justify-between rounded-2xl border border-slate-200/80 bg-white p-6 shadow-[0_2px_12px_-2px_rgba(13,139,242,0.05)] transition-all duration-300 hover:-translate-y-1 hover:border-[#0D8BF2]/40 hover:bg-white hover:shadow-[0_12px_28px_-4px_rgba(13,139,242,0.12)]">
                  <div>
                    {/* Icon Halo */}
                    <div className={`flex size-12 items-center justify-center rounded-xl ${service.haloBg} transition-transform duration-300 group-hover:scale-105`}>
                      {service.icon}
                    </div>

                    {/* Title - Standard font size */}
                    <h3 className="mt-5 text-lg font-bold tracking-tight text-slate-900">
                      {service.title}
                    </h3>

                    {/* Description */}
                    <p className="mt-2 text-xs sm:text-sm leading-relaxed text-slate-500">
                      {service.desc}
                    </p>
                  </div>

                  {/* Arrow at bottom-right */}
                  <div className="mt-5 flex items-center justify-end">
                    <span className="flex size-7 items-center justify-center rounded-full text-[#0D8BF2] transition-transform duration-300 group-hover:translate-x-1">
                      <ArrowRight className="size-4.5" />
                    </span>
                  </div>
                </div>
              );

              if (service.isAction && service.modalType) {
                return (
                  <button
                    key={service.id}
                    onClick={() => setActiveModal(service.modalType)}
                    className="text-left w-full h-full cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0D8BF2] rounded-2xl"
                  >
                    {cardContent}
                  </button>
                );
              }

              return (
                <Link
                  key={service.id}
                  href={service.href}
                  className="block h-full focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0D8BF2] rounded-2xl"
                >
                  {cardContent}
                </Link>
              );
            })}
          </div>

          {/* 4. BOTTOM BANNER CARD: "Care Made Simple - From Consultation to Recovery" */}
          <div className="mt-12 sm:mt-16 overflow-hidden rounded-2xl sm:rounded-3xl border border-blue-100/80 bg-[#EFF6FF] p-6 sm:p-8 lg:p-10 shadow-xs">
            <div className="grid grid-cols-1 items-center gap-6 lg:grid-cols-12 lg:gap-10">
              {/* Left Image: Bangladeshi Doctor with patient */}
              <div className="lg:col-span-5">
                <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl sm:rounded-2xl border border-white/80 shadow-md">
                  <Image
                    src="/doctorly-assest/bangladeshi-doctor-consultation.webp"
                    alt="Bangladeshi doctor consultation with patient"
                    fill
                    sizes="(max-width: 1024px) 100vw, 480px"
                    className="object-cover object-center"
                  />
                </div>
              </div>

              {/* Right Content */}
              <div className="lg:col-span-7 space-y-3.5 sm:space-y-4">
                <h3 className="text-xl sm:text-2xl lg:text-[28px] font-bold tracking-tight text-slate-900 leading-snug">
                  {t("careMadeSimple")} <br />
                  {t("careSubtitle")}
                </h3>

                <p className="max-w-xl text-xs sm:text-sm leading-relaxed text-slate-600">
                  {t("careDesc")}
                </p>

                {/* 3 Trust points */}
                <div className="flex flex-wrap items-center gap-4 sm:gap-6 pt-1">
                  <div className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-slate-700">
                    <CheckCircle2 className="size-4.5 text-[#0D8BF2] fill-[#0D8BF2]/15" />
                    <span>{t("trustedDoctors")}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-slate-700">
                    <CheckCircle2 className="size-4.5 text-[#0D8BF2] fill-[#0D8BF2]/15" />
                    <span>{t("securePrivate")}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-slate-700">
                    <CheckCircle2 className="size-4.5 text-[#0D8BF2] fill-[#0D8BF2]/15" />
                    <span>{t("available247")}</span>
                  </div>
                </div>

                {/* CTA Button */}
                <div className="pt-2">
                  <Link
                    href="/doctors"
                    className="group inline-flex items-center gap-2 rounded-full bg-[#0D8BF2] px-6 py-2.5 text-xs sm:text-sm font-semibold text-white shadow-md shadow-[#0D8BF2]/20 transition-all duration-300 hover:gap-3 hover:bg-[#0B78D1] hover:shadow-[#0D8BF2]/30 hover:-translate-y-0.5 active:translate-y-0"
                  >
                    <span>{t("learnMore")}</span>
                    <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-0.5" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* INTERACTIVE MODALS */}
      {/* 1. Lab Test Modal */}
      <Dialog open={activeModal === "lab-test"} onOpenChange={(open) => !open && setActiveModal(null)}>
        <DialogContent className="sm:max-w-md rounded-3xl p-6">
          <DialogHeader>
            <div className="mb-2 flex size-12 items-center justify-center rounded-2xl bg-[#F8EAFD] text-[#BA29E8]">
              <FlaskConical className="size-6" />
            </div>
            <DialogTitle className="text-xl font-bold text-slate-900">
              {locale === "bn" ? "হোম ল্যাব টেস্ট বুকিং" : "Book Lab Tests at Home"}
            </DialogTitle>
            <DialogDescription className="text-sm text-slate-500">
              {locale === "bn"
                ? "আমাদের সার্টিফাইড ল্যাব টেকনিশিয়ান আপনার বাসায় এসে রক্ত বা নমুনা সংগ্রহ করবেন। রিপোর্ট অ্যাপেই পাবেন।"
                : "Certified phlebotomists collect samples from your doorstep. Digital reports delivered within 24 hours."}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3 py-3">
            <div className="rounded-2xl border border-slate-100 bg-slate-50/70 p-3.5">
              <p className="text-xs font-bold text-slate-900">
                {locale === "bn" ? "জনপ্রিয় ল্যাব প্যাকেজসমূহ:" : "Popular Lab Packages:"}
              </p>
              <ul className="mt-2 space-y-1.5 text-xs text-slate-600">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="size-3.5 text-[#0D8BF2]" />
                  <span>CBC, Blood Glucose & HbA1c</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="size-3.5 text-[#0D8BF2]" />
                  <span>Lipid Profile & Liver Function</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="size-3.5 text-[#0D8BF2]" />
                  <span>Thyroid Profile (T3, T4, TSH)</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="flex flex-col gap-2 pt-2">
            <Button
              className="w-full rounded-full bg-[#0D8BF2] hover:bg-[#0B78D1] text-white"
              asChild
            >
              <Link href="/doctors">
                {locale === "bn" ? "ডাক্তারের পরামর্শের সাথে বুক করুন" : "Consult Doctor & Request Test"}
              </Link>
            </Button>
            <Button
              variant="outline"
              className="w-full rounded-full"
              onClick={() => setActiveModal(null)}
            >
              {locale === "bn" ? "বন্ধ করুন" : "Close"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* 2. Medicine Delivery Modal */}
      <Dialog open={activeModal === "medicine"} onOpenChange={(open) => !open && setActiveModal(null)}>
        <DialogContent className="sm:max-w-md rounded-3xl p-6">
          <DialogHeader>
            <div className="mb-2 flex size-12 items-center justify-center rounded-2xl bg-[#FFF1E4] text-[#FF7715]">
              <Truck className="size-6" />
            </div>
            <DialogTitle className="text-xl font-bold text-slate-900">
              {locale === "bn" ? "ওষুধ ডেলিভারি সেবা" : "Doorstep Medicine Delivery"}
            </DialogTitle>
            <DialogDescription className="text-sm text-slate-500">
              {locale === "bn"
                ? "প্রেসক্রিপশন আপলোড করুন অথবা ডাক্তারের ভিডিও কলের পর সরাসরি জেনুইন ওষুধ ঘরে বসে গ্রহণ করুন।"
                : "Upload your prescription or receive prescribed medicines right to your home with express courier."}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3 py-3">
            <div className="rounded-2xl border border-slate-100 bg-slate-50/70 p-3.5 text-xs text-slate-600 space-y-2">
              <div className="flex items-center gap-2">
                <Clock className="size-4 text-[#FF7715]" />
                <span>{locale === "bn" ? "২-৪ ঘণ্টার মধ্যে এক্সপ্রেস ডেলিভারি" : "Express delivery within 2-4 hours"}</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="size-4 text-[#FF7715]" />
                <span>{locale === "bn" ? "১০০% আসল ও রেজিস্টার্ড ফার্মেসি থেকে সংগ্রহ" : "100% genuine & verified pharmacies"}</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-2 pt-2">
            <Button
              className="w-full rounded-full bg-[#0D8BF2] hover:bg-[#0B78D1] text-white"
              asChild
            >
              <Link href="/book">
                {locale === "bn" ? "প্রেসক্রিপশন পেতে ডাক্তার দেখান" : "Consult Doctor for Prescription"}
              </Link>
            </Button>
            <Button
              variant="outline"
              className="w-full rounded-full"
              onClick={() => setActiveModal(null)}
            >
              {locale === "bn" ? "বন্ধ করুন" : "Close"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* 3. E-Prescription Modal */}
      <Dialog open={activeModal === "prescription"} onOpenChange={(open) => !open && setActiveModal(null)}>
        <DialogContent className="sm:max-w-md rounded-3xl p-6">
          <DialogHeader>
            <div className="mb-2 flex size-12 items-center justify-center rounded-2xl bg-[#FEECEF] text-[#FF385C]">
              <FileText className="size-6" />
            </div>
            <DialogTitle className="text-xl font-bold text-slate-900">
              {locale === "bn" ? "ডিজিটাল ই-প্রেসক্রিপশন" : "Instant E-Prescription"}
            </DialogTitle>
            <DialogDescription className="text-sm text-slate-500">
              {locale === "bn"
                ? "পরামর্শ শেষ হওয়ার সাথে সাথে ডাক্তারের ভেরিফাইড ডিজিটাল প্রেসক্রিপশন পান এবং ডাউনলোড করুন।"
                : "Instantly receive verifiable digital prescriptions after your online medical consultation."}
            </DialogDescription>
          </DialogHeader>

          <div className="rounded-2xl border border-slate-100 bg-slate-50/70 p-3.5 text-xs text-slate-600 space-y-2 my-2">
            <p className="font-semibold text-slate-800">
              {locale === "bn" ? "প্রেসক্রিপশন সুবিধার মধ্যে রয়েছে:" : "Prescription features include:"}
            </p>
            <p>• {locale === "bn" ? "BMDC রেজিস্টার্ড ডাক্তারের কিউআর কোড ভেরিফিকেশন" : "QR-code verified by BMDC licensed doctors"}</p>
            <p>• {locale === "bn" ? "পিডিএফ ডাউনলোড ও লাইফটাইম ক্লাউড স্টোরেজ" : "Instant PDF download & lifetime cloud access"}</p>
          </div>

          <div className="flex flex-col gap-2 pt-2">
            <Button
              className="w-full rounded-full bg-[#0D8BF2] hover:bg-[#0B78D1] text-white"
              asChild
            >
              <Link href="/doctors">
                {locale === "bn" ? "এখনই ডাক্তার বুক করুন" : "Book Doctor Consultation"}
              </Link>
            </Button>
            <Button
              variant="outline"
              className="w-full rounded-full"
              onClick={() => setActiveModal(null)}
            >
              {locale === "bn" ? "বন্ধ করুন" : "Close"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* FOOTER */}
      <Footer />
    </div>
  );
}
