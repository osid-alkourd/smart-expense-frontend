"use client";

import Image from "next/image";
import Link from "next/link";

export default function Hero() {
  const scrollToHowItWorks = () => {
    const element = document.getElementById('how-it-works');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };
  return (
    <section className="py-20" style={{ backgroundColor: '#EAF3FB' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left side - Text content */}
          <div className="space-y-8">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
              Track your expenses easily and intelligently.
            </h1>
            
            <p className="text-xl text-gray-600 leading-relaxed">
              Upload your receipts and let AI analyze your spending automatically.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/register"
                className="inline-flex items-center justify-center px-8 py-4 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Get Started
              </Link>
              
              <button
                onClick={scrollToHowItWorks}
                className="inline-flex items-center justify-center px-8 py-4 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                See How It Works
              </button>
            </div>
          </div>
          
          {/* Right side - Image */}
          <div className="relative">
            <div className="aspect-square relative">
              <Image
                src="/images/home-page-image.png"
                alt="Smart Expense Tracker Dashboard"
                fill
                className="object-contain"
                priority
                style={{ background: 'transparent' }}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
