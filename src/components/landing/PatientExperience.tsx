import { useTranslations } from "next-intl";
import Image from "next/image";

import experiencesData from "@/json/patientExperiences.json";

export default function PatientExperience() {
  const t = useTranslations("patientExperience");
  const experiences = experiencesData.map((exp) => ({
    ...exp,
    title: t(exp.titleKey)
  }));

  return (
    <section className="py-24 bg-doctorly-bg overflow-hidden">
      <div className="container mx-auto px-4 md:px-6">
        
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-doctorly-text mb-4 tracking-tight">
            {t("title")}
          </h2>
          <p className="text-lg text-gray-600">
            {t("subtitle")}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 auto-rows-[250px] gap-4 md:gap-6 max-w-6xl mx-auto">
          {experiences.map((exp, idx) => (
            <div 
              key={idx} 
              className={`relative rounded-3xl overflow-hidden group ${exp.className}`}
            >
              {/* Image */}
              <div className="relative w-full h-full">
                <Image
                  src={exp.image}
                  alt={exp.alt}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover transition-transform duration-700 hover:scale-105"
                />
              </div>
              {/* Dark overlay gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent"></div>
              
              {/* UI Overlay Text Box */}
              <div className="absolute bottom-6 left-6 bg-white/95 backdrop-blur-md px-4 py-2.5 rounded-xl shadow-lg border border-white/20 transform transition-transform duration-300 group-hover:-translate-y-2">
                <span className="font-semibold text-doctorly-text">{exp.title}</span>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
