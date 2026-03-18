"use client";
import dynamic from "next/dynamic";
import { useTheme } from "@/context/ThemeContext";
import Header from "@/components/Header";

// Lazy-load — heavy animated pricing cards
const PricingCards = dynamic(() => import("@/components/cards/PricingCards"), {
    ssr: false,
    loading: () => <div className="min-h-screen" style={{ background: "#0B120B" }} />,
});

export default function PricingPage() {
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
            <div id="pricing">
                <Header />
                <PricingCards />
            </div>
        </div>
    );
}
