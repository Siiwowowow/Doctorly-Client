import { Shield, Lock, FileKey } from "lucide-react";
import { useTranslations } from "next-intl";

export default function SecurityPrivacy() {
  const t = useTranslations("securityPrivacy");
  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto px-4 md:px-6">
        <div className="max-w-4xl mx-auto text-center">
          
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-doctorly-secondary/30 text-doctorly-primary mb-8 relative">
            <div className="absolute inset-0 border border-doctorly-primary/20 rounded-full animate-ping"></div>
            <Shield className="w-10 h-10" strokeWidth={1.5} />
          </div>
          
          <h2 className="text-3xl md:text-4xl font-bold text-doctorly-text mb-6 tracking-tight">
            {t("title")}
          </h2>
          <p className="text-lg text-gray-600 mb-12 max-w-2xl mx-auto">
            {t("subtitle")}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
            <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100">
              <Lock className="w-8 h-8 text-doctorly-primary mb-4" />
              <h3 className="font-bold text-gray-900 mb-2">{t("feat1Title")}</h3>
              <p className="text-sm text-gray-600">{t("feat1Desc")}</p>
            </div>
            <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100">
              <FileKey className="w-8 h-8 text-doctorly-primary mb-4" />
              <h3 className="font-bold text-gray-900 mb-2">{t("feat2Title")}</h3>
              <p className="text-sm text-gray-600">{t("feat2Desc")}</p>
            </div>
            <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100">
              <Shield className="w-8 h-8 text-doctorly-primary mb-4" />
              <h3 className="font-bold text-gray-900 mb-2">{t("feat3Title")}</h3>
              <p className="text-sm text-gray-600">{t("feat3Desc")}</p>
            </div>
          </div>
          
        </div>
      </div>
    </section>
  );
}
