import LoginForm from "@/components/Auth/LoginForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign In | Doctorly",
  description: "Sign in to your Doctorly account to access appointments, prescriptions, and healthcare records.",
};

interface LoginParams {
  searchParams: Promise<{ redirect?: string; email?: string; reason?: string }>;
}

const LoginPage = async ({ searchParams }: LoginParams) => {
  const params = await searchParams;
  const redirectPath = params.redirect;
  const defaultEmail = params.email || "";
  const reason = params.reason || "";

  return (
    <div className="min-h-[calc(100vh-5rem)] flex items-center justify-center py-6 sm:py-10 px-4 sm:px-6 lg:px-8">
      <LoginForm 
        redirectPath={redirectPath}
        defaultEmail={defaultEmail}
        reason={reason}
      />
    </div>
  );
};

export default LoginPage;