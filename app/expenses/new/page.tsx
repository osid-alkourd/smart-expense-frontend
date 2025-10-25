"use client";

import { useState } from "react";
import UserHeader from "../../components/UserHeader";

export default function NewExpensePage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      alert("Please select a file to upload");
      return;
    }

    setIsUploading(true);
    
    // Simulate upload process
    setTimeout(() => {
      setIsUploading(false);
      alert(`File "${selectedFile.name}" uploaded successfully!`);
      setSelectedFile(null);
      // Reset file input
      const fileInput = document.getElementById('file-upload') as HTMLInputElement;
      if (fileInput) {
        fileInput.value = '';
      }
    }, 2000);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    const files = e.dataTransfer.files;
    if (files && files[0]) {
      setSelectedFile(files[0]);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <UserHeader />
      
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 px-4">
        <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md text-center">
          {/* Title & Description */}
          <h1 className="text-2xl font-semibold text-gray-800 mb-2">
            Add New Expense
          </h1>
          <p className="text-sm text-gray-500 mb-6">
            Upload an image of your expense to record your expenses automatically.
          </p>

          {/* File Upload Area */}
          <div
            className="border-2 border-dashed border-gray-300 rounded-lg p-6 mb-6 hover:border-blue-400 transition-colors duration-200 cursor-pointer"
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            onClick={() => document.getElementById('file-upload')?.click()}
          >
            <div className="flex flex-col items-center">
              {/* Upload Icon */}
              <svg
                className="w-12 h-12 text-gray-400 mb-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                />
              </svg>
              
              <p className="text-sm text-gray-600 mb-2">
                {selectedFile ? selectedFile.name : "Click to upload or drag and drop"}
              </p>
              <p className="text-xs text-gray-500">
                PNG, JPG, PDF up to 10MB
              </p>
            </div>
          </div>

          {/* Hidden File Input */}
          <input
            id="file-upload"
            type="file"
            accept="image/*,.pdf"
            onChange={handleFileChange}
            className="hidden"
          />

          {/* Selected File Display */}
          {selectedFile && (
            <div className="mb-6 p-3 bg-blue-50 border border-blue-200 rounded-md">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <svg
                    className="w-5 h-5 text-blue-500 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                  <span className="text-sm text-blue-800 font-medium">
                    {selectedFile.name}
                  </span>
                </div>
                <button
                  onClick={() => setSelectedFile(null)}
                  className="text-blue-500 hover:text-blue-700"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
          )}

          {/* Upload Button */}
          <button
            onClick={handleUpload}
            disabled={!selectedFile || isUploading}
            className={`w-full py-3 px-4 rounded-md font-medium transition-colors duration-200 ${
              selectedFile && !isUploading
                ? "bg-blue-600 hover:bg-blue-700 text-white"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
          >
            {isUploading ? (
              <div className="flex items-center justify-center">
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Uploading...
              </div>
            ) : (
              "Upload Expense"
            )}
          </button>

          {/* Additional Info */}
          <p className="text-xs text-gray-400 mt-4">
            Our AI will automatically extract expense details from your receipt
          </p>
        </div>
      </div>
    </div>
  );
}
