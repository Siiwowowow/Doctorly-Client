"use client";

import Image from "next/image";
import { Activity, Apple, Beaker, FileText, Pill, Play, Stethoscope } from "lucide-react";
import { useTranslations } from "next-intl";

export default function MobileExperience() {
  const t = useTranslations("mobileExperience");

  return (
    <section className="font-sans w-full pt-10 sm:pt-12 lg:pt-16">
      <div className="mx-auto w-full max-w-[1200px] px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-t-[30px] bg-[#eaf7ff] px-6 pt-10 sm:px-10 sm:pt-12 lg:min-h-[390px] lg:px-14 lg:pt-0">
          <Image src="/doctorly-assest/bg-7.png" alt="" fill sizes="1136px" className="pointer-events-none select-none object-cover opacity-75" />

          <div className="relative z-10 grid items-center gap-10 lg:min-h-[390px] lg:grid-cols-[52%_48%]">
            <div className="pb-4 lg:py-12">
              <div className="inline-flex items-center gap-2 text-xs font-extrabold tracking-[0.08em] text-[#1268e8] uppercase">
                <span className="flex size-6 items-center justify-center rounded-full bg-white text-[#1268e8] shadow-sm">
                  <Activity className="size-3.5" />
                </span>
                {t("eyebrow")}
              </div>
              <h2 className="mt-4 text-[36px] leading-[1.02] font-extrabold tracking-[-0.04em] text-[#09143b] sm:text-[46px] lg:text-[52px]">
                {t("title")}
              </h2>
              <p className="mt-4 max-w-xl text-sm leading-6 font-medium text-[#536681] sm:text-base lg:text-lg">
                {t("subtitle")}
              </p>

              <div className="mt-7 flex flex-wrap gap-3">
                <a href="#" className="flex h-14 items-center gap-3 rounded-xl bg-black px-5 text-white transition hover:-translate-y-0.5 hover:bg-[#101827]">
                  <Apple className="size-7 fill-current" />
                  <span>
                    <span className="block text-[9px] leading-none uppercase">Download on the</span>
                    <strong className="mt-1 block text-base leading-none">{t("appStore")}</strong>
                  </span>
                </a>
                <a href="#" className="flex h-14 items-center gap-3 rounded-xl bg-black px-5 text-white transition hover:-translate-y-0.5 hover:bg-[#101827]">
                  <Play className="size-6 fill-current" />
                  <span>
                    <span className="block text-[9px] leading-none uppercase">Get it on</span>
                    <strong className="mt-1 block text-base leading-none">{t("googlePlay")}</strong>
                  </span>
                </a>
              </div>
            </div>

            <div className="relative mx-auto h-[340px] w-full max-w-[470px] lg:self-end">
              <div className="absolute bottom-[-48px] left-[7%] h-[330px] w-[178px] rotate-[-8deg] overflow-hidden rounded-[34px] border-[9px] border-[#101722] bg-white shadow-[0_24px_50px_-25px_rgba(6,42,96,0.6)]">
                <div className="absolute top-0 left-1/2 z-10 h-5 w-20 -translate-x-1/2 rounded-b-2xl bg-[#101722]" />
                <div className="flex h-full flex-col items-center justify-center bg-[linear-gradient(145deg,#ffffff,#dff3ff)] px-4 text-center">
                  <span className="flex size-14 items-center justify-center rounded-2xl bg-[#1268e8] text-white shadow-lg shadow-blue-500/25">
                    <Activity className="size-8" />
                  </span>
                  <strong className="mt-4 text-xl text-[#09143b]">Doctorly</strong>
                  <span className="mt-2 text-[10px] font-semibold text-[#6d7d96]">Better Care<br />Brighter Tomorrow</span>
                </div>
              </div>

              <div className="absolute right-[5%] bottom-[-28px] h-[360px] w-[195px] rotate-[6deg] overflow-hidden rounded-[36px] border-[9px] border-[#101722] bg-white shadow-[0_28px_55px_-25px_rgba(6,42,96,0.7)] sm:right-[10%]">
                <div className="absolute top-0 left-1/2 z-20 h-5 w-20 -translate-x-1/2 rounded-b-2xl bg-[#101722]" />
                <div className="bg-[#1268e8] px-4 pt-9 pb-7 text-white">
                  <p className="text-[10px] font-medium">Good Morning,</p>
                  <p className="mt-1 text-xs font-bold">A healthier you today!</p>
                </div>
                <div className="-mt-3 grid grid-cols-2 gap-2 px-3">
                  {[
                    [Stethoscope, "Choose Doctor"],
                    [Beaker, "Lab Tests"],
                    [Pill, "Medicine"],
                    [FileText, "Records"],
                  ].map(([Icon, label]) => {
                    const ServiceIcon = Icon as typeof Stethoscope;
                    return (
                      <div key={label as string} className="flex h-[76px] flex-col items-center justify-center rounded-xl bg-white text-center shadow-[0_8px_20px_-14px_rgba(4,52,120,0.55)]">
                        <ServiceIcon className="size-5 text-[#1268e8]" />
                        <span className="mt-2 text-[8px] font-bold text-[#273a5d]">{label as string}</span>
                      </div>
                    );
                  })}
                </div>
                <div className="absolute inset-x-0 bottom-0 flex h-12 items-center justify-around border-t border-[#e8eef5] bg-white text-[#91a0b7]">
                  <span className="size-2 rounded-full bg-[#1268e8]" />
                  <span className="size-2 rounded-full bg-[#c5cfdd]" />
                  <span className="size-2 rounded-full bg-[#c5cfdd]" />
                  <span className="size-2 rounded-full bg-[#c5cfdd]" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
