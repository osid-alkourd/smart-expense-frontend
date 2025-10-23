import Link from "next/link";

export default function FooterCTASection() {
  return (
    <section className="py-16" style={{ backgroundColor: '#0B78A6' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-xl text-white mb-6">
            Start now and monitor your expenses smartly!
          </h2>
          
          <Link
            href="/register"
            className="inline-flex items-center justify-center px-6 py-2 bg-sky-500 text-white rounded-md hover:bg-sky-600 transition-colors duration-200 font-medium"
          >
            Get Started
          </Link>
        </div>
      </div>
    </section>
  );
}
