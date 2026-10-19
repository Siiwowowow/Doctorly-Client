"use client";

import React, { useMemo, useState } from "react";
import Image from "next/image";
import {
  Apple,
  ArrowRight,
  BookOpen,
  Calendar,
  Clock,
  Dumbbell,
  Grid2X2,
  HeartPulse,
  Mail,
  MoreHorizontal,
  Search,
  Send,
  Sparkles,
  Users,
} from "lucide-react";
import rawArticles from "@/json/healthResources.json";
import BlogDetailModal, { BlogArticle } from "@/components/landing/BlogDetailModal";
import Footer from "@/components/landing/Footer";

const additionalArticles: BlogArticle[] = [
  {
    id: "morning-hydration-habit",
    slug: "morning-hydration-habit",
    category: "Lifestyle",
    title: "The Simple Morning Habit That Supports Better Energy",
    subtitle: "A practical hydration and breakfast routine to help you start the day feeling focused and refreshed.",
    time: "4 min read",
    date: "Sep 18, 2026",
    views: "2.1k",
    image: "https://images.unsplash.com/photo-1548839140-29a749e1cf4d?auto=format&fit=crop&w=900&q=80",
    author: { name: "Dr. Rafiq Hasan", role: "Family Medicine Specialist", avatar: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&w=200&q=80" },
    tags: ["Lifestyle", "Wellness", "Hydration"],
    content: [{ type: "paragraph", text: "Small, consistent morning habits can support energy, concentration and healthier choices throughout the day. Start with water, a balanced breakfast and a few calm minutes before checking your phone." }],
  },
  {
    id: "desk-stretch-routine",
    slug: "desk-stretch-routine",
    category: "Lifestyle",
    title: "5 Easy Desk Stretches for a Healthier Workday",
    subtitle: "Release neck, shoulder and back tension with short movement breaks you can do anywhere.",
    time: "5 min read",
    date: "Sep 16, 2026",
    views: "1.8k",
    image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=900&q=80",
    author: { name: "Dr. Imran Hossain", role: "Orthopedic Surgeon", avatar: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=200&q=80" },
    tags: ["Lifestyle", "Movement", "Back Care"],
    content: [{ type: "paragraph", text: "Long periods of sitting can make muscles feel tight and tired. Gentle movement every hour helps your body reset and can make a noticeable difference in comfort." }],
  },
  {
    id: "balanced-plate-guide",
    slug: "balanced-plate-guide",
    category: "Nutrition",
    title: "Build a Balanced Plate Without Counting Every Calorie",
    subtitle: "Use a simple visual guide to add more protein, fiber and colorful foods to everyday meals.",
    time: "6 min read",
    date: "Sep 14, 2026",
    views: "2.6k",
    image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=900&q=80",
    author: { name: "Nusrat Jahan", role: "Clinical Nutritionist", avatar: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=200&q=80" },
    tags: ["Nutrition", "Healthy Eating", "Wellness"],
    content: [{ type: "paragraph", text: "A balanced plate does not need to be complicated. Combine vegetables, a quality protein, whole grains and a little healthy fat to create satisfying everyday meals." }],
  },
  {
    id: "better-sleep-routine",
    slug: "better-sleep-routine",
    category: "Mental Wellness",
    title: "A Calmer Evening Routine for Better Sleep",
    subtitle: "Simple changes to light, screens and timing can help your mind prepare for restorative sleep.",
    time: "5 min read",
    date: "Sep 11, 2026",
    views: "3.2k",
    image: "https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?auto=format&fit=crop&w=900&q=80",
    author: { name: "Dr. Farzana Rahman", role: "Psychiatrist", avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80" },
    tags: ["Mental Health", "Sleep", "Stress"],
    content: [{ type: "paragraph", text: "A predictable wind-down routine helps your body recognize when it is time to rest. Lower the lights, put screens away and choose one calming activity before bed." }],
  },
  {
    id: "heart-friendly-walk",
    slug: "heart-friendly-walk",
    category: "Heart Health",
    title: "How a Daily Walk Supports Your Heart",
    subtitle: "Learn how a consistent, comfortable walking habit can support circulation and cardiovascular health.",
    time: "4 min read",
    date: "Sep 08, 2026",
    views: "2.4k",
    image: "https://images.unsplash.com/photo-1552674605-db6ffd4facb5?auto=format&fit=crop&w=900&q=80",
    author: { name: "Dr. Tanvir Ahmed", role: "Consultant Cardiologist", avatar: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=200&q=80" },
    tags: ["Heart Health", "Walking", "Prevention"],
    content: [{ type: "paragraph", text: "Regular moderate activity is one of the most accessible ways to support heart health. Start with a comfortable pace and build consistency before increasing intensity." }],
  },
  {
    id: "morning-sunlight-sleep",
    slug: "morning-sunlight-sleep",
    category: "Lifestyle",
    title: "Why Morning Sunlight Helps Your Sleep-Wake Rhythm",
    subtitle: "A few minutes of natural light can help your body understand when to feel alert and when to rest.",
    time: "4 min read",
    date: "Sep 05, 2026",
    views: "1.7k",
    image: "https://images.unsplash.com/photo-1500534623283-312aade485b7?auto=format&fit=crop&w=900&q=80",
    author: { name: "Dr. Farzana Rahman", role: "Psychiatrist", avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80" },
    tags: ["Lifestyle", "Sleep", "Mental Health"],
    content: [{ type: "paragraph", text: "Morning light is one of the strongest signals for your internal body clock. A short outdoor walk after waking can support a more consistent sleep routine." }],
  },
  {
    id: "gut-friendly-foods",
    slug: "gut-friendly-foods",
    category: "Nutrition",
    title: "Everyday Foods That Support a Healthier Gut",
    subtitle: "Add fiber-rich, colorful and fermented foods to make your meals kinder to your digestion.",
    time: "5 min read",
    date: "Sep 02, 2026",
    views: "2.0k",
    image: "https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=900&q=80",
    author: { name: "Nusrat Jahan", role: "Clinical Nutritionist", avatar: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=200&q=80" },
    tags: ["Nutrition", "Gut Health", "Healthy Eating"],
    content: [{ type: "paragraph", text: "Vegetables, fruit, lentils, whole grains and fermented foods provide the fiber and friendly cultures your digestive system needs every day." }],
  },
  {
    id: "know-your-blood-pressure",
    slug: "know-your-blood-pressure",
    category: "Heart Health",
    title: "Know Your Blood Pressure Numbers",
    subtitle: "Understand what your readings mean and which small habits can support healthier numbers.",
    time: "5 min read",
    date: "Aug 30, 2026",
    views: "2.3k",
    image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=900&q=80",
    author: { name: "Dr. Tanvir Ahmed", role: "Consultant Cardiologist", avatar: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=200&q=80" },
    tags: ["Heart Health", "Prevention", "Blood Pressure"],
    content: [{ type: "paragraph", text: "A single reading is only a snapshot. Tracking your blood pressure consistently and discussing unusual changes with a clinician gives you a clearer picture of your heart health." }],
  },
];

const articles = [...additionalArticles, ...(rawArticles as BlogArticle[])];

const topicOptions = [
  { label: "All Topics", value: "All" },
  { label: "Mental Health", value: "Mental Wellness" },
  { label: "Women&apos;s Health", value: "Women" },
  { label: "Children&apos;s Health", value: "Children" },
  { label: "Heart Health", value: "Heart Health" },
  { label: "Diabetes", value: "Diabetes" },
  { label: "Nutrition", value: "Nutrition" },
  { label: "Lifestyle", value: "Lifestyle" },
  { label: "More", value: "More" },
];

function TopicIcon({ index }: { index: number }) {
  const icons = [Grid2X2, Sparkles, Users, HeartPulse, HeartPulse, Sparkles, Apple, Dumbbell, MoreHorizontal];
  const Icon = icons[index] || MoreHorizontal;
  return <Icon className="size-4" />;
}

export default function BlogPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [activeArticle, setActiveArticle] = useState<BlogArticle | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const filteredArticles = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return articles.filter((article) => {
      const matchesCategory =
        selectedCategory === "All" ||
        selectedCategory === "More" ||
        article.category === selectedCategory ||
        (article.tags || []).some((tag) => tag.toLowerCase().includes(selectedCategory.toLowerCase()));
      const matchesSearch =
        !query ||
        article.title.toLowerCase().includes(query) ||
        article.subtitle?.toLowerCase().includes(query) ||
        article.category.toLowerCase().includes(query) ||
        (article.tags || []).some((tag) => tag.toLowerCase().includes(query));

      return matchesCategory && matchesSearch;
    });
  }, [searchQuery, selectedCategory]);

  const featuredArticle = filteredArticles.find((article) => article.id === "morning-hydration-habit") || filteredArticles.find((article) => article.featured) || filteredArticles[0];
  const supportingArticles = filteredArticles.filter((article) => article.id !== featuredArticle?.id).slice(0, 4);
  const latestArticles = filteredArticles.filter((article) => article.id !== featuredArticle?.id).slice(0, 3);

  const handleOpenArticle = (article: BlogArticle) => {
    setActiveArticle(article);
    setIsModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#f8fcff] font-sans text-slate-900">
      <section className="relative isolate overflow-hidden border-b border-sky-100 bg-[#e8f7ff]">
        <Image
          src="/doctorly-assest/bangladeshi-female-doctor-hero.webp"
          alt="Doctorly health insights"
          fill
          priority
          sizes="100vw"
          className="object-cover object-[78%_center] sm:object-contain sm:object-right"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#e8f7ff] via-[#e8f7ff]/90 to-transparent sm:bg-gradient-to-r sm:from-[#e8f7ff]/95 sm:via-[#e8f7ff]/45 sm:to-transparent" />
        <div className="relative mx-auto flex min-h-[300px] max-w-7xl items-center px-3.5 py-7 sm:min-h-[420px] sm:px-6 sm:py-10 lg:min-h-[470px] lg:px-8">
          <div className="w-[69%] max-w-xl sm:w-full">
            <div className="inline-flex items-center gap-2 rounded-full border border-sky-200 bg-white/80 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.15em] text-doctorly-primary backdrop-blur-sm sm:text-xs">
              <BookOpen className="size-3.5" />
              Our Blog
            </div>
            <h1 className="mt-3 text-[clamp(1.65rem,7.8vw,2.25rem)] font-black leading-[0.96] tracking-[-0.05em] text-[#071b49] sm:mt-4 sm:text-6xl sm:leading-[0.98] lg:text-7xl">
              Health Insights
              <span className="block text-doctorly-primary">for a Better You</span>
            </h1>
            <p className="mt-3 max-w-lg text-[10px] leading-4 text-[#3d6688] sm:mt-4 sm:text-base sm:leading-7">
              Trusted articles, expert advice, and practical tips to help you and your family live healthier every day.
            </p>
            <div className="mt-4 grid max-w-[285px] grid-cols-3 gap-1.5 sm:mt-8 sm:max-w-md sm:gap-3">
              {[
                ["500+", "Expert Articles"],
                ["50+", "Medical Experts"],
                ["100%", "Reliable Information"],
              ].map(([value, label]) => (
                <div key={label} className="rounded-lg border border-white/80 bg-white/80 px-1.5 py-2 backdrop-blur-sm sm:rounded-xl sm:px-3 sm:py-3">
                  <p className="text-xs font-black text-[#071b49] sm:text-xl">{value}</p>
                  <p className="mt-0.5 text-[7px] font-medium leading-3 text-[#3d6688] sm:text-[11px]">{label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex min-w-0 gap-2 overflow-x-auto pb-1 scrollbar-none">
            {topicOptions.map((topic, index) => (
              <button
                key={topic.value}
                type="button"
                onClick={() => setSelectedCategory(topic.value)}
                className={`inline-flex shrink-0 items-center gap-2 rounded-full border px-4 py-2.5 text-[11px] font-semibold transition sm:text-xs ${
                  selectedCategory === topic.value
                    ? "border-doctorly-primary bg-doctorly-primary text-white shadow-sm"
                    : "border-sky-100 bg-white text-slate-600 hover:border-sky-200 hover:text-doctorly-primary"
                }`}
              >
                <TopicIcon index={index} />
                {topic.label.replace("&apos;", "'")}
              </button>
            ))}
          </div>
          <div className="relative w-full shrink-0 sm:max-w-xs">
            <Search className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
            <input
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="Search articles"
              className="h-10 w-full rounded-full border border-sky-100 bg-white pl-10 pr-4 text-xs text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-doctorly-primary focus:ring-2 focus:ring-doctorly-primary/10"
            />
          </div>
        </div>

        {featuredArticle ? (
          <>
            <div className="mt-8 grid gap-5 lg:grid-cols-[minmax(0,1fr)_300px] lg:gap-6">
              <section>
                <div className="mb-3 flex items-center justify-between">
                  <h2 className="text-2xl font-black tracking-tight text-[#071b49] sm:text-3xl">Featured Articles</h2>
                  <button type="button" onClick={() => setSelectedCategory("All")} className="inline-flex items-center gap-1 text-xs font-bold text-doctorly-primary">
                    View All Articles <ArrowRight className="size-3.5" />
                  </button>
                </div>

                <div className="grid gap-4 md:grid-cols-[1.08fr_0.92fr]">
                  <article onClick={() => handleOpenArticle(featuredArticle)} className="group flex cursor-pointer flex-col overflow-hidden rounded-2xl border border-sky-100 bg-white shadow-sm transition hover:-translate-y-1 hover:border-sky-200 hover:shadow-md">
                    <div className="relative aspect-[1.65/1] overflow-hidden bg-sky-50">
                      <Image src={featuredArticle.image} alt={featuredArticle.title} fill sizes="(max-width: 768px) 100vw, 45vw" className="object-cover transition duration-500 group-hover:scale-105" />
                      <span className="absolute left-3 top-3 rounded-full bg-white/95 px-2 py-1 text-[9px] font-bold uppercase text-doctorly-primary">Featured</span>
                    </div>
                    <div className="relative -mt-10 bg-white px-3 pb-3 pt-12 sm:px-3.5 sm:pb-3.5 sm:pt-12 before:absolute before:-top-10 before:left-[-12%] before:h-20 before:w-[124%] before:rounded-[50%_50%_0_0/100%_100%_0_0] before:bg-white">
                      <div className="relative z-10">
                        <span className="text-[9px] font-bold uppercase tracking-wide text-doctorly-primary">{featuredArticle.category}</span>
                        <h3 className="mt-1 line-clamp-2 text-base font-black leading-tight tracking-tight text-[#071b49] group-hover:text-doctorly-primary sm:text-lg">{featuredArticle.title}</h3>
                        <p className="mt-1 line-clamp-2 text-[10px] leading-4 text-slate-500 sm:text-[11px]">{featuredArticle.subtitle}</p>
                        <div className="mt-2.5 flex items-center justify-between border-t border-slate-100 pt-2 text-[9px] text-slate-500 sm:text-[10px]">
                          <span className="flex min-w-0 items-center gap-1.5">
                            <span className="relative size-5 shrink-0 overflow-hidden rounded-full bg-sky-50"><Image src={featuredArticle.author.avatar} alt="" fill sizes="20px" className="object-cover" /></span>
                            <span className="truncate font-semibold text-slate-700">{featuredArticle.author.name}</span>
                          </span>
                          <span className="ml-2 inline-flex shrink-0 items-center gap-1"><Calendar className="size-3" /> {featuredArticle.date}</span>
                          <span className="ml-2 flex size-7 shrink-0 items-center justify-center rounded-full bg-sky-50 text-doctorly-primary transition group-hover:bg-doctorly-primary group-hover:text-white"><ArrowRight className="size-3.5" /></span>
                        </div>
                      </div>
                    </div>
                  </article>

                  <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-1">
                    {supportingArticles.slice(0, 2).map((article) => (
                      <article key={article.id} onClick={() => handleOpenArticle(article)} className="group flex cursor-pointer gap-3 rounded-2xl border border-sky-100 bg-white p-3 transition hover:-translate-y-0.5 hover:border-sky-200 hover:shadow-sm">
                        <div className="relative h-28 w-24 shrink-0 overflow-hidden rounded-xl bg-sky-50 sm:h-32 sm:w-28">
                          <Image src={article.image} alt={article.title} fill sizes="120px" className="object-cover transition duration-500 group-hover:scale-105" />
                        </div>
                        <div className="min-w-0 py-0.5">
                          <span className="text-[9px] font-bold uppercase text-doctorly-primary">{article.category}</span>
                          <h3 className="mt-1 line-clamp-3 text-sm font-bold leading-tight text-[#071b49] group-hover:text-doctorly-primary">{article.title}</h3>
                          <p className="mt-2 text-[10px] text-slate-500">{article.author.name}</p>
                          <p className="mt-1 inline-flex items-center gap-1 text-[10px] text-slate-400"><Clock className="size-3" />{article.time}</p>
                        </div>
                      </article>
                    ))}
                  </div>
                </div>
              </section>

              <aside className="space-y-5">
                <div className="rounded-2xl border border-sky-100 bg-gradient-to-br from-[#dff3ff] to-white p-5">
                  <div className="flex items-start justify-between">
                    <Mail className="size-7 text-doctorly-primary" />
                    <Send className="size-6 rotate-[-15deg] text-sky-400" />
                  </div>
                  <h2 className="mt-4 text-xl font-black leading-tight text-[#071b49]">Stay Informed,<br />Stay Healthy</h2>
                  <p className="mt-2 text-xs leading-5 text-slate-500">Get the latest health tips, expert advice and new articles directly in your inbox.</p>
                  <div className="mt-4 flex rounded-full border border-sky-100 bg-white p-1">
                    <input placeholder="Your email address" className="min-w-0 flex-1 bg-transparent px-3 text-[10px] outline-none" />
                    <button type="button" className="rounded-full bg-doctorly-primary px-3 py-2 text-[10px] font-bold text-white">Subscribe</button>
                  </div>
                </div>

                <div className="rounded-2xl border border-sky-100 bg-white p-5">
                  <div className="flex items-center justify-between">
                    <h2 className="text-base font-black text-[#071b49]">Popular Articles</h2>
                    <span className="text-[10px] font-bold text-doctorly-primary">See All <ArrowRight className="inline size-3" /></span>
                  </div>
                  <div className="mt-4 space-y-3">
                    {articles.slice(0, 5).map((article, index) => (
                      <button key={article.id} type="button" onClick={() => handleOpenArticle(article)} className="group flex w-full items-center gap-2.5 text-left">
                        <span className="w-5 text-xs font-bold text-slate-400">{String(index + 1).padStart(2, "0")}</span>
                        <div className="relative size-11 shrink-0 overflow-hidden rounded-lg bg-sky-50">
                          <Image src={article.image} alt="" fill sizes="44px" className="object-cover" />
                        </div>
                        <span className="min-w-0 flex-1">
                          <span className="line-clamp-2 block text-[11px] font-semibold leading-tight text-slate-700 group-hover:text-doctorly-primary">{article.title}</span>
                          <span className="mt-1 block text-[9px] text-slate-400">★ 4.8 · {article.time}</span>
                        </span>
                        <ArrowRight className="size-3.5 shrink-0 text-doctorly-primary" />
                      </button>
                    ))}
                  </div>
                </div>
              </aside>
            </div>

            <section className="mt-10">
              <div className="mb-3 flex items-center justify-between">
                <h2 className="text-2xl font-black tracking-tight text-[#071b49]">Latest Articles</h2>
                <div className="flex gap-1 rounded-full bg-sky-50 p-1 text-[10px] font-semibold text-slate-500">
                  <span className="rounded-full bg-white px-3 py-1 text-doctorly-primary shadow-sm">Latest</span>
                  <span className="px-2 py-1">Most Read</span>
                  <span className="hidden px-2 py-1 sm:inline">Editor&apos;s Pick</span>
                </div>
              </div>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {latestArticles.map((article) => (
                  <article key={article.id} onClick={() => handleOpenArticle(article)} className="group flex cursor-pointer gap-3 rounded-2xl border border-sky-100 bg-white p-3 transition hover:-translate-y-0.5 hover:border-sky-200 hover:shadow-sm">
                    <div className="relative h-28 w-24 shrink-0 overflow-hidden rounded-xl bg-sky-50">
                      <Image src={article.image} alt={article.title} fill sizes="110px" className="object-cover transition duration-500 group-hover:scale-105" />
                    </div>
                    <div className="min-w-0 py-0.5">
                      <span className="text-[9px] font-bold uppercase text-doctorly-primary">{article.category}</span>
                      <h3 className="mt-1 line-clamp-3 text-sm font-bold leading-tight text-[#071b49] group-hover:text-doctorly-primary">{article.title}</h3>
                      <p className="mt-2 text-[10px] text-slate-500">{article.author.name}</p>
                      <p className="mt-1 inline-flex items-center gap-1 text-[10px] text-slate-400"><Calendar className="size-3" />{article.date}</p>
                    </div>
                  </article>
                ))}
              </div>
            </section>
          </>
        ) : (
          <div className="mt-8 rounded-2xl border border-dashed border-sky-200 bg-white p-12 text-center">
            <BookOpen className="mx-auto size-10 text-slate-400" />
            <h2 className="mt-3 text-lg font-bold text-slate-800">No articles found</h2>
            <p className="mt-1 text-sm text-slate-500">Try another topic or search phrase.</p>
          </div>
        )}
      </main>

      <Footer />

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
