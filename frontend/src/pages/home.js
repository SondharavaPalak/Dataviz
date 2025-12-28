import HeroSection from "../components/herosection";
import Footer from "../components/footer";
import FeaturesSection from "../components/featuressection";

function Home() {
  return (
    <div className="bg-white">
      <HeroSection />
      <FeaturesSection />
      <Footer />
    </div>
  );
}

export default Home;