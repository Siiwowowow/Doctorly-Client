"use client";

import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-white p-4">
      <div className="max-w-md w-full text-center">
        {/* Simple Icon */}
        <div className="mb-8">
          <div className="w-24 h-24 mx-auto bg-gray-100 rounded-full flex items-center justify-center">
            <span className="text-5xl">⚠️</span>
          </div>
        </div>

        {/* Error Message */}
        <h1 className="text-4xl font-light text-gray-900 mb-2">
          500
        </h1>
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          Something went wrong
        </h2>
        <p className="text-gray-500 mb-8">
          {typeof error.message === "string" 
            ? error.message 
            : typeof error.message === "object" 
              ? JSON.stringify(error.message) 
              : "An unexpected error occurred. Please try again."}
        </p>

        {/* Action Buttons */}
        <div className="space-y-3">
          <button
            onClick={() => reset()}
            className="w-full px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors font-medium"
          >
            Try again
          </button>
          <button
            onClick={() => window.location.reload()}
            className="w-full px-6 py-3 bg-gray-50 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
          >
            Reload page
          </button>
        </div>

        {/* Error ID for support */}
        {error.digest && (
          <p className="mt-6 text-xs text-gray-400">
            Error reference: {error.digest}
          </p>
        )}
      </div>
    </div>
  );
}