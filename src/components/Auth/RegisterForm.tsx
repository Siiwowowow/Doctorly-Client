/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import { registerAction } from "@/app/(authRouteGroup)/(auth)/register/_action";

// Shadcn UI Components
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Checkbox } from "@/components/ui/checkbox";

// Icons
import {
  Eye,
  EyeOff,
  User,
  Mail,
  Lock,
  Phone,
  Activity,
  AlertCircle,
  CheckCircle2,
  Loader2,
  ArrowRight,
} from "lucide-react";

export default function RegisterForm() {
  const router = useRouter();

  // Form states
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [agreeTerms, setAgreeTerms] = useState(true);

  // UI interaction states
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Password strength calculation
  const passwordStrength = useMemo(() => {
    if (!password) return { score: 0, label: "", color: "bg-muted" };
    let score = 0;
    if (password.length >= 6) score += 25;
    if (password.length >= 8) score += 25;
    if (/[0-9]/.test(password)) score += 25;
    if (/[^A-Za-z0-9]/.test(password) || /[A-Z]/.test(password)) score += 25;

    if (score <= 25) return { score, label: "Weak", color: "bg-destructive" };
    if (score <= 50) return { score, label: "Fair", color: "bg-orange-500" };
    if (score <= 75) return { score, label: "Good", color: "bg-yellow-500" };
    return { score, label: "Strong", color: "bg-emerald-500" };
  }, [password]);

  const isPasswordMatching = useMemo(() => {
    if (!confirmPassword) return null;
    return password === confirmPassword;
  }, [password, confirmPassword]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError(null);

    // Validation
    if (!name.trim()) {
      setServerError("Please enter your full name.");
      return;
    }
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setServerError("Please enter a valid email address.");
      return;
    }
    if (!phoneNumber.trim()) {
      setServerError("Please enter your phone number.");
      return;
    }
    if (password.length < 6) {
      setServerError("Password must be at least 6 characters long.");
      return;
    }
    if (password !== confirmPassword) {
      setServerError("Passwords do not match. Please verify.");
      return;
    }
    if (!agreeTerms) {
      setServerError("You must agree to the Terms of Service & Privacy Policy.");
      return;
    }

    setIsLoading(true);

    try {
      const formData = new FormData();
      formData.append("name", name.trim());
      formData.append("email", email.trim().toLowerCase());
      formData.append("phoneNumber", phoneNumber.trim());
      formData.append("password", password);
      formData.append("confirmPassword", confirmPassword);
      formData.append("role", "CUSTOMER");

      const result = (await registerAction(formData)) as any;

      if (!result.success) {
        setServerError(result.message || "Registration failed. Please try again.");
        toast.error(result.message || "Registration failed");
        setIsLoading(false);
        return;
      }

      toast.success("Account created successfully! Please check your email.");
      router.push(`/verify-email?email=${encodeURIComponent(email.trim())}`);
    } catch (err: any) {
      const errorMsg = err?.message || "An unexpected error occurred.";
      setServerError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-lg shadow-xl border-border/60 backdrop-blur-sm bg-card/95 transition-all">
      {/* Top Brand Header */}
      <CardHeader className="text-center pb-4 pt-6 space-y-2">
        <div className="flex justify-center mb-1">
          <div className="flex size-12 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-md shadow-primary/25">
            <Activity className="size-6" />
          </div>
        </div>
        <div className="space-y-1">
          <div className="flex items-center justify-center gap-2">
            <CardTitle className="text-2xl font-bold tracking-tight text-foreground">
              Create Account
            </CardTitle>
            <Badge variant="secondary" className="text-[11px] font-medium px-2 py-0.5">
              Doctorly
            </Badge>
          </div>
          <CardDescription className="text-sm text-muted-foreground">
            Sign up to book doctor consultations & manage healthcare records
          </CardDescription>
        </div>
      </CardHeader>

      <CardContent className="space-y-5 px-6 sm:px-8">
        {/* Server Error Alert */}
        {serverError && (
          <Alert variant="destructive" className="py-2.5 px-3.5">
            <AlertCircle className="size-4" />
            <AlertDescription className="text-xs font-medium ml-2">
              {serverError}
            </AlertDescription>
          </Alert>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Full Name */}
          <div className="space-y-1.5">
            <Label htmlFor="name" className="text-xs font-medium text-foreground">
              Full Name <span className="text-destructive">*</span>
            </Label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
              <Input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="John Doe"
                required
                className="pl-9 h-10 rounded-xl"
                disabled={isLoading}
              />
            </div>
          </div>

          {/* Email Address */}
          <div className="space-y-1.5">
            <Label htmlFor="email" className="text-xs font-medium text-foreground">
              Email Address <span className="text-destructive">*</span>
            </Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                required
                className="pl-9 h-10 rounded-xl"
                disabled={isLoading}
              />
            </div>
          </div>

          {/* Phone Number */}
          <div className="space-y-1.5">
            <Label htmlFor="phoneNumber" className="text-xs font-medium text-foreground">
              Phone Number <span className="text-destructive">*</span>
            </Label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
              <Input
                id="phoneNumber"
                type="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="+880 1XXX XXXXXX"
                required
                className="pl-9 h-10 rounded-xl"
                disabled={isLoading}
              />
            </div>
          </div>

          {/* Password */}
          <div className="space-y-1.5">
            <Label htmlFor="password" className="text-xs font-medium text-foreground">
              Password <span className="text-destructive">*</span>
            </Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Minimum 6 characters"
                required
                className="pl-9 pr-10 h-10 rounded-xl"
                disabled={isLoading}
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-1 top-1/2 -translate-y-1/2 size-8 text-muted-foreground hover:text-foreground"
                tabIndex={-1}
              >
                {showPassword ? (
                  <EyeOff className="size-4" />
                ) : (
                  <Eye className="size-4" />
                )}
                <span className="sr-only">Toggle password visibility</span>
              </Button>
            </div>

            {/* Password strength bar */}
            {password.length > 0 && (
              <div className="pt-1.5 space-y-1">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-muted-foreground">Password strength:</span>
                  <span className="font-medium text-foreground">{passwordStrength.label}</span>
                </div>
                <Progress value={passwordStrength.score} className="h-1" />
              </div>
            )}
          </div>

          {/* Confirm Password */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <Label htmlFor="confirmPassword" className="text-xs font-medium text-foreground">
                Confirm Password <span className="text-destructive">*</span>
              </Label>
              {isPasswordMatching !== null && (
                <span
                  className={`text-[11px] font-medium flex items-center gap-1 ${
                    isPasswordMatching ? "text-emerald-600" : "text-destructive"
                  }`}
                >
                  {isPasswordMatching ? (
                    <>
                      <CheckCircle2 className="size-3" />
                      Passwords match
                    </>
                  ) : (
                    <>
                      <AlertCircle className="size-3" />
                      Passwords do not match
                    </>
                  )}
                </span>
              )}
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
              <Input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Re-enter your password"
                required
                className={`pl-9 pr-10 h-10 rounded-xl ${
                  isPasswordMatching === false ? "border-destructive focus-visible:ring-destructive/20" : ""
                }`}
                disabled={isLoading}
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-1 top-1/2 -translate-y-1/2 size-8 text-muted-foreground hover:text-foreground"
                tabIndex={-1}
              >
                {showConfirmPassword ? (
                  <EyeOff className="size-4" />
                ) : (
                  <Eye className="size-4" />
                )}
                <span className="sr-only">Toggle confirm password visibility</span>
              </Button>
            </div>
          </div>

          {/* Terms Agreement Checkbox */}
          <div className="flex items-start space-x-2 pt-1">
            <Checkbox
              id="terms"
              checked={agreeTerms}
              onCheckedChange={(checked) => setAgreeTerms(!!checked)}
              className="mt-0.5"
            />
            <Label
              htmlFor="terms"
              className="text-xs text-muted-foreground font-normal leading-tight cursor-pointer select-none"
            >
              I agree to the{" "}
              <Link href="/terms" className="text-primary font-medium hover:underline">
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link href="/privacy" className="text-primary font-medium hover:underline">
                Privacy Policy
              </Link>
            </Label>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={isLoading || !agreeTerms}
            className="w-full h-10 rounded-xl font-semibold shadow-md shadow-primary/20 flex items-center justify-center gap-2 mt-2"
          >
            {isLoading ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                <span>Creating Account...</span>
              </>
            ) : (
              <>
                <span>Create Account</span>
                <ArrowRight className="size-4" />
              </>
            )}
          </Button>
        </form>
      </CardContent>

      <CardFooter className="flex justify-center border-t border-border/50 py-4 bg-muted/20">
        <p className="text-xs text-muted-foreground">
          Already have an account?{" "}
          <Link
            href="/login"
            className="font-semibold text-primary hover:underline underline-offset-4"
          >
            Sign in
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
}
