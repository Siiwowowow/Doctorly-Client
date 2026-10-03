import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CheckCircle2, ShieldCheck, Video } from "lucide-react";
import { useTranslations } from "next-intl";

export default function Hero() {
  const t = useTranslations("hero");

  return (
    <section className="relative isolate overflow-hidden bg-[#F4F8FF]">
      <div className="mx-auto grid w-full max-w-7xl items-center gap-10 px-5 py-12 sm:px-8 sm:py-16 lg:min-h-[620px] lg:grid-cols-[0.92fr_1.08fr] lg:gap-12 lg:px-10 lg:py-16">
        <div className="relative z-10 max-w-2xl">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-blue-200 bg-white px-3.5 py-2 text-xs font-semibold text-blue-700 shadow-sm">
            <span className="size-2 rounded-full bg-blue-600" />
            {t("landingEyebrow")}
          </div>

          <h1 className="max-w-2xl text-4xl font-semibold leading-[1.08] text-slate-950 sm:text-5xl lg:text-[64px]">
            {t("landingTitleStart")} <span className="text-blue-700">{t("landingTitleHighlight")}</span>
          </h1>
          <p className="mt-6 max-w-xl text-base leading-7 text-slate-600 sm:text-lg sm:leading-8">
            {t("landingDescription")}
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/doctors"
              className="group inline-flex min-h-12 items-center justify-center gap-2 rounded-lg bg-blue-700 px-6 text-sm font-semibold text-white shadow-lg shadow-blue-900/15 transition-colors hover:bg-blue-800"
            >
              {t("findSpecialist")}
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
            </Link>
            <Link
              href="/book"
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-6 text-sm font-semibold text-slate-800 transition-colors hover:border-blue-200 hover:text-blue-700"
            >
              {t("bookConsult")}
            </Link>
          </div>

          <div className="mt-8 flex flex-wrap gap-x-6 gap-y-3 text-sm font-medium text-slate-600">
            <span className="inline-flex items-center gap-2"><ShieldCheck className="size-4 text-blue-700" />{t("encrypted")}</span>
            <span className="inline-flex items-center gap-2"><Video className="size-4 text-blue-700" />{t("hdVideo")}</span>
            <span className="inline-flex items-center gap-2"><CheckCircle2 className="size-4 text-blue-700" />{t("available")}</span>
          </div>
        </div>

        <div className="relative mx-auto h-[360px] w-full max-w-[680px] overflow-hidden rounded-[8px] bg-blue-100 sm:h-[440px] lg:h-[500px]">
          <Image
            src="/banner/banner2.png"
            alt="Patient speaking with a doctor during a video consultation"
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 55vw"
            className="object-cover object-left"
          />
          <div className="absolute bottom-5 left-5 flex items-center gap-3 rounded-lg border border-white/80 bg-white/95 px-4 py-3 shadow-lg backdrop-blur-sm sm:bottom-7 sm:left-7">
            <span className="flex size-10 items-center justify-center rounded-lg bg-blue-50 text-blue-700"><ShieldCheck className="size-5" /></span>
            <span>
              <span className="block text-sm font-semibold text-slate-900">{t("encrypted")}</span>
              <span className="mt-0.5 block text-xs text-slate-500">{t("available")}</span>
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}

