"use client";

import Link from "next/link";

export default function UserHeader() {
  return (
    <header className="bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* App name on the left */}
          <div className="flex-shrink-0">
            <Link href="/" className="text-xl font-bold text-gray-900">
              Smart Expense Tracker
            </Link>
          </div>

          {/* Navigation links on the right - Desktop */}
          <nav className="hidden md:flex space-x-8">
            <Link
              href="/"
              className="text-gray-600 hover:text-gray-900 px-3 py-2 text-sm font-medium transition-colors duration-200"
            >
              Home
            </Link>
            <Link
              href="/dashboard"
              className="text-gray-600 hover:text-gray-900 px-3 py-2 text-sm font-medium transition-colors duration-200"
            >
              Dashboard
            </Link>
            <Link
              href="/upload"
              className="text-gray-600 hover:text-gray-900 px-3 py-2 text-sm font-medium transition-colors duration-200"
            >
              Upload
            </Link>
            <Link
              href="/profile"
              className="text-blue-600 hover:text-blue-700 px-3 py-2 text-sm font-medium transition-colors duration-200"
            >
              Profile
            </Link>
            <Link
              href="/"
              className="text-red-600 hover:text-red-700 px-3 py-2 text-sm font-medium transition-colors duration-200"
            >
              Logout
            </Link>
          </nav>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              type="button"
              className="text-gray-600 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500 p-2"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              <svg
                className="h-6 w-6"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile menu - Hidden by default */}
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 border-t border-gray-200">
            <Link
              href="/"
              className="text-gray-600 hover:text-gray-900 block px-3 py-2 text-base font-medium transition-colors duration-200"
            >
              Home
            </Link>
            <Link
              href="/dashboard"
              className="text-gray-600 hover:text-gray-900 block px-3 py-2 text-base font-medium transition-colors duration-200"
            >
              Dashboard
            </Link>
            <Link
              href="/upload"
              className="text-gray-600 hover:text-gray-900 block px-3 py-2 text-base font-medium transition-colors duration-200"
            >
              Upload
            </Link>
            <Link
              href="/profile"
              className="text-blue-600 hover:text-blue-700 block px-3 py-2 text-base font-medium transition-colors duration-200"
            >
              Profile
            </Link>
            <Link
              href="/"
              className="text-red-600 hover:text-red-700 block px-3 py-2 text-base font-medium transition-colors duration-200"
            >
              Logout
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
