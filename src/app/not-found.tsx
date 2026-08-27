import Link from 'next/link'
import React from 'react'

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <h1 className="text-4xl font-bold text-center">404 - Page Not Found</h1>
      <Link href="/" className="mt-4 text-blue-500 text-center text-xl">
        Go Back to Home
      </Link>
    </div>
  );
} 