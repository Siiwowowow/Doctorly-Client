"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Plus } from "lucide-react";
import { useTranslations } from "next-intl";

import rawArticles from "@/json/healthResources.json";
import BlogDetailModal, { BlogArticle } from "./BlogDetailModal";

const allArticles = rawArticles as BlogArticle[];
const featuredArticles = [allArticles[3], allArticles[2], allArticles[0]];

export default function HealthResources() {
  const t = useTranslations("healthResources");
  const [activeArticle, setActiveArticle] = useState<BlogArticle | null>(null);

  return (
    <section className="font-sans w-full bg-white py-10 text-[#071a3d] sm:py-12 lg:py-16">
      <div className="mx-auto w-full max-w-[1200px] px-4 sm:px-6 lg:px-8">
        <div className="mb-7 flex items-end justify-between gap-5 sm:mb-9">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-[#e3f5ff] px-3 py-1.5 text-[11px] font-extrabold tracking-[0.06em] text-[#1597ff] uppercase sm:text-xs">
              <Plus className="size-3.5 stroke-[3]" aria-hidden="true" />
              {t("eyebrow")}
            </div>
            <h2 className="mt-3 text-[32px] leading-none font-extrabold tracking-[-0.025em] sm:text-[40px] lg:text-[48px]">
              <span className="text-[#09143b]">{t("sectionTitleStart")}</span>{" "}
              <span className="text-[#1597ff]">{t("sectionTitleHighlight")}</span>
            </h2>
            <p className="mt-3 max-w-2xl text-sm leading-6 font-medium text-[#1c2b45] sm:text-base">{t("subtitle")}</p>
          </div>

          <Link href="/blog" className="group hidden items-center gap-2 text-sm font-extrabold text-[#1597ff] sm:inline-flex">
            {t("viewAll")}
            <span className="flex size-8 items-center justify-center rounded-full bg-[#e2f3ff] transition group-hover:bg-[#1268e8] group-hover:text-white">
              <ArrowRight className="size-4" />
            </span>
          </Link>
        </div>

        <div className="grid gap-5 md:grid-cols-3">
          {featuredArticles.map((article, index) => {
            const image = index === 2 ? "/doctorly-assest/banner2.png" : article.image;

            return (
              <button
                key={article.id}
                type="button"
                aria-label={article.title}
                onClick={() => setActiveArticle(article)}
                className="group overflow-hidden rounded-[22px] bg-white text-left shadow-[0_12px_35px_-22px_rgba(8,42,99,0.45)] ring-1 ring-[#dcebf5] transition duration-300 hover:-translate-y-1 hover:shadow-[0_20px_42px_-22px_rgba(18,104,232,0.32)]"
              >
                <div className="relative h-52 overflow-hidden bg-[#eaf7ff] sm:h-56 md:h-44 lg:h-52">
                  <Image
                    src={image}
                    alt={article.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className={`${index === 2 ? "object-contain object-bottom" : "object-cover"} transition-transform duration-500 group-hover:scale-105`}
                  />
                </div>
                <div className="p-5">
                  <span className="inline-flex rounded-full bg-[#1597ff] px-3 py-1 text-[11px] font-bold text-white">{article.category}</span>
                  <h3 className="mt-3 line-clamp-2 min-h-12 text-lg leading-6 font-extrabold text-[#071a3d] transition-colors group-hover:text-[#1597ff]">
                    {article.title}
                  </h3>
                  <div className="mt-5 flex items-center justify-between text-xs font-semibold text-[#1c2b45]">
                    <span>{article.date}</span>
                    <span className="flex size-8 items-center justify-center rounded-full bg-[#e3f5ff] text-[#1597ff]">
                      <ArrowRight className="size-4" />
                    </span>
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        <Link href="/blog" className="mt-6 inline-flex items-center gap-2 text-sm font-extrabold text-[#1597ff] sm:hidden">
          {t("viewAll")}
          <ArrowRight className="size-4" />
        </Link>
      </div>

      <BlogDetailModal article={activeArticle} isOpen={Boolean(activeArticle)} onClose={() => setActiveArticle(null)} />
    </section>
  );
}
