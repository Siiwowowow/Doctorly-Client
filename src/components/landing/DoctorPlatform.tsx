/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { motion } from "framer-motion";
import {
  LayoutDashboard,
  Users,
  CalendarCheck,
  TrendingUp,
  ChevronRight,
  ArrowUpRight,
  Clock3,
  Video,
  CheckCircle2,
  MoreHorizontal,
  Stethoscope,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";
import Image from "next/image";

const getStats = (t: any) => [
  {
    value: "128",
    label: t("appointments"),
    change: "+12.5%",
    icon: CalendarCheck,
  },
  {
    value: "1,248",
    label: t("patients"),
    change: "+8.2%",
    icon: Users,
  },
  {
    value: "৳ 84.5K",
    label: "This Month",
    change: "+14.8%",
    icon: TrendingUp,
  },
];

import appointments from "@/json/doctorPlatform.json";

export default function DoctorPlatform() {
  const t = useTranslations("doctorPlatform");
  const statsList = getStats(t);
  
  return (
    <section className="relative overflow-hidden bg-white py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Heading / Intro */}
        <div className="grid items-center gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
          {/* LEFT */}
          <motion.div
            initial={{ opacity: 0, x: -25 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.65 }}
          >
            <div className="mb-5 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-doctorly-primary">
              <span className="flex size-7 items-center justify-center rounded-lg bg-doctorly-primary/10">
                <Stethoscope className="size-3.5" />
              </span>
              {t("provider")}
            </div>

            <h2 className="max-w-xl text-3xl font-extrabold leading-[1.1] tracking-[-0.035em] text-doctorly-text sm:text-4xl md:text-5xl">
              {t("titleStart")}
              <span className="text-doctorly-primary">
                {t("titleHighlight")}
              </span>
            </h2>

            <p className="mt-5 max-w-lg text-sm leading-7 text-gray-500 sm:text-base">
              {t("subtitle")}
            </p>

            {/* Benefits */}
            <div className="mt-8 space-y-4">
              <Benefit
                icon={<LayoutDashboard className="size-4" />}
                title={t("benefit1Title")}
                text={t("benefit1Desc")}
              />

              <Benefit
                icon={<Users className="size-4" />}
                title={t("benefit2Title")}
                text={t("benefit2Desc")}
              />

              <Benefit
                icon={<TrendingUp className="size-4" />}
                title={t("benefit3Title")}
                text={t("benefit3Desc")}
              />
            </div>

            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Button
                className="
                  group h-12 rounded-xl bg-doctorly-primary
                  px-6 text-sm font-bold text-white
                  shadow-lg shadow-doctorly-primary/15
                  transition-all hover:-translate-y-0.5
                  hover:bg-doctorly-primary/90
                "
              >
                {t("join")}
                <ChevronRight className="ml-1 size-4 transition-transform group-hover:translate-x-1" />
              </Button>

              <Button
                variant="outline"
                className="
                  h-12 rounded-xl border-gray-200
                  px-6 text-sm font-semibold text-gray-600
                  hover:border-doctorly-primary/20
                  hover:bg-doctorly-primary/5
                  hover:text-doctorly-primary
                "
              >
                {t("explore")}
              </Button>
            </div>
          </motion.div>

          {/* RIGHT — Dashboard */}
          <motion.div
            initial={{ opacity: 0, x: 30, scale: 0.98 }}
            whileInView={{ opacity: 1, x: 0, scale: 1 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.7 }}
            className="relative"
          >
            {/* Browser / Dashboard frame */}
            <div className="relative overflow-hidden rounded-[24px] border border-gray-200 bg-white shadow-[0_25px_70px_rgba(15,23,42,0.08)]">
              {/* Header */}
              <div className="flex h-14 items-center justify-between border-b border-gray-100 px-4 sm:px-5">
                <div className="flex items-center gap-2.5">
                  <div className="flex size-8 items-center justify-center rounded-lg bg-doctorly-primary text-white">
                    <Stethoscope className="size-4" />
                  </div>

                  <div>
                    <p className="text-xs font-bold text-gray-900">
                      Doctorly
                    </p>
                    <p className="text-[9px] text-gray-400">
                      {t("dashboard")}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <div className="hidden items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1.5 sm:flex">
                    <span className="size-1.5 animate-pulse rounded-full bg-emerald-500" />
                    <span className="text-[9px] font-bold text-emerald-600">
                      {t("available")}
                    </span>
                  </div>

                  <div className="flex size-8 items-center justify-center rounded-full bg-gray-100 text-xs font-bold text-gray-500">
                    AS
                  </div>
                </div>
              </div>

              {/* Dashboard body */}
              <div className="grid md:grid-cols-[150px_1fr]">
                {/* Sidebar */}
                <aside className="hidden border-r border-gray-100 p-3 md:block">
                  <div className="space-y-1">
                    <SidebarItem
                      active
                      icon={<LayoutDashboard className="size-3.5" />}
                      text={t("overview")}
                    />

                    <SidebarItem
                      icon={<CalendarCheck className="size-3.5" />}
                      text={t("appointments")}
                    />

                    <SidebarItem
                      icon={<Users className="size-3.5" />}
                      text={t("patients")}
                    />

                    <SidebarItem
                      icon={<TrendingUp className="size-3.5" />}
                      text={t("analytics")}
                    />
                  </div>

                  <div className="mt-8 border-t border-gray-100 pt-4">
                    <p className="px-2 text-[8px] font-bold uppercase tracking-wider text-gray-300">
                      {t("practice")}
                    </p>

                    <p className="mt-3 px-2 text-[10px] font-medium text-gray-500">
                      {t("settings")}
                    </p>
                  </div>
                </aside>

                {/* Main */}
                <main className="min-w-0 bg-[#FAFBFC] p-4 sm:p-5">
                  {/* Greeting */}
                  <div className="mb-5 flex items-center justify-between">
                    <div>
                      <p className="text-[9px] font-medium text-gray-400">
                        {t("date")}
                      </p>

                      <h3 className="mt-1 text-base font-bold text-gray-900 sm:text-lg">
                        {t("greeting")}
                      </h3>
                    </div>

                    <button className="flex size-8 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-400">
                      <MoreHorizontal className="size-4" />
                    </button>
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-3 gap-2.5">
                    {statsList.map((stat, index) => {
                      const Icon = stat.icon;

                      return (
                        <motion.div
                          key={stat.label}
                          initial={{ opacity: 0, y: 10 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true }}
                          transition={{
                            delay: 0.25 + index * 0.08,
                          }}
                          className="rounded-xl border border-gray-100 bg-white p-3"
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex size-7 items-center justify-center rounded-lg bg-doctorly-primary/8 text-doctorly-primary">
                              <Icon className="size-3.5" />
                            </div>

                            <span className="text-[8px] font-bold text-emerald-500">
                              {stat.change}
                            </span>
                          </div>

                          <p className="mt-3 text-base font-extrabold text-gray-900 sm:text-xl">
                            {stat.value}
                          </p>

                          <p className="mt-0.5 text-[8px] font-medium text-gray-400 sm:text-[9px]">
                            {stat.label}
                          </p>
                        </motion.div>
                      );
                    })}
                  </div>

                  {/* Appointments */}
                  <div className="mt-4 rounded-xl border border-gray-100 bg-white">
                    <div className="flex items-center justify-between border-b border-gray-100 px-4 py-3">
                      <div>
                        <h4 className="text-xs font-bold text-gray-900">
                          {t("todayAppts")}
                        </h4>
                        <p className="mt-0.5 text-[8px] text-gray-400">
                          {t("manageAppts")}
                        </p>
                      </div>

                      <button className="text-[9px] font-bold text-doctorly-primary">
                        {t("viewAll")}
                      </button>
                    </div>

                    <div className="divide-y divide-gray-100">
                      {appointments.map((appointment, index) => (
                        <motion.div
                          key={appointment.name}
                          initial={{ opacity: 0, x: 10 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          viewport={{ once: true }}
                          transition={{
                            delay: 0.4 + index * 0.08,
                          }}
                          className="flex items-center justify-between gap-3 px-4 py-3"
                        >
                          <div className="flex min-w-0 items-center gap-3">
                            <div className="relative size-8 shrink-0 overflow-hidden rounded-full">
                              <Image
                                src={appointment.avatar}
                                alt={appointment.name}
                                fill
                                sizes="32px"
                                className="object-cover"
                              />
                            </div>

                            <div className="min-w-0">
                              <p className="truncate text-[10px] font-bold text-gray-900">
                                {appointment.name}
                              </p>

                              <div className="mt-1 flex items-center gap-1.5">
                                <Clock3 className="size-2.5 text-gray-400" />

                                <span className="text-[8px] text-gray-400">
                                  {appointment.time}
                                </span>

                                <span className="size-0.5 rounded-full bg-gray-300" />

                                <span className="text-[8px] text-gray-400">
                                  {appointment.type}
                                </span>
                              </div>
                            </div>
                          </div>

                          <div className="flex shrink-0 items-center gap-2">
                            <span
                              className={`
                                hidden rounded-full px-2 py-1 text-[8px] font-bold sm:block
                                ${
                                  appointment.status === "Confirmed"
                                    ? "bg-emerald-50 text-emerald-600"
                                    : "bg-amber-50 text-amber-600"
                                }
                              `}
                            >
                              {appointment.status}
                            </span>

                            <button className="flex size-7 items-center justify-center rounded-lg bg-doctorly-primary/8 text-doctorly-primary transition hover:bg-doctorly-primary hover:text-white">
                              <Video className="size-3" />
                            </button>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  {/* Bottom mini insight */}
                  <div className="mt-3 grid grid-cols-2 gap-2.5">
                    <div className="flex items-center gap-2.5 rounded-xl border border-gray-100 bg-white p-3">
                      <div className="flex size-8 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                        <TrendingUp className="size-3.5" />
                      </div>

                      <div>
                        <p className="text-[8px] text-gray-400">
                          {t("monthlyGrowth")}
                        </p>
                        <p className="text-xs font-bold text-gray-900">
                          +18.6%
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2.5 rounded-xl border border-gray-100 bg-white p-3">
                      <div className="flex size-8 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
                        <CheckCircle2 className="size-3.5" />
                      </div>

                      <div>
                        <p className="text-[8px] text-gray-400">
                          {t("patientSatisfaction")}
                        </p>
                        <p className="text-xs font-bold text-gray-900">
                          98.4%
                        </p>
                      </div>
                    </div>
                  </div>
                </main>
              </div>
            </div>

            {/* Floating notification */}
            <motion.div
              animate={{ y: [0, -6, 0] }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="absolute -right-4 bottom-10 hidden rounded-xl border border-gray-100 bg-white p-3 shadow-[0_15px_40px_rgba(15,23,42,0.10)] sm:block"
            >
              <div className="flex items-center gap-2.5">
                <div className="flex size-8 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
                  <CheckCircle2 className="size-4" />
                </div>

                <div>
                  <p className="text-[9px] font-bold text-gray-900">
                    Appointment confirmed
                  </p>

                  <p className="mt-0.5 text-[8px] text-gray-400">
                    New patient booking
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Floating growth */}
            <motion.div
              animate={{ y: [0, 6, 0] }}
              transition={{
                duration: 4.5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="absolute -left-4 top-20 hidden rounded-xl border border-gray-100 bg-white p-3 shadow-[0_15px_40px_rgba(15,23,42,0.10)] sm:block"
            >
              <div className="flex items-center gap-2.5">
                <div className="flex size-8 items-center justify-center rounded-lg bg-doctorly-primary/10 text-doctorly-primary">
                  <ArrowUpRight className="size-4" />
                </div>

                <div>
                  <p className="text-[9px] font-bold text-gray-900">
                    Practice growing
                  </p>

                  <p className="mt-0.5 text-[8px] text-emerald-500">
                    +18.6% this month
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* Bottom stats */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="mx-auto mt-14 grid max-w-3xl grid-cols-2 divide-x divide-gray-200 border-y border-gray-100 py-6 md:grid-cols-4"
        >
          <ProviderStat value="10K+" label={t("doctors")} />
          <ProviderStat value="250K+" label={t("consultations")} />
          <ProviderStat value="98%" label={t("satisfaction")} />
          <ProviderStat value="24/7" label={t("platformAccess")} />
        </motion.div>
      </div>
    </section>
  );
}

/* ---------------- Components ---------------- */

function Benefit({
  icon,
  title,
  text,
}: {
  icon: React.ReactNode;
  title: string;
  text: string;
}) {
  return (
    <motion.div
      whileHover={{ x: 4 }}
      className="flex items-start gap-3"
    >
      <div className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-lg bg-doctorly-primary/8 text-doctorly-primary">
        {icon}
      </div>

      <div>
        <p className="text-sm font-bold text-gray-800">{title}</p>
        <p className="mt-0.5 text-xs leading-5 text-gray-400">{text}</p>
      </div>
    </motion.div>
  );
}

function SidebarItem({
  icon,
  text,
  active = false,
}: {
  icon: React.ReactNode;
  text: string;
  active?: boolean;
}) {
  return (
    <div
      className={`
        flex items-center gap-2 rounded-lg px-2.5 py-2
        text-[9px] font-semibold
        ${
          active
            ? "bg-doctorly-primary/8 text-doctorly-primary"
            : "text-gray-400"
        }
      `}
    >
      {icon}
      {text}
    </div>
  );
}

function ProviderStat({
  value,
  label,
}: {
  value: string;
  label: string;
}) {
  return (
    <div className="px-4 text-center first:pl-0 last:pr-0">
      <p className="text-xl font-extrabold tracking-tight text-doctorly-primary sm:text-2xl">
        {value}
      </p>

      <p className="mt-1 text-[9px] font-semibold uppercase tracking-wider text-gray-400">
        {label}
      </p>
    </div>
  );
}