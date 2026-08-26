"use client";

import { SignOutButton } from "@clerk/nextjs";

export default function UnauthorizedPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md text-center max-w-md">
        <h1 className="text-2xl font-bold text-red-600 mb-4">Access Denied</h1>
        <p className="text-gray-600 mb-6">
          You are not authorized to access this application. Only the admin
          account is allowed.
        </p>
        <SignOutButton>
          <button className="bg-red-500 text-white px-6 py-2 rounded hover:bg-red-600 transition">
            Sign Out
          </button>
        </SignOutButton>
      </div>
    </div>
  );
}
