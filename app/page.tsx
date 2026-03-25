"use client";
import { useTheme } from "@/context/ThemeContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import HeroSection from "@/components/HeroSection";
import ActivityTicker from "@/components/ActivityTicker";
import HeroScroll from "@/components/HeroScroll";

// Home page: hero experience with shared header/footer
export default function Home() {
  const { isDark } = useTheme();

  return (
    <>
      {/* <Header /> */}
      <div
        className="min-h-screen"
        style={{
          background: isDark
            ? "#0B120B"
            : "linear-gradient(135deg, #f5f3ef 0%, #ffffff 50%, #ede9e3 100%)",
        }}
      >
        <div id="hero">
          <Header />
          <HeroSection />
        </div>
        {/* <ActivityTicker /> */}
        <HeroScroll />
      </div>
      {/* <Footer /> */}
    </>
  );
}