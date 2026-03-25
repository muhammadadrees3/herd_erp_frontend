"use client";
import dynamic from "next/dynamic";
import { useTheme } from "@/context/ThemeContext";

// Lazy-load below-fold heavy components
const TrustBuilding = dynamic(() => import("@/components/TrustBuilding"), {
    ssr: false,
    loading: () => <div className="min-h-[50vh]" />,
});
const Testimonials = dynamic(() => import("@/components/Testimonials"), {
    ssr: false,
    loading: () => <div className="min-h-[40vh]" />,
});

export default function AboutPage() {
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
            <div id="agri-trust">
                <TrustBuilding />
            </div>
            <Testimonials />
        </div>
    );
}
