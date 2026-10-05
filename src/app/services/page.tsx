import Link from "next/link";
import { ArrowRight, CalendarRange, MessageSquareText, ShieldCheck, Video } from "lucide-react";

const services = [
  {
    icon: Video,
    title: "Video Consultation",
    description: "Connect with doctors instantly through secure, high-quality virtual visits.",
  },
  {
    icon: CalendarRange,
    title: "Smart Appointments",
    description: "Book, track, and manage medical appointments with a streamlined workflow.",
  },
  {
    icon: MessageSquareText,
    title: "Doctor Messaging",
    description: "Chat with clinicians before and after consultations for faster support.",
  },
  {
    icon: ShieldCheck,
    title: "Private & Secure",
    description: "Protected patient data, compliance-focused care, and trusted workflows.",
  },
];

export const metadata = {
  title: "Services | Doctorly",
  description: "Explore Doctorly healthcare services including telemedicine, appointments, and secure messaging.",
};

export default function ServicesPage() {
  return (
    <main className="min-h-screen bg-slate-50">
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="mb-12 max-w-3xl">
          <span className="inline-flex rounded-full border border-doctorly-primary/20 bg-doctorly-primary/5 px-3 py-1 text-sm font-semibold text-doctorly-primary">
            Healthcare Services
          </span>
          <h1 className="mt-6 text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">
            Care designed around your needs
          </h1>
          <p className="mt-5 text-lg text-slate-600">
            Doctorly brings modern healthcare together in one place, so patients and doctors can connect faster, easier, and with more confidence.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {services.map(({ icon: Icon, title, description }) => (
            <div key={title} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
              <div className="mb-5 flex size-12 items-center justify-center rounded-2xl bg-doctorly-primary/10 text-doctorly-primary">
                <Icon className="size-6" />
              </div>
              <h2 className="text-xl font-bold text-slate-900">{title}</h2>
              <p className="mt-3 text-sm leading-6 text-slate-600">{description}</p>
            </div>
          ))}
        </div>

        <div className="mt-14 rounded-3xl bg-doctorly-primary px-8 py-10 text-white shadow-lg shadow-doctorly-primary/20">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-white/80">Ready to begin?</p>
              <h2 className="mt-2 text-3xl font-bold">Find the right care in minutes</h2>
            </div>
            <Link href="/doctors" className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 font-semibold text-doctorly-primary transition hover:bg-slate-100">
              Explore Doctors
              <ArrowRight className="size-4" />
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
