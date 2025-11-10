"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import UserHeader from "../components/UserHeader";
import { getProfile, updateProfile } from "../../lib/api";

export default function ProfilePage() {
  const [formData, setFormData] = useState({
    fullName: "",
    password: "",
    confirmPassword: ""
  });
  const [email, setEmail] = useState("");
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<{ field?: string; message: string }[]>([]);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const response = await getProfile();
        
        if (response.success && response.data) {
          setFormData({
            fullName: response.data!.user.name,
            password: "",
            confirmPassword: ""
          });
          setEmail(response.data!.user.email);
          setAvatarUrl(response.data!.user.avatarUrl || null);
        } else {
          console.error("Failed to fetch profile:", response.message);
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSaveChanges = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setErrors([]);
    setSuccessMessage(null);

    try {
      const updateData: { name: string; newPassword?: string; confirmPassword?: string } = {
        name: formData.fullName
      };

      // Only include password fields if password is provided
      if (formData.password) {
        updateData.newPassword = formData.password;
        updateData.confirmPassword = formData.confirmPassword;
      }

      const response = await updateProfile(updateData);

      if (response.success) {
        // Show success message
        setSuccessMessage(response.message || "Profile updated successfully!");
        setFormData(prev => ({
          ...prev,
          password: "",
          confirmPassword: ""
        }));
        setSaving(false);
        
        // Redirect to dashboard after 2 seconds
        setTimeout(() => {
          router.push('/dashboard');
        }, 2000);
      } else {
        // Display validation errors
        setErrors(response.errors || [{ field: "general", message: response.message }]);
        setSaving(false);
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      setErrors([{ field: "general", message: "An error occurred while updating your profile" }]);
      setSaving(false);
    }
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
                <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mb-4 overflow-hidden">
                  {avatarUrl ? (
                    <img 
                      src={avatarUrl} 
                      alt="Profile Avatar" 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-gray-600 font-medium text-lg">Avatar</span>
                  )}
                </div>
                
                {/* User Info */}
                <h2 className="text-xl font-semibold text-gray-900 mb-1">
                  {loading ? "Loading..." : formData.fullName || "User"}
                </h2>
                <p className="text-gray-600 mb-6">
                  {loading ? "Loading..." : email || "No email"}
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
                    className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 text-gray-900 ${
                      errors.some(e => e.field === "name") 
                        ? "border-red-500" 
                        : "border-gray-300"
                    }`}
                    placeholder="Enter your full name"
                  />
                  {errors.filter(e => e.field === "name").map((error, index) => (
                    <p key={index} className="mt-1 text-sm text-red-600">{error.message}</p>
                  ))}
                </div>

                {/* Change Password */}
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                    Change Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      id="password"
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      autoComplete="new-password"
                    className={`w-full px-3 py-2 pr-10 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 text-gray-900 ${
                        errors.some(e => e.field === "password" || e.field === "newPassword") 
                          ? "border-red-500" 
                          : "border-gray-300"
                      }`}
                      placeholder="Enter new password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-gray-700 focus:outline-none"
                    >
                      {showPassword ? (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.29 3.29m13.4 13.4L21 21M3 3l18 18" />
                        </svg>
                      ) : (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      )}
                    </button>
                  </div>
                  {errors.filter(e => e.field === "password" || e.field === "newPassword").map((error, index) => (
                    <p key={index} className="mt-1 text-sm text-red-600">{error.message}</p>
                  ))}
                </div>

                {/* Confirm Password */}
                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      id="confirmPassword"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      autoComplete="new-password"
                      className={`w-full px-3 py-2 pr-10 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 text-gray-900 ${
                        errors.some(e => e.field === "confirmPassword") 
                          ? "border-red-500" 
                          : "border-gray-300"
                      }`}
                      placeholder="Confirm new password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-gray-700 focus:outline-none"
                    >
                      {showConfirmPassword ? (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.29 3.29m13.4 13.4L21 21M3 3l18 18" />
                        </svg>
                      ) : (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      )}
                    </button>
                  </div>
                  {errors.filter(e => e.field === "confirmPassword").map((error, index) => (
                    <p key={index} className="mt-1 text-sm text-red-600">{error.message}</p>
                  ))}
                </div>

                {/* Success Message */}
                {successMessage && (
                  <div className="p-3 bg-green-50 border border-green-200 rounded-md">
                    <p className="text-sm text-green-600">{successMessage}</p>
                  </div>
                )}

                {/* General Error Messages */}
                {errors.filter(e => e.field === "general").map((error, index) => (
                  <div key={index} className="p-3 bg-red-50 border border-red-200 rounded-md">
                    <p className="text-sm text-red-600">{error.message}</p>
                  </div>
                ))}

                {/* Save Changes Button */}
                <div className="pt-4">
                  <button
                    type="submit"
                    disabled={saving}
                    className={`w-full px-6 py-3 rounded-md font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                      saving
                        ? "bg-blue-400 cursor-not-allowed text-white"
                        : "bg-blue-600 hover:bg-blue-700 text-white"
                    }`}
                  >
                    {saving ? "Saving..." : "Save Changes"}
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
