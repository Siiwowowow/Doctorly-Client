import { HeartPulse, Brain, Baby, Stethoscope, Eye, Bone, Ear, Salad, Activity, Dna, Syringe, Pill } from "lucide-react";
import { useTranslations } from "next-intl";

const getSpecialties = (t: (key: string) => string) => [
  { name: t("generalMedicine"), icon: Stethoscope, color: "text-blue-500", bg: "bg-blue-50" },
  { name: t("cardiology"), icon: HeartPulse, color: "text-red-500", bg: "bg-red-50" },
  { name: t("pediatrics"), icon: Baby, color: "text-orange-500", bg: "bg-orange-50" },
  { name: t("neurology"), icon: Brain, color: "text-purple-500", bg: "bg-purple-50" },
  { name: t("orthopedics"), icon: Bone, color: "text-emerald-500", bg: "bg-emerald-50" },
  { name: t("ophthalmology"), icon: Eye, color: "text-cyan-500", bg: "bg-cyan-50" },
  { name: t("ent"), icon: Ear, color: "text-amber-500", bg: "bg-amber-50" },
  { name: t("nutrition"), icon: Salad, color: "text-lime-500", bg: "bg-lime-50" },
  { name: t("psychiatry"), icon: Activity, color: "text-indigo-500", bg: "bg-indigo-50" },
  { name: t("genetics"), icon: Dna, color: "text-rose-500", bg: "bg-rose-50" },
  { name: t("vaccination"), icon: Syringe, color: "text-sky-500", bg: "bg-sky-50" },
  { name: t("pharmacy"), icon: Pill, color: "text-fuchsia-500", bg: "bg-fuchsia-50" },
];

export default function Specialties() {
  const t = useTranslations("specialties");
  const specialtiesList = getSpecialties(t);
  
  return (
    <section className="relative overflow-hidden bg-white py-16 md:py-20">
      {/* Decorative background element */}
      <div className="absolute -top-[200px] -right-[200px] w-[500px] h-[500px] rounded-full bg-doctorly-secondary/30 blur-3xl opacity-50 pointer-events-none"></div>

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        
        <div className="mb-10 flex flex-col items-start justify-between gap-5 md:mb-12 md:flex-row md:items-end">
          <div className="max-w-2xl">
            <h2 className="mb-3 text-3xl font-semibold text-doctorly-text md:text-4xl">
              {t("title")}
            </h2>
            <p className="text-base leading-7 text-gray-600 md:text-lg">
              {t("subtitle")}
            </p>
          </div>
          <button className="text-doctorly-primary font-semibold hover:underline decoration-2 underline-offset-4 shrink-0">
            {t("viewAll")}
          </button>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:gap-4 lg:grid-cols-4 xl:grid-cols-6">
          {specialtiesList.map((spec, i) => {
            const Icon = spec.icon;
            return (
              <div 
                key={i} 
                className="group flex cursor-pointer flex-col items-center justify-center rounded-lg border border-gray-200/80 bg-white p-4 text-center transition-all duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-[0_16px_36px_-22px_rgba(37,99,235,0.35)] sm:p-5"
              >
                <div className={`mb-4 flex size-12 items-center justify-center rounded-lg ${spec.bg} transition-transform duration-300 group-hover:scale-105`}>
                  <Icon className={`w-6 h-6 ${spec.color}`} strokeWidth={1.5} />
                </div>
                <h3 className="font-semibold text-gray-800 text-sm">{spec.name}</h3>
                
                {/* Subtle arrow indicator on hover */}
                <div className="mt-3 opacity-0 transform translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
                  <span className="text-doctorly-primary text-xs font-bold">&rarr;</span>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
