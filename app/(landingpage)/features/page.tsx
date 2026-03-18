"use client";
import dynamic from "next/dynamic";
import { useTheme } from "@/context/ThemeContext";
import Header from "@/components/Header";

// Lazy-load for performance — code-splits the heavy carousel component
const FeatureCards = dynamic(() => import("@/components/cards/FeatureCards"), {
    ssr: false,
    loading: () => <div className="min-h-screen" style={{ background: "#0B120B" }} />,
});

export default function FeaturesPage() {
    const { isDark } = useTheme();
    return (
        <div
            className="min-h-screen pt-[76px]"
            style={{
                background: isDark
                    ? "linear-gradient(135deg, #070D07 0%, #0B120B 100%)"
                    : "linear-gradient(135deg, #f0ede6 0%, #e8e4da 100%)",
            }}
        >
            <div id="feature-cards">
                <Header />
                <FeatureCards />
            </div>
        </div>
    );
}
