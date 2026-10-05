import Hero from "@/components/landing/Hero";
import HealthcareServices from "@/components/landing/HealthcareServices";
import HowItWorks from "@/components/landing/HowItWorks";
import WhyDoctorly from "@/components/landing/WhyDoctorly";
import EditorialCare from "@/components/landing/EditorialCare";
import Testimonials from "@/components/landing/Testimonials";
import FAQ from "@/components/landing/FAQ";
import FinalCTA from "@/components/landing/FinalCTA";
import Footer from "@/components/landing/Footer";
import DoctorSearch from "@/components/landing/DoctorSearch";
import Specialties from "@/components/landing/Specialties";
import HealthResources from "@/components/landing/HealthResources";
import MobileExperience from "@/components/landing/MobileExperience";

export default function HomePage() {
  return (
    <div className="flex w-full flex-col bg-[#f7fbfe] landing-page">
      <Hero />
      <HealthcareServices />
      <HowItWorks />
      <Specialties />
      <DoctorSearch />
      <WhyDoctorly />
      <Testimonials />
      <EditorialCare />
      <FAQ />
      <FinalCTA />
      <HealthResources />
      <MobileExperience />
      <Footer />
    </div>
  );
}
