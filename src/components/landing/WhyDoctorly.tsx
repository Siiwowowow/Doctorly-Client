import { ShieldCheck, CalendarCheck, Video, Lock, FileText, Stethoscope } from "lucide-react";
import { useTranslations } from "next-intl";

export default function WhyDoctorly() {
  const t = useTranslations("whyDoctorly");
  const features = [
    {
      icon: ShieldCheck,
      title: t("feat1Title"),
      desc: t("feat1Desc"),
    },
    {
      icon: CalendarCheck,
      title: t("feat2Title"),
      desc: t("feat2Desc"),
    },
    {
      icon: Video,
      title: t("feat3Title"),
      desc: t("feat3Desc"),
    },
    {
      icon: Lock,
      title: t("feat4Title"),
      desc: t("feat4Desc"),
    },
    {
      icon: FileText,
      title: t("feat5Title"),
      desc: t("feat5Desc"),
    },
    {
      icon: Stethoscope,
      title: t("feat6Title"),
      desc: t("feat6Desc"),
    }
  ];

  return (
    <section className="py-24 bg-white border-y border-gray-100">
      <div className="container mx-auto px-4 md:px-6">
        
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-doctorly-text mb-4 tracking-tight">
            {t("title")}
          </h2>
          <p className="text-lg text-gray-600">
            {t("subtitle")}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12 max-w-6xl mx-auto">
          {features.map((feature, idx) => {
            const Icon = feature.icon;
            return (
              <div key={idx} className="flex gap-4">
                <div className="shrink-0 mt-1">
                  <div className="w-12 h-12 rounded-xl bg-doctorly-secondary/50 flex items-center justify-center text-doctorly-primary">
                    <Icon className="w-6 h-6" strokeWidth={1.5} />
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-doctorly-text mb-2">{feature.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{feature.desc}</p>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
