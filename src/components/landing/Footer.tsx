import Link from "next/link";
import { Activity } from "lucide-react";
import { IconBrandFacebook, IconBrandTwitter, IconBrandInstagram, IconBrandLinkedin } from "@tabler/icons-react";
import { useTranslations } from "next-intl";

export default function Footer() {
  const t = useTranslations("footer");
  return (
    <footer className="bg-[#0f172a] text-gray-300 pt-20 pb-10">
      <div className="container mx-auto px-4 md:px-6">
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 mb-16">
          
          {/* Brand Column */}
          <div className="lg:col-span-2 pr-0 lg:pr-10">
            <Link href="/" className="flex items-center gap-2.5 font-bold text-2xl tracking-tight text-white mb-6">
              <div className="flex size-10 items-center justify-center rounded-xl bg-doctorly-primary text-white">
                <Activity className="size-6" />
              </div>
              <span>Doctorly</span>
            </Link>
            <p className="text-gray-400 mb-8 leading-relaxed max-w-sm">
              {t("desc")}
            </p>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-doctorly-primary hover:text-white transition-colors">
                <IconBrandFacebook className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-doctorly-primary hover:text-white transition-colors">
                <IconBrandTwitter className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-doctorly-primary hover:text-white transition-colors">
                <IconBrandInstagram className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-doctorly-primary hover:text-white transition-colors">
                <IconBrandLinkedin className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Links Columns */}
          <div>
            <h4 className="text-white font-bold mb-6 tracking-wider text-sm uppercase">{t("platform")}</h4>
            <ul className="space-y-4">
              <li><Link href="/doctors" className="hover:text-doctorly-secondary transition-colors">{t("findDoctors")}</Link></li>
              <li><Link href="/book" className="hover:text-doctorly-secondary transition-colors">{t("bookAppt")}</Link></li>
              <li><Link href="/video-consult" className="hover:text-doctorly-secondary transition-colors">{t("videoConsult")}</Link></li>
              <li><Link href="/chat" className="hover:text-doctorly-secondary transition-colors">{t("chatConsult")}</Link></li>
              <li><Link href="/records" className="hover:text-doctorly-secondary transition-colors">{t("medicalRecords")}</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold mb-6 tracking-wider text-sm uppercase">{t("specialties")}</h4>
            <ul className="space-y-4">
              <li><Link href="/specialties/general" className="hover:text-doctorly-secondary transition-colors">{t("genMed")}</Link></li>
              <li><Link href="/specialties/cardiology" className="hover:text-doctorly-secondary transition-colors">{t("cardiology")}</Link></li>
              <li><Link href="/specialties/dermatology" className="hover:text-doctorly-secondary transition-colors">{t("dermatology")}</Link></li>
              <li><Link href="/specialties/pediatrics" className="hover:text-doctorly-secondary transition-colors">{t("pediatrics")}</Link></li>
              <li><Link href="/specialties/gynecology" className="hover:text-doctorly-secondary transition-colors">{t("gynecology")}</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold mb-6 tracking-wider text-sm uppercase">{t("company")}</h4>
            <ul className="space-y-4">
              <li><Link href="/about" className="hover:text-doctorly-secondary transition-colors">{t("about")}</Link></li>
              <li><Link href="/careers" className="hover:text-doctorly-secondary transition-colors">{t("careers")}</Link></li>
              <li><Link href="/contact" className="hover:text-doctorly-secondary transition-colors">{t("contact")}</Link></li>
              <li><Link href="/join-as-doctor" className="text-doctorly-accent hover:text-doctorly-accent/80 font-medium transition-colors">{t("becomeDoctor")}</Link></li>
            </ul>
          </div>

        </div>

        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-500">
          <p>{t("rights")}</p>
          <div className="flex gap-6">
            <Link href="/privacy" className="hover:text-white transition-colors">{t("privacy")}</Link>
            <Link href="/terms" className="hover:text-white transition-colors">{t("terms")}</Link>
            <Link href="/security" className="hover:text-white transition-colors">{t("security")}</Link>
          </div>
        </div>

      </div>
    </footer>
  );
}
