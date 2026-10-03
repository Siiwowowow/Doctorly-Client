import Hero from "@/components/landing/Hero";
import TrustIndicators from "@/components/landing/TrustIndicators";
import HealthcareServices from "@/components/landing/HealthcareServices";
import HowItWorks from "@/components/landing/HowItWorks";
import WhyDoctorly from "@/components/landing/WhyDoctorly";
import Testimonials from "@/components/landing/Testimonials";
import FAQ from "@/components/landing/FAQ";
import FinalCTA from "@/components/landing/FinalCTA";
import Footer from "@/components/landing/Footer";
import DoctorSearch from "@/components/landing/DoctorSearch";
import Specialties from "@/components/landing/Specialties";

export default function HomePage() {
  return (
    <div className="flex w-full flex-col">
      <Hero />
      <TrustIndicators />
      <HealthcareServices />
      <HowItWorks />
      <Specialties />
      <DoctorSearch />
      <WhyDoctorly />
      <Testimonials />
      <FAQ />
      <FinalCTA />
      <Footer />
    </div>
  );
}


