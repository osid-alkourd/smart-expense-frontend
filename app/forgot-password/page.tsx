"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { isAuthenticated, forgotPassword } from "@/lib/api";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const router = useRouter();

  // Redirect if authenticated
  useEffect(() => {
    if (isAuthenticated()) {
      router.push('/profile');
    }
  }, [router]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    setError(null);
    setSuccessMessage(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const response = await forgotPassword({ email });

      if (response.success) {
        setSuccessMessage(response.message || "If the email exists, a password reset code has been sent.");

        // Redirect to reset password page after a short delay
        setTimeout(() => {
          router.push("/reset-password");
        }, 1500);
      } else {
        setError(response.message || "Failed to send reset code. Please try again.");
      }
    } catch (error) {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#EAF3FB' }}>
      {/* Main Content */}
      <main className="flex items-center justify-center min-h-screen py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full">
          {/* Form Card */}
          <div className="bg-white rounded-lg shadow-md border border-gray-300 p-8">
            {/* App Title */}
            <h1 className="text-2xl font-bold text-center text-gray-900 mb-4">
              Smart Expense Tracker
            </h1>

            {/* Section Title */}
            <h2 className="text-lg font-medium text-center text-gray-900 mb-4">
              Forget Password
            </h2>

            {/* Description */}
            <p className="text-sm text-gray-600 text-center mb-6">
              Enter your email and we'll send you a verification code to reset your password.
            </p>

            {/* Success Message */}
            {successMessage && (
              <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-md">
                <p className="text-sm text-green-600 text-center">{successMessage}</p>
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
                <p className="text-sm text-red-600 text-center">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Email Field */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={email}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                  placeholder="Enter your email address"
                />
              </div>

              {/* Send Code Button */}
              <button
                type="submit"
                disabled={loading}
                className={`w-full py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200 font-medium ${
                  loading
                    ? "bg-blue-400 cursor-not-allowed text-white"
                    : "bg-blue-700 text-white hover:bg-blue-800"
                }`}
              >
                {loading ? "Sending..." : "Send Code"}
              </button>
            </form>

            {/* Back to Login Link */}
            <div className="text-center mt-6">
              <Link 
                href="/login" 
                className="text-sm text-blue-600 hover:text-blue-700 transition-colors"
              >
                Back to Login
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
