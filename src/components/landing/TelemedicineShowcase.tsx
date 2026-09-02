"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useTranslations } from "next-intl";
import {
  Video,
  Mic,
  MicOff,
  VideoOff,
  PhoneOff,
  MessageSquare,
  ShieldCheck,
  CheckCircle2,
  FileText,
  Clock,
  Sparkles,
  ArrowRight,
  Stethoscope,
  Wifi,
  Lock,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function TelemedicineShowcase() {
  const t = useTranslations("showcase");
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-white via-slate-50/60 to-white py-16 sm:py-20 lg:py-28">
      {/* Subtle Background Glows */}
      <div className="pointer-events-none absolute -left-40 top-20 h-96 w-96 rounded-full bg-teal-100/40 blur-3xl" />
      <div className="pointer-events-none absolute -right-40 bottom-20 h-96 w-96 rounded-full bg-emerald-100/40 blur-3xl" />

      <div className="relative mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mx-auto mb-12 max-w-3xl text-center sm:mb-16">
          <div className="mb-3.5 inline-flex items-center gap-2 rounded-full border border-teal-200 bg-teal-50/80 px-4 py-1.5 text-xs font-bold text-doctorly-primary shadow-sm backdrop-blur-md">
            <Video className="size-3.5" />
            <span>{t("eyebrow") || "Virtual Telemedicine Consultation"}</span>
          </div>

          <h2 className="text-2xl font-black tracking-tight text-slate-900 sm:text-4xl md:text-[42px] leading-tight">
            {t("title")}
          </h2>

          <p className="mx-auto mt-3.5 max-w-2xl text-sm leading-relaxed text-slate-600 sm:text-base md:text-lg">
            {t("subtitle")}
          </p>
        </div>

        {/* 2-Column Main Showcase Grid */}
        <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-12 lg:gap-12">
          {/* LEFT: Feature Highlights & Benefits */}
          <div className="space-y-5 sm:space-y-6 lg:col-span-5">
            {/* Feature Item 1 */}
            <div className="group flex items-start gap-4 rounded-2xl border border-slate-200/80 bg-white p-4 sm:p-5 shadow-sm transition-all duration-300 hover:border-teal-200 hover:shadow-md">
              <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-teal-50 text-doctorly-primary shadow-sm group-hover:scale-105 transition-transform">
                <Video className="size-5" />
              </div>
              <div>
                <h3 className="text-sm sm:text-base font-bold text-slate-900">
                  HD Video & Crystal Audio
                </h3>
                <p className="mt-1 text-xs sm:text-sm text-slate-500 leading-relaxed">
                  Smooth face-to-face consultations engineered for both high-speed broadband and mobile networks.
                </p>
              </div>
            </div>

            {/* Feature Item 2 */}
            <div className="group flex items-start gap-4 rounded-2xl border border-slate-200/80 bg-white p-4 sm:p-5 shadow-sm transition-all duration-300 hover:border-teal-200 hover:shadow-md">
              <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 shadow-sm group-hover:scale-105 transition-transform">
                <Lock className="size-5" />
              </div>
              <div>
                <h3 className="text-sm sm:text-base font-bold text-slate-900">
                  End-to-End Encrypted & Private
                </h3>
                <p className="mt-1 text-xs sm:text-sm text-slate-500 leading-relaxed">
                  100% confidential. Your consultation and medical history are protected under strict privacy standards.
                </p>
              </div>
            </div>

            {/* Feature Item 3 */}
            <div className="group flex items-start gap-4 rounded-2xl border border-slate-200/80 bg-white p-4 sm:p-5 shadow-sm transition-all duration-300 hover:border-teal-200 hover:shadow-md">
              <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-sky-50 text-sky-600 shadow-sm group-hover:scale-105 transition-transform">
                <FileText className="size-5" />
              </div>
              <div>
                <h3 className="text-sm sm:text-base font-bold text-slate-900">
                  Instant Digital Prescriptions
                </h3>
                <p className="mt-1 text-xs sm:text-sm text-slate-500 leading-relaxed">
                  Receive verified digital prescriptions immediately after your call, ready to download or print.
                </p>
              </div>
            </div>

            {/* CTA Button */}
            <div className="pt-2">
              <Button
                asChild
                className="w-full sm:w-auto h-12 rounded-xl bg-doctorly-primary px-7 text-sm font-bold text-white shadow-lg shadow-teal-900/15 hover:bg-doctorly-primary/90 hover:scale-[1.02] active:scale-[0.98] transition-all"
              >
                <Link href="/doctors" className="flex items-center justify-center gap-2">
                  <Stethoscope className="size-4" />
                  <span>Start Video Consultation</span>
                  <ArrowRight className="size-4" />
                </Link>
              </Button>
            </div>
          </div>

          {/* RIGHT: Visual Video Call Interface Mockup */}
          <div className="lg:col-span-7">
            <div className="relative mx-auto w-full max-w-[620px]">
              {/* Main Video Call Card */}
              <div className="relative overflow-hidden rounded-3xl border-2 border-slate-200/90 bg-slate-950 shadow-2xl">
                {/* Top Call Status Bar */}
                <div className="absolute top-0 inset-x-0 z-20 flex items-center justify-between p-3.5 sm:p-4 bg-gradient-to-b from-black/80 via-black/40 to-transparent">
                  {/* Doctor Info */}
                  <div className="flex items-center gap-2.5">
                    <div className="relative size-9 overflow-hidden rounded-full border border-white/40">
                      <Image
                        src="/doctors/doctor2.png"
                        alt="Doctor"
                        fill
                        sizes="36px"
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <div className="flex items-center gap-1 text-xs sm:text-sm font-bold text-white">
                        <span>Dr. Anjali Sharma</span>
                        <CheckCircle2 className="size-3.5 text-emerald-400 shrink-0" />
                      </div>
                      <p className="text-[10px] text-white/70">
                        Senior Cardiologist
                      </p>
                    </div>
                  </div>

                  {/* Connection / Timer Badge */}
                  <div className="flex items-center gap-2">
                    <span className="flex items-center gap-1.5 rounded-full bg-black/40 border border-white/20 px-2.5 py-1 text-[11px] font-semibold text-emerald-400 backdrop-blur-md">
                      <span className="size-2 rounded-full bg-emerald-400 animate-pulse" />
                      08:42
                    </span>
                    <span className="hidden sm:flex items-center gap-1 rounded-full bg-black/40 border border-white/20 px-2.5 py-1 text-[11px] font-medium text-white/90 backdrop-blur-md">
                      <Wifi className="size-3 text-emerald-400" />
                      HD
                    </span>
                  </div>
                </div>

                {/* Doctor Main Video Stream */}
                <div className="relative aspect-[4/3] sm:aspect-[16/10] w-full overflow-hidden bg-slate-900">
                  <Image
                    src="/doctors/doctor2.png"
                    alt="Doctor Video Consultation"
                    fill
                    priority
                    sizes="(max-width: 768px) 100vw, 600px"
                    className="object-cover object-center"
                  />
                  {/* Subtle gradient vignette */}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-transparent to-slate-950/30" />

                  {/* Patient PiP (Picture in Picture) */}
                  <div className="absolute bottom-20 right-3.5 sm:bottom-22 sm:right-5 z-20 h-28 w-20 sm:h-36 sm:w-28 overflow-hidden rounded-2xl border-2 border-white/40 bg-slate-800 shadow-2xl">
                    <Image
                      src="/doctors/doctor1.png"
                      alt="Patient Camera Feed"
                      fill
                      sizes="120px"
                      className="object-cover"
                    />
                    <div className="absolute bottom-1.5 inset-x-1.5 rounded-md bg-black/60 py-0.5 text-center text-[9px] font-bold text-white backdrop-blur-sm">
                      {t("you") || "You"}
                    </div>
                  </div>

                  {/* Floating Doctor Badge (Bottom Left) */}
                  <div className="absolute bottom-20 left-3.5 sm:bottom-22 sm:left-5 z-20 rounded-xl bg-black/50 border border-white/20 px-3 py-1.5 backdrop-blur-md">
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-white">
                      <ShieldCheck className="size-3.5 text-emerald-400" />
                      <span>BMDC Verified Specialist</span>
                    </div>
                  </div>

                  {/* Bottom Interactive Call Controls Bar */}
                  <div className="absolute bottom-3.5 inset-x-3.5 sm:bottom-4 sm:inset-x-5 z-20 flex items-center justify-center gap-2.5 sm:gap-4 rounded-2xl bg-black/60 border border-white/20 p-2 sm:p-2.5 backdrop-blur-xl">
                    {/* Mic Toggle */}
                    <button
                      onClick={() => setIsMuted(!isMuted)}
                      aria-label="Toggle Microphone"
                      className={`flex size-9 sm:size-10 items-center justify-center rounded-full transition-all ${
                        isMuted
                          ? "bg-rose-500 text-white"
                          : "bg-white/20 text-white hover:bg-white/30"
                      }`}
                    >
                      {isMuted ? (
                        <MicOff className="size-4 sm:size-4.5" />
                      ) : (
                        <Mic className="size-4 sm:size-4.5" />
                      )}
                    </button>

                    {/* Camera Toggle */}
                    <button
                      onClick={() => setIsVideoOff(!isVideoOff)}
                      aria-label="Toggle Camera"
                      className={`flex size-9 sm:size-10 items-center justify-center rounded-full transition-all ${
                        isVideoOff
                          ? "bg-rose-500 text-white"
                          : "bg-white/20 text-white hover:bg-white/30"
                      }`}
                    >
                      {isVideoOff ? (
                        <VideoOff className="size-4 sm:size-4.5" />
                      ) : (
                        <Video className="size-4 sm:size-4.5" />
                      )}
                    </button>

                    {/* Chat Bubble Icon */}
                    <button
                      aria-label="Open Chat"
                      className="flex size-9 sm:size-10 items-center justify-center rounded-full bg-white/20 text-white hover:bg-white/30 transition-all"
                    >
                      <MessageSquare className="size-4 sm:size-4.5" />
                    </button>

                    {/* End Call Button */}
                    <button
                      aria-label="End Call"
                      className="flex h-9 sm:h-10 px-4 sm:px-5 items-center justify-center gap-1.5 rounded-xl bg-rose-600 text-white font-bold text-xs shadow-lg shadow-rose-600/30 hover:bg-rose-700 transition-all"
                    >
                      <PhoneOff className="size-4" />
                      <span className="hidden sm:inline">End Call</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Floating Prescription Notification Card (Overlapping bottom-left for desktop realism) */}
              <div className="absolute -bottom-5 -left-4 sm:-bottom-6 sm:-left-6 z-30 hidden sm:flex items-center gap-3 rounded-2xl border border-slate-200/90 bg-white p-3.5 shadow-xl">
                <div className="flex size-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 shadow-sm">
                  <CheckCircle2 className="size-5" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-900">
                    {t("prescriptionReady") || "Digital Prescription Ready"}
                  </p>
                  <p className="text-[11px] text-slate-500">
                    {t("availableToDownload") || "Available to download instantly"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
