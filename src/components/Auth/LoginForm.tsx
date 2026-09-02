/* eslint-disable react-hooks/set-state-in-effect */
"use client";
import { loginAction } from "@/app/(authRouteGroup)/(auth)/login/_action";
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
import {
  Activity,
  AlertCircle,
  ArrowRight,
  Eye,
  EyeOff,
  Info,
  Loader2,
  Lock,
  Mail,
} from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import AppField from "../shared/form/AppField";
import { useRouter } from "next/navigation";
import { useUser } from "@/hooks/useUser";
import { toast } from "sonner";
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
          if (result.redirectUrl) {
            toast.info(result.message || "Redirecting...");
            window.location.href = result.redirectUrl;
            return;
          }
          setServerError(result.message || "Login failed");
          return;
        }

        toast.success("Login successful!");
        setUser(result.user);

        const targetUrl = result.redirectUrl || getRoleBasedRedirect(result.user?.role as UserRole);
        window.location.href = targetUrl;
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
    <Card className="w-full max-w-md mx-auto shadow-xl border-border/60 backdrop-blur-sm bg-card/95 transition-all">
      {/* Top Brand Header */}
      <CardHeader className="text-center pb-4 pt-6 space-y-2">
        <div className="flex justify-center mb-1">
          <Link href="/" className="group inline-flex flex-col items-center">
            <div className="flex size-12 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-md shadow-primary/25 group-hover:scale-105 transition-transform duration-200">
              <Activity className="size-6" />
            </div>
          </Link>
        </div>
        <div className="space-y-1">
          <div className="flex items-center justify-center gap-2">
            <CardTitle className="text-2xl font-bold tracking-tight text-foreground">
              Welcome Back
            </CardTitle>
            <Badge variant="secondary" className="text-[11px] font-medium px-2 py-0.5">
              Doctorly
            </Badge>
          </div>
          <CardDescription className="text-sm text-muted-foreground">
            Sign in to access your healthcare portal & appointments
          </CardDescription>
        </div>
      </CardHeader>

      <CardContent className="space-y-4 px-6 sm:px-8">
        {/* Session Expired Alert */}
        {reason === "expired" && (
          <Alert className="bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20 py-2.5 px-3.5">
            <Info className="h-4 w-4" />
            <AlertDescription className="text-xs font-medium ml-2">
              Your session has expired. Please log in again.
            </AlertDescription>
          </Alert>
        )}

        {/* Server Error Alert */}
        {serverError && (
          <Alert variant="destructive" className="py-2.5 px-3.5">
            <AlertCircle className="size-4" />
            <AlertDescription className="text-xs font-medium ml-2">
              {serverError}
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
          {/* Email Address */}
          <form.Field
            name="email"
            validators={{ onChange: loginZodSchema.shape.email }}
          >
            {(field) => (
              <AppField
                field={field}
                label="Email Address"
                type="email"
                placeholder="name@example.com"
                required
                prepend={<Mail className="size-4 text-muted-foreground" />}
              />
            )}
          </form.Field>

          {/* Password */}
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
                required
                prepend={<Lock className="size-4 text-muted-foreground" />}
                append={
                  <Button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    variant="ghost"
                    size="icon"
                    className="size-8 text-muted-foreground hover:text-foreground"
                    tabIndex={-1}
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

          {/* Forgot Password Link */}
          <div className="flex justify-end pt-0.5">
            <Link
              href="/forgot-password"
              className="text-xs font-medium text-primary hover:underline underline-offset-4"
            >
              Forgot password?
            </Link>
          </div>

          {/* Submit Button */}
          <form.Subscribe selector={(s) => [s.canSubmit, s.isSubmitting] as const}>
            {([canSubmit, isSubmitting]) => (
              <Button
                type="submit"
                disabled={!canSubmit || isSubmitting || isPending}
                className="w-full h-10 rounded-xl font-semibold shadow-md shadow-primary/20 flex items-center justify-center gap-2 mt-2"
              >
                {isSubmitting || isPending ? (
                  <>
                    <Loader2 className="size-4 animate-spin" />
                    <span>Logging in...</span>
                  </>
                ) : (
                  <>
                    <span>Log In</span>
                    <ArrowRight className="size-4" />
                  </>
                )}
              </Button>
            )}
          </form.Subscribe>
        </form>
      </CardContent>

      <CardFooter className="flex justify-center border-t border-border/50 py-4 bg-muted/20">
        <p className="text-xs text-muted-foreground">
          Don&apos;t have an account?{" "}
          <Link
            href="/register"
            className="font-semibold text-primary hover:underline underline-offset-4"
          >
            Sign up
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
};

export default LoginForm;
