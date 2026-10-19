
/* eslint-disable react/no-unescaped-entities */
"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";

import TESTIMONIALS from "@/json/testimonials.json";

type Testimonial = {
  image: string;
  name: string;
  age: number;
  location: string;
  consultation: string;
  quote: string;
  rating: number;
};

export default function Testimonials() {
  const t = useTranslations("testimonials");

  const testimonials = TESTIMONIALS as unknown as Testimonial[];

  // Duplicate data for seamless infinite marquee
  const firstRow = [...testimonials, ...testimonials];
  const secondRow = [...testimonials.slice().reverse(), ...testimonials.slice().reverse()];

  const TestimonialCard = ({ testimonial }: { testimonial: Testimonial }) => {
    return (
      <div
        className="
          w-[clamp(220px,27vw,360px)]
          shrink-0
          mx-[clamp(4px,0.8vw,12px)]
          rounded-[clamp(8px,0.7vw,12px)]
          border border-gray-100
          bg-white
          p-[clamp(12px,1.5vw,20px)]
          shadow-[0_10px_30px_-15px_rgba(0,0,0,0.15)]
          hover:shadow-[0_15px_35px_-15px_rgba(0,0,0,0.2)]
          transition-all duration-300
        "
      >
        {/* User */}
        <div className="flex items-center gap-3">
          <div className="relative size-[clamp(36px,3.5vw,48px)] shrink-0 overflow-hidden rounded-full border-2 border-doctorly-primary/20">
            <Image
              src={testimonial.image}
              alt={testimonial.name}
              fill
              sizes="48px"
              className="object-cover"
            />
          </div>

          <div className="min-w-0">
            <div className="flex items-center gap-1">
              <h4 className="truncate text-[clamp(10px,1.15vw,16px)] font-semibold text-gray-900">
                {testimonial.name}, {testimonial.age}
              </h4>

              {/* Verified badge */}
              <svg
                width="14"
                height="14"
                viewBox="0 0 12 12"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="size-[clamp(10px,1vw,14px)] shrink-0 text-doctorly-primary"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M4.555.72a4 4 0 0 1-.297.24c-.179.12-.38.202-.59.244a4 4 0 0 1-.38.041c-.48.039-.721.058-.922.129a1.63 1.63 0 0 0-.992.992c-.071.2-.09.441-.129.922a4 4 0 0 1-.041.38 1.6 1.6 0 0 1-.245.59 3 3 0 0 1-.239.297c-.313.368-.47.551-.56.743-.213.444-.213.96 0 1.404.09.192.247.375.56.743.125.146.187.219.24.297.12.179.202.38.244.59.018.093.026.189.041.38.039.48.058.721.129.922.163.464.528.829.992.992.2.071.441.09.922.129.191.015.287.023.38.041.21.042.411.125.59.245.078.052.151.114.297.239.368.313.551.47.743.56.444.213.96.213 1.404 0 .192-.09.375-.247.743-.56.146-.125.219-.187.297-.24.179-.12.38-.202.59-.244a4 4 0 0 1 .38-.041c.48-.039.721-.058.922-.129.464-.163.829-.528.992-.992.071-.2.09-.441.129-.922a4 4 0 0 1 .041-.38c.042-.21.125-.411.245-.59.052-.078.114-.151.239-.297.313-.368.47-.551.56-.743.213-.444.213-.96 0-1.404-.09-.192-.247-.375-.56-.743a4 4 0 0 1-.24-.297 1.6 1.6 0 0 1-.244-.59 3 3 0 0 1-.041-.38c-.039-.48-.058-.721-.129-.922a1.63 1.63 0 0 0-.992-.992c-.2-.071-.441-.09-.922-.129a4 4 0 0 1-.38-.041 1.6 1.6 0 0 1-.59-.245A3 3 0 0 1 7.445.72C7.077.407 6.894.25 6.702.16a1.63 1.63 0 0 0-1.404 0c-.192.09-.375.247-.743.56m4.07 3.998a.488.488 0 0 0-.691-.69l-2.91 2.91-.958-.957a.488.488 0 0 0-.69.69l1.302 1.302c.19.191.5.191.69 0z"
                  fill="currentColor"
                />
              </svg>
            </div>

            <p className="mt-0.5 text-[clamp(8px,0.85vw,12px)] text-gray-500">
              {testimonial.location}
            </p>
          </div>
        </div>

        {/* Rating */}
        <div className="mt-[clamp(10px,1.2vw,16px)] flex items-center gap-1">
          {[...Array(testimonial.rating)].map((_, index) => (
            <span
              key={index}
              className="text-[clamp(10px,1.1vw,14px)] text-doctorly-primary"
            >
              ★
            </span>
          ))}
        </div>

        {/* Review */}
        <p className="mt-[clamp(8px,0.9vw,12px)] min-h-[clamp(60px,5.3vw,72px)] text-[clamp(10px,1.1vw,14px)] leading-[1.55] text-gray-700">
          "{testimonial.quote}"
        </p>

        {/* Consultation */}
        <div className="mt-[clamp(12px,1.4vw,20px)] flex items-center justify-between gap-2 border-t border-gray-100 pt-[clamp(10px,1.2vw,16px)]">
          <span className="text-[clamp(8px,0.85vw,12px)] text-gray-400">
            {testimonial.consultation}
          </span>

          <span className="text-[clamp(8px,0.85vw,12px)] font-medium text-doctorly-primary">
            Verified Patient
          </span>
        </div>
      </div>
    );
  };

  return (
    <section className="overflow-hidden bg-doctorly-bg py-[clamp(40px,6vw,80px)]">
      {/* Section Header */}
      <div className="container mx-auto px-4 md:px-6">
        <div className="mx-auto mb-[clamp(24px,3.5vw,48px)] max-w-2xl text-center">
          <p className="mb-[clamp(8px,1vw,12px)] text-[clamp(9px,1vw,14px)] font-semibold uppercase tracking-[0.2em] text-doctorly-primary">
            {t("eyebrow") || "Patient Stories"}
          </p>

          <h2 className="text-[clamp(24px,3.4vw,48px)] font-bold tracking-tight text-doctorly-text">
            {t("title")}
          </h2>

          <p className="mt-[clamp(8px,1.2vw,16px)] text-[clamp(10px,1.15vw,16px)] text-gray-500">
            {t("description") ||
              "Real experiences from patients who chose Doctorly for their healthcare journey."}
          </p>
        </div>
      </div>

      {/* Marquee Area */}
      <div className="relative space-y-[clamp(12px,1.5vw,20px)]">
        {/* Left Gradient */}
        <div className="pointer-events-none absolute top-0 bottom-0 left-0 z-10 w-[clamp(40px,8vw,128px)] bg-gradient-to-r from-doctorly-bg to-transparent" />

        {/* Right Gradient */}
        <div className="pointer-events-none absolute top-0 right-0 bottom-0 z-10 w-[clamp(40px,8vw,128px)] bg-gradient-to-l from-doctorly-bg to-transparent" />

        {/* First Row */}
        <div className="overflow-hidden">
          <div className="marquee-inner flex w-max">
            {firstRow.map((testimonial, index) => (
              <TestimonialCard
                key={`first-${index}`}
                testimonial={testimonial}
              />
            ))}
          </div>
        </div>

        {/* Second Row */}
        <div className="overflow-hidden">
          <div className="marquee-inner marquee-reverse flex w-max">
            {secondRow.map((testimonial, index) => (
              <TestimonialCard
                key={`second-${index}`}
                testimonial={testimonial}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Animation */}
      <style jsx>{`
        @keyframes marqueeScroll {
          0% {
            transform: translateX(0);
          }

          100% {
            transform: translateX(-50%);
          }
        }

        .marquee-inner {
          animation: marqueeScroll 35s linear infinite;
        }

        .marquee-reverse {
          animation-direction: reverse;
        }

        .marquee-inner:hover {
          animation-play-state: paused;
        }

        @media (max-width: 768px) {
          .marquee-inner {
            animation-duration: 28s;
          }
        }
      `}</style>
    </section>
  );
}
