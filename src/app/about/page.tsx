import Link from "next/link";
import { ArrowRight, HeartHandshake, Shield, Sparkles, Users } from "lucide-react";

const values = [
  {
    icon: HeartHandshake,
    title: "Patient-first care",
    description: "We build healthcare experiences around trust, clarity, and convenience.",
  },
  {
    icon: Shield,
    title: "Reliable access",
    description: "Doctors and patients stay connected with secure, dependable services.",
  },
  {
    icon: Users,
    title: "Community health",
    description: "We support healthier communities through accessible digital care.",
  },
  {
    icon: Sparkles,
    title: "Modern healthcare",
    description: "Smart tools and compassionate support bring care into everyday life.",
  },
];

export const metadata = {
  title: "About | Doctorly",
  description: "Learn about Doctorly and our mission to make quality healthcare more accessible.",
};

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-white">
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="grid items-center gap-10 lg:grid-cols-[1.2fr_0.8fr]">
          <div>
            <span className="inline-flex rounded-full border border-doctorly-primary/20 bg-doctorly-primary/5 px-3 py-1 text-sm font-semibold text-doctorly-primary">
              About Doctorly
            </span>
            <h1 className="mt-6 text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">
              Better care, backed by technology and empathy.
            </h1>
            <p className="mt-5 max-w-xl text-lg text-slate-600">
              Doctorly helps people find trusted healthcare professionals and connect with care in a simpler, smarter way.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link href="/doctors" className="inline-flex items-center gap-2 rounded-full bg-doctorly-primary px-5 py-3 font-semibold text-white transition hover:bg-doctorly-primary/90">
                Find a doctor
                <ArrowRight className="size-4" />
              </Link>
              <Link href="/join-as-doctor" className="inline-flex items-center gap-2 rounded-full border border-slate-300 px-5 py-3 font-semibold text-slate-700 transition hover:border-doctorly-primary hover:text-doctorly-primary">
                Join as doctor
              </Link>
            </div>
          </div>

          <div className="rounded-[2rem] border border-slate-200 bg-slate-50 p-8 shadow-sm">
            <div className="rounded-3xl bg-white p-6 shadow-sm">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-doctorly-primary">Our mission</p>
              <h2 className="mt-4 text-2xl font-bold text-slate-900">Accessible, human-centered healthcare for everyone.</h2>
              <p className="mt-4 text-slate-600">
                We combine clinical expertise, digital convenience, and compassionate support to make healthcare more approachable.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-16 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {values.map(({ icon: Icon, title, description }) => (
            <div key={title} className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
              <div className="mb-4 flex size-12 items-center justify-center rounded-2xl bg-white text-doctorly-primary shadow-sm">
                <Icon className="size-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900">{title}</h3>
              <p className="mt-3 text-sm leading-6 text-slate-600">{description}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
