// src/app/(authRouteGroup)/(auth)/register/page.tsx
import RegisterForm from "@/components/Auth/RegisterForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Create Account | Doctorly",
  description: "Create an account on Doctorly to book doctor appointments and manage medical records.",
};

export default function RegisterPage() {
  return (
    <div className="min-h-[calc(100vh-5rem)] flex items-center justify-center py-6 sm:py-10 px-4 sm:px-6 lg:px-8">
      <RegisterForm />
    </div>
  );
}