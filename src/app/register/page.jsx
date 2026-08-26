"use client";

import { SignUp } from "@clerk/nextjs";

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <SignUp
        path="/register"
        routing="path"
        signInUrl="/login"
      />
    </div>
  );
}