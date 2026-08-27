import { ArrowRight, Clock } from "lucide-react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import Image from "next/image";

import articles from "@/json/healthResources.json";

export default function HealthResources() {
  const t = useTranslations("healthResources");

  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto px-4 md:px-6 max-w-6xl">
        
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
          <div className="max-w-2xl">
            <h2 className="text-3xl md:text-4xl font-bold text-doctorly-text mb-4 tracking-tight">
              {t("title")}
            </h2>
            <p className="text-lg text-gray-600">
              {t("subtitle")}
            </p>
          </div>
          <Link href="/blog" className="flex items-center gap-2 text-doctorly-primary font-semibold hover:underline decoration-2 underline-offset-4 shrink-0">
            {t("explore")} <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
          
          {/* Featured Article */}
          <div className="lg:col-span-7 group cursor-pointer">
            <div className="relative rounded-[24px] overflow-hidden mb-6 h-[300px] sm:h-[400px]">
              <Image 
                src="/doctor/doctor6.png" 
                alt="Health Guide" 
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-doctorly-primary shadow-sm">
                {t("preventiveCare")}
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
                <Clock className="w-4 h-4" />
                <span>{t("readTime")}</span>
              </div>
              <h3 className="text-2xl font-bold text-doctorly-text mb-3 group-hover:text-doctorly-primary transition-colors">
                {t("articleTitle")}
              </h3>
              <p className="text-gray-600 line-clamp-2">
                {t("articleDesc")}
              </p>
            </div>
          </div>

          {/* Smaller Articles */}
          <div className="lg:col-span-5 flex flex-col gap-8">
            {articles.map((article, idx) => (
              <div key={idx} className="flex gap-4 sm:gap-6 group cursor-pointer">
                <div className="relative w-28 sm:w-36 h-28 sm:h-32 shrink-0 rounded-2xl overflow-hidden">
                  <Image 
                    src={article.image} 
                    alt={article.title} 
                    fill
                    sizes="144px"
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                </div>
                <div className="flex flex-col justify-center">
                  <span className="text-xs font-bold text-doctorly-primary mb-2 uppercase tracking-wider">{article.category}</span>
                  <h4 className="text-lg font-bold text-doctorly-text mb-2 leading-tight group-hover:text-doctorly-primary transition-colors line-clamp-2">
                    {article.title}
                  </h4>
                  <div className="flex items-center gap-1.5 text-xs text-gray-500 mt-auto">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{article.time}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}
