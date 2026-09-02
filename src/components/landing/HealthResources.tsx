"use client";

import React, { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight,
  Clock,
  Calendar,
  Eye,
  BookOpen,
  Sparkles,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import rawArticles from "@/json/healthResources.json";
import BlogDetailModal, { BlogArticle } from "./BlogDetailModal";

const articles = rawArticles as BlogArticle[];

export default function HealthResources() {
  const t = useTranslations("healthResources");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [activeArticle, setActiveArticle] = useState<BlogArticle | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const categories = useMemo(() => {
    const cats = Array.from(new Set(articles.map((a) => a.category)));
    return ["All", ...cats];
  }, []);

  const filteredArticles = useMemo(() => {
    if (selectedCategory === "All") return articles;
    return articles.filter((a) => a.category === selectedCategory);
  }, [selectedCategory]);

  const featuredArticle = useMemo(() => {
    return filteredArticles.find((a) => a.featured) || filteredArticles[0];
  }, [filteredArticles]);

  const secondaryArticles = useMemo(() => {
    return filteredArticles.filter((a) => a.id !== featuredArticle?.id).slice(0, 3);
  }, [filteredArticles, featuredArticle]);

  const handleOpenArticle = (article: BlogArticle) => {
    setActiveArticle(article);
    setIsModalOpen(true);
  };

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-white via-slate-50/50 to-white py-16 sm:py-20 lg:py-24">
      {/* Decorative backdrop glow */}
      <div className="pointer-events-none absolute -top-40 right-0 h-96 w-96 rounded-full bg-teal-100/40 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-40 left-0 h-96 w-96 rounded-full bg-emerald-100/30 blur-3xl" />

      <div className="relative mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-10 flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end lg:mb-12">
          <div className="max-w-2xl">
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-teal-200 bg-teal-50/80 px-3.5 py-1 text-xs font-bold text-teal-800 backdrop-blur-md">
              <Sparkles className="size-3.5 text-doctorly-primary" />
              <span>Medical Insights & Wellness</span>
            </div>

            <h2 className="text-2xl font-black tracking-tight text-slate-900 sm:text-3xl lg:text-4xl">
              {t("title")}
            </h2>
            <p className="mt-2 text-sm text-slate-600 sm:text-base leading-relaxed">
              {t("subtitle")}
            </p>
          </div>

          <Link
            href="/blog"
            className="group inline-flex items-center gap-2 text-sm font-bold text-doctorly-primary transition-colors hover:text-teal-700 shrink-0"
          >
            <span>{t("explore")}</span>
            <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </div>

        {/* Category Filter Pills */}
        <div className="mb-8 flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`rounded-full px-4 py-1.5 text-xs sm:text-sm font-semibold transition-all duration-200 shrink-0 ${
                selectedCategory === cat
                  ? "bg-doctorly-primary text-white shadow-md shadow-teal-900/10 scale-105"
                  : "bg-white text-slate-600 border border-slate-200/80 hover:bg-slate-50 hover:text-slate-900"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:gap-8">
          {/* Featured Article Card */}
          {featuredArticle && (
            <motion.div
              layout
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              onClick={() => handleOpenArticle(featuredArticle)}
              className="group relative cursor-pointer overflow-hidden rounded-3xl border border-slate-200/80 bg-white p-4 sm:p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-teal-200 hover:shadow-xl lg:col-span-7 flex flex-col justify-between"
            >
              <div>
                {/* Image Container */}
                <div className="relative mb-4 h-48 sm:h-56 lg:h-60 w-full overflow-hidden rounded-2xl bg-slate-900">
                  <Image
                    src={featuredArticle.image}
                    alt={featuredArticle.title}
                    fill
                    sizes="(max-width: 1024px) 100vw, 60vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent" />

                  {/* Top Badges */}
                  <div className="absolute top-3.5 left-3.5 right-3.5 flex items-center justify-between">
                    <span className="rounded-full bg-white/95 px-3 py-1 text-xs font-bold text-doctorly-primary shadow-sm backdrop-blur-md">
                      {featuredArticle.category}
                    </span>
                    <span className="flex items-center gap-1 rounded-full bg-black/40 px-2.5 py-1 text-xs font-medium text-white backdrop-blur-md">
                      <Clock className="size-3.5" />
                      {featuredArticle.time}
                    </span>
                  </div>

                  {/* Date & Views on image bottom */}
                  <div className="absolute bottom-3.5 left-3.5 flex items-center gap-3 text-xs text-white/90 font-medium">
                    <span className="flex items-center gap-1">
                      <Calendar className="size-3.5" />
                      {featuredArticle.date}
                    </span>
                    {featuredArticle.views && (
                      <span className="flex items-center gap-1">
                        <Eye className="size-3.5" />
                        {featuredArticle.views} views
                      </span>
                    )}
                  </div>
                </div>

                {/* Article Info */}
                <h3 className="mb-2 text-lg sm:text-xl lg:text-2xl font-bold text-slate-900 transition-colors group-hover:text-doctorly-primary leading-snug">
                  {featuredArticle.title}
                </h3>
                <p className="line-clamp-2 text-xs sm:text-sm text-slate-600 leading-relaxed mb-3">
                  {featuredArticle.subtitle}
                </p>
              </div>

              {/* Author & CTA Footer */}
              <div className="mt-3 flex items-center justify-between border-t border-slate-100 pt-3">
                <div className="flex items-center gap-2.5">
                  <div className="relative size-8 overflow-hidden rounded-full border border-teal-500/20">
                    <Image
                      src={featuredArticle.author.avatar}
                      alt={featuredArticle.author.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-900">
                      {featuredArticle.author.name}
                    </p>
                    <p className="text-[11px] text-slate-500">
                      {featuredArticle.author.role}
                    </p>
                  </div>
                </div>

                <span className="inline-flex items-center gap-1 text-xs font-bold text-doctorly-primary group-hover:underline">
                  <span>Read Article</span>
                  <ChevronRight className="size-4" />
                </span>
              </div>
            </motion.div>
          )}

          {/* Secondary Articles List */}
          <div className="flex flex-col justify-between gap-3.5 lg:col-span-5">
            {secondaryArticles.map((article, idx) => (
              <motion.div
                key={article.id || idx}
                layout
                initial={{ opacity: 0, x: 15 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.35, delay: idx * 0.08 }}
                onClick={() => handleOpenArticle(article)}
                className="group cursor-pointer rounded-2xl border border-slate-200/80 bg-white p-3 sm:p-3.5 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-teal-200 hover:shadow-md flex gap-3 sm:gap-4 items-center"
              >
                {/* Thumbnail Image */}
                <div className="relative h-20 w-20 sm:h-24 sm:w-24 shrink-0 overflow-hidden rounded-xl bg-slate-100">
                  <Image
                    src={article.image}
                    alt={article.title}
                    fill
                    sizes="(max-width: 640px) 96px, 112px"
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute top-2 left-2 rounded-md bg-black/60 px-1.5 py-0.5 text-[10px] font-bold text-white backdrop-blur-sm">
                    {article.category}
                  </div>
                </div>

                {/* Content */}
                <div className="flex flex-col justify-center min-w-0 flex-1">
                  <div className="mb-1 flex items-center gap-2 text-[11px] text-slate-500">
                    <span className="flex items-center gap-1">
                      <Clock className="size-3" />
                      {article.time}
                    </span>
                    <span>•</span>
                    <span>{article.date}</span>
                  </div>

                  <h4 className="line-clamp-2 text-sm font-bold text-slate-900 transition-colors group-hover:text-doctorly-primary sm:text-base leading-snug">
                    {article.title}
                  </h4>

                  <div className="mt-2 flex items-center gap-2">
                    <div className="relative size-5 overflow-hidden rounded-full">
                      <Image
                        src={article.author.avatar}
                        alt={article.author.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <span className="truncate text-xs font-medium text-slate-600">
                      {article.author.name}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}

            {/* Quick Consultation Banner Card */}
            <div className="rounded-2xl border border-teal-100 bg-gradient-to-br from-teal-50 via-emerald-50/60 to-white p-4 sm:p-5 shadow-sm flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-doctorly-primary text-white shadow-md">
                  <BookOpen className="size-5" />
                </div>
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-slate-900">
                    Explore our Health Library
                  </h4>
                  <p className="text-[11px] sm:text-xs text-slate-500">
                    Over 120+ verified doctor guides & wellness tips.
                  </p>
                </div>
              </div>
              <Button
                asChild
                size="sm"
                className="shrink-0 rounded-xl bg-doctorly-primary hover:bg-doctorly-primary/90 text-white font-bold text-xs"
              >
                <Link href="/blog">Browse All</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Detail Reader Modal */}
      <BlogDetailModal
        article={activeArticle}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setActiveArticle(null);
        }}
      />
    </section>
  );
}
