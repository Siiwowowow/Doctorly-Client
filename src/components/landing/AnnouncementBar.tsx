import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useTranslations } from "next-intl";

export default function AnnouncementBar() {
  const t = useTranslations("announcement");
  
  return (
    <div className="bg-doctorly-primary text-white text-xs sm:text-sm font-medium py-2 px-4 flex items-center justify-center gap-2">
      <span className="opacity-90">{t("message")}</span>
      <Link href="/consult" className="flex items-center gap-1 font-semibold hover:underline">
        {t("cta")} <ArrowRight className="w-3 h-3" />
      </Link>
    </div>
  );
}
