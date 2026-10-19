import { Metadata } from "next";
import ServicesPageContent from "@/components/services/ServicesPageContent";

export const metadata: Metadata = {
  title: "Services | Doctorly",
  description: "Complete Healthcare at Your Fingertips. From online consultations to lab tests and medicine delivery, get complete healthcare — anytime, anywhere.",
};

export default function ServicesPage() {
  return (
    <main>
      <ServicesPageContent />
    </main>
  );
}
