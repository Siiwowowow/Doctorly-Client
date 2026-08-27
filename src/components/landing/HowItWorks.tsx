import { Search, CalendarDays, Video, Activity } from "lucide-react";
import { useTranslations } from "next-intl";

export default function HowItWorks() {
  const t = useTranslations("howItWorks");

  const steps = [
    {
      icon: Search,
      title: t("step1Title"),
      desc: t("step1Desc"),
      color: "text-blue-500",
      bg: "bg-blue-50"
    },
    {
      icon: CalendarDays,
      title: t("step2Title"),
      desc: t("step2Desc"),
      color: "text-purple-500",
      bg: "bg-purple-50"
    },
    {
      icon: Video,
      title: t("step3Title"),
      desc: t("step3Desc"),
      color: "text-doctorly-primary",
      bg: "bg-doctorly-secondary/50"
    },
    {
      icon: Activity,
      title: t("step4Title"),
      desc: t("step4Desc"),
      color: "text-emerald-500",
      bg: "bg-emerald-50"
    }
  ];

  return (
    <section className="py-24 bg-gray-50 border-y border-gray-100 overflow-hidden">
      <div className="container mx-auto px-4 md:px-6 relative">
        
        <div className="text-center max-w-2xl mx-auto mb-20">
          <h2 className="text-3xl md:text-4xl font-bold text-doctorly-text mb-4 tracking-tight">
            {t("title")}
          </h2>
          <p className="text-lg text-gray-600">
            {t("subtitle")}
          </p>
        </div>

        <div className="relative max-w-5xl mx-auto">
          {/* Visual connecting path (Desktop) */}
          <div className="hidden md:block absolute top-12 left-[10%] right-[10%] h-0.5 bg-gray-200 z-0">
            <div className="absolute top-0 left-0 h-full bg-doctorly-primary/30 w-full rounded-full overflow-hidden">
              <div className="w-full h-full bg-doctorly-primary animate-[shimmer_3s_infinite] origin-left"></div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-6 relative z-10">
            {steps.map((step, idx) => {
              const Icon = step.icon;
              return (
                <div key={idx} className="flex flex-col items-center text-center group">
                  <div className="relative mb-6">
                    {/* Circle */}
                    <div className={`w-24 h-24 rounded-full ${step.bg} border-4 border-white shadow-xl flex items-center justify-center transition-transform duration-300 group-hover:scale-110 group-hover:shadow-2xl`}>
                      <Icon className={`w-10 h-10 ${step.color}`} strokeWidth={1.5} />
                    </div>
                    {/* Step Number Badge */}
                    <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-doctorly-text text-white text-sm font-bold flex items-center justify-center border-2 border-white shadow-md">
                      0{idx + 1}
                    </div>
                  </div>
                  
                  <h3 className="text-lg font-bold text-doctorly-text mb-2">{step.title}</h3>
                  <p className="text-sm text-gray-600 leading-relaxed px-2">
                    {step.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </section>
  );
}
