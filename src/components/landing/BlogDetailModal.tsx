/* eslint-disable react/no-unescaped-entities */
"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Clock,
  Calendar,
  Eye,
  Share2,
  Bookmark,
  Heart,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  Stethoscope,
  Sparkles,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

export interface BlogArticle {
  id: string;
  slug: string;
  category: string;
  title: string;
  subtitle?: string;
  time: string;
  date: string;
  views?: string;
  image: string;
  author: {
    name: string;
    role: string;
    avatar: string;
  };
  featured?: boolean;
  tags?: string[];
  content?: Array<{
    type: "paragraph" | "heading" | "quote" | "callout";
    text?: string;
    title?: string;
  }>;
}

interface BlogDetailModalProps {
  article: BlogArticle | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function BlogDetailModal({
  article,
  isOpen,
  onClose,
}: BlogDetailModalProps) {
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [likes, setLikes] = useState(64);
  const [hasLiked, setHasLiked] = useState(false);

  // Close on Escape key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  if (!isOpen || !article) return null;

  const handleShare = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      toast.success("Article link copied to clipboard!");
    }
  };

  const handleBookmark = () => {
    setIsBookmarked(!isBookmarked);
    toast.success(
      isBookmarked
        ? "Removed from saved articles"
        : "Article saved to your reading list!"
    );
  };

  const handleLike = () => {
    if (!hasLiked) {
      setLikes((prev) => prev + 1);
      setHasLiked(true);
      toast.success("Thank you for liking this article!");
    } else {
      setLikes((prev) => prev - 1);
      setHasLiked(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-slate-950/75 backdrop-blur-sm transition-opacity"
        />

        {/* Modal Window Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 16 }}
          transition={{ type: "spring", duration: 0.45, bounce: 0.12 }}
          className="relative z-10 w-full max-w-3xl max-h-[92vh] overflow-y-auto rounded-2xl sm:rounded-3xl bg-white shadow-2xl border border-slate-100 flex flex-col scrollbar-thin scrollbar-thumb-slate-200"
        >
          {/* Top Sticky Bar */}
          <div className="sticky top-0 z-40 flex items-center justify-between border-b border-slate-100 bg-white/95 px-4 sm:px-6 py-3 backdrop-blur-md">
            <div className="flex items-center gap-2">
              <span className="rounded-full bg-teal-50 border border-teal-200 px-3 py-1 text-xs font-bold text-doctorly-primary">
                {article.category}
              </span>
              <span className="hidden sm:inline-flex items-center gap-1 text-xs font-medium text-slate-500">
                <Clock className="size-3.5 text-slate-400" />
                {article.time}
              </span>
            </div>

            <div className="flex items-center gap-1.5 sm:gap-2">
              <button
                onClick={handleLike}
                aria-label="Like article"
                className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold transition-all ${
                  hasLiked
                    ? "bg-rose-50 text-rose-600 border border-rose-200"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                <Heart
                  className={`size-3.5 ${hasLiked ? "fill-rose-500 text-rose-500" : ""}`}
                />
                <span>{likes}</span>
              </button>

              <button
                onClick={handleBookmark}
                aria-label="Bookmark article"
                className={`flex size-8 items-center justify-center rounded-full transition-all ${
                  isBookmarked
                    ? "bg-emerald-50 text-emerald-600 border border-emerald-200"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                <Bookmark
                  className={`size-4 ${isBookmarked ? "fill-emerald-500 text-emerald-500" : ""}`}
                />
              </button>

              <button
                onClick={handleShare}
                aria-label="Share article"
                className="flex size-8 items-center justify-center rounded-full bg-slate-100 text-slate-600 hover:bg-slate-200 transition-all"
              >
                <Share2 className="size-4" />
              </button>

              <button
                onClick={onClose}
                aria-label="Close modal"
                className="flex size-8 items-center justify-center rounded-full bg-slate-100 text-slate-700 hover:bg-slate-200 hover:text-slate-900 transition-all ml-1"
              >
                <X className="size-4.5" />
              </button>
            </div>
          </div>

          {/* Article Header & Typography */}
          <div className="px-4 sm:px-8 pt-6 sm:pt-8 pb-4">
            {/* Title */}
            <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-[32px] font-black text-slate-900 tracking-tight leading-tight sm:leading-snug">
              {article.title}
            </h1>

            {/* Subtitle */}
            {article.subtitle && (
              <p className="mt-3 text-sm sm:text-base text-slate-600 leading-relaxed font-normal">
                {article.subtitle}
              </p>
            )}

            {/* Author Profile Row */}
            <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-y border-slate-100 py-3.5">
              <div className="flex items-center gap-3">
                <div className="relative size-10 sm:size-11 overflow-hidden rounded-full border border-teal-500/20 shadow-sm shrink-0">
                  <Image
                    src={article.author.avatar}
                    alt={article.author.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <div className="flex items-center gap-1.5 text-xs sm:text-sm font-bold text-slate-900">
                    <span>{article.author.name}</span>
                    <CheckCircle2 className="size-3.5 text-doctorly-primary shrink-0" />
                  </div>
                  <p className="text-[11px] sm:text-xs text-slate-500 font-medium">
                    {article.author.role}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 text-xs text-slate-500">
                <span className="flex items-center gap-1">
                  <Calendar className="size-3.5 text-slate-400" />
                  {article.date}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Clock className="size-3.5 text-slate-400" />
                  {article.time}
                </span>
                {article.views && (
                  <>
                    <span className="hidden sm:inline">•</span>
                    <span className="hidden sm:flex items-center gap-1">
                      <Eye className="size-3.5 text-slate-400" />
                      {article.views} views
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Featured Article Image (Real Blog Layout) */}
          <div className="px-4 sm:px-8 mb-6">
            <div className="relative w-full overflow-hidden rounded-2xl border border-slate-200/80 shadow-sm bg-slate-100 aspect-[16/9] max-h-[360px]">
              <Image
                src={article.image}
                alt={article.title}
                fill
                priority
                sizes="(max-width: 768px) 100vw, 720px"
                className="object-cover object-center w-full h-full"
              />
            </div>
            <p className="mt-2 text-center text-[11px] text-slate-400 italic">
              Doctorly Health Library • Medically verified educational resource
            </p>
          </div>

          {/* Article Main Body Content */}
          <div className="px-4 sm:px-8 pb-8 space-y-5 text-slate-700 leading-relaxed text-sm sm:text-base">
            {/* Medical Review Disclaimer */}
            <div className="flex items-center gap-2.5 rounded-xl bg-emerald-50/80 p-3 text-xs font-medium text-emerald-900 border border-emerald-200/70">
              <ShieldCheck className="size-4 shrink-0 text-emerald-600" />
              <span>
                Medically reviewed by the <strong>Doctorly Clinical Advisory Board</strong> for scientific and clinical accuracy.
              </span>
            </div>

            {/* Paragraphs and sections */}
            {article.content && article.content.length > 0 ? (
              <div className="space-y-4">
                {article.content.map((block, index) => {
                  if (block.type === "heading") {
                    return (
                      <h2
                        key={index}
                        className="pt-4 text-base sm:text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2 border-b border-slate-100 pb-2"
                      >
                        <span className="size-2 rounded-full bg-doctorly-primary" />
                        <span>{block.text}</span>
                      </h2>
                    );
                  }
                  if (block.type === "quote") {
                    return (
                      <blockquote
                        key={index}
                        className="my-4 rounded-2xl bg-slate-50 p-4 sm:p-5 border-l-4 border-doctorly-primary text-slate-800 font-semibold italic text-sm sm:text-base shadow-sm"
                      >
                        "{block.text}"
                      </blockquote>
                    );
                  }
                  if (block.type === "callout") {
                    return (
                      <div
                        key={index}
                        className="my-5 rounded-2xl bg-teal-50/80 p-4 sm:p-5 border border-teal-200/80 text-teal-950 shadow-sm"
                      >
                        <div className="flex items-center gap-2 font-bold text-teal-900 text-xs sm:text-sm mb-1.5">
                          <Stethoscope className="size-4 text-doctorly-primary" />
                          <span>{block.title || "Clinical Health Advice"}</span>
                        </div>
                        <p className="text-xs sm:text-sm text-teal-800 leading-relaxed">
                          {block.text}
                        </p>
                      </div>
                    );
                  }
                  return (
                    <p
                      key={index}
                      className="whitespace-pre-line text-slate-600 leading-relaxed text-sm sm:text-[15px]"
                    >
                      {block.text}
                    </p>
                  );
                })}
              </div>
            ) : (
              <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
                Stay updated with scientifically validated medical tips and routine preventive measures curated by certified doctors and healthcare specialists.
              </p>
            )}

            {/* Tags */}
            {article.tags && article.tags.length > 0 && (
              <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center gap-2">
                <span className="text-xs font-semibold text-slate-400">
                  Topics:
                </span>
                {article.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600 hover:bg-slate-200 transition-colors"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}

            {/* Doctor Consultation Banner */}
            <div className="rounded-2xl bg-gradient-to-br from-doctorly-primary via-teal-700 to-emerald-800 p-5 sm:p-6 text-white shadow-lg flex flex-col sm:flex-row items-center justify-between gap-4 mt-8">
              <div>
                <div className="inline-flex items-center gap-1.5 rounded-full bg-white/20 px-2.5 py-0.5 text-[11px] font-bold text-teal-100 mb-1.5 backdrop-blur-md">
                  <Sparkles className="size-3" />
                  <span>Personalized Medical Care</span>
                </div>
                <h3 className="text-sm sm:text-base font-bold text-white">
                  Have health symptoms or questions?
                </h3>
                <p className="text-xs text-teal-100 mt-0.5">
                  Consult with certified specialist doctors online in minutes.
                </p>
              </div>
              <Button
                asChild
                className="shrink-0 rounded-xl bg-white text-doctorly-primary font-bold hover:bg-teal-50 shadow-md text-xs sm:text-sm h-10 px-5"
              >
                <Link
                  href="/doctors"
                  onClick={onClose}
                  className="flex items-center gap-2"
                >
                  <span>Find a Doctor</span>
                  <ArrowRight className="size-4" />
                </Link>
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
