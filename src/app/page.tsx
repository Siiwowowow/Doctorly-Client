import Hero from "@/components/landing/Hero";
import TrustIndicators from "@/components/landing/TrustIndicators";
import DoctorSearch from "@/components/landing/DoctorSearch";
import Specialties from "@/components/landing/Specialties";
import HowItWorks from "@/components/landing/HowItWorks";
import TelemedicineShowcase from "@/components/landing/TelemedicineShowcase";
import PatientExperience from "@/components/landing/PatientExperience";
import WhyDoctorly from "@/components/landing/WhyDoctorly";
import DoctorPlatform from "@/components/landing/DoctorPlatform";
import HealthcareServices from "@/components/landing/HealthcareServices";
import HealthResources from "@/components/landing/HealthResources";
import Testimonials from "@/components/landing/Testimonials";
import MobileExperience from "@/components/landing/MobileExperience";
import SecurityPrivacy from "@/components/landing/SecurityPrivacy";
import FAQ from "@/components/landing/FAQ";
import FinalCTA from "@/components/landing/FinalCTA";
import Footer from "@/components/landing/Footer";

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

