/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

const BASE_API_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

// ✅ IRegisterPayload বাদ — এখন সরাসরি FormData নেবে
export async function registerAction(formData: FormData) {
  try {
    const res = await fetch(`${BASE_API_URL}/auth/register`, {
      method: "POST",
      // ✅ Content-Type header দেবেন না — browser নিজে multipart/form-data set করবে
      body: formData,
      credentials: "include",
    });

    const data = await res.json();

    if (!res.ok) {
      let errorMessage = "Registration failed";
      
      if (typeof data.message === "string") {
        errorMessage = data.message;
      } else if (Array.isArray(data.message)) {
        errorMessage = data.message.map((err: any) => err.message || err.path || JSON.stringify(err)).join(", ");
      } else if (data.message && typeof data.message === "object") {
        errorMessage = data.message.message || JSON.stringify(data.message);
      } else if (data.errorMessages && Array.isArray(data.errorMessages)) {
        errorMessage = data.errorMessages.map((err: any) => err.message || err.path).join(", ");
      }

      return {
        success: false,
        message: errorMessage,
      };
    }

    return {
      success: true,
      message: data.message || "Registration successful. Please check your email for verification code.",
      data: data.data,
    };
  } catch (error: any) {
    console.error("Registration error:", error);
    return {
      success: false,
      message: error.message || "An error occurred during registration",
    };
  }
}