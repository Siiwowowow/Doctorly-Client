"use client";

import {
  Search,
  CalendarDays,
  Star,
  CheckCircle2,
  ChevronRight,
  Video,
  SlidersHorizontal,
  ArrowUpRight,
} from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";
import Image from "next/image";
import DOCTORS from "@/json/doctors.json";

export default function DoctorSearch() {
  const t = useTranslations("doctorSearch");
  
  return (
    <section className="relative overflow-hidden bg-doctorly-bg py-20 md:py-24">
      {/* Background decoration */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-[-120px] top-20 h-72 w-72 rounded-full bg-doctorly-primary/5 blur-3xl" />
        <div className="absolute right-[-100px] bottom-0 h-80 w-80 rounded-full bg-doctorly-secondary/5 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mx-auto mb-10 max-w-2xl text-center"
        >
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-doctorly-primary/15 bg-white px-3 py-1.5 text-xs font-semibold text-doctorly-primary shadow-sm">
            <span className="size-1.5 animate-pulse rounded-full bg-doctorly-primary" />
            {t("findTrusted")}
          </div>

          <h2 className="text-3xl font-extrabold tracking-tight text-doctorly-text sm:text-4xl md:text-[42px]">
            {t("titleStart")}
            <span className="text-doctorly-primary">{t("titleHighlight")}</span>
          </h2>

          <p className="mt-4 text-sm leading-6 text-gray-500 sm:text-base">
            {t("subtitle")}
          </p>
        </motion.div>

        {/* Modern Search */}
        <motion.div
          initial={{ opacity: 0, y: 25, scale: 0.98 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mx-auto mb-14 max-w-5xl"
        >
          <div
            className="
              rounded-2xl border border-gray-200/80
              bg-white p-2 shadow-[0_12px_40px_rgba(15,23,42,0.06)]
              md:rounded-[22px] md:p-2.5
            "
          >
            <div className="flex flex-col gap-2 md:flex-row md:items-center">
              {/* Search */}
              <div className="group flex min-h-[58px] flex-1 items-center gap-3 rounded-xl bg-gray-50 px-4 transition-all focus-within:bg-white focus-within:ring-2 focus-within:ring-doctorly-primary/10">
                <Search className="size-5 shrink-0 text-gray-400 transition-colors group-focus-within:text-doctorly-primary" />

                <div className="min-w-0 flex-1">
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-400">
                    {t("searchLabel")}
                  </label>

                  <input
                    type="text"
                    placeholder={t("searchPlaceholder")}
                    className="w-full bg-transparent text-sm font-medium text-gray-700 outline-none placeholder:text-gray-400"
                  />
                </div>
              </div>

              <div className="hidden h-10 w-px bg-gray-200 md:block" />

              {/* Specialty */}
              <div className="group flex min-h-[58px] flex-1 items-center gap-3 rounded-xl bg-gray-50 px-4 transition-all hover:bg-gray-100/70">
                <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-white text-gray-400 shadow-sm">
                  <SlidersHorizontal className="size-4" />
                </div>

                <div className="min-w-0 flex-1">
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-400">
                    {t("specialtyLabel")}
                  </label>

                  <select className="w-full cursor-pointer appearance-none bg-transparent text-sm font-semibold text-gray-700 outline-none">
                    <option>{t("allSpecialties")}</option>
                    <option>Cardiology</option>
                    <option>Dermatology</option>
                    <option>Pediatrics</option>
                    <option>Neurology</option>
                  </select>
                </div>
              </div>

              <div className="hidden h-10 w-px bg-gray-200 md:block" />

              {/* Availability */}
              <div className="group flex min-h-[58px] flex-1 items-center gap-3 rounded-xl bg-gray-50 px-4 transition-all hover:bg-gray-100/70">
                <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-white text-gray-400 shadow-sm">
                  <CalendarDays className="size-4" />
                </div>

                <div className="min-w-0 flex-1">
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-400">
                    {t("availabilityLabel")}
                  </label>

                  <select className="w-full cursor-pointer appearance-none bg-transparent text-sm font-semibold text-gray-700 outline-none">
                    <option>{t("anyAvailability")}</option>
                    <option>{t("availableToday")}</option>
                    <option>{t("availableTomorrow")}</option>
                  </select>
                </div>
              </div>

              {/* Search button */}
              <Button
                className="
                  min-h-[58px] rounded-xl bg-doctorly-primary px-7
                  font-semibold text-white shadow-lg
                  shadow-doctorly-primary/15 transition-all
                  hover:-translate-y-0.5 hover:bg-doctorly-primary/90
                "
              >
                <Search className="mr-2 size-4" />
                {t("searchBtn")}
              </Button>
            </div>
          </div>

          {/* Quick filters */}
          <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
            <span className="mr-1 text-xs font-medium text-gray-400">
              {t("popular")}
            </span>

            {["Cardiology", "Dermatology", "Pediatrics", "Neurology"].map(
              (item) => (
                <button
                  key={item}
                  className="rounded-full border border-gray-200 bg-white px-3 py-1.5 text-[11px] font-medium text-gray-500 transition-all hover:border-doctorly-primary/20 hover:bg-doctorly-primary/5 hover:text-doctorly-primary"
                >
                  {item}
                </button>
              )
            )}
          </div>
        </motion.div>

        {/* Results header */}
        <div className="mb-5 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
              {t("recommended")}
            </p>
            <h3 className="mt-1 text-lg font-bold text-doctorly-text">
              {t("availableDoctors")}
            </h3>
          </div>

          <button className="hidden items-center gap-1 text-sm font-semibold text-doctorly-primary sm:flex">
            {t("sortBy")}
            <ChevronRight className="size-4" />
          </button>
        </div>

        {/* Doctors */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {DOCTORS.map((doctor, index) => (
            <motion.div
              key={doctor.name}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{
                duration: 0.5,
                delay: index * 0.08,
              }}
              whileHover={{ y: -5 }}
              className="
                group relative overflow-hidden rounded-2xl
                border border-gray-200/80 bg-white
                p-4 shadow-sm
                transition-all duration-300
                hover:border-doctorly-primary/20
                hover:shadow-[0_18px_45px_rgba(15,23,42,0.08)]
              "
            >
              {/* Online */}
              <div className="absolute right-3 top-3 z-10">
                {doctor.isOnline ? (
                  <span className="flex items-center gap-1.5 rounded-full border border-emerald-100 bg-white/95 px-2 py-1 text-[9px] font-bold text-emerald-600 shadow-sm backdrop-blur">
                    <span className="relative flex size-1.5">
                      <span className="absolute size-full animate-ping rounded-full bg-emerald-500 opacity-60" />
                      <span className="relative size-1.5 rounded-full bg-emerald-500" />
                    </span>
                    {t("online")}
                  </span>
                ) : (
                  <span className="rounded-full bg-gray-100 px-2 py-1 text-[9px] font-semibold text-gray-400">
                    {t("offline")}
                  </span>
                )}
              </div>

              {/* Doctor image */}
              <div className="relative mb-4 flex justify-center pt-2">
                <div className="relative">
                  <div className="size-[92px] overflow-hidden rounded-2xl bg-gray-100 ring-4 ring-gray-50 transition-all duration-300 group-hover:ring-doctorly-primary/10 relative">
                    <Image
                      src={doctor.image}
                      alt={doctor.name}
                      fill
                      sizes="92px"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>

                  {doctor.isOnline && (
                    <span className="absolute -bottom-1 -right-1 flex size-6 items-center justify-center rounded-full border-2 border-white bg-emerald-500 text-white shadow-sm">
                      <Video className="size-3" />
                    </span>
                  )}
                </div>
              </div>

              {/* Identity */}
              <div className="text-center">
                <div className="flex items-center justify-center gap-1">
                  <h3 className="text-[15px] font-bold text-doctorly-text">
                    {doctor.name}
                  </h3>

                  <CheckCircle2 className="size-3.5 shrink-0 text-doctorly-primary" />
                </div>

                <p className="mt-1 text-xs font-medium text-doctorly-primary">
                  {doctor.specialty}
                </p>
              </div>

              {/* Rating / Experience */}
              <div className="mt-4 flex items-center justify-center gap-3 border-y border-gray-100 py-3">
                <div className="flex items-center gap-1">
                  <Star className="size-3.5 fill-amber-400 text-amber-400" />
                  <span className="text-xs font-bold text-gray-700">
                    {doctor.rating}
                  </span>
                  <span className="text-[10px] text-gray-400">
                    ({doctor.reviews})
                  </span>
                </div>

                <span className="h-4 w-px bg-gray-200" />

                <span className="text-[10px] font-semibold text-gray-500">
                  {doctor.experience}
                </span>
              </div>

              {/* Availability */}
              <div className="mt-4 rounded-xl bg-gray-50 px-3 py-2.5">
                <div className="flex items-center justify-between gap-2">
                  <div>
                    <p className="text-[9px] font-bold uppercase tracking-wider text-gray-400">
                      {t("consultation")}
                    </p>
                    <p className="mt-0.5 text-sm font-bold text-doctorly-text">
                      {doctor.fee}
                    </p>
                  </div>

                  <div className="text-right">
                    <p className="text-[9px] font-bold uppercase tracking-wider text-gray-400">
                      {t("nextAvailable")}
                    </p>
                    <p className="mt-0.5 text-[10px] font-bold text-doctorly-primary">
                      {doctor.availability}
                    </p>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="mt-3 grid grid-cols-[1fr_1.2fr] gap-2">
                <Button
                  variant="outline"
                  className="
                    h-9 rounded-lg border-gray-200
                    text-xs font-semibold text-gray-600
                    hover:border-doctorly-primary/20
                    hover:bg-doctorly-primary/5
                    hover:text-doctorly-primary
                  "
                >
                  {t("profile")}
                </Button>

                <Button
                  className="
                    h-9 rounded-lg bg-doctorly-primary
                    text-xs font-semibold text-white
                    shadow-sm shadow-doctorly-primary/15
                    hover:bg-doctorly-primary/90
                  "
                >
                  {t("bookAppt")}
                </Button>
              </div>

              {/* Hover line */}
              <div className="absolute bottom-0 left-0 h-0.5 w-full origin-left scale-x-0 bg-doctorly-primary transition-transform duration-300 group-hover:scale-x-100" />
            </motion.div>
          ))}
        </div>

        {/* View all */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="mt-9 text-center"
        >
          <Button
            variant="outline"
            className="
              group h-10 rounded-xl border-gray-200
              bg-white px-5 text-sm font-semibold
              text-doctorly-primary
              hover:border-doctorly-primary/20
              hover:bg-doctorly-primary/5
            "
          >
            {t("viewAll")}
            <ArrowUpRight className="ml-1.5 size-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </Button>
        </motion.div>
      </div>
    </section>
  );
}