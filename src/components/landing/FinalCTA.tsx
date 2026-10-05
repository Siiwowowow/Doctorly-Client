"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useTranslations } from "next-intl";

export default function FinalCTA() {
  const t = useTranslations("finalCTA");

  return (
    <section className="font-sans w-full py-8 sm:py-10 lg:py-12">
      <div className="mx-auto w-full max-w-[1200px] px-4 sm:px-6 lg:px-8">
        <div className="relative min-h-[380px] overflow-hidden rounded-[28px] bg-[#0876ed] shadow-[0_22px_50px_-32px_rgba(8,78,190,0.75)] sm:min-h-[400px] md:min-h-[270px] lg:min-h-[290px]">
          <Image
            src="/doctorly-assest/phone2.png"
            alt="Video consultation with a Doctorly doctor"
            fill
            sizes="(max-width: 768px) 100vw, 1136px"
            className="select-none object-cover object-[68%_center] md:object-contain md:object-right"
          />
          <div className="absolute inset-0 bg-[linear-gradient(90deg,#064bcf_0%,rgba(5,77,207,0.98)_43%,rgba(5,82,214,0.68)_57%,rgba(5,90,220,0.05)_76%,transparent_100%)]" />

          <div className="relative z-10 flex min-h-[380px] max-w-[650px] flex-col justify-center px-6 py-10 text-white sm:min-h-[400px] sm:px-10 md:min-h-[270px] md:max-w-[58%] md:px-12 md:py-8 lg:min-h-[290px] lg:px-14">
            <span className="text-xs font-extrabold tracking-[0.14em] text-cyan-100 uppercase">{t("badge")}</span>
            <h2 className="mt-3 text-[34px] leading-[1.02] font-extrabold tracking-[-0.035em] text-white sm:text-[42px] md:text-[36px] lg:text-[44px]">
              <span className="text-white drop-shadow-[0_2px_12px_rgba(0,30,110,0.18)]">{t("appointmentTitle")}</span>
            </h2>
            <p className="mt-4 max-w-xl text-sm leading-6 font-medium text-blue-50/90 sm:text-base md:text-sm lg:text-base">
              {t("appointmentSubtitle")}
            </p>
            <Link
              href="/doctors"
              className="group mt-6 inline-flex h-12 w-fit items-center gap-8 rounded-xl bg-white px-6 text-sm font-extrabold text-[#075fd0] shadow-[0_12px_26px_-16px_rgba(0,0,0,0.55)] transition hover:-translate-y-0.5 hover:bg-blue-50"
            >
              {t("appointmentButton")}
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
