import dynamic from "next/dynamic";
import Hero from "@/components/landing/Hero";
import TrustIndicators from "@/components/landing/TrustIndicators";
import DoctorSearch from "@/components/landing/DoctorSearch";
import Specialties from "@/components/landing/Specialties";

// Below-the-fold components dynamically imported for instant initial load time & minimal bundle size
const HowItWorks = dynamic(() => import("@/components/landing/HowItWorks"), { ssr: true });
const TelemedicineShowcase = dynamic(() => import("@/components/landing/TelemedicineShowcase"), { ssr: true });
const PatientExperience = dynamic(() => import("@/components/landing/PatientExperience"), { ssr: true });
const WhyDoctorly = dynamic(() => import("@/components/landing/WhyDoctorly"), { ssr: true });
const DoctorPlatform = dynamic(() => import("@/components/landing/DoctorPlatform"), { ssr: true });
const HealthcareServices = dynamic(() => import("@/components/landing/HealthcareServices"), { ssr: true });
const HealthResources = dynamic(() => import("@/components/landing/HealthResources"), { ssr: true });
const Testimonials = dynamic(() => import("@/components/landing/Testimonials"), { ssr: true });
const MobileExperience = dynamic(() => import("@/components/landing/MobileExperience"), { ssr: true });
const SecurityPrivacy = dynamic(() => import("@/components/landing/SecurityPrivacy"), { ssr: true });
const FAQ = dynamic(() => import("@/components/landing/FAQ"), { ssr: true });
const FinalCTA = dynamic(() => import("@/components/landing/FinalCTA"), { ssr: true });
const Footer = dynamic(() => import("@/components/landing/Footer"), { ssr: true });

export default function HomePage() {
  return (
    <div className="flex flex-col w-full font-inter">
      <Hero />
      <TrustIndicators />
      <DoctorSearch />
      <Specialties />
      <HowItWorks />
      <TelemedicineShowcase />
      <PatientExperience />
      <WhyDoctorly />
      <DoctorPlatform />
      <HealthcareServices />
      <HealthResources />
      <Testimonials />
      <MobileExperience />
      <SecurityPrivacy />
      <FAQ />
      <FinalCTA />
      <Footer />
    </div>
  );
}


