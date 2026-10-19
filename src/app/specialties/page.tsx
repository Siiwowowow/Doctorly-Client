import { Metadata } from "next";
import { getAllSpecialties } from "@/services/specialty.services";
import { Specialty } from "@/types/api.types";
import SpecialtiesPageContent from "@/components/specialties/SpecialtiesPageContent";

export const metadata: Metadata = {
  title: "Medical Specialties | Doctorly",
  description:
    "Explore our wide range of medical specialties and get personalized care from experienced doctors.",
};

export default async function SpecialtiesPage() {
  let specialties: Specialty[] = [];
  try {
    const response = await getAllSpecialties();
    if (response?.data?.length) {
      specialties = response.data;
    }
  } catch (error) {
    console.error("Failed to load specialties from API:", error);
  }

  return (
    <main>
      <SpecialtiesPageContent initialSpecialties={specialties} />
    </main>
  );
}

