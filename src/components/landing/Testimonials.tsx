/* eslint-disable react/no-unescaped-entities */
"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";
import { useTranslations } from "next-intl";

import TESTIMONIALS from "@/json/testimonials.json";

export default function Testimonials() {
  const t = useTranslations("testimonials");
  const [currentIndex, setCurrentIndex] = useState(0);

  const next = () => setCurrentIndex((prev) => (prev + 1) % TESTIMONIALS.length);
  const prev = () => setCurrentIndex((prev) => (prev - 1 + TESTIMONIALS.length) % TESTIMONIALS.length);

  return (
    <section className="py-24 bg-doctorly-bg overflow-hidden relative">
      <div className="container mx-auto px-4 md:px-6">
        
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-doctorly-text mb-4 tracking-tight">
            {t("title")}
          </h2>
        </div>

        <div className="max-w-4xl mx-auto relative">
          
          <div className="overflow-hidden">
            <div 
              className="flex transition-transform duration-500 ease-in-out" 
              style={{ transform: `translateX(-${currentIndex * 100}%)` }}
            >
              {TESTIMONIALS.map((testimonial, idx) => (
                <div key={idx} className="w-full flex-shrink-0 px-4 md:px-12">
                  <div className="flex flex-col md:flex-row gap-8 md:gap-12 items-center md:items-start bg-white p-8 md:p-10 rounded-[32px] border border-gray-100 shadow-[0_20px_40px_-20px_rgba(0,0,0,0.05)]">
                    
                    <div className="shrink-0">
                      <div className="w-24 h-24 md:w-32 md:h-32 rounded-full overflow-hidden border-4 border-doctorly-secondary/50">
                        <img 
                          src={testimonial.image} 
                          alt={testimonial.name} 
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>
                    
                    <div className="flex-1 text-center md:text-left">
                      <div className="flex justify-center md:justify-start gap-1 mb-4">
                        {[...Array(5)].map((_, i) => (
                          <Star 
                            key={i} 
                            className={`w-5 h-5 ${i < testimonial.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} 
                          />
                        ))}
                      </div>
                      <p className="text-xl md:text-2xl text-gray-800 font-medium leading-relaxed italic mb-6">
                        "{testimonial.quote}"
                      </p>
                      <div>
                        <h4 className="font-bold text-lg text-doctorly-text">{testimonial.name}, {testimonial.age}</h4>
                        <p className="text-gray-500">{testimonial.location} • {testimonial.consultation}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button 
            onClick={prev}
            className="absolute left-0 md:-left-6 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white shadow-lg border border-gray-100 flex items-center justify-center text-gray-600 hover:text-doctorly-primary hover:scale-110 transition-all z-10"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          
          <button 
            onClick={next}
            className="absolute right-0 md:-right-6 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white shadow-lg border border-gray-100 flex items-center justify-center text-gray-600 hover:text-doctorly-primary hover:scale-110 transition-all z-10"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          <div className="flex justify-center gap-2 mt-8">
            {TESTIMONIALS.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                className={`w-2.5 h-2.5 rounded-full transition-all ${idx === currentIndex ? 'bg-doctorly-primary w-8' : 'bg-gray-300'}`}
              />
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}
