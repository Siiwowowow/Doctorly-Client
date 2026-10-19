import Link from "next/link";
import { ArrowRight, CheckCircle2, ChevronDown, CircleHelp, MessageCircle, Sparkles } from "lucide-react";

const faqs = [
  {
    question: "How do I book a consultation?",
    answer: "Browse doctors, choose a specialty, and book a time that works for you from the appointment flow.",
  },
  {
    question: "Can I speak with a doctor online?",
    answer: "Yes. Doctorly supports video consultations and secure messaging to keep care accessible from wherever you are.",
  },
  {
    question: "Is my medical information secure?",
    answer: "Yes. We prioritize privacy and secure workflows to protect patient records, conversations, and appointment details.",
  },
  {
    question: "Can I use Doctorly as a doctor?",
    answer: "Absolutely. Doctors can join the platform, manage schedules, and connect with patients digitally.",
  },
  {
    question: "What can I do after a consultation?",
    answer: "You can review your care details, follow up with your doctor, and keep your health journey organized in one place.",
  },
];

export const metadata = {
  title: "FAQ | Doctorly",
  description: "Read the most common Doctorly questions about appointments, video care, and doctor access.",
};

export default function FAQPage() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#f5faff] text-slate-900">
      <section className="relative border-b border-sky-100/80">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_80%_0%,rgba(0,188,212,0.16),transparent_30%),linear-gradient(135deg,#f9fdff_0%,#eef8ff_58%,#edf4ff_100%)]" />
        <div className="relative mx-auto max-w-7xl px-4 pb-14 pt-12 sm:px-6 sm:pt-16 lg:px-8 lg:pb-16 lg:pt-20">
          <div className="grid items-end gap-8 lg:grid-cols-[1fr_0.7fr] lg:gap-16">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full border border-[#1d63ed]/20 bg-white/80 px-3 py-1.5 text-[11px] font-bold tracking-[0.12em] text-[#1d63ed] uppercase shadow-sm backdrop-blur">
                <Sparkles className="size-3.5" />
                Frequently asked questions
              </span>
              <h1 className="mt-6 max-w-3xl text-4xl leading-[1.05] font-black tracking-[-0.04em] sm:text-5xl lg:text-6xl">
                Clear answers for a <span className="text-[#1d63ed]">healthier next step.</span>
              </h1>
              <p className="mt-5 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg">Find quick answers about appointments, online consultations, privacy, and getting started with Doctorly.</p>
            </div>
            <div className="rounded-[2rem] bg-[#0c2e67] p-6 text-white shadow-[0_24px_55px_-25px_rgba(12,46,103,0.55)] sm:p-7">
              <div className="flex size-12 items-center justify-center rounded-2xl bg-white/10 text-sky-200 ring-1 ring-white/15"><MessageCircle className="size-6" /></div>
              <h2 className="mt-6 text-2xl leading-tight font-black">Still unsure where to start?</h2>
              <p className="mt-3 text-sm leading-6 text-sky-100/75">Our verified doctors can help you choose the right care path.</p>
              <Link href="/doctors" className="mt-6 inline-flex items-center gap-2 rounded-full bg-white px-4 py-2.5 text-sm font-bold text-[#1d63ed] transition hover:bg-sky-50">Talk to a doctor <ArrowRight className="size-4" /></Link>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="space-y-3">
          {faqs.map(({ question, answer }, index) => (
            <details key={question} open={index === 0} className="group overflow-hidden rounded-[1.5rem] border border-slate-200/80 bg-white shadow-[0_12px_35px_-26px_rgba(15,61,112,0.45)] transition open:border-[#1d63ed]/25 open:shadow-[0_20px_40px_-28px_rgba(29,99,237,0.4)]">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 p-5 sm:p-6 [&::-webkit-details-marker]:hidden">
                <span className="flex min-w-0 items-center gap-3 text-base font-bold sm:text-lg"><span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-sky-100 text-[#1d63ed]"><CircleHelp className="size-4" /></span>{question}</span>
                <ChevronDown className="size-5 shrink-0 text-slate-400 transition group-open:rotate-180 group-open:text-[#1d63ed]" />
              </summary>
              <div className="flex gap-3 border-t border-slate-100 px-5 pb-6 pt-4 text-sm leading-6 text-slate-500 sm:px-6"><CheckCircle2 className="mt-0.5 size-4 shrink-0 text-teal-500" />{answer}</div>
            </details>
          ))}
        </div>
      </section>
    </main>
  );
}
