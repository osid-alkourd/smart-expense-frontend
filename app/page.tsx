import Header from "./components/Header";
import Hero from "./components/Hero";
import FeaturesAndHowItWorksSection from "./components/FeaturesAndHowItWorksSection";
import FooterCTASection from "./components/FooterCTASection";

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <Hero />
      <FeaturesAndHowItWorksSection />
      <FooterCTASection />
    </div>
  );
}
