"use client";

import Image from "next/image";
import { useEffect, useState, useCallback, useTransition } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const bannerImages = [
  "/banner/banner1.png",
  "/banner/banner2.png",
  "/banner/banner3.png",
  "/banner/banner4.png",
  "/banner/banner9.png",
  "/banner/banner6.png",
  "/banner/banner7.png",
  "/banner/banner8.png",
  "/banner/banner10.png",
];

export default function Hero() {
  const [current, setCurrent] = useState(0);
  const [, startTransition] = useTransition();
  const total = bannerImages.length;

  const goTo = useCallback(
    (index: number) => {
      startTransition(() => {
        setCurrent((index + total) % total);
      });
    },
    [total],
  );

  const next = useCallback(() => goTo(current + 1), [current, goTo]);
  const prev = useCallback(() => goTo(current - 1), [current, goTo]);

  // Autoplay with pause on hover
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      next();
    }, 5000);
    return () => clearInterval(timer);
  }, [next, isPaused]);

  // Preload next and previous images
  const nextIndex = (current + 1) % total;
  const prevIndex = (current - 1 + total) % total;

  return (
    <section 
      className="relative w-full overflow-hidden bg-slate-100/60 select-none"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div
        className="relative w-full overflow-hidden"
        style={{ aspectRatio: "1855 / 848" }}
      >
        {/* Slides: only render active, next and prev to minimize DOM & network pressure */}
        {bannerImages.map((image, index) => {
          const isActive = index === current;
          const isAdjacent = index === nextIndex || index === prevIndex;
          
          if (!isActive && !isAdjacent) return null;

          return (
            <div
              key={image}
              aria-hidden={!isActive}
              className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
                isActive ? "opacity-100 z-10" : "opacity-0 z-0 pointer-events-none"
              }`}
            >
              <Image
                src={image}
                alt={`Doctorly Banner ${index + 1}`}
                fill
                priority={index === 0 || isActive}
                quality={85}
                sizes="(max-width: 768px) 100vw, (max-width: 1400px) 100vw, 1920px"
                className="w-full h-full object-contain object-center"
              />
            </div>
          );
        })}

        {/* Prev / Next arrows */}
        <button
          onClick={prev}
          aria-label="Previous slide"
          className="absolute left-3 top-1/2 z-20 flex -translate-y-1/2 items-center justify-center rounded-full bg-doctorly-primary/90 p-2 text-white shadow-lg backdrop-blur-sm transition-all duration-200 hover:scale-110 hover:bg-doctorly-primary active:scale-95 sm:left-6 sm:p-3"
        >
          <ChevronLeft className="h-4 w-4 sm:h-6 sm:w-6" />
        </button>
        <button
          onClick={next}
          aria-label="Next slide"
          className="absolute right-3 top-1/2 z-20 flex -translate-y-1/2 items-center justify-center rounded-full bg-doctorly-primary/90 p-2 text-white shadow-lg backdrop-blur-sm transition-all duration-200 hover:scale-110 hover:bg-doctorly-primary active:scale-95 sm:right-6 sm:p-3"
        >
          <ChevronRight className="h-4 w-4 sm:h-6 sm:w-6" />
        </button>

        {/* Dots navigation */}
        <div className="absolute bottom-3 left-1/2 z-20 flex -translate-x-1/2 items-center gap-1.5 rounded-full bg-black/40 px-3 py-1.5 backdrop-blur-md sm:bottom-5 sm:gap-2">
          {bannerImages.map((_, index) => (
            <button
              key={index}
              onClick={() => goTo(index)}
              aria-label={`Go to slide ${index + 1}`}
              className={`h-1.5 rounded-full transition-all duration-300 sm:h-2 ${
                index === current
                  ? "w-6 sm:w-8 bg-doctorly-primary shadow-sm"
                  : "w-2 sm:w-2.5 bg-white/70 hover:bg-white"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

