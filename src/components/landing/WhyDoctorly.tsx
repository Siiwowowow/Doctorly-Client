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
    <section id="why-choose-us" className="relative w-full py-[clamp(16px,3vw,56px)] font-sans">
      <div className="mx-auto w-full max-w-[1440px] px-[clamp(0px,3vw,40px)]">
        <div className="relative h-[clamp(180px,29.85vw,400px)] overflow-hidden rounded-[clamp(18px,2.5vw,36px)] border border-[#cbe6f8] bg-gradient-to-r from-[#eef8ff] via-[#f5faff] to-[#eaf5fe] shadow-[0_12px_36px_-15px_rgba(29,99,237,0.18)]">
          <div className="relative z-10 grid h-full grid-cols-[44%_34%_22%] items-stretch">
            <div className="relative order-1 overflow-hidden">
              <Image
                src="/doctorly-assest/bg-5.webp"
                alt=""
                fill
                loading="lazy"
                sizes="(max-width: 1024px) 100vw, 620px"
                className="pointer-events-none select-none object-contain object-left-bottom"
              />
              <Image
                src="/doctorly-assest/banner2.webp"
                alt="Mother and daughter smiling"
                fill
                loading="lazy"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 620px, 44vw"
                className="pointer-events-none z-10 select-none object-contain object-left-bottom drop-shadow-[0_12px_24px_rgba(15,23,42,0.09)]"
              />
            </div>

            <div className="order-2 flex min-w-0 flex-col items-start justify-center px-[clamp(7px,1.8vw,20px)] py-[clamp(8px,2.1vw,32px)]">
              <div className="inline-flex min-w-0 items-center gap-[clamp(3px,0.6vw,10px)] rounded-full bg-[#d9edff]/95 px-[clamp(5px,1vw,16px)] py-[clamp(3px,0.5vw,8px)] text-[clamp(5px,0.85vw,14px)] font-bold tracking-[0.055em] text-[#1268e8] uppercase">
                <span className="size-[clamp(4px,0.65vw,10px)] shrink-0 rounded-full bg-[#1675ed]" />
                <span>{t("eyebrow")}</span>
              </div>

              <h2 className="mt-[clamp(5px,1.2vw,16px)] text-[clamp(17px,3.7vw,60px)] leading-[1.04] font-extrabold tracking-[-0.015em] [word-spacing:0.1em]">
                <span className="block text-[#09143b]">{t("titleLine1")}</span>
                <span className="block text-[#1268e8]">{t("titleLine2")}</span>
              </h2>

              <p className="mt-[clamp(5px,1vw,16px)] max-w-md text-[clamp(6px,1.2vw,19px)] leading-[1.45] font-medium text-[#4c6086]">
                {t("subtitle")}
              </p>

              <Link
                href="/doctors"
                className="group mt-[clamp(7px,1.5vw,24px)] inline-flex h-[clamp(30px,4.4vw,64px)] w-full max-w-[clamp(100px,25vw,340px)] items-center justify-between rounded-[clamp(8px,1.4vw,20px)] bg-[#1268e8] px-[clamp(8px,1.8vw,28px)] text-[clamp(7px,1.15vw,18px)] font-bold text-white shadow-[0_12px_26px_-14px_rgba(18,104,232,0.9)] transition duration-200 hover:-translate-y-0.5 hover:bg-[#0d5ed7] hover:shadow-[0_16px_30px_-14px_rgba(18,104,232,0.95)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1268e8]"
              >
                <span>{t("cta")}</span>
                <ArrowRight className="size-[clamp(10px,1.5vw,24px)] transition-transform duration-200 group-hover:translate-x-1" />
              </Link>
            </div>

            <div className="order-3 flex min-w-0 flex-col justify-center gap-[clamp(5px,1.3vw,20px)] px-[clamp(5px,1.2vw,16px)] py-[clamp(8px,2vw,32px)]">
              {features.map(({ icon: Icon, title }) => (
                <div key={title} className="flex min-w-0 items-center gap-[clamp(4px,0.8vw,16px)]">
                  <span className="flex size-[clamp(22px,3.3vw,48px)] shrink-0 items-center justify-center rounded-full bg-[#1268e8] text-white shadow-sm">
                    <Icon className="size-[clamp(10px,1.6vw,24px)] stroke-[2.2] text-white" aria-hidden="true" />
                  </span>
                  <span className="min-w-0 text-[clamp(5px,1.1vw,18px)] leading-tight font-semibold text-[#283a63] [word-spacing:0.08em]">
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
