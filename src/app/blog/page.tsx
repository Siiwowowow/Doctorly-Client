"use client";

import React, { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Search,
  Clock,
  Calendar,
  Eye,
  ArrowLeft,
  Sparkles,
  BookOpen,
  ChevronRight,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import rawArticles from "@/json/healthResources.json";
import BlogDetailModal, { BlogArticle } from "@/components/landing/BlogDetailModal";

const articles = rawArticles as BlogArticle[];

export default function BlogPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [activeArticle, setActiveArticle] = useState<BlogArticle | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const categories = useMemo(() => {
    const cats = Array.from(new Set(articles.map((a) => a.category)));
    return ["All", ...cats];
  }, []);

  const filteredArticles = useMemo(() => {
    return articles.filter((article) => {
      const matchesCategory =
        selectedCategory === "All" || article.category === selectedCategory;
      const matchesSearch =
        article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (article.subtitle &&
          article.subtitle.toLowerCase().includes(searchQuery.toLowerCase())) ||
        article.category.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [searchQuery, selectedCategory]);

  const handleOpenArticle = (article: BlogArticle) => {
    setActiveArticle(article);
    setIsModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-slate-50/50 pb-20">
      {/* Header Banner */}
      <div className="relative overflow-hidden bg-gradient-to-b from-teal-900 via-doctorly-primary to-teal-950 py-16 sm:py-20 text-white">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-white/10 via-transparent to-transparent pointer-events-none" />

        <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <Link
            href="/"
            className="mb-6 inline-flex items-center gap-2 text-xs font-semibold text-teal-200 hover:text-white transition-colors"
          >
            <ArrowLeft className="size-4" />
            <span>Back to Home</span>
          </Link>

          <div className="max-w-3xl">
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-teal-400/30 bg-white/10 px-3.5 py-1 text-xs font-bold text-teal-100 backdrop-blur-md">
              <Sparkles className="size-3.5 text-teal-300" />
              <span>Doctorly Health & Clinical Library</span>
            </div>

            <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl md:text-5xl text-white">
              Medically-Reviewed Articles & Guides
            </h1>
            <p className="mt-3 text-sm sm:text-base text-teal-100/90 leading-relaxed">
              Explore evidence-based health insights, nutrition guides, and wellness tips reviewed by certified medical specialists.
            </p>
          </div>

          {/* Search Bar */}
          <div className="mt-8 max-w-xl">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-slate-400" />
              <Input
                type="text"
                placeholder="Search health topics, nutrition, heart health..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-12 w-full rounded-2xl bg-white pl-12 pr-4 text-slate-900 shadow-xl placeholder:text-slate-400 focus-visible:ring-teal-400 text-sm"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 mt-10">
        {/* Category Pills */}
        <div className="mb-8 flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`rounded-full px-4 py-2 text-xs sm:text-sm font-semibold transition-all duration-200 shrink-0 ${
                selectedCategory === cat
                  ? "bg-doctorly-primary text-white shadow-md shadow-teal-900/15"
                  : "bg-white text-slate-600 border border-slate-200/80 hover:bg-slate-50 hover:text-slate-900"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Articles Grid */}
        {filteredArticles.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {filteredArticles.map((article, idx) => (
              <motion.div
                key={article.id || idx}
                layout
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: idx * 0.05 }}
                onClick={() => handleOpenArticle(article)}
                className="group cursor-pointer overflow-hidden rounded-3xl border border-slate-200/80 bg-white p-4 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-teal-200 hover:shadow-xl flex flex-col justify-between"
              >
                <div>
                  {/* Image Header */}
                  <div className="relative mb-4 h-48 sm:h-52 w-full overflow-hidden rounded-2xl bg-slate-900">
                    <Image
                      src={article.image}
                      alt={article.title}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent" />

                    <div className="absolute top-3 left-3">
                      <span className="rounded-full bg-white/95 px-2.5 py-1 text-[11px] font-bold text-doctorly-primary shadow-sm backdrop-blur-md">
                        {article.category}
                      </span>
                    </div>

                    <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs text-white/90 font-medium">
                      <span className="flex items-center gap-1">
                        <Calendar className="size-3.5" />
                        {article.date}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="size-3.5" />
                        {article.time}
                      </span>
                    </div>
                  </div>

                  {/* Title & Subtitle */}
                  <h3 className="line-clamp-2 mb-2 text-base sm:text-lg font-bold text-slate-900 transition-colors group-hover:text-doctorly-primary leading-snug">
                    {article.title}
                  </h3>
                  {article.subtitle && (
                    <p className="line-clamp-2 text-xs sm:text-sm text-slate-500 leading-relaxed">
                      {article.subtitle}
                    </p>
                  )}
                </div>

                {/* Author Footer */}
                <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-3">
                  <div className="flex items-center gap-2">
                    <div className="relative size-7 overflow-hidden rounded-full border border-teal-500/20">
                      <Image
                        src={article.author.avatar}
                        alt={article.author.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <span className="text-xs font-semibold text-slate-700">
                      {article.author.name}
                    </span>
                  </div>

                  <span className="inline-flex items-center gap-1 text-xs font-bold text-doctorly-primary group-hover:underline">
                    <span>Read</span>
                    <ChevronRight className="size-3.5" />
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="rounded-3xl border border-dashed border-slate-200 bg-white p-12 text-center">
            <BookOpen className="mx-auto size-12 text-slate-400 mb-3" />
            <h3 className="text-lg font-bold text-slate-800">
              No articles found
            </h3>
            <p className="text-sm text-slate-500 mt-1">
              Try searching with different keywords or switch the category filter.
            </p>
          </div>
        )}
      </div>

      {/* Reader Modal */}
      <BlogDetailModal
        article={activeArticle}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setActiveArticle(null);
        }}
      />
    </div>
  );
}
