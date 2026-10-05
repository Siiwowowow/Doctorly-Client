"use client";

import Image from "next/image";
import { Clock3, HeartPulse, LockKeyhole, ShieldCheck, Tags } from "lucide-react";
import { useTranslations } from "next-intl";

export default function EditorialCare() {
  const t = useTranslations("editorialCare");

  const features = [
    {
      icon: ShieldCheck,
      title: t("verifiedTitle"),
      description: t("verifiedDescription"),
      cardClass: "bg-gradient-to-br from-[#46bfff] to-[#b8ecff]",
      iconClass: "bg-[#1268e8] text-white",
    },
    {
      icon: Clock3,
      title: t("convenientTitle"),
      description: t("convenientDescription"),
      cardClass: "bg-gradient-to-br from-[#ffe13b] to-[#ffad4d]",
      iconClass: "bg-[#09143b] text-[#ffe36d]",
    },
    {
      icon: Tags,
      title: t("affordableTitle"),
      description: t("affordableDescription"),
      cardClass: "bg-gradient-to-br from-[#ff7394] to-[#ffc0cf]",
      iconClass: "bg-[#09143b] text-white",
    },
    {
      icon: LockKeyhole,
      title: t("secureTitle"),
      description: t("secureDescription"),
      cardClass: "bg-gradient-to-br from-[#55dca1] to-[#b9f1d6]",
      iconClass: "bg-[#09143b] text-white",
    },
  ];

  return (
    <section className="font-sans relative w-full overflow-x-clip py-8 sm:py-9 lg:py-10">
      <div className="mx-auto w-full max-w-[1200px] px-4 sm:px-6 lg:px-8">
        <div className="relative">
          <div className="absolute -top-4 right-4 z-30 hidden rotate-2 bg-[#ffe13b] px-4 py-2 text-[11px] font-black tracking-[0.12em] text-[#09143b] uppercase shadow-[5px_5px_0_#ff5f7e] md:block">
            {t("sticker")}
          </div>

          <div className="relative min-h-[500px] overflow-hidden bg-[#dff2ff] shadow-[10px_10px_0_#78d5ff] sm:min-h-[540px] md:min-h-[320px] lg:min-h-[340px]">
            <Image
              src="/doctorly-assest/banner5.png"
              alt="A doctor having a thoughtful conversation with a patient"
              fill
              sizes="(max-width: 768px) 100vw, 1136px"
              className="hidden scale-x-[1.06] select-none object-cover object-center md:block"
            />

            <div className="absolute inset-x-0 bottom-0 h-[42%] md:hidden">
              <div className="absolute inset-0 bg-[#dff2ff]" />
              <Image
                src="/doctorly-assest/banner4.png"
                alt="Doctor consulting with a patient"
                fill
                sizes="100vw"
                className="relative select-none object-contain object-bottom"
              />
            </div>

            <div className="pointer-events-none absolute inset-0 hidden bg-[linear-gradient(90deg,#fff_0%,rgba(255,255,255,0.98)_37%,rgba(255,255,255,0.66)_52%,transparent_70%)] md:block" />

            <div className="relative z-10 max-w-xl px-5 pt-7 sm:px-8 sm:pt-9 md:max-w-[50%] md:px-8 md:py-8 lg:px-10 lg:py-9 xl:max-w-[48%] xl:px-12">
              <div className="inline-flex items-center gap-2 bg-[#09143b] px-3 py-1.5 text-[10px] font-black tracking-[0.08em] text-white uppercase shadow-[4px_4px_0_#ff5f7e] sm:text-[11px]">
                <span className="size-2 bg-[#ffe13b]" />
                {t("eyebrow")}
              </div>

              <h2 className="mt-4 text-[34px] leading-[0.94] font-black tracking-[-0.045em] text-[#09143b] sm:text-[40px] md:text-[38px] lg:text-[46px] xl:text-[50px]">
                {t("titleLine1")}
                <span className="mt-1 block text-[#1268e8]">{t("titleLine2")}</span>
              </h2>

              <p className="mt-4 max-w-md text-[14px] leading-5 font-bold text-[#42516d] sm:text-[15px] lg:text-base">
                {t("description")}
              </p>
            </div>

            <div className="absolute right-3 bottom-3 z-10 flex max-w-[225px] items-center gap-2.5 bg-[#ffe13b] p-2.5 shadow-[5px_5px_0_#1268e8] sm:right-5 sm:bottom-5 md:right-5 md:bottom-5">
              <span className="flex size-10 shrink-0 items-center justify-center bg-[#ff5f7e] text-white">
                <HeartPulse className="size-5" aria-hidden="true" />
              </span>
              <span>
                <strong className="block text-xs font-black text-[#09143b] sm:text-sm">{t("calloutTitle")}</strong>
                <span className="mt-0.5 block text-[11px] leading-4 font-bold text-[#53617a]">{t("calloutDescription")}</span>
              </span>
            </div>
          </div>

          <div className="relative z-20 mt-4 grid gap-3 sm:grid-cols-2 lg:-mt-6 lg:grid-cols-4 lg:px-5">
            {features.map(({ icon: Icon, title, description, cardClass, iconClass }, index) => (
              <article
                key={title}
                className={`group relative min-h-[132px] overflow-hidden p-4 shadow-[7px_7px_0_rgba(9,20,59,0.9)] transition-transform duration-200 hover:translate-x-1 hover:translate-y-1 hover:shadow-none lg:min-h-[148px] ${cardClass}`}
              >
                <div className="relative z-10 flex items-start gap-3 lg:block">
                  <span className={`flex size-11 shrink-0 items-center justify-center shadow-[3px_3px_0_rgba(9,20,59,0.28)] ${iconClass}`}>
                    <Icon className="size-5" strokeWidth={2.6} aria-hidden="true" />
                  </span>
                  <span className="pr-4 lg:mt-3 lg:block lg:pr-0">
                    <h3 className="text-[15px] leading-[1.05] font-black text-[#09143b]">{title}</h3>
                    <p className="mt-1.5 text-xs leading-4 font-bold text-[#34435c]">{description}</p>
                  </span>
                </div>
                <span className="pointer-events-none absolute -right-1 -bottom-3 text-[58px] leading-none font-black text-[#09143b]/10" aria-hidden="true">
                  0{index + 1}
                </span>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
