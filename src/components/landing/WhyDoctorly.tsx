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
    <section className="border-y border-gray-100 bg-white py-16 md:py-20">
      <div className="container mx-auto px-4 md:px-6">
        
        <div className="mx-auto mb-10 max-w-2xl text-center md:mb-12">
          <h2 className="mb-3 text-3xl font-semibold text-doctorly-text md:text-4xl">
            {t("title")}
          </h2>
          <p className="text-base leading-7 text-gray-600 md:text-lg">
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
