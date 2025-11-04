"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { login } from "@/lib/api";

export default function LoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear errors for this field when user starts typing
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setSuccessMessage("");
    setIsLoading(true);

    try {
      const response = await login(formData);

      if (response.success && response.data) {
        // Store the access token and user data
        localStorage.setItem("accessToken", response.data.accessToken);
        localStorage.setItem("user", JSON.stringify(response.data.user));
        
        setSuccessMessage(response.message || "Login successful!");
        
        // Redirect to dashboard after a short delay
        setTimeout(() => {
          router.push("/dashboard");
        }, 1000);
      } else {
        // Handle validation errors
        if (response.errors && response.errors.length > 0) {
          const fieldErrors: Record<string, string[]> = {};
          
          response.errors.forEach((error) => {
            const field = error.field || "general";
            if (!fieldErrors[field]) {
              fieldErrors[field] = [];
            }
            fieldErrors[field].push(error.message);
          });
          
          setErrors(fieldErrors);
        } else {
          setErrors({
            general: [response.message || "Login failed. Please try again."]
          });
        }
      }
    } catch (error) {
      setErrors({
        general: ["An unexpected error occurred. Please try again."]
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getFieldErrors = (fieldName: string): string[] => {
    return errors[fieldName] || [];
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#EAF3FB' }}>
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <Link href="/" className="text-2xl font-bold text-gray-900 hover:text-blue-600 transition-colors">
              Smart Expense Tracker
            </Link>
            <Link 
              href="/" 
              className="text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-medium transition-colors"
            >
              Home
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex items-center justify-center min-h-[calc(100vh-5rem)] py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full">
          {/* Form Card */}
          <div className="bg-white rounded-lg shadow-md border border-gray-200 p-8">
            <h1 className="text-2xl font-bold text-center text-gray-900 mb-8">
              Login
            </h1>

            {/* Success Message */}
            {successMessage && (
              <div className="mb-4 p-3 bg-green-50 border border-green-200 text-green-800 rounded-md text-sm">
                {successMessage}
              </div>
            )}

            {/* General Error Message */}
            {errors.general && errors.general.length > 0 && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-800 rounded-md text-sm">
                {errors.general.map((error, index) => (
                  <p key={index}>{error}</p>
                ))}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Email Field */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                    getFieldErrors("email").length > 0
                      ? "border-red-300"
                      : "border-gray-300"
                  }`}
                  placeholder="Enter your email"
                  disabled={isLoading}
                />
                {getFieldErrors("email").length > 0 && (
                  <div className="mt-1 text-sm text-red-600">
                    {getFieldErrors("email").map((error, index) => (
                      <p key={index}>{error}</p>
                    ))}
                  </div>
                )}
              </div>

              {/* Password Field */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                  className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                    getFieldErrors("password").length > 0
                      ? "border-red-300"
                      : "border-gray-300"
                  }`}
                  placeholder="Enter your password"
                  disabled={isLoading}
                />
                {getFieldErrors("password").length > 0 && (
                  <div className="mt-1 text-sm text-red-600">
                    {getFieldErrors("password").map((error, index) => (
                      <p key={index}>{error}</p>
                    ))}
                  </div>
                )}
              </div>

              {/* Login Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-purple-600 text-white py-2 px-4 rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition-colors duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? "Logging in..." : "Login"}
              </button>
            </form>

            {/* Footer Text */}
            <div className="text-center text-sm text-gray-600 mt-6 space-y-2">
              <p>
                You don't have an account?{" "}
                <Link 
                  href="/register" 
                  className="text-purple-600 hover:text-purple-700 font-medium transition-colors"
                >
                  Register
                </Link>
              </p>
              <p>
                <Link 
                  href="/forgot-password" 
                  className="text-purple-600 hover:text-purple-700 transition-colors"
                >
                  Forgot your password?
                </Link>
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
