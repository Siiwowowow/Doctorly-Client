import { HeartPulse, Brain, Baby, Stethoscope, Eye, Bone, Ear, Salad, Activity, Dna, Syringe, Pill } from "lucide-react";
import { useTranslations } from "next-intl";

const getSpecialties = (t: any) => [
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
    <section className="py-24 bg-white relative overflow-hidden">
      {/* Decorative background element */}
      <div className="absolute -top-[200px] -right-[200px] w-[500px] h-[500px] rounded-full bg-doctorly-secondary/30 blur-3xl opacity-50 pointer-events-none"></div>

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
          <div className="max-w-2xl">
            <h2 className="text-3xl md:text-4xl font-bold text-doctorly-text mb-4 tracking-tight">
              {t("title")}
            </h2>
            <p className="text-lg text-gray-600">
              {t("subtitle")}
            </p>
          </div>
          <button className="text-doctorly-primary font-semibold hover:underline decoration-2 underline-offset-4 shrink-0">
            {t("viewAll")}
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4 md:gap-6">
          {specialtiesList.map((spec, i) => {
            const Icon = spec.icon;
            return (
              <div 
                key={i} 
                className="group cursor-pointer bg-white border border-gray-100 p-6 rounded-2xl flex flex-col items-center justify-center text-center hover:border-doctorly-secondary hover:shadow-[0_15px_30px_-10px_rgba(10,107,119,0.1)] hover:-translate-y-1 transition-all duration-300"
              >
                <div className={`w-14 h-14 rounded-full ${spec.bg} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
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
