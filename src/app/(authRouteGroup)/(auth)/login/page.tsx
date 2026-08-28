import LoginForm from "@/components/Auth/LoginForm";

interface LoginParams {
  searchParams: Promise<{ redirect?: string; email?: string; reason?: string }>;
}

const LoginPage = async ({ searchParams }: LoginParams) => {
  const params = await searchParams;
  const redirectPath = params.redirect;
  const defaultEmail = params.email || "";  // 👈 যোগ করা হয়েছে
  const reason = params.reason || "";

  return (
    <LoginForm 
      redirectPath={redirectPath}
      defaultEmail={defaultEmail}  // 👈 যোগ করা হয়েছে
      reason={reason}
    />
  );
};

export default LoginPage;