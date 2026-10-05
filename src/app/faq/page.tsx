import Link from "next/link";
import { ArrowRight, CircleHelp, ChevronRight } from "lucide-react";

const faqs = [
  {
    question: "How do I book a consultation?",
    answer: "Browse doctors, choose a specialty, and book a time that works for you from the appointment flow.",
  },
  {
    question: "Can I speak with a doctor online?",
    answer: "Yes. Doctorly supports video consultations and secure messaging to keep care accessible.",
  },
  {
    question: "Is my medical information secure?",
    answer: "Yes. We prioritize privacy and secure workflows to protect patient records and messages.",
  },
  {
    question: "Can I use Doctorly as a doctor?",
    answer: "Absolutely. Doctors can join the platform, manage schedules, and connect with patients digitally.",
  },
];

export const metadata = {
  title: "FAQ | Doctorly",
  description: "Read the most common Doctorly questions about appointments, video care, and doctor access.",
};

export default function FAQPage() {
  return (
    <main className="min-h-screen bg-slate-50">
      <section className="mx-auto max-w-5xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <span className="inline-flex rounded-full border border-doctorly-primary/20 bg-doctorly-primary/5 px-3 py-1 text-sm font-semibold text-doctorly-primary">
            Frequently Asked Questions
          </span>
          <h1 className="mt-6 text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">
            Everything you need to know
          </h1>
        </div>

        <div className="space-y-4">
          {faqs.map(({ question, answer }) => (
            <div key={question} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 flex size-8 items-center justify-center rounded-full bg-doctorly-primary/10 text-doctorly-primary">
                    <CircleHelp className="size-4" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-slate-900">{question}</h2>
                    <p className="mt-2 text-sm leading-6 text-slate-600">{answer}</p>
                  </div>
                </div>
                <ChevronRight className="size-5 text-slate-400" />
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 rounded-3xl bg-white p-8 text-center shadow-sm ring-1 ring-slate-200">
          <p className="text-lg font-semibold text-slate-900">Still have a question?</p>
          <p className="mt-2 text-slate-600">Our team is here to help you get the right care faster.</p>
          <Link href="/doctors" className="mt-6 inline-flex items-center gap-2 rounded-full bg-doctorly-primary px-5 py-3 font-semibold text-white transition hover:bg-doctorly-primary/90">
            Talk to a doctor
            <ArrowRight className="size-4" />
          </Link>
        </div>
      </section>
    </main>
  );
}
