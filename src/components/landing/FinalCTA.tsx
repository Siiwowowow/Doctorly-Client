"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useTranslations } from "next-intl";

export default function FinalCTA() {
  const t = useTranslations("finalCTA");

  return (
    <section className="w-full py-[clamp(16px,3vw,48px)] font-sans">
      <div className="mx-auto w-full max-w-[1200px] px-[clamp(12px,4vw,32px)]">
        <div className="relative h-[clamp(170px,24vw,290px)] overflow-hidden rounded-[clamp(18px,2.1vw,28px)] bg-[#0876ed] shadow-[0_22px_50px_-32px_rgba(8,78,190,0.75)]">
          <Image
            src="/doctorly-assest/phone2.webp"
            alt="Video consultation with a Doctorly doctor"
            fill
            loading="lazy"
            sizes="(max-width: 1200px) 100vw, 1136px"
            className="pointer-events-none select-none object-contain object-right"
          />
          <div className="absolute inset-0 bg-[linear-gradient(90deg,#064bcf_0%,rgba(5,77,207,0.98)_43%,rgba(5,82,214,0.68)_57%,rgba(5,90,220,0.05)_76%,transparent_100%)]" />

          <div className="absolute inset-y-0 left-0 z-10 flex w-[58%] max-w-[650px] flex-col justify-center px-[clamp(12px,4vw,56px)] py-[clamp(14px,3vw,32px)] text-white">
            <span className="text-[clamp(5px,0.8vw,12px)] font-extrabold tracking-[0.14em] text-cyan-100 uppercase">{t("badge")}</span>
            <h2 className="mt-[clamp(4px,1vw,12px)] text-[clamp(18px,3.25vw,44px)] leading-[1.02] font-extrabold tracking-[-0.035em] text-white">
              <span className="text-white drop-shadow-[0_2px_12px_rgba(0,30,110,0.18)]">{t("appointmentTitle")}</span>
            </h2>
            <p className="mt-[clamp(5px,1vw,16px)] max-w-xl text-[clamp(7px,1.18vw,16px)] leading-[1.45] font-medium text-blue-50/90">
              {t("appointmentSubtitle")}
            </p>
            <Link
              href="/doctors"
              className="group mt-[clamp(8px,2vw,24px)] inline-flex h-[clamp(30px,4vw,48px)] w-fit items-center gap-[clamp(12px,2.5vw,32px)] rounded-[clamp(6px,0.9vw,12px)] bg-white px-[clamp(10px,1.8vw,24px)] text-[clamp(7px,1vw,14px)] font-extrabold text-[#075fd0] shadow-[0_12px_26px_-16px_rgba(0,0,0,0.55)] transition hover:-translate-y-0.5 hover:bg-blue-50"
            >
              {t("appointmentButton")}
              <ArrowRight className="size-[clamp(10px,1.2vw,16px)] transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
