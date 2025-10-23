"use client";

import Link from "next/link";
import { useState } from "react";

export default function ResetPasswordPage() {
  const [formData, setFormData] = useState({
    verificationCode: "",
    newPassword: "",
    confirmPassword: ""
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission here
    console.log("Reset password form submitted:", formData);
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter verification code"
                />
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter new password"
                />
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Confirm new password"
                />
              </div>

              {/* Update Password Button */}
              <button
                type="submit"
                className="w-full bg-blue-700 text-white py-2 px-4 rounded-md hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200 font-medium"
              >
                Update the Password
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
