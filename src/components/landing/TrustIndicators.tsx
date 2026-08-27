/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  BadgeCheck,
  CalendarCheck,
  HeartHandshake,
  Clock3,
} from "lucide-react";
import { useTranslations } from "next-intl";

const getStats = (t: any) => [
  {
    value: 10000,
    suffix: "+",
    label: t("verifiedDoctors"),
    icon: BadgeCheck,
  },
  {
    value: 250000,
    suffix: "+",
    label: t("consultations"),
    icon: CalendarCheck,
  },
  {
    value: 98,
    suffix: "%",
    label: t("patientSatisfaction"),
    icon: HeartHandshake,
  },
  {
    value: 24,
    suffix: "/7",
    label: t("healthcareAccess"),
    icon: Clock3,
  },
];

function AnimatedNumber({
  value,
  suffix,
  duration = 1800,
}: {
  value: number;
  suffix: string;
  duration?: number;
}) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTime: number | null = null;

    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime;

      const progress = Math.min(
        (currentTime - startTime) / duration,
        1
      );

      const easedProgress =
        1 - Math.pow(1 - progress, 4);

      setCount(
        Math.floor(value * easedProgress)
      );

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setCount(value);
      }
    };

    const frame = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(frame);
  }, [value, duration]);

  const formatted = count.toLocaleString();

  return (
    <span>
      {formatted}
      {suffix}
    </span>
  );
}

export default function TrustIndicators() {
  const t = useTranslations("trust");
  const stats = getStats(t);
  
  return (
    <section className="relative overflow-hidden border-y border-gray-100 bg-white py-10 md:py-12">
      {/* Background */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/4 top-0 h-40 w-40 rounded-full bg-doctorly-primary/5 blur-3xl" />
        <div className="absolute right-1/4 bottom-0 h-40 w-40 rounded-full bg-blue-400/5 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-8 text-center"
        >
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-doctorly-primary">
            {t("trustedHealthcare")}
          </p>

          <h2 className="mt-2 text-2xl font-extrabold tracking-tight text-doctorly-text md:text-3xl">
            {t("title")}
          </h2>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4">
          {stats.map((stat, index) => {
            const Icon = stat.icon;

            return (
              <motion.div
                key={stat.label}
                initial={{
                  opacity: 0,
                  y: 15,
                }}
                whileInView={{
                  opacity: 1,
                  y: 0,
                }}
                viewport={{
                  once: true,
                  amount: 0.4,
                }}
                transition={{
                  duration: 0.45,
                  delay: index * 0.08,
                }}
                className={`
                  flex items-center justify-center
                  px-4 py-3 text-center
                  ${
                    index !== 0
                      ? "border-l border-gray-100"
                      : ""
                  }
                  ${
                    index >= 2
                      ? "border-t border-gray-100 md:border-t-0"
                      : ""
                  }
                `}
              >
                <div className="flex flex-col items-center">
                  {/* Icon */}
                  <motion.div
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    viewport={{ once: true }}
                    transition={{
                      type: "spring",
                      stiffness: 300,
                      damping: 18,
                      delay: index * 0.08,
                    }}
                    className="
                      mb-2
                      flex
                      size-8
                      items-center
                      justify-center
                      rounded-lg
                      bg-doctorly-primary/8
                      text-doctorly-primary
                    "
                  >
                    <Icon className="size-4" />
                  </motion.div>

                  {/* Animated number */}
                  <div
                    className="
                      text-2xl
                      font-extrabold
                      tracking-tight
                      text-doctorly-primary
                      sm:text-3xl
                      md:text-4xl
                    "
                  >
                    <AnimatedNumber
                      value={stat.value}
                      suffix={stat.suffix}
                    />
                  </div>

                  {/* Label */}
                  <p className="mt-1 text-[10px] font-semibold uppercase tracking-wider text-gray-500 sm:text-xs">
                    {stat.label}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Small trust line */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6 }}
          className="mt-7 flex items-center justify-center gap-1.5"
        >
          <BadgeCheck className="size-3.5 text-doctorly-primary" />

          <span className="text-[10px] text-gray-400">
            {t("disclaimer")}
          </span>
        </motion.div>
      </div>
    </section>
  );
}