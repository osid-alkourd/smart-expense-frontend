"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { isAuthenticated, resetPassword } from "@/lib/api";

export default function ResetPasswordPage() {
  const [formData, setFormData] = useState({
    verificationCode: "",
    newPassword: "",
    confirmPassword: ""
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [errors, setErrors] = useState<{ field?: string; message: string }[]>([]);
  const router = useRouter();

  // Redirect if authenticated
  useEffect(() => {
    if (isAuthenticated()) {
      router.push('/profile');
    }
  }, [router]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError(null);
    setErrors([]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setErrors([]);

    try {
      const response = await resetPassword({
        code: formData.verificationCode,
        newPassword: formData.newPassword,
        confirmPassword: formData.confirmPassword
      });

      if (response.success) {
        // Redirect to password-updated page on success
        router.push('/password-updated');
      } else {
        // Display validation errors
        if (response.errors && response.errors.length > 0) {
          setErrors(response.errors);
        } else {
          setError(response.message || "Failed to reset password. Please try again.");
        }
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

            {/* Page Title */}
            <h2 className="text-lg font-medium text-center text-gray-900 mb-4">
              Reset password
            </h2>

            {/* Instruction */}
            <p className="text-sm text-gray-600 text-center mb-6">
              Enter the verification code and then enter the new password.
            </p>

            {/* Error Message */}
            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
                <p className="text-sm text-red-600 text-center">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Verification Code Field */}
              <div>
                <label htmlFor="verificationCode" className="block text-sm font-medium text-gray-700 mb-1">
                  Verification Code
                </label>
                <input
                  type="text"
                  id="verificationCode"
                  name="verificationCode"
                  value={formData.verificationCode}
                  onChange={handleInputChange}
                  required
                  className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 ${
                    errors.some(e => e.field === "code") 
                      ? "border-red-500" 
                      : "border-gray-300"
                  }`}
                  placeholder="Enter verification code"
                />
                {errors.filter(e => e.field === "code").map((error, index) => (
                  <p key={index} className="mt-1 text-sm text-red-600">{error.message}</p>
                ))}
              </div>

              {/* New Password Field */}
              <div>
                <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-1">
                  New Password
                </label>
                <input
                  type="password"
                  id="newPassword"
                  name="newPassword"
                  value={formData.newPassword}
                  onChange={handleInputChange}
                  required
                  className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 ${
                    errors.some(e => e.field === "newPassword") 
                      ? "border-red-500" 
                      : "border-gray-300"
                  }`}
                  placeholder="Enter new password"
                />
                {errors.filter(e => e.field === "newPassword").map((error, index) => (
                  <p key={index} className="mt-1 text-sm text-red-600">{error.message}</p>
                ))}
              </div>

              {/* Confirm New Password Field */}
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  required
                  className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 ${
                    errors.some(e => e.field === "confirmPassword") 
                      ? "border-red-500" 
                      : "border-gray-300"
                  }`}
                  placeholder="Confirm new password"
                />
                {errors.filter(e => e.field === "confirmPassword").map((error, index) => (
                  <p key={index} className="mt-1 text-sm text-red-600">{error.message}</p>
                ))}
              </div>

              {/* Update Password Button */}
              <button
                type="submit"
                disabled={loading}
                className={`w-full py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200 font-medium ${
                  loading
                    ? "bg-blue-400 cursor-not-allowed text-white"
                    : "bg-blue-700 text-white hover:bg-blue-800"
                }`}
              >
                {loading ? "Updating..." : "Update the Password"}
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
