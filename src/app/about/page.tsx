import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  CreditCard,
  FileText,
  FlaskConical,
  Headphones,
  HeartHandshake,
  HeartPulse,
  LockKeyhole,
  MessageCircle,
  Search,
  Shield,
  Sparkles,
  Stethoscope,
  Users,
  Video,
} from "lucide-react";
import Footer from "@/components/landing/Footer";

const shortcuts = [
  { label: "Appointments", icon: CalendarDays, tone: "bg-blue-50 text-blue-600" },
  { label: "Online Consultation", icon: Video, tone: "bg-cyan-50 text-cyan-600" },
  { label: "Doctors", icon: Stethoscope, tone: "bg-pink-50 text-pink-600" },
  { label: "Payments", icon: CreditCard, tone: "bg-indigo-50 text-indigo-600" },
  { label: "Prescriptions", icon: FileText, tone: "bg-purple-50 text-purple-600" },
  { label: "Lab Tests", icon: FlaskConical, tone: "bg-orange-50 text-orange-600" },
  { label: "Account & Privacy", icon: LockKeyhole, tone: "bg-sky-50 text-sky-600" },
];

const values = [
  { title: "Accessible Care", text: "Healthcare for everyone.", icon: Users, tone: "bg-blue-50 text-blue-600" },
  { title: "Trusted Professionals", text: "Verified & experienced doctors.", icon: Shield, tone: "bg-cyan-50 text-cyan-600" },
  { title: "Patient First", text: "Your health, our priority.", icon: HeartPulse, tone: "bg-rose-50 text-rose-600" },
  { title: "Privacy & Security", text: "Your data is protected.", icon: LockKeyhole, tone: "bg-indigo-50 text-indigo-600" },
];

const faqGroups = [
  ["All Questions", 12],
  ["Appointments", 5],
  ["Online Consultation", 6],
  ["Doctors", 4],
  ["Payments", 3],
  ["Prescriptions", 4],
  ["Lab Tests", 4],
  ["Account & Privacy", 6],
];

const faqs = [
  "How do I book an appointment?",
  "Can I consult a doctor online?",
  "How do I make a payment?",
  "Will I get a digital prescription?",
  "How are my records and data protected?",
  "Can I cancel or reschedule an appointment?",
  "Do you offer lab tests at home?",
];

export const metadata = {
  title: "About Doctorly | Help Center",
  description: "Learn about Doctorly and find quick answers about your healthcare journey.",
};

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-[#f4fbff] px-2 py-2 text-slate-900 sm:px-4 sm:py-4">
      <section className="mx-auto max-w-[1440px] overflow-hidden rounded-[1.5rem] border border-sky-100 bg-white shadow-[0_20px_60px_-40px_rgba(13,139,242,0.45)] sm:rounded-[2rem]">
        <div className="relative isolate overflow-hidden bg-gradient-to-br from-[#f7fcff] via-[#eaf8ff] to-[#dff4ff]">
          <div className="grid min-h-[350px] items-center gap-6 px-5 py-8 sm:min-h-[430px] sm:px-8 sm:py-10 lg:grid-cols-[1fr_0.8fr] lg:px-12 lg:py-12">
            <div className="relative z-10 max-w-xl">
              <span className="inline-flex items-center gap-2 rounded-full border border-sky-200 bg-white/80 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.14em] text-doctorly-primary sm:text-xs">
                <Sparkles className="size-3.5" />
                About Doctorly
              </span>
              <h1 className="mt-4 text-4xl font-black leading-[1.02] tracking-[-0.05em] text-[#071b49] sm:text-6xl">
                Healthcare Should Feel <span className="text-doctorly-primary">Human.</span>
              </h1>
              <p className="mt-4 max-w-lg text-sm leading-6 text-[#3d6688] sm:text-base sm:leading-7">
                At Doctorly, we believe quality healthcare should be simple, accessible and personal—for everyone, everywhere.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link href="/doctors" className="inline-flex items-center gap-2 rounded-lg bg-doctorly-primary px-5 py-2.5 text-xs font-bold text-white shadow-sm transition hover:bg-blue-700">
                  Our Journey <ArrowRight className="size-3.5" />
                </Link>
                <Link href="/services" className="inline-flex items-center gap-2 rounded-lg border border-sky-200 bg-white px-5 py-2.5 text-xs font-bold text-doctorly-primary transition hover:bg-sky-50">
                  Explore Services
                </Link>
              </div>
              <div className="mt-6 flex flex-wrap gap-x-4 gap-y-2 text-[10px] font-semibold text-slate-500 sm:text-xs">
                {['Trusted professionals', 'Simple digital care', 'Built for Bangladesh'].map((item) => (
                  <span key={item} className="inline-flex items-center gap-1.5"><CheckCircle2 className="size-3.5 text-emerald-500" />{item}</span>
                ))}
              </div>
            </div>
            <div className="relative mx-auto h-[270px] w-full max-w-lg sm:h-[350px] lg:h-[430px]">
              <Image src="/doctorly-assest/bangladeshi-doctor-consultation.webp" alt="Doctorly doctor caring for a patient" fill priority sizes="(max-width: 1024px) 100vw, 520px" className="rounded-2xl object-cover object-center" />
            </div>
          </div>

          <div className="grid grid-cols-2 border-t border-white/80 bg-white/75 sm:grid-cols-4">
            {[
              ["500K+", "Patients Served"],
              ["2,500+", "Verified Doctors"],
              ["4.8/5", "Patient Rating"],
              ["24/7", "Care Support"],
            ].map(([value, label]) => (
              <div key={label} className="border-b border-r border-sky-100 px-4 py-4 text-center last:border-r-0 sm:border-b-0 sm:px-5">
                <p className="text-lg font-black text-[#071b49] sm:text-xl">{value}</p>
                <p className="mt-0.5 text-[9px] font-medium text-slate-500 sm:text-[11px]">{label}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="border-b border-sky-100 px-5 py-7 sm:px-8 lg:px-12">
          <div className="grid gap-4 sm:grid-cols-2">
            <article className="rounded-xl border border-sky-100 bg-[#f6fcff] p-4 sm:p-5">
              <div className="flex items-center gap-2 text-doctorly-primary"><HeartHandshake className="size-5" /><span className="text-[10px] font-bold uppercase tracking-[0.14em]">Our Mission</span></div>
              <p className="mt-2 text-sm font-semibold leading-5 text-[#071b49]">Make high-quality healthcare accessible, affordable and human for everyone.</p>
            </article>
            <article className="rounded-xl border border-orange-100 bg-[#fffaf2] p-4 sm:p-5">
              <div className="flex items-center gap-2 text-orange-500"><Sparkles className="size-5" /><span className="text-[10px] font-bold uppercase tracking-[0.14em]">Our Vision</span></div>
              <p className="mt-2 text-sm font-semibold leading-5 text-[#071b49]">A healthier world where every person has the care and support they need.</p>
            </article>
          </div>
          <div className="mt-6 flex items-center justify-between">
            <h2 className="text-xl font-black tracking-tight text-[#071b49] sm:text-2xl">Our Core Values</h2>
            <span className="hidden text-[10px] font-medium text-slate-400 sm:inline">What guides everything we do</span>
          </div>
          <div className="mt-3 grid grid-cols-2 gap-3 lg:grid-cols-4">
            {values.map(({ title, text, icon: Icon, tone }) => (
              <article key={title} className="rounded-xl border border-slate-100 bg-white p-3 transition hover:-translate-y-0.5 hover:border-sky-200 hover:shadow-sm sm:p-4">
                <span className={`flex size-9 items-center justify-center rounded-lg ${tone}`}><Icon className="size-4.5" /></span>
                <h3 className="mt-3 text-xs font-bold text-[#071b49] sm:text-sm">{title}</h3>
                <p className="mt-1 text-[10px] leading-4 text-slate-500">{text}</p>
              </article>
            ))}
          </div>
        </div>

        <div className="bg-[#fbfeff] px-5 py-7 sm:px-8 lg:px-12">
          <div className="relative isolate -mx-5 -mt-7 min-h-[210px] overflow-hidden bg-[#e8f7ff] sm:-mx-8 sm:min-h-[340px] lg:-mx-12 lg:aspect-[2172/724] lg:min-h-0">
            <Image src="/doctorly-assest/help-center-banner.webp" alt="Doctorly support specialist at a computer desk" fill sizes="100vw" className="object-cover object-[84%_center] sm:object-cover sm:object-center lg:object-center" />
            <div className="absolute inset-0 bg-gradient-to-r from-[#e8f7ff] via-[#e8f7ff]/88 to-transparent sm:bg-gradient-to-r sm:from-[#e8f7ff]/95 sm:via-[#e8f7ff]/55 sm:to-transparent" />
            <div className="relative z-10 flex h-full min-h-[210px] items-center px-3.5 py-4 sm:min-h-[340px] sm:px-8 sm:py-8 lg:min-h-0 lg:px-12">
              <div className="w-[76%] max-w-[520px] sm:w-full">
                <span className="inline-flex items-center gap-1 rounded-full border border-sky-200 bg-white/95 px-2 py-0.5 text-[8px] font-bold uppercase tracking-[0.12em] text-doctorly-primary sm:gap-2 sm:px-3 sm:py-1 sm:text-[10px] sm:tracking-[0.14em]"><MessageCircle className="size-3 sm:size-3.5" /> Help Center</span>
                <h2 className="mt-2 text-[clamp(1.1rem,5.5vw,1.45rem)] font-black leading-[0.98] tracking-[-0.04em] text-[#071b49] sm:mt-3 sm:text-4xl">How Can We <span className="text-doctorly-primary">Help?</span></h2>
                <p className="mt-1.5 max-w-md text-[9px] leading-3.5 text-slate-600 sm:mt-2 sm:text-sm sm:leading-5">Find quick answers about appointments, consultations, payments, prescriptions and more.</p>
                <div className="relative mt-2.5 max-w-md sm:mt-4">
                  <Search className="absolute left-2.5 top-1/2 size-3 -translate-y-1/2 text-slate-400 sm:left-3.5 sm:size-4" />
                  <input placeholder="Search for a question..." className="h-8 w-full rounded-md border border-sky-100 bg-white pl-8 pr-9 text-[9px] outline-none focus:border-doctorly-primary focus:ring-2 focus:ring-doctorly-primary/10 sm:h-11 sm:rounded-lg sm:pl-10 sm:pr-12 sm:text-xs" />
                  <button type="button" className="absolute right-1 top-1 flex size-6 items-center justify-center rounded bg-doctorly-primary text-white sm:right-1.5 sm:top-1.5 sm:size-8 sm:rounded-md"><Search className="size-3 sm:size-3.5" /></button>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-5 grid grid-cols-2 gap-2 sm:grid-cols-4 lg:grid-cols-7">
            {shortcuts.map(({ label, icon: Icon, tone }) => (
              <Link key={label} href={label === "Doctors" ? "/doctors" : "/services"} className="group rounded-xl border border-sky-100 bg-white px-2 py-3 text-center transition hover:-translate-y-0.5 hover:border-sky-200 hover:shadow-sm">
                <span className={`mx-auto flex size-8 items-center justify-center rounded-lg ${tone}`}><Icon className="size-4" /></span>
                <span className="mt-2 block text-[9px] font-semibold leading-tight text-slate-600 group-hover:text-doctorly-primary">{label}</span>
              </Link>
            ))}
          </div>

          <div className="mt-5 grid gap-4 lg:grid-cols-[210px_minmax(0,1fr)]">
            <aside className="rounded-xl border border-sky-100 bg-white p-3">
              <h3 className="px-2 pb-2 text-xs font-black text-[#071b49]">Help Topics</h3>
              <div className="space-y-1">
                {faqGroups.map(([label, count], index) => (
                  <button key={label} type="button" className={`flex w-full items-center justify-between rounded-lg px-2.5 py-2 text-left text-[10px] font-medium ${index === 0 ? "bg-sky-50 text-doctorly-primary" : "text-slate-500 hover:bg-slate-50"}`}>
                    <span>{label}</span><span className="text-[9px] text-slate-400">({count})</span>
                  </button>
                ))}
              </div>
            </aside>
            <div className="rounded-xl border border-sky-100 bg-white p-4 sm:p-5">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3"><div><p className="text-[10px] font-bold uppercase tracking-[0.14em] text-doctorly-primary">Popular Questions</p><h3 className="mt-1 text-lg font-black text-[#071b49]">How can we help you today?</h3></div><span className="hidden text-[10px] font-bold text-doctorly-primary sm:inline">Expand All <ArrowRight className="inline size-3" /></span></div>
              <div className="divide-y divide-slate-100">
                {faqs.map((question) => (
                  <details key={question} className="group">
                    <summary className="flex cursor-pointer list-none items-center justify-between gap-3 py-2.5 text-xs font-semibold text-slate-700 hover:text-doctorly-primary sm:text-sm"><span>{question}</span><span className="flex size-5 shrink-0 items-center justify-center rounded-full border border-sky-100 text-slate-400 transition group-open:rotate-45">+</span></summary>
                    <p className="pb-2.5 pr-8 text-[10px] leading-4 text-slate-500">Doctorly makes this process simple. Follow the guided steps or contact our support team for personal help.</p>
                  </details>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-5 flex flex-col items-start justify-between gap-3 rounded-xl border border-sky-100 bg-gradient-to-r from-[#dff4ff] to-white p-4 sm:flex-row sm:items-center sm:p-5">
            <div className="flex items-center gap-3"><span className="flex size-10 items-center justify-center rounded-xl bg-white text-doctorly-primary shadow-sm"><Headphones className="size-5" /></span><div><h3 className="text-sm font-black text-[#071b49]">Still Have Questions?</h3><p className="text-[10px] text-slate-500">Our support team is here to help you 24/7.</p></div></div>
            <div className="flex w-full gap-2 sm:w-auto"><Link href="/services" className="flex-1 rounded-lg bg-doctorly-primary px-4 py-2 text-center text-[10px] font-bold text-white sm:flex-none">Chat with Us</Link><Link href="/services" className="flex-1 rounded-lg border border-sky-200 bg-white px-4 py-2 text-center text-[10px] font-bold text-doctorly-primary sm:flex-none">Contact Support</Link></div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
