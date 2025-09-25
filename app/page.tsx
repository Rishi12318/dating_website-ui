import HeroSection from "@/components/HeroSection";
import MatchYourVibe from "@/components/match yourvibe";
import ClickSection from "@/components/click";
import ReviewsSection from "@/components/reviews";
import FooterSection from "@/components/FooterSection";

export default function Home() {
  return (
    <div className="min-h-screen">
      <HeroSection />
      <MatchYourVibe />
      <ClickSection />
      <ReviewsSection />
      <FooterSection />
    </div>
  );
}
