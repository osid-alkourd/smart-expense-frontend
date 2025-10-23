export default function FeaturesAndHowItWorksSection() {
  const features = [
    "Uploads receipts easily",
    "Automatic data analysis", 
    "Interactive dashboard",
    "Smart money saving tips"
  ];

  const howItWorksSteps = [
    "Upload your receipt",
    "The system reads it",
    "It is saved automatically", 
    "Analytics appear in the dashboard"
  ];

  return (
    <section className="bg-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Features Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Features
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md hover:scale-105 transition-all duration-200 text-center"
              >
                <p className="text-gray-700 font-medium">{feature}</p>
              </div>
            ))}
          </div>
        </div>

        {/* How It Works Section */}
        <div id="how-it-works">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            How it works
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {howItWorksSteps.map((step, index) => (
              <div
                key={index}
                className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md hover:scale-105 transition-all duration-200 text-center relative"
              >
                {/* Step number indicator */}
                <div className="absolute -top-3 -left-3 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                  {index + 1}
                </div>
                <p className="text-gray-700 font-medium mt-2">{step}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
