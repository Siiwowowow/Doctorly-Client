//src/components/GoogleLoginSuccess.tsx
"use client";

import { useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { useUser } from "@/hooks/useUser";

export function GoogleLoginSuccess() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { setUser } = useUser(); // ✅ ADD THIS
  const shownRef = useRef(false);

  useEffect(() => {
    if (shownRef.current) return;
    shownRef.current = true;

    const loginStatus = searchParams.get("login");

    const fetchUser = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/me`,
          {
            credentials: "include",
          }
        );
        const data = await res.json();
        if (data?.data) {
          setUser(data.data); // 🔥 THIS FIXES EVERYTHING
        }
      } catch (err) {
        console.log(err);
      }
    };

    if (loginStatus === "success") {
      setTimeout(() => {
        toast.success("Logged in successfully! 🎉", {
          duration: 2500,
        });
      }, 100);

      fetchUser(); // 🔥 REFRESH USER HERE
    }

    if (loginStatus === "error") {
      setTimeout(() => {
        toast.error("Login failed. Please try again.", {
          duration: 2500,
        });
      }, 100);
    }

    router.replace("/");
  }, [searchParams, router, setUser]);

  return null;
}