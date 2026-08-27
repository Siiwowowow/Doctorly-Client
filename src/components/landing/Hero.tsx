"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight,
  CalendarCheck,
  ChevronLeft,
  ChevronRight,
  Clock3,
  Search,
  ShieldCheck,
  Video,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";

const bannerImages = [
  "/banner/banner1.jpg",
  "/banner/banner2.jpg",
  "/banner/banner3.jpg",
  "/banner/banner4.jpg",
  "/banner/banner5.png",
  "/banner/banner6.jpg",
  "/banner/banner7.jpg",
];

export default function Hero() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const t = useTranslations("hero");
  const banners = t.raw("banners");

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % bannerImages.length);
    }, 8000); // Change image every 8 seconds

    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => setCurrentImageIndex((prev) => (prev + 1) % bannerImages.length);
  const prevSlide = () => setCurrentImageIndex((prev) => (prev - 1 + bannerImages.length) % bannerImages.length);

  return (
    <section className="relative w-full bg-gray-900">
      {/* Background Carousel */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <AnimatePresence>
          <motion.img
            key={currentImageIndex}
            src={bannerImages[currentImageIndex]}
            alt={`Doctorly Banner ${currentImageIndex + 1}`}
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
            className="absolute inset-0 size-full object-cover opacity-80"
          />
        </AnimatePresence>

        {/* Gradient overlay to make text readable */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/20 to-transparent" />
      </div>

      {/* Content */}
      <div className="relative z-10 mx-auto max-w-7xl px-4 pb-8 pt-16 sm:px-6 lg:px-8 lg:pb-12 lg:pt-20 min-h-[400px]">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentImageIndex}
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="max-w-2xl text-white"
          >
            {/* Eyebrow */}
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-semibold backdrop-blur-md">
              <span className="relative flex size-2">
                <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-400 opacity-60" />
                <span className="relative inline-flex size-2 rounded-full bg-emerald-400" />
              </span>
              {banners[currentImageIndex].eyebrow}
            </div>

            {/* Heading */}
            <h1 className="text-4xl font-extrabold leading-[1.15] tracking-[-0.02em] sm:text-5xl lg:text-6xl">
              {banners[currentImageIndex].titleStart}
              <span className="block text-doctorly-accent">{banners[currentImageIndex].titleHighlight}</span>
            </h1>

            {/* Description */}
            <p className="mt-6 text-base leading-relaxed text-gray-300 sm:text-lg">
              {banners[currentImageIndex].description}
            </p>

            {/* CTA Buttons */}
            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
              <Button
                asChild
                size="lg"
                className="h-14 rounded-xl bg-doctorly-primary px-8 text-base font-bold text-white shadow-xl transition-all hover:-translate-y-0.5 hover:bg-doctorly-primary/90"
              >
                <Link href="/doctors" className="flex items-center gap-2">
                  <Search className="size-5" />
                  {t("findSpecialist")}
                  <ArrowRight className="size-5" />
                </Link>
              </Button>

              <Button
                asChild
                size="lg"
                variant="outline"
                className="h-14 rounded-xl border-2 border-white/30 bg-transparent px-8 text-base font-bold text-white backdrop-blur-sm transition-all hover:bg-white/10 hover:text-white"
              >
                <Link href="/book" className="flex items-center gap-2">
                  <CalendarCheck className="size-5" />
                  {t("bookConsult")}
                </Link>
              </Button>
            </div>

            {/* Trust indicators */}
            <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-4">
              <div className="flex items-center gap-2.5 text-sm font-semibold text-gray-200">
                <div className="flex size-7 items-center justify-center rounded-full bg-white/10 text-emerald-400">
                  <ShieldCheck className="size-4" />
                </div>
                {t("encrypted")}
              </div>
              <div className="flex items-center gap-2.5 text-sm font-semibold text-gray-200">
                <div className="flex size-7 items-center justify-center rounded-full bg-white/10 text-doctorly-accent">
                  <Video className="size-4" />
                </div>
                {t("hdVideo")}
              </div>
              <div className="flex items-center gap-2.5 text-sm font-semibold text-gray-200">
                <div className="flex size-7 items-center justify-center rounded-full bg-white/10 text-doctorly-primary">
                  <Clock3 className="size-4" />
                </div>
                {t("available")}
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Carousel Controls */}
      <div className="relative z-10 mx-auto max-w-7xl px-4 pb-6 sm:px-6 lg:px-8">
        <div className="flex justify-end">
          <div className="flex items-center gap-4">
            <div className="flex gap-2">
              <button 
                onClick={prevSlide}
                className="flex size-10 items-center justify-center rounded-full border border-white/20 bg-black/50 text-white backdrop-blur-sm transition-all hover:bg-white/20"
                aria-label="Previous banner"
              >
                <ChevronLeft className="size-5" />
              </button>
              <button 
                onClick={nextSlide}
                className="flex size-10 items-center justify-center rounded-full border border-white/20 bg-black/50 text-white backdrop-blur-sm transition-all hover:bg-white/20"
                aria-label="Next banner"
              >
                <ChevronRight className="size-5" />
              </button>
            </div>
            {/* Dots */}
            <div className="ml-2 flex gap-1.5">
              {bannerImages.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentImageIndex(idx)}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    idx === currentImageIndex ? "w-6 bg-doctorly-primary" : "w-1.5 bg-white/40"
                  }`}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}