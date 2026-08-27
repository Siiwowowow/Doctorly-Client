/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { useTranslations } from "next-intl";

const getFAQS = (t: any) => [
  {
    question: t("q1"),
    answer: t("a1")
  },
  {
    question: t("q2"),
    answer: t("a2")
  },
  {
    question: t("q3"),
    answer: t("a3")
  },
  {
    question: t("q4"),
    answer: t("a4")
  },
  {
    question: t("q5"),
    answer: t("a5")
  },
  {
    question: t("q6"),
    answer: t("a6")
  }
];

export default function FAQ() {
  const t = useTranslations("faq");
  const FAQS = getFAQS(t);
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="py-24 bg-gray-50 border-t border-gray-100">
      <div className="container mx-auto px-4 md:px-6">
        <div className="max-w-3xl mx-auto">
          
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-doctorly-text mb-4 tracking-tight">
              {t("title")}
            </h2>
            <p className="text-lg text-gray-600">
              {t("subtitle")}
            </p>
          </div>

          <div className="space-y-4">
            {FAQS.map((faq, index) => {
              const isOpen = openIndex === index;
              return (
                <div 
                  key={index} 
                  className={`bg-white border transition-colors duration-300 rounded-2xl overflow-hidden ${isOpen ? 'border-doctorly-primary/30 shadow-md' : 'border-gray-200 hover:border-gray-300'}`}
                >
                  <button
                    className="w-full px-6 py-5 text-left flex justify-between items-center focus:outline-none"
                    onClick={() => toggleFAQ(index)}
                  >
                    <span className={`font-semibold text-base md:text-lg transition-colors ${isOpen ? 'text-doctorly-primary' : 'text-doctorly-text'}`}>
                      {faq.question}
                    </span>
                    <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
                  </button>
                  
                  <div 
                    className={`transition-all duration-300 ease-in-out ${isOpen ? 'max-h-48 opacity-100' : 'max-h-0 opacity-0'}`}
                  >
                    <div className="px-6 pb-5 pt-0 text-gray-600">
                      {faq.answer}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          
        </div>
      </div>
    </section>
  );
}
