"use client";

import { motion } from "framer-motion";
import {
  ArrowRight,
  CalendarCheck,
  CheckCircle2,
  Clock3,
  ShieldCheck,
  Stethoscope,
  Video,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";

export default function FinalCTA() {
  const t = useTranslations("finalCTA");

  return (
    <section className="relative overflow-hidden bg-white py-20 md:py-28">
      {/* Background */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-0 top-1/2 h-[420px] w-[420px] -translate-y-1/2 rounded-full bg-doctorly-primary/5 blur-3xl" />
        <div className="absolute right-0 top-0 h-[300px] w-[300px] rounded-full bg-blue-100/40 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Main CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.7 }}
          className="
            relative overflow-hidden rounded-[28px]
            border border-doctorly-primary/10
            bg-[#F3FAFC]
            shadow-[0_25px_80px_rgba(15,23,42,0.08)]
          "
        >
          {/* Decorative circles */}
          <div className="pointer-events-none absolute -right-32 -top-32 size-[420px] rounded-full border-[70px] border-doctorly-primary/5" />
          <div className="pointer-events-none absolute -bottom-40 -left-20 size-[350px] rounded-full bg-doctorly-primary/5 blur-3xl" />

          <div className="relative grid min-h-[480px] lg:grid-cols-[1.05fr_0.95fr]">
            {/* Left content */}
            <div className="flex flex-col justify-center p-8 sm:p-12 lg:p-16 xl:p-20">
              {/* Badge */}
              <motion.div
                initial={{ opacity: 0, x: -15 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.15 }}
                className="
                  mb-6 flex w-fit items-center gap-2
                  rounded-full border border-doctorly-primary/15
                  bg-white px-3 py-1.5
                  text-xs font-bold text-doctorly-primary
                  shadow-sm
                "
              >
                <span className="flex size-5 items-center justify-center rounded-full bg-doctorly-primary/10">
                  <Stethoscope className="size-3" />
                </span>

                {t("badge")}
              </motion.div>

              {/* Heading */}
              <motion.h2
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="
                  max-w-xl text-4xl font-extrabold
                  leading-[1.08] tracking-[-0.035em]
                  text-doctorly-text
                  sm:text-5xl lg:text-[54px]
                "
              >
                {t("titleStart")}
                <span className="text-doctorly-primary">
                  {t("titleHighlight")}
                </span>
              </motion.h2>

              <motion.p
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 }}
                className="
                  mt-5 max-w-lg text-sm leading-7
                  text-gray-500 sm:text-base
                "
              >
                {t("subtitle")}
              </motion.p>

              {/* Actions */}
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4 }}
                className="mt-8 flex flex-col gap-3 sm:flex-row"
              >
                <Button
                  className="
                    group h-12 rounded-xl
                    bg-doctorly-primary px-6
                    text-sm font-bold text-white
                    shadow-lg shadow-doctorly-primary/20
                    transition-all duration-300
                    hover:-translate-y-0.5
                    hover:bg-doctorly-primary/90
                  "
                >
                  {t("findDoctor")}
                  <ArrowRight className="ml-2 size-4 transition-transform group-hover:translate-x-1" />
                </Button>

                <Button
                  variant="outline"
                  className="
                    h-12 rounded-xl
                    border-gray-200 bg-white
                    px-6 text-sm font-bold
                    text-doctorly-text
                    transition-all
                    hover:border-doctorly-primary/20
                    hover:bg-white
                    hover:text-doctorly-primary
                  "
                >
                  <CalendarCheck className="mr-2 size-4" />
                  {t("bookConsultation")}
                </Button>
              </motion.div>

              {/* Trust points */}
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.55 }}
                className="mt-8 flex flex-wrap gap-x-5 gap-y-2"
              >
                <TrustItem text={t("verifiedDoctors")} />
                <TrustItem text={t("securePlatform")} />
                <TrustItem text={t("access247")} />
              </motion.div>
            </div>

            {/* Right visual */}
            <div className="relative hidden min-h-[480px] items-center justify-center lg:flex">
              {/* Large visual background */}
              <div className="absolute inset-y-0 right-0 w-full bg-gradient-to-br from-doctorly-primary/5 via-transparent to-doctorly-primary/10" />

              {/* Central circle */}
              <motion.div
                animate={{
                  y: [0, -10, 0],
                }}
                transition={{
                  duration: 5,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="
                  relative z-10 flex size-64
                  items-center justify-center
                  rounded-full
                  border border-doctorly-primary/10
                  bg-white/70
                  shadow-[0_25px_80px_rgba(15,118,138,0.12)]
                  backdrop-blur-xl
                "
              >
                <div className="flex size-40 items-center justify-center rounded-full bg-doctorly-primary/10">
                  <div className="flex size-24 items-center justify-center rounded-[28px] bg-doctorly-primary text-white shadow-xl shadow-doctorly-primary/25">
                    <Stethoscope className="size-11" strokeWidth={1.7} />
                  </div>
                </div>
              </motion.div>

              {/* Floating card 1 */}
              <motion.div
                animate={{ y: [0, -7, 0] }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="
                  absolute left-6 top-20 z-20
                  rounded-2xl border border-gray-100
                  bg-white p-3.5
                  shadow-[0_15px_40px_rgba(15,23,42,0.10)]
                "
              >
                <div className="flex items-center gap-3">
                  <div className="flex size-9 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                    <CheckCircle2 className="size-4" />
                  </div>

                  <div>
                    <p className="text-xs font-bold text-gray-900">
                      {t("verifiedDocBadge")}
                    </p>
                    <p className="mt-0.5 text-[9px] text-gray-400">
                      {t("credentialsVerified")}
                    </p>
                  </div>
                </div>
              </motion.div>

              {/* Floating card 2 */}
              <motion.div
                animate={{ y: [0, 8, 0] }}
                transition={{
                  duration: 4.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="
                  absolute right-8 top-24 z-20
                  rounded-2xl border border-gray-100
                  bg-white p-3.5
                  shadow-[0_15px_40px_rgba(15,23,42,0.10)]
                "
              >
                <div className="flex items-center gap-3">
                  <div className="flex size-9 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                    <Video className="size-4" />
                  </div>

                  <div>
                    <p className="text-xs font-bold text-gray-900">
                      {t("videoConsultation")}
                    </p>
                    <p className="mt-0.5 text-[9px] text-gray-400">
                      {t("connectAnywhere")}
                    </p>
                  </div>
                </div>
              </motion.div>

              {/* Floating appointment card */}
              <motion.div
                animate={{ y: [0, -6, 0] }}
                transition={{
                  duration: 4.2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="
                  absolute bottom-20 left-16 z-20
                  rounded-2xl border border-gray-100
                  bg-white p-4
                  shadow-[0_15px_40px_rgba(15,23,42,0.10)]
                "
              >
                <div className="flex items-center gap-3">
                  <div className="flex size-10 items-center justify-center rounded-xl bg-doctorly-primary/10 text-doctorly-primary">
                    <CalendarCheck className="size-5" />
                  </div>

                  <div>
                    <p className="text-[9px] font-bold uppercase tracking-wider text-gray-400">
                      {t("appointment")}
                    </p>
                    <p className="mt-0.5 text-sm font-bold text-gray-900">
                      {t("todayTime")}
                    </p>
                  </div>
                </div>
              </motion.div>

              {/* Availability */}
              <motion.div
                animate={{ y: [0, 7, 0] }}
                transition={{
                  duration: 4.8,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="
                  absolute bottom-16 right-10 z-20
                  rounded-2xl border border-emerald-100
                  bg-emerald-50/90 p-3.5
                  shadow-[0_15px_40px_rgba(16,185,129,0.10)]
                "
              >
                <div className="flex items-center gap-2.5">
                  <span className="relative flex size-2">
                    <span className="absolute size-full animate-ping rounded-full bg-emerald-500 opacity-50" />
                    <span className="relative size-2 rounded-full bg-emerald-500" />
                  </span>

                  <div>
                    <p className="text-xs font-bold text-emerald-800">
                      {t("doctorsAvailable")}
                    </p>
                    <p className="mt-0.5 flex items-center gap-1 text-[9px] text-emerald-600">
                      <Clock3 className="size-3" />
                      {t("rightNow")}
                    </p>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* Bottom reassurance */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="mt-7 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-center"
        >
          <div className="flex items-center gap-1.5 text-[11px] font-medium text-gray-400">
            <ShieldCheck className="size-3.5 text-doctorly-primary" />
            {t("privacyProtected")}
          </div>

          <span className="hidden size-1 rounded-full bg-gray-300 sm:block" />

          <div className="flex items-center gap-1.5 text-[11px] font-medium text-gray-400">
            <CheckCircle2 className="size-3.5 text-emerald-500" />
            {t("trustedProfessionals")}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function TrustItem({ text }: { text: string }) {
  return (
    <div className="flex items-center gap-1.5">
      <CheckCircle2 className="size-3.5 text-emerald-500" />
      <span className="text-[11px] font-semibold text-gray-500">
        {text}
      </span>
    </div>
  );
}