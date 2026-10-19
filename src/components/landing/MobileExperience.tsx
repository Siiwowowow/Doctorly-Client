"use client";

import Image from "next/image";
import { Activity, Apple, Beaker, FileText, Pill, Play, Stethoscope } from "lucide-react";
import { useTranslations } from "next-intl";

export default function MobileExperience() {
  const t = useTranslations("mobileExperience");

  return (
    <section className="relative z-10 -mb-12 w-full pt-10 font-sans sm:-mb-16 sm:pt-12 lg:-mb-20 lg:pt-16">
      <div className="mx-auto w-full max-w-[1200px] px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-[30px] bg-[#eaf7ff] px-[clamp(8px,4vw,56px)] pt-[clamp(12px,3vw,48px)] shadow-[0_24px_60px_-36px_rgba(6,42,96,0.55)] lg:min-h-[390px] lg:pt-0">
          <Image src="/doctorly-assest/bg-7.webp" alt="" fill loading="lazy" sizes="1136px" className="pointer-events-none select-none object-cover opacity-75" />

          <div className="relative z-10 grid min-h-[clamp(150px,29vw,390px)] grid-cols-[52%_48%] items-center gap-0 lg:min-h-[390px]">
            <div className="py-[clamp(12px,3vw,48px)]">
              <div className="inline-flex items-center gap-[clamp(3px,0.6vw,8px)] text-[clamp(6px,0.7vw,12px)] font-extrabold tracking-[0.08em] text-[#1268e8] uppercase">
                <span className="flex size-[clamp(14px,1.8vw,24px)] items-center justify-center rounded-full bg-white text-[#1268e8] shadow-sm">
                  <Activity className="size-[clamp(8px,1vw,14px)]" />
                </span>
                {t("eyebrow")}
              </div>
              <h2 className="mt-[clamp(5px,1.2vw,16px)] text-[clamp(16px,3.85vw,52px)] leading-[1.02] font-extrabold tracking-[-0.04em] text-[#09143b]">
                {t("title")}
              </h2>
              <p className="mt-[clamp(5px,1.2vw,16px)] max-w-xl text-[clamp(7px,1.32vw,18px)] leading-[1.35] font-medium text-[#536681]">
                {t("subtitle")}
              </p>

              <div className="mt-[clamp(8px,2vw,28px)] flex flex-wrap gap-[clamp(3px,0.8vw,12px)]">
                <a href="#" className="flex h-[clamp(28px,4.1vw,56px)] items-center gap-[clamp(3px,0.8vw,12px)] rounded-[clamp(6px,0.9vw,12px)] bg-black px-[clamp(7px,1.5vw,20px)] text-white transition hover:-translate-y-0.5 hover:bg-[#101827]">
                  <Apple className="size-[clamp(14px,2vw,28px)] fill-current" />
                  <span>
                    <span className="block text-[clamp(5px,0.65vw,9px)] leading-none uppercase">Download on the</span>
                    <strong className="mt-[clamp(1px,0.2vw,4px)] block text-[clamp(8px,1.2vw,16px)] leading-none">{t("appStore")}</strong>
                  </span>
                </a>
                <a href="#" className="flex h-[clamp(28px,4.1vw,56px)] items-center gap-[clamp(3px,0.8vw,12px)] rounded-[clamp(6px,0.9vw,12px)] bg-black px-[clamp(7px,1.5vw,20px)] text-white transition hover:-translate-y-0.5 hover:bg-[#101827]">
                  <Play className="size-[clamp(13px,1.8vw,24px)] fill-current" />
                  <span>
                    <span className="block text-[clamp(5px,0.65vw,9px)] leading-none uppercase">Get it on</span>
                    <strong className="mt-[clamp(1px,0.2vw,4px)] block text-[clamp(8px,1.2vw,16px)] leading-none">{t("googlePlay")}</strong>
                  </span>
                </a>
              </div>
            </div>

            <div className="relative mx-auto h-[clamp(135px,29vw,340px)] w-full max-w-[470px] self-end">
              <div className="absolute bottom-[-10px] left-[2%] h-[clamp(130px,25vw,330px)] w-[clamp(70px,13.5vw,178px)] rotate-[-8deg] overflow-hidden rounded-[clamp(14px,2.6vw,34px)] border-[clamp(3px,0.65vw,9px)] border-[#101722] bg-white shadow-[0_24px_50px_-25px_rgba(6,42,96,0.6)] lg:bottom-[-48px]">
                <div className="absolute top-0 left-1/2 z-10 h-[clamp(9px,1.3vw,20px)] w-[clamp(30px,5.2vw,80px)] -translate-x-1/2 rounded-b-2xl bg-[#101722]" />
                <div className="flex h-full flex-col items-center justify-center bg-[linear-gradient(145deg,#ffffff,#dff3ff)] px-[clamp(4px,1.2vw,16px)] text-center">
                  <span className="flex size-[clamp(28px,4vw,56px)] items-center justify-center rounded-[clamp(8px,1.5vw,16px)] bg-[#1268e8] text-white shadow-lg shadow-blue-500/25">
                    <Activity className="size-[clamp(15px,2.3vw,32px)]" />
                  </span>
                  <strong className="mt-[clamp(5px,1vw,16px)] text-[clamp(9px,1.5vw,20px)] text-[#09143b]">Doctorly</strong>
                  <span className="mt-[clamp(2px,0.5vw,8px)] text-[clamp(4px,0.75vw,10px)] font-semibold text-[#6d7d96]">Better Care<br />Brighter Tomorrow</span>
                </div>
              </div>

              <div className="absolute right-[2%] bottom-[-10px] h-[clamp(125px,27vw,360px)] w-[clamp(74px,14.8vw,195px)] rotate-[6deg] overflow-hidden rounded-[clamp(15px,2.8vw,36px)] border-[clamp(3px,0.65vw,9px)] border-[#101722] bg-white shadow-[0_28px_55px_-25px_rgba(6,42,96,0.7)] lg:bottom-[-28px]">
                <div className="absolute top-0 left-1/2 z-20 h-[clamp(9px,1.3vw,20px)] w-[clamp(30px,5.2vw,80px)] -translate-x-1/2 rounded-b-2xl bg-[#101722]" />
                <div className="bg-[#1268e8] px-[clamp(6px,1.2vw,16px)] pt-[clamp(16px,2.7vw,36px)] pb-[clamp(10px,2vw,28px)] text-white">
                  <p className="text-[clamp(4px,0.65vw,10px)] font-medium">Good Morning,</p>
                  <p className="mt-[clamp(1px,0.2vw,4px)] text-[clamp(5px,0.8vw,12px)] font-bold">A healthier you today!</p>
                </div>
                <div className="-mt-[clamp(4px,0.8vw,12px)] grid grid-cols-2 gap-[clamp(2px,0.6vw,8px)] px-[clamp(3px,0.9vw,12px)]">
                  {[
                    [Stethoscope, "Choose Doctor"],
                    [Beaker, "Lab Tests"],
                    [Pill, "Medicine"],
                    [FileText, "Records"],
                  ].map(([Icon, label]) => {
                    const ServiceIcon = Icon as typeof Stethoscope;
                    return (
                      <div key={label as string} className="flex h-[clamp(35px,5.5vw,76px)] flex-col items-center justify-center rounded-[clamp(5px,0.9vw,12px)] bg-white text-center shadow-[0_8px_20px_-14px_rgba(4,52,120,0.55)]">
                        <ServiceIcon className="size-[clamp(9px,1.5vw,20px)] text-[#1268e8]" />
                        <span className="mt-[clamp(1px,0.5vw,8px)] text-[clamp(4px,0.6vw,8px)] font-bold text-[#273a5d]">{label as string}</span>
                      </div>
                    );
                  })}
                </div>
                <div className="absolute inset-x-0 bottom-0 flex h-[clamp(20px,3.5vw,48px)] items-center justify-around border-t border-[#e8eef5] bg-white text-[#91a0b7]">
                  <span className="size-[clamp(3px,0.6vw,8px)] rounded-full bg-[#1268e8]" />
                  <span className="size-[clamp(3px,0.6vw,8px)] rounded-full bg-[#c5cfdd]" />
                  <span className="size-[clamp(3px,0.6vw,8px)] rounded-full bg-[#c5cfdd]" />
                  <span className="size-[clamp(3px,0.6vw,8px)] rounded-full bg-[#c5cfdd]" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
