"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Clock3, Heart, ShieldCheck, Users } from "lucide-react";
import { useTranslations } from "next-intl";

export default function WhyDoctorly() {
  const t = useTranslations("whyDoctorly");

  const features = [
    { icon: Users, title: t("feature1") },
    { icon: Heart, title: t("feature2") },
    { icon: ShieldCheck, title: t("feature3") },
    { icon: Clock3, title: t("feature4") },
  ];

  return (
    <section id="why-choose-us" className="font-sans relative w-full py-8 sm:py-10 lg:py-14">
      <div className="mx-auto w-full max-w-[1440px] px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-[28px] border border-[#cbe6f8] bg-gradient-to-r from-[#eef8ff] via-[#f5faff] to-[#eaf5fe] shadow-[0_12px_36px_-15px_rgba(29,99,237,0.18)] sm:rounded-[36px] lg:aspect-[3.35/1]">
          <div className="relative z-10 grid lg:h-full lg:grid-cols-[44%_34%_22%] lg:items-stretch">
            <div className="relative order-1 min-h-[310px] overflow-hidden sm:min-h-[390px] lg:min-h-0">
              <Image
                src="/doctorly-assest/bg-5.png"
                alt=""
                fill
                sizes="(max-width: 1024px) 100vw, 620px"
                className="pointer-events-none select-none object-contain object-left-bottom"
              />
              <Image
                src="/doctorly-assest/banner2.png"
                alt="Mother and daughter smiling"
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 620px, 44vw"
                className="pointer-events-none z-10 select-none object-contain object-left-bottom drop-shadow-[0_12px_24px_rgba(15,23,42,0.09)]"
              />
            </div>

            <div className="order-2 flex flex-col items-start justify-center px-6 py-9 sm:px-10 sm:py-11 lg:px-3 lg:py-8 xl:px-5">
              <div className="inline-flex items-center gap-2.5 rounded-full bg-[#d9edff]/95 px-4 py-2 text-[11px] font-bold tracking-[0.055em] text-[#1268e8] uppercase sm:text-xs lg:px-4 lg:py-2 xl:text-[14px]">
                <span className="size-2.5 shrink-0 rounded-full bg-[#1675ed]" />
                <span>{t("eyebrow")}</span>
              </div>

              <h2 className="mt-4 text-[34px] leading-[1.04] font-extrabold tracking-[-0.015em] [word-spacing:0.1em] sm:text-[44px] lg:text-[56px] xl:text-[60px]">
                <span className="block text-[#09143b]">{t("titleLine1")}</span>
                <span className="block text-[#1268e8]">{t("titleLine2")}</span>
              </h2>

              <p className="mt-4 max-w-md text-[15px] leading-[1.45] font-medium text-[#4c6086] sm:text-lg lg:mt-3 lg:text-base xl:text-[19px]">
                {t("subtitle")}
              </p>

              <Link
                href="/doctors"
                className="group mt-6 inline-flex h-14 w-full max-w-[340px] items-center justify-between rounded-[20px] bg-[#1268e8] px-7 text-base font-bold text-white shadow-[0_12px_26px_-14px_rgba(18,104,232,0.9)] transition duration-200 hover:-translate-y-0.5 hover:bg-[#0d5ed7] hover:shadow-[0_16px_30px_-14px_rgba(18,104,232,0.95)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1268e8] lg:mt-5 lg:h-[58px] xl:mt-6 xl:h-16 xl:text-lg"
              >
                <span>{t("cta")}</span>
                <ArrowRight className="size-5 transition-transform duration-200 group-hover:translate-x-1 xl:size-6" />
              </Link>
            </div>

            <div className="order-3 grid grid-cols-1 gap-4 px-6 pb-10 sm:grid-cols-2 sm:px-10 lg:flex lg:flex-col lg:justify-center lg:gap-4 lg:px-2 lg:py-8 xl:gap-5 xl:px-3">
              {features.map(({ icon: Icon, title }) => (
                <div key={title} className="flex items-center gap-4 lg:gap-3 xl:gap-4">
                  <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-[#1268e8] text-white shadow-sm lg:size-11 xl:size-12">
                    <Icon className="size-5 stroke-[2.2] text-white lg:size-5.5 xl:size-6" aria-hidden="true" />
                  </span>
                  <span className="text-[15px] leading-tight font-semibold text-[#283a63] [word-spacing:0.08em] lg:text-base xl:text-[18px]">
                    {title}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
