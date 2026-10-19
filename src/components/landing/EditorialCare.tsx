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
    <section className="relative w-full overflow-x-clip py-[clamp(16px,3vw,40px)] font-sans">
      <div className="mx-auto w-full max-w-[1440px] px-[clamp(0px,3vw,40px)]">
        <div className="relative">
          <div className="absolute -top-[clamp(8px,1.2vw,16px)] right-[clamp(8px,2vw,28px)] z-30 rotate-2 bg-[#ffe13b] px-[clamp(6px,1.1vw,16px)] py-[clamp(4px,0.6vw,8px)] text-[clamp(5px,0.8vw,11px)] font-black tracking-[0.12em] text-[#09143b] uppercase shadow-[clamp(3px,0.4vw,5px)_clamp(3px,0.4vw,5px)_0_#ff5f7e]">
            {t("sticker")}
          </div>

          <div className="relative h-[clamp(250px,31vw,340px)] overflow-hidden bg-[#dff2ff] shadow-[clamp(5px,0.7vw,10px)_clamp(5px,0.7vw,10px)_0_#78d5ff]">
            <Image
              src="/doctorly-assest/banner5.webp"
              alt="A doctor having a thoughtful conversation with a patient"
              fill
              loading="lazy"
              sizes="(max-width: 1440px) 100vw, 1440px"
              className="pointer-events-none scale-x-[1.06] select-none object-cover object-center"
            />

            <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,#fff_0%,rgba(255,255,255,0.98)_37%,rgba(255,255,255,0.66)_52%,transparent_70%)]" />

            <div className="relative z-10 w-[48%] max-w-[650px] px-[clamp(10px,3.5vw,48px)] py-[clamp(18px,3vw,36px)]">
              <div className="inline-flex items-center gap-[clamp(3px,0.6vw,8px)] bg-[#09143b] px-[clamp(5px,0.9vw,12px)] py-[clamp(3px,0.45vw,6px)] text-[clamp(5px,0.75vw,11px)] font-black tracking-[0.08em] text-white uppercase shadow-[clamp(2px,0.3vw,4px)_clamp(2px,0.3vw,4px)_0_#ff5f7e]">
                <span className="size-[clamp(4px,0.55vw,8px)] bg-[#ffe13b]" />
                {t("eyebrow")}
              </div>

              <h2 className="mt-[clamp(6px,1.2vw,16px)] text-[clamp(18px,3.5vw,50px)] leading-[0.96] font-black tracking-[-0.045em] text-[#09143b]">
                {t("titleLine1")}
                <span className="mt-[clamp(2px,0.35vw,4px)] block text-[#1268e8]">{t("titleLine2")}</span>
              </h2>

              <p className="mt-[clamp(6px,1.2vw,16px)] max-w-md text-[clamp(6px,1.1vw,16px)] leading-[1.35] font-bold text-[#42516d]">
                {t("description")}
              </p>
            </div>

            <div className="absolute right-[clamp(8px,2vw,24px)] bottom-[clamp(8px,2vw,24px)] z-10 flex w-[clamp(145px,17vw,225px)] items-center gap-[clamp(4px,0.8vw,10px)] bg-[#ffe13b] p-[clamp(5px,0.8vw,10px)] shadow-[clamp(2px,0.4vw,5px)_clamp(2px,0.4vw,5px)_0_#1268e8]">
              <span className="flex size-[clamp(24px,3vw,40px)] shrink-0 items-center justify-center bg-[#ff5f7e] text-white">
                <HeartPulse className="size-[clamp(12px,1.5vw,20px)]" aria-hidden="true" />
              </span>
              <span>
                <strong className="block text-[clamp(6px,1vw,14px)] font-black text-[#09143b]">{t("calloutTitle")}</strong>
                <span className="mt-[clamp(1px,0.15vw,2px)] block text-[clamp(5px,0.75vw,11px)] leading-[1.25] font-bold text-[#53617a]">{t("calloutDescription")}</span>
              </span>
            </div>
          </div>

          <div className="relative z-20 -mt-[clamp(14px,2.4vw,24px)] grid grid-cols-4 gap-[clamp(4px,0.9vw,12px)] px-[clamp(4px,1.5vw,20px)]">
            {features.map(({ icon: Icon, title, description, cardClass, iconClass }, index) => (
              <article
                key={title}
                className={`group relative min-h-[clamp(82px,10.5vw,148px)] overflow-hidden p-[clamp(5px,1.2vw,16px)] shadow-[clamp(3px,0.5vw,7px)_clamp(3px,0.5vw,7px)_0_rgba(9,20,59,0.9)] transition-transform duration-200 hover:translate-x-1 hover:translate-y-1 hover:shadow-none ${cardClass}`}
              >
                <div className="relative z-10 block">
                  <span className={`flex size-[clamp(22px,3.2vw,44px)] items-center justify-center shadow-[clamp(2px,0.3vw,3px)_clamp(2px,0.3vw,3px)_0_rgba(9,20,59,0.28)] ${iconClass}`}>
                    <Icon className="size-[clamp(11px,1.5vw,20px)]" strokeWidth={2.6} aria-hidden="true" />
                  </span>
                  <span className="mt-[clamp(3px,0.8vw,12px)] block">
                    <h3 className="text-[clamp(6px,1.05vw,15px)] leading-[1.05] font-black text-[#09143b]">{title}</h3>
                    <p className="mt-[clamp(2px,0.4vw,6px)] text-[clamp(4px,0.75vw,12px)] leading-[1.25] font-bold text-[#34435c]">{description}</p>
                  </span>
                </div>
                <span className="pointer-events-none absolute -right-1 -bottom-2 text-[clamp(28px,4.2vw,58px)] leading-none font-black text-[#09143b]/10" aria-hidden="true">
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
