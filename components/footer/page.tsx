"use client";
import dynamic from "next/dynamic";
import { useTheme } from "@/context/ThemeContext";

// Footer doubles as the contact page
const Footer = dynamic(() => import("@/components/Footer"), {
    ssr: false,
    loading: () => <div className="min-h-screen" />,
});

export default function ContactPage() {
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
            <div id="footer">
                <Footer />
            </div>
        </div>
    );
}
