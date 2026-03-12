import type { Metadata } from "next";
import { Barlow_Condensed, DM_Sans, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/context/ThemeContext";
import { NavigationProvider } from "@/context/NavigationContext";
import NavigationLoader from "@/components/NavigationLoader";

// Display font — var(--font-display)
const barlowCondensed = Barlow_Condensed({
  variable: "--font-barlow-condensed",
  subsets: ["latin"],
  weight: ["600", "800"],
  display: "swap",
});

// Body font — var(--font-body)
const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  weight: ["300", "400", "600"],
  display: "swap",
});

// Mono font — var(--font-mono)
const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  weight: ["400", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "HerdERP Smart Livestock Management Platform",
  description:
    "Precision livestock management ERP. Track herd health, optimize breeding, monitor milk production, and maximize farm profitability with real-time analytics.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${barlowCondensed.variable} ${dmSans.variable} ${jetbrainsMono.variable} antialiased`}
      >
        <ThemeProvider>
          <NavigationProvider>
            {/* Navigation progress loader — renders above everything */}
            {/* <NavigationLoader /> */}
            {/* Header and Footer are handled by each section's nested layout */}
            {children}
          </NavigationProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}