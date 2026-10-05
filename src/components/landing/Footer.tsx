import Link from "next/link";
import { Activity, Clock3, Mail, MapPin, Phone, Stethoscope } from "lucide-react";
import { IconBrandFacebook, IconBrandInstagram, IconBrandLinkedin, IconBrandTwitter, IconBrandYoutube } from "@tabler/icons-react";
import { useTranslations } from "next-intl";

const socialIcons = [IconBrandFacebook, IconBrandInstagram, IconBrandTwitter, IconBrandLinkedin, IconBrandYoutube];

export default function Footer() {
  const t = useTranslations("footer");

  return (
    <footer className="font-sans bg-[#061a3a] text-[#b8c7dd]">
      <div className="mx-auto w-full max-w-[1200px] px-6 py-12 sm:px-8 lg:px-12 lg:py-14">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-[1.35fr_0.75fr_0.9fr_1fr] lg:gap-12">
          <div>
            <Link href="/" className="inline-flex items-center gap-3 text-2xl font-extrabold text-white">
              <span className="flex size-11 items-center justify-center rounded-xl bg-[#1268e8]">
                <Activity className="size-7" />
              </span>
              Doctorly
            </Link>
            <p className="mt-5 max-w-xs text-sm leading-6">{t("desc")}</p>
            <div className="mt-6 flex gap-2.5">
              {socialIcons.map((Icon, index) => (
                <a key={index} href="#" aria-label={`Social link ${index + 1}`} className="flex size-9 items-center justify-center rounded-full bg-white/8 text-white transition hover:bg-[#1268e8]">
                  <Icon className="size-4.5" />
                </a>
              ))}
            </div>

            {/* Dedicated Join as a Doctor CTA */}
            <div className="mt-6">
              <Link
                href="/join-as-doctor"
                className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#1268e8] to-[#2563eb] px-4 py-2.5 text-xs font-bold text-white shadow-md shadow-[#1268e8]/25 transition hover:brightness-110 hover:-translate-y-0.5"
              >
                <Stethoscope className="size-4" />
                <span>{t("becomeDoctor")}</span>
              </Link>
            </div>
          </div>

          <FooterColumn title={t("quickLinks")} links={[
            [t("home"), "/"],
            [t("services"), "/services"],
            [t("specialties"), "/specialties"],
            [t("findDoctors"), "/doctors"],
            [t("about"), "/about"],
            [t("becomeDoctor"), "/join-as-doctor"],
          ]} />

          <FooterColumn title={t("ourServices")} links={[
            [t("videoConsult"), "/doctors"],
            [t("labTests"), "/services"],
            [t("medicineDelivery"), "/services"],
            [t("medicalRecords"), "/records"],
            [t("insuranceSupport"), "/services"],
          ]} />

          <div>
            <h3 className="text-sm font-extrabold text-white">{t("contactUs")}</h3>
            <ul className="mt-5 space-y-4 text-sm">
              <li className="flex items-start gap-3"><Phone className="mt-0.5 size-4 shrink-0 text-[#48a4ff]" /><span>+880 123 4567</span></li>
              <li className="flex items-start gap-3"><Mail className="mt-0.5 size-4 shrink-0 text-[#48a4ff]" /><span>support@doctorly.com</span></li>
              <li className="flex items-start gap-3"><MapPin className="mt-0.5 size-4 shrink-0 text-[#48a4ff]" /><span>Dhaka, Bangladesh</span></li>
              <li className="flex items-start gap-3"><Clock3 className="mt-0.5 size-4 shrink-0 text-[#48a4ff]" /><span>{t("hours")}</span></li>
            </ul>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-4 border-t border-white/10 pt-6 text-xs text-[#7f91ab] sm:flex-row sm:items-center sm:justify-between">
          <p>{t("rights")}</p>
          <div className="flex flex-wrap gap-5">
            <Link href="/privacy" className="hover:text-white">{t("privacy")}</Link>
            <Link href="/terms" className="hover:text-white">{t("terms")}</Link>
            <Link href="/security" className="hover:text-white">{t("security")}</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({ title, links }: { title: string; links: string[][] }) {
  return (
    <div>
      <h3 className="text-sm font-extrabold text-white">{title}</h3>
      <ul className="mt-5 space-y-3 text-sm">
        {links.map(([label, href]) => {
          const isDoctor = href === "/join-as-doctor";
          return (
            <li key={`${label}-${href}`}>
              <Link
                href={href}
                className={
                  isDoctor
                    ? "inline-flex items-center gap-1.5 font-semibold text-[#48a4ff] hover:text-white transition-colors"
                    : "transition hover:text-white"
                }
              >
                <span>{label}</span>
                {isDoctor && (
                  <span className="rounded-full bg-[#1268e8]/30 border border-[#48a4ff]/50 px-1.5 py-0.5 text-[9px] font-bold text-[#48a4ff] uppercase tracking-wider">
                    Join
                  </span>
                )}
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
