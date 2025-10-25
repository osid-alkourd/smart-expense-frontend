"use client";

import { useState } from "react";
import UserHeader from "../components/UserHeader";

export default function ProfilePage() {
  const [formData, setFormData] = useState({
    fullName: "Osid Alkurd",
    email: "osid@gmail.com",
    password: "",
    currency: "Dollar"
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSaveChanges = (e: React.FormEvent) => {
    e.preventDefault();
    // Placeholder for save functionality
    console.log("Saving changes:", formData);
    alert("Changes saved successfully!");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <UserHeader />
      
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Left Column - Profile Info */}
          <div className="w-full md:w-1/3">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              {/* Avatar */}
              <div className="flex flex-col items-center">
                <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mb-4">
                  <span className="text-gray-600 font-medium text-lg">Avatar</span>
                </div>
                
                {/* User Info */}
                <h2 className="text-xl font-semibold text-gray-900 mb-1">
                  {formData.fullName}
                </h2>
                <p className="text-gray-600 mb-6">
                  {formData.email}
                </p>
                
                {/* Edit Profile Picture Button */}
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                  Edit Profile Picture
                </button>
              </div>
            </div>
          </div>

          {/* Right Column - Edit Information */}
          <div className="w-full md:w-2/3">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">
                Edit Information
              </h3>
              
              <form onSubmit={handleSaveChanges} className="space-y-6">
                {/* Full Name */}
                <div>
                  <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    id="fullName"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                    placeholder="Enter your full name"
                  />
                </div>

                {/* Email */}
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                    placeholder="Enter your email"
                  />
                </div>

                {/* Change Password */}
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                    Change Password
                  </label>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                    placeholder="Enter new password"
                  />
                </div>

                {/* Currency Preference */}
                <div>
                  <label htmlFor="currency" className="block text-sm font-medium text-gray-700 mb-2">
                    Currency Preference
                  </label>
                  <select
                    id="currency"
                    name="currency"
                    value={formData.currency}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                  >
                    <option value="Dollar">Dollar ($)</option>
                    <option value="Euro">Euro (€)</option>
                    <option value="Pound">Pound (£)</option>
                    <option value="Yen">Yen (¥)</option>
                    <option value="CAD">Canadian Dollar (C$)</option>
                  </select>
                </div>

                {/* Save Changes Button */}
                <div className="pt-4">
                  <button
                    type="submit"
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-md font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
