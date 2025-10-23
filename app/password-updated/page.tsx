"use client";

import Link from "next/link";

export default function PasswordUpdatedPage() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: '#EAF3FB' }}>
      {/* Main Content */}
      <main className="flex items-center justify-center min-h-screen py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full">
          {/* Success Card */}
          <div className="bg-white rounded-lg shadow-md border border-gray-300 p-8">
            {/* App Title */}
            <h1 className="text-2xl font-bold text-center text-gray-900 mb-4">
              Smart Expense Tracker
            </h1>

            {/* Main Title */}
            <h2 className="text-xl font-bold text-center text-gray-900 mb-4">
              Password Updated
            </h2>

            {/* Success Message */}
            <p className="text-sm text-gray-600 text-center mb-8">
              Your password has been changed successfully.
            </p>

            {/* Go to Login Button */}
            <Link
              href="/login"
              className="w-full bg-blue-700 text-white py-2 px-4 rounded-md hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200 font-medium text-center block"
            >
              Go to Login
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
