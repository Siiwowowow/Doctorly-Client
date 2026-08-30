import React from "react";
import { getPatientProfile } from "@/services/patient.services";
import { getUserInfo } from "@/services/auth.services";
import { PatientProfileView } from "./components/PatientProfileView";

export const metadata = {
  title: "My Profile | Doctorly",
};

export default async function PatientProfilePage() {
  let profile = null;
  const user = await getUserInfo();

  try {
    const res = await getPatientProfile();
    profile = res.data;
  } catch (error) {
    console.error("Failed to load profile:", error);
  }

  const finalProfile = profile ? {
    ...profile,
    bloodGroup: profile.bloodGroup || profile.patientHealthData?.bloodGroup || null,
  } : (user ? {
    id: user.id || "",
    name: user.name || "User",
    email: user.email || "",
    profilePhoto: user.profilePhoto || null,
    contactNumber: user.contactNumber || null,
    address: user.address || null,
    bloodGroup: user.bloodGroup || null,
    isDeleted: false,
    createdAt: user.createdAt || new Date().toISOString(),
    updatedAt: user.updatedAt || new Date().toISOString(),
    userId: user.id || "",
  } : null);

  if (!finalProfile) {
    return (
      <div className="p-8 text-center text-muted-foreground">
        Failed to load profile data.
      </div>
    );
  }

  return <PatientProfileView initialProfile={finalProfile} />;
}
