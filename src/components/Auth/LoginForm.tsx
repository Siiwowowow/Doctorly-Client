/* eslint-disable react-hooks/set-state-in-effect */
"use client";
import { loginAction } from "@/app/(authRouteGroup)/(auth)/login/_action";
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ILoginPayload, loginZodSchema } from "@/zod/auth.validation";
import { useForm } from "@tanstack/react-form";
import { useMutation } from "@tanstack/react-query";
import { Eye, EyeOff, Info } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import AppField from "../shared/form/AppField";
import AppSubmitButton from "../shared/form/AppSubmitButton";
import { useRouter } from "next/navigation";
import { useUser } from "@/hooks/useUser";
import { toast } from "sonner";
import SocialLogin from "../shared/socialLogin/socialLogin";
import { UserRole } from "@/lib/authUtils";

interface LoginFormProps {
  redirectPath?: string;
  defaultEmail?: string;
  reason?: string;
}

const LoginForm = ({ redirectPath, defaultEmail = "", reason = "" }: LoginFormProps) => {
  const [serverError, setServerError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const { setUser } = useUser();
  const [hasShownToast, setHasShownToast] = useState(false);

  useEffect(() => {
    if (reason === "expired" && !hasShownToast) {
      toast.info("Your session has expired. Please log in again.");
      setUser(null);
      setHasShownToast(true);
    }
  }, [reason, hasShownToast, setUser]);

  const { mutateAsync, isPending } = useMutation({
    mutationFn: (payload: ILoginPayload) => loginAction(payload, redirectPath),
  });

  const form = useForm({
    defaultValues: {
      email: defaultEmail,
      password: "",
    },

    onSubmit: async ({ value }) => {
      setServerError(null);
      try {
        const result = await mutateAsync(value) as any;

        if (!result.success) {
          setServerError(result.message || "Login failed");
          return;
        }

        toast.success("Login successful!");
        setUser(result.user);

        router.refresh();

        if (result.redirectUrl) {
          router.push(result.redirectUrl);
        } else {
          const userRole = result.user?.role as UserRole;
          const roleBasedRedirect = getRoleBasedRedirect(userRole);
          router.push(roleBasedRedirect);
        }
      } catch (error: any) {
        setServerError(error.message || "Invalid email or password.");
      }
    },
  });

  const getRoleBasedRedirect = (role: UserRole): string => {
    switch (role) {
      case "SUPER_ADMIN":
      case "ADMIN":
        return "/admin/dashboard";
      case "DOCTOR":
        return "/doctor/dashboard";
      case "PATIENT":
        return "/user/dashboard";
      default:
        return "/";
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto shadow-md">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-bold">Welcome Back!</CardTitle>
        <CardDescription>Please enter your credentials to log in.</CardDescription>
      </CardHeader>

      <CardContent>
        {reason === "expired" && (
          <Alert className="mb-4 bg-amber-50 text-amber-900 border-amber-200 dark:bg-amber-950 dark:text-amber-100 dark:border-amber-800">
            <Info className="h-4 w-4 text-amber-600" />
            <AlertDescription>
              Your session has expired. Please log in again.
            </AlertDescription>
          </Alert>
        )}

        <form
          method="POST"
          action="#"
          noValidate
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            form.handleSubmit();
          }}
          className="space-y-4"
        >
          <form.Field
            name="email"
            validators={{ onChange: loginZodSchema.shape.email }}
          >
            {(field) => (
              <AppField
                field={field}
                label="Email"
                type="email"
                placeholder="Enter your email"
              />
            )}
          </form.Field>

          <form.Field
            name="password"
            validators={{ onChange: loginZodSchema.shape.password }}
          >
            {(field) => (
              <AppField
                field={field}
                label="Password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                aria-label={showPassword ? "Hide password" : "Show password"}
                className="cursor-pointer"
                append={
                  <Button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    variant="ghost"
                    size="icon"
                  >
                    {showPassword ? (
                      <EyeOff className="size-4" aria-hidden="true" />
                    ) : (
                      <Eye className="size-4" aria-hidden="true" />
                    )}
                  </Button>
                }
              />
            )}
          </form.Field>

          <div className="text-right mt-2">
            <Link
              href="/forgot-password"
              className="text-sm text-primary hover:underline underline-offset-4"
            >
              Forgot password?
            </Link>
          </div>

          {serverError && (
            <Alert variant="destructive">
              <AlertDescription>{serverError}</AlertDescription>
            </Alert>
          )}

          <form.Subscribe selector={(s) => [s.canSubmit, s.isSubmitting] as const}>
            {([canSubmit, isSubmitting]) => (
              <AppSubmitButton
                isPending={isSubmitting || isPending}
                pendingLabel="Logging In...."
                disabled={!canSubmit}
              >
                Log In
              </AppSubmitButton>
            )}
          </form.Subscribe>
        </form>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white dark:bg-slate-900 text-gray-500">Or continue with</span>
          </div>
        </div>

        <SocialLogin />
      </CardContent>

      <CardFooter className="justify-center border-t pt-4">
        <p className="text-sm text-muted-foreground">
          Don&apos;t have an account?{" "}
          <Link
            href="/register"
            className="text-primary font-medium hover:underline underline-offset-4"
          >
            Sign Up for an account
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
};

export default LoginForm;
