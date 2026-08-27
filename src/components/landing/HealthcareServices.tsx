import { Video, Calendar, FileText, Activity, MessageSquare, Clock, HeartPulse, ShieldCheck } from "lucide-react";
import { useTranslations } from "next-intl";

export default function HealthcareServices() {
  const t = useTranslations("services");
  const services = [
    {
      icon: Video,
      title: t("srv1Title"),
      desc: t("srv1Desc"),
      color: "bg-blue-50 text-blue-600",
    },
    {
      icon: MessageSquare,
      title: t("srv2Title"),
      desc: t("srv2Desc"),
      color: "bg-green-50 text-green-600",
    },
    {
      icon: Calendar,
      title: t("srv3Title"),
      desc: t("srv3Desc"),
      color: "bg-purple-50 text-purple-600",
    },
    {
      icon: FileText,
      title: t("srv4Title"),
      desc: t("srv4Desc"),
      color: "bg-orange-50 text-orange-600",
    },
    {
      icon: Activity,
      title: t("srv5Title"),
      desc: t("srv5Desc"),
      color: "bg-teal-50 text-teal-600",
    },
    {
      icon: Clock,
      title: t("srv6Title"),
      desc: t("srv6Desc"),
      color: "bg-indigo-50 text-indigo-600",
    },
    {
      icon: HeartPulse,
      title: t("srv7Title"),
      desc: t("srv7Desc"),
      color: "bg-rose-50 text-rose-600",
    },
    {
      icon: ShieldCheck,
      title: t("srv8Title"),
      desc: t("srv8Desc"),
      color: "bg-cyan-50 text-cyan-600",
    }
  ];

  return (
    <section className="py-24 bg-gray-50 border-y border-gray-100">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-doctorly-text mb-4 tracking-tight">
            {t("title")}
          </h2>
          <p className="text-lg text-gray-600">
            {t("subtitle")}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 max-w-6xl mx-auto">
          {services.map((service, idx) => {
            const Icon = service.icon;
            return (
              <div 
                key={idx} 
                className="bg-white p-6 rounded-2xl border border-gray-100 hover:border-doctorly-secondary hover:shadow-lg transition-all duration-300 group"
              >
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-5 transition-transform duration-300 group-hover:scale-110 ${service.color}`}>
                  <Icon className="w-6 h-6" strokeWidth={1.5} />
                </div>
                <h3 className="font-bold text-doctorly-text mb-2">{service.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{service.desc}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
